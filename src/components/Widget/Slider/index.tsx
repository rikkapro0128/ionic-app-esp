import { memo, useState } from 'react';

import Box from '@mui/material/Box';
import SD from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import icon from '../index';

interface PayloadType {
  device: {
    id: string,
    name: string,
    sub: string,
    value: number,
    icon: string,
    type: string,
  }
}

function Slider({ device }: PayloadType) {
  const [percent, setPercent] = useState(device.value);

  function changePercent(event: Event, value: number | number[]) {
    setPercent(value as number);
  }

  return (
    <Box className='flex flex-nowrap w-full'>
      <Box className='mr-3'>
        { device.icon in icon ? icon[device.icon as keyof typeof icon] : icon['light'] }
        <Typography variant="subtitle1" className='text-slate-600 text-center pt-3'>{ percent }%</Typography>
      </Box>
      <Box className='flex flex-col flex-1 px-3'>
        <SD sx={{ color: 'rgb(99, 102, 241)' }} defaultValue={percent} onChange={changePercent} aria-label="Default" valueLabelDisplay="auto" />
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

export default memo(Slider);
