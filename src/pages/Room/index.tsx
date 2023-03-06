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
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import Snackbar from "@mui/material/Snackbar";
import TextField from "@mui/material/TextField";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

import { useSnackbar, PropsSnack } from "../../hooks/SnackBar";

import AddIcon from "@mui/icons-material/Add";
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";

import Room, { RoomInfo } from "../../components/Room";

import { IconRoom } from "../../icons";

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { getAuth } from "firebase/auth";

import { appAuthWeb } from "../../firebase";
import {
  ref,
  get,
  set,
  child,
  onChildAdded,
  onChildRemoved,
} from "firebase/database";
import { database } from "../../firebase/db";

import { addRoom, removeRoom, setRooms } from "../../store/slices/roomsSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

import { v1 as genIDByTimeStamp } from "uuid";

import { getUserIDByPlaform } from "../../ConfigGlobal";

import detechOS from "detectos.js";

const OSType = new detechOS();

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

const roomFake = [
  {
    idRoom: "121awda214qad",
    name: "Nhà bếp",
    sub: "",
  },
  {
    idRoom: "121vc214qad",
    name: "Phòng khách",
    sub: "Nơi đón tiếp khách quý",
  },
  {
    idRoom: "121wdaw214qad",
    name: "Phòng thờ, cúng",
    sub: "Phòng thờ cúng vái ông bà tổ tiên",
  },
  {
    idRoom: "121s21as4qad",
    name: "Phòng ngủ",
    sub: "Dĩ nhiên là để ngủ",
  },
  {
    idRoom: "1212dak14qad",
    name: "Phòng ăn",
    sub: "Nơi ăn uống, tụ tập sum vầy.",
  },
];

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Rooms = () => {
  const dispatch = useAppDispatch();
  const rooms = useAppSelector((state) => state.rooms.value);
  const [activeSnack, closeSnack] = useSnackbar();
  const [userIDCtx, setUserIDCtx] = useState<string | undefined>();
  const [createRoom, setCreateRoom] = useState(false);
  const [openSucessCreateRoom, setOpenSucessCreateRoom] = useState(false);
  const [loadingCreateRoom, setLoadingCreateRoom] = useState(false);

  useEffect(() => {
    const runNow = async () => {
      const idUser = await getUserIDByPlaform();
      setUserIDCtx(idUser);
    };
    runNow();
  }, []);

  useEffect(() => {
    let UnRemove: any;
    let UnAdd: any;
    if (userIDCtx) {
      const roomsRef = ref(database, `user-${userIDCtx}/rooms`);
      UnRemove = onChildRemoved(roomsRef, async (snapshot) => {
        const idRoom = snapshot.key?.split("room-")[1];
        if (idRoom) {
          await dispatch(removeRoom(idRoom));
        }
      });
      UnAdd = onChildAdded(roomsRef, async (snapshot) => {
        const snapRoom = snapshot.val();
        
        if (snapRoom) {
          const { name, sub, createAt }: { name: string, sub: string, createAt: number } = snapRoom;
          const idRoom = snapshot.key?.split("room-")[1];
          const rooomExist = rooms.find((room) => room.id === idRoom);
          if (!rooomExist) {
            const unix = createAt ? new Date(createAt) : null;
            const dateParser = unix ? unix.toLocaleDateString('en-US') : '';
            await dispatch(addRoom({ id: idRoom, name, sub, createAt: dateParser }));
          }
        }
      });
    }
    return () => {
      if (typeof UnRemove === "function") {
        UnRemove();
      }
      if (typeof UnAdd === "function") {
        UnAdd();
      }
    };
  }, [userIDCtx]);

  const [infoCreateRoom, setInfoCreateRoom] = useState<RoomInfo>(
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

  return (
    <>
      <Snackbar
        open={openSucessCreateRoom}
        autoHideDuration={3000}
        onClose={handleCloseSucessCreateRoom}
      >
        <Alert onClose={handleCloseSucessCreateRoom} className="mx-3" sx={{ width: '100%' }} severity="success">
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
            className="bg-slate-100 text-slate-700 rounded-md"
            maxWidth={"90%"}
            onSubmit={handleCreateRoom}
          >
            <Typography id="transition-modal-title" variant="h6" component="h2">
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
      <div className="w-full h-screen bg-slate-100 text-slate-700 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-5">
          <Typography className="capitalize text-slate-600" variant="h6">
            Số phòng hiện có: { rooms.length }
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={openRoom}
            variant="contained"
          >
            Tạo phòng
          </Button>
        </div>
        <div className="flex-1 overflow-y-scroll">
          {rooms.length > 0 ? (
            <div className="flex flex-col pb-[4.8rem]">
              {rooms.map((room, index) => (
                <Room
                  className={`${index !== 0 ? "mt-2" : ""} mx-1`}
                  key={`${room.id}-${index}`}
                  room={room}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col justify-center items-center h-full">
              <div className="relative">
                <div className="absolute -top-1 w-full h-full scale-125 rounded-full bg-slate-200"></div>
                <IconRoom className="relative w-20 h-20" />
              </div>
              <span className="mt-2">chưa có phòng nào được tạo.</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Rooms);
