import { memo, useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grow from '@mui/material/Grow';
import Switch from '@mui/material/Switch';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { ref, get, set, child } from "firebase/database";
import { database } from "../../../firebase/db";

import AntSwitch from '../../../components/Switch';

import icon from '../index';

interface PayloadType {
  device: {
    id: string,
    name: string,
    sub: string,
    value: boolean,
    icon: string,
    type: string,
  }
}

function Toggle({ device }: PayloadType) {
  const [toggle, setToggle] = useState(device.value);
  const [userID, setUser] = useState<string>('');
  const [block, setBlock] = useState<boolean>(false);

  useEffect(() => {
    const getUserID = async () => {
      try {
        const user = await FirebaseAuthentication.getCurrentUser();
        setUser(user.user?.uid || '');
      } catch (error) {
        console.log(error);
      }
    }
    getUserID();
  }, [])

  const handleClick = async () => {
    if(userID && device.id && !block) {
      setBlock(state => true);
      try {
        await set(ref(database, `user-${userID}/nodes/node-${device.id}/value`), !toggle);
      } catch (error) {
        console.log(error);
      }
      setToggle(state => !state);
      setBlock(state => false);
    }
  }

  return (
    <Box onClick={handleClick} className="flex flex-nowrap">
      <Box className='mr-3'>
        { device.icon in icon ? icon[device.icon as keyof typeof icon] : icon['light'] }
      </Box>
      <Box className="flex flex-col flex-1">
        <Typography className='text-slate-600 capitalize' variant="subtitle1">{ device.name }</Typography>
        <Typography className='text-slate-600' variant="caption">{ device.sub }</Typography>
        <Typography className='text-slate-600 flex-1 flex items-end' variant="subtitle1">
          <span className={`capitalize ${ toggle ? 'text-green-400' : 'text-slate-500' }`}>{ toggle ? 'bật' : 'tắt' }</span>
        </Typography>
      </Box>
      <AntSwitch checked={toggle} inputProps={{ 'aria-label': 'ant design' }} />
    </Box>
  )
}

export default memo(Toggle);
