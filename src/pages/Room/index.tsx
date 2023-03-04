import { EventHandler, memo, useState, ChangeEvent } from "react";

import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

import AddIcon from "@mui/icons-material/Add";
import NoMeetingRoomIcon from "@mui/icons-material/NoMeetingRoom";

import Room, { RoomInfo } from "../../components/Room";

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

const Rooms = () => {
  const [createRoom, setCreateRoom] = useState(false);
  const [loadingCreateRoom, setLoadingCreateRoom] = useState(false);
  const [roomList, setRoomList] = useState<Array<RoomInfo> | []>(
    roomFake.length < 0 ? roomFake : []
  );
  const [infoCreateRoom, setInfoCreateRoom] = useState<RoomInfo>({
    idRoom: "",
    name: "",
    sub: "",
  });

  const openRoom = () => {
    setCreateRoom(true);
  };

  const closeRoom = () => {
    setCreateRoom(false);
  };

  const changeCreateNameRoom = (event: ChangeEvent<HTMLInputElement>) => {
    setInfoCreateRoom({ ...infoCreateRoom, name: event.currentTarget.value });
  };

  const changeCreateSubRoom = (event: ChangeEvent<HTMLInputElement>) => {
    setInfoCreateRoom({ ...infoCreateRoom, sub: event.currentTarget.value });
  };

  return (
    <>
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
            sx={styleTransition}
            className="bg-slate-100 text-slate-700 rounded-md"
            maxWidth={"90%"}
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
                margin="normal"
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
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="text" onClick={closeRoom}>
                huỷ
              </Button>
              <Button variant="contained">Xác nhận tạo</Button>
            </div>
          </Box>
        </Fade>
      </Modal>
      <div className="w-full h-screen bg-slate-100 text-slate-700 p-4 flex flex-col">
        <div className="flex justify-between items-center">
          <Typography className="capitalize" variant="h6">
            Số phòng hiện có: 0
          </Typography>
          <Button
            startIcon={<AddIcon />}
            onClick={openRoom}
            variant="contained"
          >
            Tạo phòng
          </Button>
        </div>
        <div className="">
          {roomList.length > 0 ? (
            <div className="grid grid-cols-1 gap-2 mt-5">
              {
                roomList.map((room) => <Room key={room.idRoom} room={room} />)
              }
            </div>
          ) : (
            <div className={`flex-1 flex justify-center`}>
              <div className="flex flex-col justify-center items-center">
                <div className="relative">
                  <div className="absolute w-full h-full rounded-full bg-slate-200 top-0"></div>
                  <NoMeetingRoomIcon
                    sx={{ fontSize: "6rem" }}
                    className="relative"
                  />
                </div>
                <span className="mt-2">chưa có phòng nào được tạo.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default memo(Rooms);
