import { useCallback, useState } from "react";

import { CapacitorHttp } from "@capacitor/core";

import { ReMapValue } from "../ConfigGlobal";

interface OptionsType {
  start: number;
  end: number;
}

export const useScanDevice = (): [number, () => Promise<any[]>] => {
  const [progress, setProgress] = useState<number>(0);

  const scanDevices = async (
    options: OptionsType = {
      start: 2,
      end: 251,
    }
  ) => {
    setProgress(0);
    const listScan = new Array(options.end - options.start)
      .fill("http://192.168.1")
      .map((arrHost, index) => `${arrHost}.${index + options.start}`);

    const temps = await Promise.all(
      listScan.map((host, index, arrHost) => {
        return new Promise(async (resolve) => {
          try {
            const response = await CapacitorHttp.get({
              url: `${host}/ping`,
              connectTimeout: 2000,
              webFetchExtra: { mode: "no-cors" },
            });
            if (response.status === 200) {
              const payload = response.data;
              resolve({ ...payload, host });
            } else {
              resolve(null);
            }
          } catch (error) {
            resolve(null);
          }
          setProgress(ReMapValue(index + options.start, options.start, options.end, 0, 100));
        });
      })
    );
    setProgress(100);
    return temps;
  };

  return [progress, scanDevices];
};
