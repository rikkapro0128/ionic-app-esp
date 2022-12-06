import { memo, useState, useEffect } from "react";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Grow from '@mui/material/Grow';
import Dialog from '@mui/material/Dialog';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InfoIcon from '@mui/icons-material/Info';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import Skeleton from '@mui/material/Skeleton';
import { styled } from '@mui/material/styles';
import { grey } from '@mui/material/colors';

import EditIcon from '@mui/icons-material/Edit';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CancelIcon from '@mui/icons-material/Cancel';

import { IconNode, IconNotFound } from '../../icons';

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { ref, get, set, child } from "firebase/database";
import { database } from "../../firebase/db";

import toast from 'react-hot-toast';

import Notify from '../../components/Notify';

const notify = ({ title= 'Thông báo', body = 'Push notìy thành công!' }) => toast.custom((t) => (
  <Notify title={title} body={body} state={t} />
), {
  duration: 5000,
});

interface TransferNodeType {
  nodes: {
    [node: string]: {
      type: string;
      value: any;
    };
  };
}

interface NodeType {
  id: string,
  name: string;
  sub: string;
  icon: string;
  type: string;
  uint: string;
}

const transferTypeModel = {
  LOGIC: "toggle",
  TRANSFORM: "slider",
  RGB: "color",
  PRGRESS: "progress",
  none: "toggle",
};

const drawerBleeding = 56;

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

function Nodes() {
  const [loading, setLoading] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [nodes, setNodes] = useState<NodeType[] | []>([]);
  const [nodeIndex, setNodeIndex] = useState<number>();
  const [infoNode, setInfoNode] = useState<NodeType>();
  const [board, setBoard] = useState<NodeType>();
  const [openDrawer, setOpenDrawer] = useState<boolean>(false);
  const [edit, setEdit] = useState<boolean>(false);
  const [loadingPushInfo, setLoadingPushInfo] = useState<boolean>(false);
  const open = Boolean(anchorEl);

  const transferNodes = (nodes: TransferNodeType) => {
    if(nodes) {
      const transfers = Object.entries(nodes).map(([key, field]): NodeType => ({
        id: key.split("node-")[1],
        name: field?.info?.name || "",
        sub: field?.info?.sub || "",
        type: field.type in transferTypeModel ? transferTypeModel[field.type as keyof typeof transferTypeModel] : transferTypeModel['none'],
        icon: 'light',
        uint: field?.info?.uint || "",
      }));
      if(transfers.length > 0) {
        setNodes(transfers);
      }
    }

  };

  const toggleDrawer = (state: boolean) => () => {
    setOpenDrawer(state);
  };

  useEffect(() => {
    const getNode = async () => {
      setLoading(true);
      try {
        const user = await FirebaseAuthentication.getCurrentUser();
        const idUser = user.user?.uid;
        if (idUser) {
          const pathListNode = `user-${idUser}/nodes`;
          const dbRef = ref(database);
          const snapshot = await get(child(dbRef, pathListNode));
          const nodes = snapshot.val();
          transferNodes(nodes);
        }
      } catch (error: unknown) {
        hanldeError(error);
      }
      setLoading(false);
    };
    getNode();
  }, []);

  useEffect(() => {
    if(typeof nodeIndex === 'number') {
      if(nodes[nodeIndex]) {
        setInfoNode(nodes[nodeIndex]);
        setBoard(nodes[nodeIndex]);
      }
    }
  }, [nodeIndex, edit]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    setAnchorEl(event.currentTarget);
    setNodeIndex(index);
  };

  const updateInfoNode = async () => {
    const getNode = async () => {
      setLoadingPushInfo(true);
      try {
        const user = await FirebaseAuthentication.getCurrentUser();
        const idUser = user.user?.uid;
        if(idUser && board?.id) {
          const pathUpdateNode = `user-${idUser}/nodes/node-${board?.id}/info`;
          const dbRef = ref(database, pathUpdateNode);
          const { name, sub, uint, icon, id } = board;
          await set(dbRef, { name, sub, uint, icon });
          notify({ body: `Cập nhật thông tin node ${id} thành công!` });
          setOpenDrawer(false);
        }
      } catch (error) {
        hanldeError(error);
      }
      setLoadingPushInfo(false);
    };
    getNode();
  }

  const handleClose = () => {
    setAnchorEl(null);
  }

  const hanldeError = (error: unknown) => {
    console.log(error);
    notify({ body: 'Có lỗi xảy ra khi cập nhật thông tin!', title: 'Lỗi rồi' });
  }

  const handleClickDetail = async () => {
    setOpenDrawer(true);
    handleClose();
  }

  const editField = (field: string, value: string) => {
    if(board) {
      setBoard({ ...board, [field]: value });
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, field: string) => {
    editField(field, event.target.value);
  };

  return (
    <>
      <SwipeableDrawer
        sx={{
          '.MuiPaper-root': {
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12, 
          }
        }}
        container={window.document.body}
        anchor="bottom"
        open={openDrawer}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={0}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box className="px-3" sx={{ 
          p: 2,
        }}>
          <Box className="py-3">
            <Puller className="mt-3" />
          </Box>
          <Typography sx={{ fontWeight: 600, fontSize: '1.2rem' }} className='text-slate-700'>Chi thiết Node</Typography>
        </Box>
        <Box className='px-6'>
          <Box>
            <Divider textAlign="left">
              <Chip label={'ID'} />
            </Divider>
            <TextField sx={{ paddingY: '0.5rem' }} disabled={true} value={ infoNode?.id || 'Chưa có ID'} fullWidth id="standard-basic" variant="standard" />
          </Box>
          <Box>
            <Divider textAlign="left">
              <Chip label={'Tên'} />
            </Divider>
            <TextField sx={{ paddingY: '0.5rem' }} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, 'name')} disabled={!edit} value={ edit ? board?.name : infoNode?.name || 'Chưa có tên'} fullWidth id="standard-basic" variant="standard" />
          </Box>
          <Box>
            <Divider textAlign="left">
              <Chip label={'Mô tả'} />
            </Divider>
            <TextField sx={{ paddingY: '0.5rem' }} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, 'sub')} disabled={!edit} value={ edit ? board?.sub : infoNode?.sub  || 'Chưa có mô tả nào'} fullWidth id="standard-basic" variant="standard" />
          </Box>
          <Box>
            <Divider textAlign="left">
              <Chip label={'Loại node'} />
            </Divider>
            <TextField sx={{ paddingY: '0.5rem' }} disabled={true} value={ infoNode?.type  || 'Chưa có phân loại'} fullWidth id="standard-basic" variant="standard" />
          </Box>
          <Box>
            <Divider textAlign="left">
              <Chip label={'Đơn vị'} />
            </Divider>
            <TextField sx={{ paddingY: '0.5rem' }} onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleChange(event, 'uint')} disabled={!edit} value={ edit ? board?.uint : infoNode?.uint || 'Chưa có đơn vị'} fullWidth id="standard-basic" variant="standard" />
          </Box>
        </Box>
        <Box className='px-6 w-full pt-4 pb-8'>
          <Stack spacing={2} direction="row" >
            <Button fullWidth onClick={() => setEdit(state => !state)} startIcon={ edit ? <CancelIcon /> : <EditIcon /> } variant="contained"> { edit ? 'Huỷ thay đổi' : 'Chỉnh sửa' }</Button>
            <Button fullWidth onClick={updateInfoNode} startIcon={ loadingPushInfo ? <CircularProgress size={20} /> : <UpgradeIcon />} variant="outlined">Cập nhật</Button>
          </Stack>
        </Box>
      </SwipeableDrawer>
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <ListItem>
          <ListItemButton onClick={handleClickDetail}>
            <ListItemIcon>
              <InfoIcon />
            </ListItemIcon>
            <ListItemText primary={'Chi tiết'} />
          </ListItemButton>
        </ListItem>
      </Popover>
      <Grow in={true}>
        <Box className="grid grid-cols-2 gap-3 p-3">
          {
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
            nodes.length > 0 
            ?
            nodes.map((node ,index) => (
              <Box key={node.id} className={`flex flex-col p-3 items-center rounded-2xl border-indigo-600 border-2 shadow-md`}>
                <Box className='flex flex-nowrap justify-between items-center w-full'>
                  <Box className={`w-4 h-4 ml-3 rounded-full shadow-sm ${ true ? 'shadow-green-400 bg-green-400' : 'bg-gray-400 shadow-gray-400' }`} />
                  <IconButton onClick={(event: React.MouseEvent<HTMLButtonElement>) => handleClick(event, index)} aria-label="delete">
                    <MoreVertIcon />
                  </IconButton>
                </Box>
                <Box>
                  <IconNode className='w-12 h-12 my-3 fill-slate-600' />
                </Box>
                <Typography className='text-slate-600 truncate max-w-full' variant="subtitle1">{ node.name || node.id }</Typography>
              </Box>
            ))
            :
            <Box className="h-full w-full flex justify-between items-center">
              <Box className='m-auto'>
                <IconNotFound className='w-48 h-48 m-auto' />
                <Typography sx={{ fontSize: '1.2rem' }} className='pt-3 text-slate-700'>Không tìm thấy thiết bị nào.</Typography>
              </Box>
            </Box>
          }
        </Box>
      </Grow>
    </>
  )
}

export default memo(Nodes)