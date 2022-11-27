import { memo } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grow from '@mui/material/Grow';
import Switch from '@mui/material/Switch';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import AntSwitch from '../../../components/Switch';

import icon from '../index';

interface PayloadType {
  device: {
    name: string,
    sub: string,
    value: boolean,
    icon: string,
    type: string,
  }
}

function Toggle({ device }: PayloadType) {
  return (
    <>
      <Box className='mr-3'>
        { device.icon in icon ? icon[device.icon as keyof typeof icon] : icon['light'] }
      </Box>
      <Box className="flex flex-col flex-1">
        <Typography className='text-slate-600 capitalize' variant="subtitle1">{ device.name }</Typography>
        <Typography className='text-slate-600' variant="caption">{ device.sub }</Typography>
        <Typography className='text-slate-600 flex-1 flex items-end' variant="subtitle1">
          <span className={`capitalize ${ device.value ? 'text-green-400' : 'text-slate-500' }`}>{ device.value ? 'bật' : 'tắt' }</span>
        </Typography>
      </Box>
      <AntSwitch defaultChecked={device.value} inputProps={{ 'aria-label': 'ant design' }} />
    </>
  )
}

export default memo(Toggle);
