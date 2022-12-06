import { memo, useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grow from "@mui/material/Grow";
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';

import WidgetToggle from "../../components/Widget/Toggle";
import WidgetProgress from "../../components/Widget/Progress";
import WidgetSlider from "../../components/Widget/Slider";
import WidgetColor from "../../components/Widget/Rgb";

import { IconNotFound } from '../../icons';

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { ref, get, set, child } from "firebase/database";
import { database } from "../../firebase/db";

const grids = {
  toggle: "col-span-1",
  slider: "col-span-2",
  color: "col-span-2",
  progress: "col-span-1 row-span-2",
  none: "col-span-1",
};

const transferTypeModel = {
  LOGIC: "toggle",
  TRANSFORM: "slider",
  RGB: "color",
  PRGRESS: "progress",
  none: "toggle",
};

interface DeviceType {
  id: string,
  name: string;
  sub: string;
  value: any;
  icon: string;
  type: string;
  uint: string;
}
interface TransferNodeType {
  nodes: {
    [node: string]: {
      type: string;
      value: any;
    };
  };
}

const getTypeWidget = (device: DeviceType) => {
  if (device.type === "toggle") {
    return <WidgetToggle device={device} />;
  } else if (device.type === "progress") {
    return <WidgetProgress device={device} />;
  } else if (device.type === "slider") {
    return <WidgetSlider device={device} />;
  } else if (device.type === "color") {
    return <WidgetColor device={device} />;
  } else {
    return null;
  }
};

function Devices() {
  const [devices, setDevices] = useState<DeviceType[] | []>([
    // {
    //   name: 'quạt trần',
    //   sub: 'PANASONIC F-60WWK',
    //   value: true,
    //   icon: 'fan',
    //   type: 'toggle'
    // },
    // {
    //   name: 'nhiệt độ phòng',
    //   sub: 'cảm biến DHT21',
    //   value: 25,
    //   icon: 'sensor',
    //   type: 'progress',
    //   uint: '%'
    // },
    // {
    //   name: 'đèn ngủ',
    //   sub: 'light 3d',
    //   value: 56,
    //   icon: 'light',
    //   type: 'slider',
    //   uint: '%'
    // },
    // {
    //   name: 'decor phòng ngủ',
    //   sub: 'rgb ws2812b',
    //   value: 'rgb(38, 255, 121)',
    //   icon: 'color',
    //   type: 'color',
    // },
  ]);
  const [loading, setLoading] = useState<boolean>(true);

  const transferNodes = (nodes: TransferNodeType) => {
    if(nodes) {
      const transfers = Object.entries(nodes).map(([key, field]): DeviceType => ({
        id: key.split("node-")[1],
        name: field?.info?.name || "tên không xác định",
        sub: field?.info?.sub || "không có mô tả",
        value: field.value,
        type: field.type in transferTypeModel ? transferTypeModel[field.type as keyof typeof transferTypeModel] : transferTypeModel['none'],
        icon: 'light',
        uint: field?.info?.uint || "",
      }));
      if(transfers.length > 0) {
        setDevices(transfers);
      }
    }

  };

  useEffect(() => {
    const getNode = async () => {
      setLoading(true);
      const user = await FirebaseAuthentication.getCurrentUser();
      const idUser = user.user?.uid;
      if (idUser) {
        const pathListNode = `user-${idUser}/nodes`;
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, pathListNode));
        const nodes = snapshot.val();
        transferNodes(nodes);
      }
      setLoading(false);
    };
    getNode();
  }, []);

  return (
    loading
    ?
    <Dialog sx={{ '& .MuiPaper-root': {
      backgroundColor: 'transparent',
      boxShadow: 'none'
    } }} open={true}>
      <CircularProgress sx={{ color: 'white', margin: '0 auto' }} />
      <Typography className="text-white pt-5" variant="subtitle1" gutterBottom>
        Đang tải thiết bị!
      </Typography>
    </Dialog>
    :
      devices.length > 0 
      ?
      <Box
        sx={{ maxHeight: window.innerHeight - 72 }}
        className={`overflow-y-scroll`}
      >
        <Box className={`grid grid-cols-2 gap-3 p-3`}>
          {devices.map((device, index) => (
            <Box
              key={index}
              className={`flex flex-nowrap ${
                device.type in grids
                  ? grids[device.type as keyof typeof grids]
                  : grids["none"]
              } p-3 rounded-2xl border-indigo-600 border-2 shadow-md`}
            >
              {getTypeWidget(device)}
            </Box>
          ))}
        </Box>
      </Box>
      : 
      <Box className="h-full w-full flex justify-between items-center">
        <Box className='m-auto'>
          <IconNotFound className='w-48 h-48 m-auto' />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 600 }} className='pt-3 text-slate-700'>Không tìm thấy thiết bị nào.</Typography>
        </Box>
      </Box>
  );
}

export default memo(Devices);
