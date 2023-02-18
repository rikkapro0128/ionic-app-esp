import { memo, useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';

import Node from "../../components/Node";

import { IconNotFound } from '../../icons';

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { ref, get, set, child, onValue } from "firebase/database";
import { database } from "../../firebase/db";

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setNodes } from '../../store/slices/nodesSlice';

import { WidgetType } from '../../components/Widget/type'

const transferTypeModel = {
  LOGIC: "toggle",
  TRANSFORM: "slider",
  COLOR: "color",
  PROGRESS: "progress",
  none: "none",
};
interface DevicesFixType {
  id: string,
  name?: string;
  num?: number;
  pin: number;
  sub?: string;
  value?: any;
  state?: any;
  icon: string;
  type: WidgetType;
  uint?: string;
  node_id: string,
}
interface Map {
  [key: string]: any
}

interface TransferNodeType {
  nodes: {
    [node: string]: {
      type: WidgetType;
      value: any;
    };
  };
}

function Devices() {
  const dispatch = useAppDispatch();
  // const [nodes, setNodes] = useState<Map>({});
  const statusFB = useAppSelector(state => state.commons.fbConnection);
  const nodes = useAppSelector(state => state.nodes.value);
  const [loading, setLoading] = useState<boolean>(true);
  const [idUser, setIDUser] = useState<string | undefined>();
  
  const transferNodes = (nodes: TransferNodeType) => {
    let deviceTemp: Map = {};
    Object.entries(nodes).forEach(([key, field]) => {
      // console.log(field);
      if(field.devices) {
        const keyNode = key.split('node-')[1] || '';      
        deviceTemp[keyNode as keyof Map] = {};
        deviceTemp[keyNode].name = field?.name;
        deviceTemp[keyNode].sub = field?.sub;
        deviceTemp[keyNode].devices = [...Object.entries(field.devices).map(([key, field]): DevicesFixType => ({ ...field as DevicesFixType, id: key.slice(7), icon: 'light', node_id: keyNode }))];
      }else {
        return false;
      }
    })
    // console.log(deviceTemp);
    
    // setNodes(deviceTemp);
    dispatch(setNodes(deviceTemp));
  };

  useEffect(() => {
    const getNode = async () => {
      const user = await FirebaseAuthentication.getCurrentUser();
      const idUser = user.user?.uid;
      if (idUser) {
        setLoading(true);
        const pathListNode = `user-${idUser}/nodes`;
        const dbRef = ref(database, pathListNode);
        onValue(dbRef, (snapshot) => {
          const nodes = snapshot.val();
          transferNodes(nodes);
          setLoading(false);
        })
      }
      setIDUser(idUser);
    };
    if(statusFB) {
      getNode();
    }
  }, [statusFB]);

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
      Object.entries(nodes).length > 0
      ?
      <Box
        sx={{ maxHeight: window.innerHeight - 72, height: window.innerHeight - 72 }}
        className={`overflow-y-scroll bg-[#edf1f5]`}
      >
        {
          Object.entries(nodes).map(([key, node]) => {
            return (
              <div key={key} className="grid grid-cols-2 gap-3 p-3">
                <Node devices={node.devices} node={{ id: key, name: node.name, sub: node.sub }} idUser={idUser} />
              </div>
            )
          })
        }
      </Box>
      : 
      <Box className="h-full w-full flex justify-between items-center bg-slate-100">
        <Box className='m-auto'>
          <IconNotFound className='w-48 h-48 m-auto' />
          <Typography sx={{ fontSize: '1.2rem', fontWeight: 600 }} className='pt-3 text-slate-700'>Không tìm thấy thiết bị nào.</Typography>
        </Box>
      </Box>
  );
}

export default memo(Devices);
