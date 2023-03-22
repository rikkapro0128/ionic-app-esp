import { memo, useState, useEffect, useMemo, useCallback } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

// import Hue from '@uiw/react-color-hue';
import { Alpha, Hue } from "@uiw/react-color";
import {
  hsvaToRgba,
  hsvaToHexa,
  rgbaToHsva,
  rgbaToHex,
} from "@uiw/color-convert";

import { ref, get, set, child, onValue, DataSnapshot, Unsubscribe } from "firebase/database";
import { database } from "../../../firebase/db";

import icon from "../index";

import { DeviceType, ColorType } from "../type";

interface PayloadType {
  device: DeviceType;
  idUser: string | undefined;
}

function Rgb({ device, idUser }: PayloadType) {
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
  const [hsvaRemote, setHsvaRemote] = useState({ h: 0, s: 0, v: 68, a: 1 });
  const [rgba, setRgba] = useState({ r: 0, g: 0, b: 0, a: 0 });
  const [userID, setUser] = useState<string | undefined>(idUser);
  const [timeBounce, setTimeBounce] = useState<number>(200);
  const [startBounce, setStartBounce] = useState<boolean>(false);
  const [idBounce, setIdBounce] = useState<undefined | NodeJS.Timeout>(
    undefined
  );
  const [block, setBlock] = useState(true);
  const blockUpdate = useMemo(() => block, [block]);

  useEffect(() => {
    let unOn: Unsubscribe | undefined;
    if (userID) {
      unOn = onValue(
        ref(
          database,
          `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/value`
        ),
        onUpdate
      )
    }
    return () => {
      if(typeof unOn === 'function') {
        unOn();
      }
    }
  }, [userID, device]);
  

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

  const onUpdate = useCallback((snapshot: DataSnapshot) => {
    const color: ColorType | undefined = snapshot.val();
    
    if (color !== undefined && !blockUpdate) {
      if (
        color.r !== rgba.r ||
        color.g !== rgba.g ||
        color.b !== rgba.b ||
        color.contrast !== rgba.a
      ) {
        console.log('update state', blockUpdate);
        
        setHsva(rgbaToHsva({ r: color.r, g: color.g, b: color.b, a: color.contrast }));
      }
    }
  }, [blockUpdate])

  useEffect(() => {
    if (startBounce) {
      clearTimeout(idBounce);
      console.log(block);
      
      if(!block) {
        setIdBounce(setTimeout(handleValueRgb, timeBounce));
      }else {
        setBlock(false);
      }
    }
  }, [rgba]);

  async function handleValueRgb() {
    if (userID) {
      try {
        const color = {
          r: rgba.r,
          g: rgba.g,
          b: rgba.b,
          contrast: Math.round(rgba.a * 100),
        };
        
        setBlock(true);

        await set(
          ref(
            database,
            `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/value`
          ),
          color
        );
      } catch (error) {
        console.log(error);
      }
    }
  }

  function changeColor() {}

  return (
    <Box className="flex flex-nowrap w-full">
      <Box className="mr-3 flex flex-col">
        {device.icon in icon
          ? icon[device.icon as keyof typeof icon]
          : icon["light"]}
        <Box
          className="flex-1 w-full mt-3 rounded-md"
          sx={{ backgroundColor: hsvaToHexa(hsva) }}
        ></Box>
      </Box>
      <Box className="flex flex-col flex-1 px-3">
        <Box className="grid grid-rows-2 gap-6 my-3">
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
        <Typography variant="subtitle1" className=" capitalize" gutterBottom>
          {device.name || device.id}
        </Typography>
        <Typography variant="subtitle1" className="" gutterBottom>
          {device.sub || "chưa có mô tả"}
        </Typography>
      </Box>
    </Box>
  );
}

export default memo(Rgb);
