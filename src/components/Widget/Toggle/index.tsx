import { memo, useEffect, useState } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grow from '@mui/material/Grow';
import Switch from '@mui/material/Switch';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { ref, get, set, child, onValue } from "firebase/database";
import { database } from "../../../firebase/db";

import { updateValueDevice } from '../../../store/slices/nodesSlice';

import { useAppSelector, useAppDispatch } from '../../../store/hooks';

import AntSwitch from '../../../components/Switch';

import icon from '../index';

interface PayloadType {
  device: {
    id: string,
    name?: string;
    num?: number;
    pin: number;
    sub?: string;
    state?: boolean;
    icon: string;
    node_id: string;
  },
  idUser: string | undefined;
}

function Toggle({ device, idUser }: PayloadType) {
  const dispatch = useAppDispatch();
  const [toggle, setToggle] = useState(device.state ? true : false);
  const [userID, setUser] = useState<string | undefined>(idUser);
  const [block, setBlock] = useState<boolean>(false);

  useEffect(() => {
    const refDBState = `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/state`;
    const dbRef = ref(database, refDBState);
    onValue(dbRef, (snapshot) => {
      const val = snapshot.val();
      if(!block) {
        setBlock(() => true);
        setToggle(val);
        dispatch(updateValueDevice({ nodeId: device.node_id, deviceId: device.id, value: val }));
        setBlock(() => false);
      }
    })
  }, [])

  const handleClick = async () => {
    if(userID && device.id && !block) {
      setBlock(() => true);
      try {
        await set(ref(database, `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/state`), !toggle);
      } catch (error) {
        console.log(error);
      }
      // setToggle(state => !state);
      setBlock(() => false);
    }
  }

  return (
    <Box onClick={handleClick} className="flex flex-nowrap mx-auto">
      <Box className='mr-3'>
        { device.icon in icon ? icon[device.icon as keyof typeof icon] : icon['light'] }
        <AntSwitch className="mt-2" checked={toggle} inputProps={{ 'aria-label': 'ant design' }} />
      </Box>
      <Box className="flex flex-col flex-1">
        <Typography className='text-slate-600 capitalize' variant="subtitle1">{ device.name || device.id }</Typography>
        <Typography className='text-slate-600' variant="caption">{ device.sub || 'không có mô tả nào' }</Typography>
        <Typography className='text-slate-600 flex-1 flex items-end' variant="subtitle1">
          <span className={`capitalize ${ toggle ? 'text-green-400' : 'text-slate-500' }`}>{ toggle ? 'bật' : 'tắt' }</span>
        </Typography>
      </Box>
    </Box>
  )
}

export default memo(Toggle);
