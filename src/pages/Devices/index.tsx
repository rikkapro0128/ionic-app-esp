import { memo, useState } from "react";

import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';

import WidgetToggle from '../../components/Widget/Toggle';
import WidgetProgress from '../../components/Widget/Progress';
import WidgetSlider from '../../components/Widget/Slider';
import WidgetColor from '../../components/Widget/Rgb';

const grids = {
  'toggle': 'col-span-1',
  'slider': 'col-span-2',
  'color': 'col-span-2',
  'progress': 'col-span-1 row-span-2',
  'none': 'col-span-1',
}

interface DeviceType {
  name: string,
  sub: string,
  value: any,
  icon: string,
  type: string,
}

const getTypeWidget = (device: DeviceType) => {
  if(device.type === 'toggle') {
    return <WidgetToggle device={device} />
  }
  else if(device.type === 'progress') {
    return <WidgetProgress device={device} />
  }
  else if(device.type === 'slider') {
    return <WidgetSlider device={device} />
  }
  else if(device.type === 'color') {
    return <WidgetColor device={device} />
  }
  else {
    return null
  }
}

function Devices() {
  const [devices, setDevices] = useState([
    {
      name: 'quạt trần',
      sub: 'PANASONIC F-60WWK',
      value: true,
      icon: 'fan',
      type: 'toggle'
    },
    {
      name: 'bóng đèn',
      sub: '60W RẠNG ĐÔNG',
      value: true,
      icon: 'light',
      type: 'toggle'
    },
    {
      name: 'điều hoà',
      sub: 'PANASONIC CS-XPU9XKH-8',
      value: false,
      icon: 'air',
      type: 'toggle'
    },
    {
      name: 'nhiệt độ phòng',
      sub: 'cảm biến DHT21',
      value: 25,
      icon: 'sensor',
      type: 'progress',
      uint: '%'
    },
    {
      name: 'đèn ngủ',
      sub: 'light 3d',
      value: 56,
      icon: 'light',
      type: 'slider',
      uint: '%'
    },
    {
      name: 'máy bơm',
      sub: 'Panasonic GP-15HCN1 1.5HP',
      value: true,
      icon: 'fan',
      type: 'toggle'
    },
    {
      name: 'độ ẩm vườn rau',
      sub: 'cảm biến DHT21',
      value: 94,
      icon: 'sensor',
      type: 'progress',
      uint: '%'
    },
    {
      name: 'đèn sưởi gà con',
      sub: 'Kangaroo KG254N',
      value: 78,
      icon: 'light',
      type: 'slider',
      uint: '%'
    },
    {
      name: 'decor phòng ngủ',
      sub: 'rgb ws2812b',
      value: 'rgb(38, 255, 121)',
      icon: 'color',
      type: 'color',
    },
  ]);

  console.log();

  return (
  <Grow in={true}>
    <Box sx={{ maxHeight: window.innerHeight - 72 }} className={`overflow-y-scroll`}>
      <Box className={`grid grid-cols-2 gap-3 p-3`}>
        {
          devices.map((device, index) => (
            <Box key={index} className={`flex flex-nowrap ${device.type in grids ? grids[device.type as keyof typeof grids] : grids['none'] } p-3 rounded-2xl border-indigo-600 border-2 shadow-md`}>
              { getTypeWidget(device) }
            </Box>
          ))
        }
      </Box>
    </Box>
  </Grow>
  )
}

export default memo(Devices)