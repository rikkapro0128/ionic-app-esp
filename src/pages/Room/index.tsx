import {
  memo,
  useState,
  ChangeEvent,
  FormEvent,
  useEffect,
  forwardRef,
} from "react";

import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import DialogContentText from "@mui/material/DialogContentText";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";

import { useSnackbar, PropsSnack } from "../../hooks/SnackBar";

import AddIcon from "@mui/icons-material/Add";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import RemoveCircleOutlineRoundedIcon from "@mui/icons-material/RemoveCircleOutlineRounded";

import Room from "../../components/Room";
import Node from "../../components/Node";
import WrapOnNode from "../../components/Room/watch";

import { IconRoom } from "../../icons";
import { ref, set } from "firebase/database";
import { database } from "../../firebase/db";

import { RoomType } from "../../store/slices/roomsSlice";
import { NodePayload } from "../../store/slices/nodesSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { DeviceType } from "../../components/Widget/type";

import Transition from "../../components/Transition/index";

import { v1 as genIDByTimeStamp } from "uuid";

import { RouterIcon } from "../../icons";

const styleTransition = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const defaultRoomEmpty = {
  id: "",
  name: "",
  sub: "",
};

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Rooms = () => {
  const dispatch = useAppDispatch();
  const nodes = useAppSelector((state) => state.nodes.value);
  const rooms = useAppSelector((state) => state.rooms.value);
  const userIDCtx = useAppSelector((state) => state.commons.userId);
  const [activeSnack, closeSnack] = useSnackbar();
  const [dialog, setDialog] = useState<boolean>(false);
  const [pickViewRoom, setPickViewRoom] = useState<RoomType | undefined>();
  const [devicesViewRoom, setDevicesViewRoom] = useState<
    NodePayload | undefined
  >();
  const [createRoom, setCreateRoom] = useState(false);
  const [openSucessCreateRoom, setOpenSucessCreateRoom] = useState(false);
  const [loadingCreateRoom, setLoadingCreateRoom] = useState(false);
  const [loadingViewRoom, setLoadingViewRoom] = useState(true);

  useEffect(() => {
    let idTimeOut: NodeJS.Timeout;
    setLoadingViewRoom(true);
    if (pickViewRoom?.devicesOwn?.length) {
      idTimeOut = setTimeout(() => {
        setLoadingViewRoom(false);
      }, 5000);
      const tempDevicesByNode: NodePayload = {};
      pickViewRoom.devicesOwn.forEach((preDevice: DeviceType, index: number, arr) => {
        if (typeof tempDevicesByNode[preDevice.node_id] !== "object") {
          tempDevicesByNode[preDevice.node_id] = {
            devices: [],
            name: "",
            sub: "",
          };
        }

        tempDevicesByNode[preDevice.node_id].name =
          nodes[preDevice.node_id]?.name ?? "";
        tempDevicesByNode[preDevice.node_id].sub =
          nodes[preDevice.node_id]?.sub ?? "";
        tempDevicesByNode[preDevice.node_id].devices.push(preDevice);
        if(index === arr.length - 1) {
          setLoadingViewRoom(false);
          if(idTimeOut) {
            clearTimeout(idTimeOut);
          }
        }
      });
      setDevicesViewRoom(tempDevicesByNode);
    } else {
      setDevicesViewRoom(undefined);
      setLoadingViewRoom(false);
    }
    return () => {
      if(idTimeOut) {
        clearTimeout(idTimeOut);
      }
    }
  }, [pickViewRoom]);

  useEffect(() => {
    // console.log(rooms);
    if (pickViewRoom) {
      const reUpdateRoom = rooms.find((room) => room.id === pickViewRoom.id);
      if (reUpdateRoom) {
        setPickViewRoom(reUpdateRoom);
      }
    }
  }, [rooms]);

  const [infoCreateRoom, setInfoCreateRoom] = useState<RoomType>(
    () => defaultRoomEmpty
  );
  const [messageError, setMessageError] = useState({
    nameRoom: "",
    subRoom: "",
  });

  const openRoom = () => {
    setCreateRoom(true);
  };

  const closeRoom = () => {
    setCreateRoom(false);
  };

  const cancelCreateRoom = () => {
    closeRoom();
    setInfoCreateRoom(() => defaultRoomEmpty);
  };

  const handleOpenSucessCreateRoom = () => {
    setOpenSucessCreateRoom(true);
  };

  const handleCloseSucessCreateRoom = () => {
    setOpenSucessCreateRoom(false);
  };

  const changeCreateNameRoom = (event: ChangeEvent<HTMLInputElement>) => {
    if (infoCreateRoom.name.length > 0) {
      setMessageError((state) => ({ ...state, nameRoom: "" }));
    }
    setInfoCreateRoom({ ...infoCreateRoom, name: event.currentTarget.value });
  };

  const changeCreateSubRoom = (event: ChangeEvent<HTMLInputElement>) => {
    setInfoCreateRoom({ ...infoCreateRoom, sub: event.currentTarget.value });
  };

  const handleCreateRoom = async (
    event: FormEvent<HTMLFormElement> | undefined
  ) => {
    try {
      if (event) {
        event.preventDefault();
      }
      setLoadingCreateRoom(true);
      if (!infoCreateRoom.name) {
        setMessageError((state) => ({
          ...state,
          nameRoom: "tên phòng không được bỏ trống!",
        }));
        setLoadingCreateRoom(false);
        return;
      }
      if (userIDCtx) {
        const genIdRoom = genIDByTimeStamp();
        await set(ref(database, `user-${userIDCtx}/rooms/room-${genIdRoom}`), {
          name: infoCreateRoom.name,
          sub: infoCreateRoom.sub || "",
          createAt: Date.now(),
        });
        handleOpenSucessCreateRoom();
        cancelCreateRoom();
        setLoadingCreateRoom(false);
      } else {
        activeSnack({
          message:
            "Không thể tạo phòng vì thiếu thông tin id của bạn, hãy liên hệ dev để biết thêm chi tiết!",
        } as PropsSnack & string);
      }
    } catch (error) {
      activeSnack({
        message: "Đã có lỗi gì đó xảy ra khi tạo phòng!",
      } as PropsSnack & string);
    }
    setLoadingCreateRoom(false);
  };

  const handleCloseRoomView = () => {
    setPickViewRoom(undefined);
  };

  const removeRoomDialog = async () => {
    // console.log(pickViewRoom);
    try {
      if (userIDCtx && pickViewRoom) {
        await set(
          ref(database, `user-${userIDCtx}/rooms/room-${pickViewRoom.id}`),
          null
        );
        activeSnack({
          message: `Đã xoá phòng ${pickViewRoom.name}!`,
        } as PropsSnack & string);
        setPickViewRoom(undefined);
      }
    } catch (error) {
      activeSnack({
        message: "Không thể xoá phòng, vui lòng thử lại!",
      } as PropsSnack & string);
    }
    setDialog(false);
  };

  return (
    <WrapOnNode>
      <Box className="h-full">
        <Dialog
          open={dialog}
          onClose={() => setDialog(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Bạn muốn xoá phòng?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Hành động này của bạn sẽ xoá phòng "{pickViewRoom?.name}" ra khỏi
              ứng dụng bạn chắc chứ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialog(false)}>Huỷ</Button>
            <Button onClick={removeRoomDialog} autoFocus>
              Đồng ý
            </Button>
          </DialogActions>
        </Dialog>
        <Dialog
          open={pickViewRoom ? true : false}
          TransitionComponent={Transition}
          keepMounted
          aria-describedby="alert-dialog-slide-description"
          fullWidth
          fullScreen
        >
          <DialogTitle className="flex justify-between items-start">
            <div className="flex flex-col">
              <Typography variant="h6">Bạn đang trong</Typography>
              <span className="font-bold block">{` "${
                pickViewRoom?.name || pickViewRoom?.id
              }"`}</span>
            </div>
            <IconButton onClick={handleCloseRoomView} aria-label="close">
              <CloseRoundedIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <div className="h-full flex flex-col items-center overflow-hidden">
              <div className="w-full flex justify-end mb-5">
                <Button
                  onClick={() => {
                    setDialog(true);
                  }}
                  variant="contained"
                  endIcon={<RemoveCircleOutlineRoundedIcon />}
                >
                  xoá phòng
                </Button>
              </div>
              <div className="flex h-full w-full flex-col overflow-y-scroll overflow-x-hidden p-1">
                {loadingViewRoom ? (
                  <Box className="text-indigo-600 w-full flex flex-col justify-center items-center">
                    <CircularProgress
                      sx={{ color: "inherit", margin: "0 auto" }}
                    />
                    <Typography
                      className=" pt-5"
                      variant="subtitle1"
                      gutterBottom
                    >
                      Đang tải thiết bị.
                    </Typography>
                  </Box>
                ) : devicesViewRoom &&
                  Object.entries(devicesViewRoom).length > 0 ? (
                  Object.entries(devicesViewRoom).map(([key, node]) => {
                    return (
                      <div key={key} className="h-fit grid grid-cols-2 gap-3">
                        <Node
                          devices={node.devices}
                          node={{ id: key, name: node.name, sub: node.sub }}
                        />
                      </div>
                    );
                  })
                ) : (
                  <Fade in={true} timeout={{ enter: 1000 }}>
                    <div className="relative top-1/2 -translate-y-1/2 w-full flex flex-col justify-center items-center">
                      <RouterIcon className="w-20 h-20 pb-2" />
                      <Typography variant="subtitle2">
                        không tìm thấy thiết bị nào trong phòng này.
                      </Typography>
                    </div>
                  </Fade>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Snackbar
          open={openSucessCreateRoom}
          autoHideDuration={3000}
          onClose={handleCloseSucessCreateRoom}
        >
          <Alert
            onClose={handleCloseSucessCreateRoom}
            className="mx-3"
            sx={{ width: "100%" }}
            severity="success"
          >
            Bạn vừa tạo 1 phòng mới.
          </Alert>
        </Snackbar>
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={createRoom}
          onClose={closeRoom}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
        >
          <Fade in={createRoom}>
            <Box
              component="form"
              sx={styleTransition}
              className="rounded-md"
              maxWidth={"90%"}
              onSubmit={handleCreateRoom}
            >
              <Typography
                id="transition-modal-title"
                variant="h6"
                component="h2"
              >
                Tạo phòng
              </Typography>
              <div className="flex flex-col">
                <TextField
                  fullWidth
                  label="Tên phòng"
                  variant="filled"
                  color="success"
                  onChange={changeCreateNameRoom}
                  focused
                  value={infoCreateRoom.name}
                  margin="normal"
                  error={messageError.nameRoom ? true : false}
                  helperText={messageError.nameRoom}
                />
                <TextField
                  fullWidth
                  className="mt-2"
                  label="Mô tả (không bắt buộc)"
                  rows={4}
                  multiline
                  variant="filled"
                  color="success"
                  onChange={changeCreateSubRoom}
                  focused
                  value={infoCreateRoom.sub}
                  error={messageError.subRoom ? true : false}
                  helperText={messageError.subRoom}
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button variant="text" onClick={cancelCreateRoom}>
                  huỷ
                </Button>
                <Button
                  onClick={() => handleCreateRoom(undefined)}
                  variant="contained"
                >
                  Xác nhận tạo
                </Button>
              </div>
            </Box>
          </Fade>
        </Modal>
        <Box className="w-full h-full p-4 flex flex-col">
          <Box className="flex justify-between items-center mb-5">
            <Typography
              color={(theme) => theme.palette.text.primary}
              className="capitalize "
              variant="h6"
            >
              Số phòng hiện có: {rooms.length}
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={openRoom}
              variant="contained"
            >
              Tạo phòng
            </Button>
          </Box>
          <div className="flex-1 overflow-y-scroll">
            {rooms.length > 0 ? (
              <div className="flex flex-col ">
                {rooms.map((room, index) => (
                  <Fade
                    key={`${room.id}-${index}`}
                    in={true}
                    timeout={{ enter: 1000 * (index + 1) }}
                  >
                    <div
                      onClick={() => {
                        setPickViewRoom(room);
                      }}
                    >
                      <Room
                        className={`${index !== 0 ? "mt-2" : ""} mx-1`}
                        room={room}
                      />
                    </div>
                  </Fade>
                ))}
              </div>
            ) : (
              <Fade in={true}>
                <div className="flex flex-col justify-center items-center h-full">
                  <div className="relative">
                    <div className="absolute -top-1 w-full h-full scale-125 rounded-full bg-slate-200"></div>
                    <IconRoom className="relative w-20 h-20" />
                  </div>
                  <span className="mt-2">chưa có phòng nào được tạo.</span>
                </div>
              </Fade>
            )}
          </div>
        </Box>
      </Box>
    </WrapOnNode>
  );
};

export default memo(Rooms);
