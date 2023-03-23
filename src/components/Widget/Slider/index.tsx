import { memo, useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import SD from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

import { ref, get, set, child } from "firebase/database";
import { database } from "../../../firebase/db";

import icon from '../index';

import { DeviceType } from '../type';

interface PayloadType {
  device: DeviceType,
  idUser: string | undefined;
}

function Slider({ device, idUser }: PayloadType) {
  const [percent, setPercent] = useState(device.value as number);
  const [userID, setUser] = useState<string | undefined>(idUser);
  const [timeBounce, setTimeBounce] = useState<number>(200);
  const [startBounce, setStartBounce] = useState<boolean>(false);
  const [idBounce, setIdBounce] = useState<undefined | NodeJS.Timeout>(undefined);

  function changePercent(event: Event, value: number | number[]) {
    setPercent(value as number);
  }
  
  useEffect(() => {
    if(startBounce) {
      clearTimeout(idBounce);
      setIdBounce(setTimeout(handleUpdateValue, timeBounce));
    }
    return () => {
      if(!startBounce) { setStartBounce(true) }
    }
  }, [percent])

  async function handleUpdateValue() {
    if(userID) {
      try {
        await set(ref(database, `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/value`), percent);
      } catch (error) {
        console.log(error);
      }
    }
  }

  return (
    <Box className='flex flex-nowrap w-full'>
      <Box className='mr-3'>
        { device.icon in icon ? icon[device.icon as keyof typeof icon] : icon['TOGGLE'] }
        <Typography variant="subtitle1" className=' text-center pt-3'>{ percent }%</Typography>
      </Box>
      <Box className='flex flex-col flex-1 px-3'>
        <SD sx={{ color: 'rgb(99, 102, 241)' }} defaultValue={percent} onChange={changePercent} aria-label="Default" valueLabelDisplay="auto" />
        <Typography variant="subtitle1" className=' capitalize' gutterBottom>
          { device.name || device.id }
        </Typography>
        <Typography variant="subtitle1" className='' gutterBottom>
          { device.sub || 'không có mô tả nào' }
        </Typography>
      </Box>
    </Box>
  );
}

export default memo(Slider);
