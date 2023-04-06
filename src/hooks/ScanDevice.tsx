import { useCallback, useState } from "react";

import { ReMapValue } from '../ConfigGlobal';

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
    if(progress !== 0) { setProgress(0); }
    return await Promise.all(
      new Array(options.end - options.start)
        .fill("http://192.168.1")
        .map((arrHost, index) => `${arrHost}.${index + options.start}`)
        .map(async (host, index, arrHost) => {
          return new Promise(async (res) => {
            try {
              const response = await fetch(`${host}/ping`, { mode: "no-cors" });
              if (!response.ok) {
                res(null);
              } else {
                const payload = await response.json();
                res({ ...payload, host });
                console.log(host);
              }
            } catch (error) {
              res(null);
            }
            if(index === arrHost.length - 1) {
              setProgress(100);
            }else {
              setProgress(ReMapValue(index + options.start, options.start, options.end, 0, 100));
            }
          });
        })
    );
  };

  return [progress, scanDevices];
};
