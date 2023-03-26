import { useCallback, useState } from "react";

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
    const listHost = new Array(options.end - options.start)
      .fill("http://192.168.1")
      .map((arrHost, index) => `${arrHost}.${index + options.start}`);
    const result = await Promise.all(
      listHost.map(async (host) => {
        return new Promise(async (res) => {
          try {
            const response = await fetch(`${host}/ping`, { mode: "no-cors" });
            if (!response.ok) {
              res(null);
            } else {
              const payload = await response.json();
              res(payload);
            }
          } catch (error) {
            res(null);
          }
        });
      })
    );
    return result;
  };

  return [progress, scanDevices];
};
