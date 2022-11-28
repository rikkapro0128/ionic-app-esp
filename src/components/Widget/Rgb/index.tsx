import { memo, useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// import Hue from '@uiw/react-color-hue';
import { Alpha, Hue } from '@uiw/react-color';
import { hsvaToRgba } from '@uiw/color-convert';

import icon from '../index';

interface PayloadType {
  device: {
    name: string,
    sub: string,
    value: string,
    icon: string,
    type: string,
  }
}

function Rgb({ device }: PayloadType) {
  const [hsva, setHsva] = useState({ h: 0, s: 0, v: 68, a: 1 });
  const [rgb, setRgb] = useState({ r: 0, g: 0, b: 0, a: 0 });

  useEffect(() => {
    const tempColor = hsvaToRgba(hsva);
    setRgb(tempColor);
  }, [hsva]);

  return (
    <Box className='flex flex-nowrap w-full'>
      <Box className='mr-3 flex flex-col'>
        { device.icon in icon ? icon[device.icon as keyof typeof icon] : icon['light'] }
        <Box></Box>
      </Box>
      <Box className='flex flex-col flex-1 px-3'>
        <Box className='grid grid-rows-2 gap-6 my-3'>
          <Hue radius={16} hue={hsva.h} onChange={(newHue) => { setHsva({ ...hsva, ...newHue }); }} />
          <Alpha radius={16} hsva={hsva} onChange={(newAlpha) => { setHsva({ ...hsva, ...newAlpha }); }} />
        </Box>
        <Typography variant="subtitle1" className='text-slate-600 capitalize' gutterBottom>
          { device.name }
        </Typography>
        <Typography variant="subtitle1" className='text-slate-600' gutterBottom>
          { device.sub }
        </Typography>
      </Box>
    </Box>
  );
}

export default memo(Rgb);