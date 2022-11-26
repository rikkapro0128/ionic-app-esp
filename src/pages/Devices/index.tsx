import { memo, useState } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grow from '@mui/material/Grow';
import Switch from '@mui/material/Switch';

import MoreVertIcon from '@mui/icons-material/MoreVert';

import { IconNode, IconLight, IconAir, IconFan } from '../../icons';

import AntSwitch from '../../components/Switch';

const icon = {
  fan: <IconFan className='w-6 h-6 fill-slate-700' />,
  light: <IconLight className='w-6 h-6 fill-slate-700' />,
  air: <IconAir className='w-6 h-6 fill-slate-700' />,
} 

const label = { inputProps: { 'aria-label': 'Switch demo' } };

function Devices() {
  const [devices, setDevices] = useState([
    {
      name: 'quạt trần',
      sub: 'PANASONIC F-60WWK',
      state: true,
      icon: 'fan'
    },
    {
      name: 'bóng đèn',
      sub: '60W RẠNG ĐÔNG',
      state: true,
      icon: 'light'
    },
    {
      name: 'điều hoà',
      sub: 'PANASONIC CS-XPU9XKH-8',
      state: false,
      icon: 'air'
    },
  ]);

  return (
  <Grow in={true}>
    <Box className="grid grid-cols-2 gap-3 p-3">
      {
        devices.map((device, index) => (
          <Box key={index} className="flex flex-nowrap p-3 rounded-2xl border-indigo-600 border-2 shadow-md">
            <Box className='mr-3'>
              { device.icon in icon ? icon[device.icon as keyof typeof icon] : icon['light'] }
            </Box>
            <Box className="flex flex-col flex-1">
              <Typography className='text-slate-600 capitalize' variant="subtitle1">{ device.name }</Typography>
              <Typography className='text-slate-600' variant="caption">{ device.sub }</Typography>
              <Typography className='text-slate-600 flex-1 flex items-end' variant="subtitle1">
                <span className={`capitalize ${ device.state ? 'text-green-400' : 'text-slate-500' }`}>{ device.state ? 'bật' : 'tắt' }</span>
              </Typography>
            </Box>
            <AntSwitch defaultChecked={device.state} inputProps={{ 'aria-label': 'ant design' }} />
          </Box>
        ))
      }
    </Box>
  </Grow>
  )
}

export default memo(Devices)