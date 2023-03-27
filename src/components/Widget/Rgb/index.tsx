import { memo, useState, useEffect } from "react";

import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// import Hue from '@uiw/react-color-hue';
import { Alpha, Hue } from "@uiw/react-color";
import {
  hsvaToRgba,
  hsvaToHexa,
  rgbaToHsva,
  rgbaToHex,
  HsvaColor,
} from "@uiw/color-convert";

import {
  ref,
  get,
  set,
  child,
  onValue,
  DataSnapshot,
  Unsubscribe,
} from "firebase/database";
import { database } from "../../../firebase/db";

import { useAppSelector } from "../../../store/hooks";

import icon from "../index";

import { ReMapValue } from "../../../ConfigGlobal";

import { DeviceType, ColorType, ModeColor } from "../type";

interface PayloadType {
  device: DeviceType;
  idUser?: string | undefined;
  isOffline?: boolean;
  hostOffline?: string;
}

let blockUpdate = false;

function Rgb({ device, idUser, isOffline = false, hostOffline }: PayloadType) {
  const theme = useTheme();
  const [hsva, setHsva] = useState(() =>
    device.value && typeof device.value === "object"
      ? rgbaToHsva({
          r: device.value.r,
          g: device.value.g,
          b: device.value.b,
          a: Number((device.value.contrast / 100).toFixed(1)),
        })
      : { h: 0, s: 0, v: 68, a: 1 }
  );
  const [rgba, setRgba] = useState({ r: 0, g: 0, b: 0, a: 0 });
  const userID = useAppSelector(state => state.commons.userId);
  const [timeBounce, setTimeBounce] = useState<number>(200);
  const [startBounce, setStartBounce] = useState<boolean>(false);
  const [idBounce, setIdBounce] = useState<undefined | NodeJS.Timeout>(
    undefined
  );

  useEffect(() => {
    let unOn: Unsubscribe | undefined;
    if (userID) {
      if (!isOffline) {
        unOn = onValue(
          ref(
            database,
            `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/value`
          ),
          (snapshot: DataSnapshot) => {
            const color: ColorType | undefined = snapshot.val();
            if (color !== undefined) {
              if (
                color.r !== rgba.r ||
                color.g !== rgba.g ||
                color.b !== rgba.b ||
                color.contrast !== rgba.a
              ) {
                if (!blockUpdate) {
                  blockUpdate = true;
                  setHsva(
                    rgbaToHsva({
                      r: color.r,
                      g: color.g,
                      b: color.b,
                      a: Number((color.contrast / 100).toFixed(1)),
                    })
                  );
                  blockUpdate = false;
                }
              }
            }
          }
        );
      }
    }
    return () => {
      if (typeof unOn === "function") {
        unOn();
      }
    };
  }, [userID, isOffline]);

  useEffect(() => {
    if (startBounce) {
      setRgba(hsvaToRgba(hsva));
    }
    return () => {
      if (!startBounce) {
        setStartBounce(true);
      }
    };
  }, [hsva]);

  useEffect(() => {
    if (startBounce) {
      clearTimeout(idBounce);
      setIdBounce(setTimeout(handleValueRgb, timeBounce));
    }
  }, [rgba]);

  async function handleValueRgb() {
    if (userID && !blockUpdate) {
      try {
        const color = {
          r: rgba.r,
          g: rgba.g,
          b: rgba.b,
          contrast: Math.round(rgba.a * 100),
        };

        blockUpdate = true;
        if (!isOffline) {
          await set(
            ref(
              database,
              `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/value`
            ),
            color
          );
        } else {
          if (hostOffline) {
            const response = await fetch(`${hostOffline}/controll`, {
              method: 'POST',
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                uid: userID,
                did: device.id,
                mode: 0,
                value: {
                  r: color.r,
                  g: color.g,
                  b: color.b,
                  a: color.contrast,
                },
              }),
            });
            // const result = await response.json();
            // console.log(result);
          }
        }
      } catch (error) {
        console.log(error);
      }

      blockUpdate = false;
    }
  }

  return (
    <Box className={`flex flex-nowrap w-full relative`}>
      <Box
        className="mr-3 flex flex-col"
        sx={{
          "& svg": {
            fill: theme.palette.text.primary,
            filter: `drop-shadow(-1px 1px 2px ${theme.palette.text.primary})`,
          },
        }}
      >
        {device.type in icon
          ? icon[device.type as keyof typeof icon]
          : icon["TOGGLE"]}
        <Box
          className="flex-1 w-full mt-3 rounded-md"
          sx={{
            backgroundColor: hsvaToHexa(hsva),
            boxShadow: `0px 0px 4px ${hsvaToHexa(hsva)}`,
          }}
        ></Box>
      </Box>
      <Box className="flex flex-col flex-1 px-3">
        <Box
          sx={{
            transition: "filter 200ms ease",
          }}
          className={`grid grid-rows-2 gap-6 my-3 ${
            device.mode === ModeColor.AUTO ? "blur-sm pointer-events-none" : ""
          }`}
        >
          <Hue
            radius={16}
            hue={hsva.h}
            onChange={(newHue) => {
              setHsva({ ...hsva, h: Math.round(newHue.h), s: 100, v: 100 });
            }}
          />
          <Alpha
            radius={16}
            hsva={hsva}
            onChange={(newAlpha) => {
              setHsva({ ...hsva, ...newAlpha });
            }}
          />
        </Box>
        <Box className="grid grid-cols-2">
          <Box className="col-span-1">
            <Typography
              color={(theme) => theme.palette.text.primary}
              variant="subtitle1"
              className=" capitalize"
              gutterBottom
            >
              {device.name || device.id}
            </Typography>
            <Typography
              color={(theme) => theme.palette.text.secondary}
              variant="subtitle1"
              className=""
              gutterBottom
            >
              {device.sub || "chưa có mô tả"}
            </Typography>
          </Box>
          <Typography className="col-span-1">
            Chế độ - {device.mode === ModeColor.SINGLE ? "Đơn sắc" : "Đa sắc"}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default memo(Rgb);
