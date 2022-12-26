import { memo, useState, useEffect, forwardRef } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import Grow from '@mui/material/Grow';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Divider from '@mui/material/Divider';
import CircularProgress from '@mui/material/CircularProgress';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

import UnfoldMoreIcon from '@mui/icons-material/UnfoldMore';
import UnfoldLessIcon from '@mui/icons-material/UnfoldLess';
import SettingsIcon from '@mui/icons-material/Settings';
import EditIcon from '@mui/icons-material/Edit';

import WidgetToggle from "../Widget/Toggle";
import WidgetProgress from "../Widget/Progress";
import WidgetSlider from "../Widget/Slider";
import WidgetColor from "../Widget/Rgb";

import { ref, get, set, child, push, update } from "firebase/database";
import { database } from "../../firebase/db";

import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { setNodes, updateDevice } from '../../store/slices/nodesSlice';

interface DevicesFixType {
  id: string,
  name?: string;
  num?: number;
  pin: number;
  sub?: string;
  value?: any;
  state?: any;
  icon: string;
  type: string;
  uint?: string;
  node_id: string,
}

interface PropsType {
  devices: DevicesFixType[] | [];
  node: NodeType;
  idUser: string | undefined;
}

interface NodeType {
  id: string;
  name: string;
  sub: string;
}

enum EditType {
  NODE = "node",
  DEVICE = "device"
}
interface BoardType {
  name: string | undefined;
  sub: string | undefined;
}
interface InfoEditType {
  type: EditType;
  payload: DevicesFixType;
}

interface UpdateType {
  [key: string]: any,
}
interface UpdateField {
  key: string,
  value: any,
}

const grids = {
  LOGIC: "col-span-1",
  TRANSFORM: "col-span-2",
  COLOR: "col-span-2",
  PROGRESS: "col-span-1 row-span-2",
  none: "col-span-1",
};

const getTypeWidget = (device: DevicesFixType, idUser: string | undefined) => {
  if (device.type === "LOGIC") {
    return <WidgetToggle device={device} idUser={idUser} />;
  }
  // else if (device.type === "progress") {
  //   return <WidgetProgress device={device} idUser={idUser} />;
  // }
  // else if (device.type === "slider") {
  //   return <WidgetSlider device={device} idUser={idUser} />;
  // }
  else if (device.type === "COLOR") {
    return <WidgetColor device={device} idUser={idUser} />;
  } else {
    return null;
  }
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Node({ devices, node, idUser }: PropsType) {
  const dispatch = useAppDispatch();
  const [expand, setExpand] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [infoEdit, setInfoEdit] = useState<InfoEditType>();
  const [board, setBoard] = useState<BoardType>();

  const handleClickOpen = () => {
    setOpenEdit(true);
  };

  const handleClose = () => {
    setOpenEdit(false);
    setInfoEdit(undefined);
    setBoard(undefined);
  };

  const activeEditDevice = (device: DevicesFixType) => {
    setInfoEdit({ type: EditType.DEVICE, payload: device });
    setBoard({ name: device.name || '', sub: device.sub || '' });
    handleClickOpen();
  }

  const changeBoard = (field: string, value: string) => {
    if(board) {
      setBoard({ ...board, [field as keyof BoardType]: value });
    }
  }

  const updateFieldByPath = async (path: string, payload: UpdateField[]) => {
    const updates: UpdateType = {};
    payload.forEach(value => updates[`${path}/${value.key}`] = value.value);
    await update(ref(database), updates);
  }

  const updateEdit = async () => {
    setLoadingUpdate(true)
    try {
      if(infoEdit?.type === EditType.DEVICE) {
        if(idUser && infoEdit) {
          const pathRef = `user-${idUser}/nodes/node-${infoEdit.payload.node_id}/devices/device-${infoEdit.payload.id}`;
          const payload: UpdateField[] = [{ key: 'name', value: board?.name }, { key: 'sub', value: board?.sub }];
          await updateFieldByPath(pathRef, payload);
          // update info to redux store
          dispatch(updateDevice({ nodeId: infoEdit.payload.node_id, device: { ...infoEdit.payload, ...board } }));
        }else {
          throw new Error('Missing field to update.');
        }
      }else { 
        if(idUser && infoEdit) {
          const pathRef = `user-${idUser}/nodes/node-${infoEdit.payload.node_id}`;
          const payload: UpdateField[] = [{ key: 'name', value: board?.name }, { key: 'sub', value: board?.sub }];
          await updateFieldByPath(pathRef, payload);
          // update info to redux store

        }else {
          throw new Error('Missing field to update.');
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingUpdate(false)
    handleClose();
  }
  
  return (
    <>
      <Dialog
        open={openEdit}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle>Chỉnh sửa { infoEdit?.type === EditType.DEVICE ? 'thiết bị' : 'node' }</DialogTitle>
        <DialogContent>
          <Typography className="pb-2 text-slate-700 whitespace-nowrap overflow-x-scroll" variant="subtitle2" gutterBottom>ID: { infoEdit?.payload.id }</Typography>
          <Box>
            <Divider textAlign="left">
              <Chip label={'Tên'} />
            </Divider>
            <TextField sx={{ paddingY: '0.5rem' }} onChange={(event: React.ChangeEvent<HTMLInputElement>) => changeBoard('name', event.target.value)} value={ board?.name || '' } placeholder={ board?.name || 'thiết bị chưa có tên' } fullWidth id="standard-name" variant="standard" />
          </Box>
          <Box>
            <Divider textAlign="left">
              <Chip label={'Mô tả'} />
            </Divider>
            <TextField sx={{ paddingY: '0.5rem' }} onChange={(event: React.ChangeEvent<HTMLInputElement>) => changeBoard('sub', event.target.value)} value={ board?.sub || '' } placeholder={ board?.sub || 'thiết bị chưa có môt tả' } fullWidth id="standard-sub" variant="standard" />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button endIcon={ loadingUpdate ? <CircularProgress size={20} /> : null } onClick={updateEdit}>Cập nhật</Button>
        </DialogActions>
      </Dialog>
      <Box className="grid grid-cols-2 col-span-full flex flex-nowrap">
        <Typography className="col-span-1 text-slate-700 pt-5 whitespace-nowrap overflow-x-scroll" variant="h6" gutterBottom>{ node.name || node.id }</Typography>
        <Box className="flex flex-nowrap justify-end">
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="setting">
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={() => { setExpand(state => !state); }} aria-label="expand">
            { expand ? <UnfoldLessIcon /> : <UnfoldMoreIcon /> }
          </IconButton>
        </Box>
      </Box>
      {
        devices.map((device, index) => (
          <Box 
            key={index}
            className="col-span-2 grid grid-cols-2 relative"
          >
            {/* <Grow
              className="absolute overflow-hidden right-0 w-full flex z-10"
              in={expand}
              style={{ transformOrigin: '0 0 0' }}
              {...(expand ? { timeout: (index + 1) * 200 } : {})}
            > */}
            <div className="absolute w-full transition-opacity" style={{ opacity: expand ? 1 : 0 }}>
              <Box className="flex">
                <Box className="flex-1 border-indigo-700 border-t-2 border-l-2 rounded-tl-lg mr-4 ml-10 translate-y-1/2"></Box>
                <Box className="flex flex-nowrap">
                  <IconButton size={'small'} aria-label="setting">
                    Cài đặt <SettingsIcon className="ml-1" />
                  </IconButton>
                  <IconButton onClick={() => activeEditDevice(device)} size={'small'} aria-label="edit">
                    Chỉnh sửa <EditIcon className="ml-1" />
                  </IconButton>
                </Box>
              </Box>
            </div>
            {/* </Grow> */}
            <Box
              style={{
                marginTop: expand ? 40 : 0,
                transition: 'margin 200ms ease-in-out'
              }}
              className={`flex flex-nowrap ${
                device.type in grids
                  ? grids[device.type as keyof typeof grids]
                  : grids["none"]
              } p-3 rounded-2xl border-indigo-600 border-2 shadow-md relative z-20 bg-[#edf1f5]`}
            >
              {getTypeWidget(device, idUser)}
            </Box>
          </Box>
        ))
      }
    </>
  )
}

export default memo(Node);
