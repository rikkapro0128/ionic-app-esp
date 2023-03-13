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

import { DeviceType } from '../type';
import { getUserIDByPlaform } from '../../../ConfigGlobal';

interface PayloadType {
  device: DeviceType,
  idUser: string | undefined;
}

function Toggle({ device, idUser }: PayloadType) {
  const dispatch = useAppDispatch();
  const [toggle, setToggle] = useState(device.state ? true : false);
  const [userID, setidUser] = useState<string | undefined>(idUser);
  const [block, setBlock] = useState<boolean>(false);

  useEffect(() => {
    const runNow = async () => {
      const idUser = await getUserIDByPlaform();
      setidUser(idUser);
    };
    runNow();
  }, []);

  useEffect(() => {
    // console.log(device);
    const run = () => {
      if(userID) {
        const refDBState = `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/state`;
        const dbRef = ref(database, refDBState);
        return onValue(dbRef, (snapshot) => {
          const val = snapshot.val();
          
          if(!block) {
            setBlock(() => true);
            setToggle(val);
            dispatch(updateValueDevice({ nodeId: device.node_id, deviceId: device.id, value: val }));
            setBlock(() => false);
          }
        })
      }
    }
    const Unsubscribe = run();
    return Unsubscribe;
  }, [userID])

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
    <Box onClick={handleClick} className="flex flex-nowrap mx-auto max-w-full overflow-hidden">
      <Box className='mr-3 flex flex-col items-center justify-between'>
        <div className={`flex justify-center p-2 rounded-full ${ toggle ? 'fill-slate-50' : 'fill-indigo-400' } bg-indigo-500`}>
          { device.icon in icon ? icon[device.icon as keyof typeof icon] : icon['light'] }
        </div>
        <AntSwitch className="mt-2 " checked={toggle} inputProps={{ 'aria-label': 'ant design' }} />
      </Box>
      <Box className="flex flex-col flex-1 max-w-[75%]">
        <Typography className='text-slate-600 capitalize whitespace-nowrap text-ellipsis overflow-hidden' variant="subtitle2">{ device.name || device.id }</Typography>
        <Typography className='text-slate-600 whitespace-nowrap text-ellipsis overflow-hidden' component={'p'} variant="caption">{ device.sub || 'không có mô tả nào' }</Typography>
        <Typography className='text-slate-600 flex-1 flex items-end' variant="subtitle1">
          <span className={`capitalize ${ toggle ? 'text-green-400' : 'text-slate-500' }`}>{ toggle ? 'bật' : 'tắt' }</span>
        </Typography>
      </Box>
    </Box>
  )
}

export default memo(Toggle);
