import { useState, ChangeEvent, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import FriendRequest from "../../components/FriendRequest";

import { emailValidate } from "../../ConfigGlobal";

import { ref, orderByChild, query, equalTo, onValue } from 'firebase/database';
import { database } from "../../firebase/db";

const fakeDataFriends = [
  {
    name: "Trung hau",
  },
  {
    name: "Trung Nguyen Hao",
  },
  {
    name: "Van tung",
  },
];

const db = ref(database);

const FriendsRequest = () => {
  const [stateAddFriendsModal, setStateAddFriendsModal] =
    useState<boolean>(false);
  const [loadingSendRequets, setLoadingSendRequets] = useState<boolean>(false);
  const [emailFriendToAdd, setEmailFriendToAdd] = useState<string>("");


  useEffect(() => {
    const run = () => {
      const keyQuery = query(db, orderByChild('info/email'), equalTo('vkcks@gmail.com'));
      onValue(keyQuery, (val) => {
        console.log(val.val());
      })
      
    }

    run();
  }, [])

  const handleCloseModalAddFriends = () => {
    setStateAddFriendsModal(false);
  };

  const handleOpenModalAddFriends = () => {
    setStateAddFriendsModal(true);
  };

  const onChangeEmailToAddFriend = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailFriendToAdd(event.currentTarget.value);
  };

  const handleSendRequestFriend = () => {
    handleCloseModalAddFriends();
  };

  return (
    <>
      <Dialog
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        open={stateAddFriendsModal}
        onClose={handleCloseModalAddFriends}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        fullWidth
      >
        <Typography className="px-5 pt-5" variant="h6">
          Thêm bạn bè
        </Typography>
        <Box className="p-5 pt-1">
          <TextField
            fullWidth
            placeholder="vd: abc123@gmail.com"
            label="Email bạn bè"
            variant="outlined"
            color={emailValidate(emailFriendToAdd) ? "success" : "error"}
            onChange={onChangeEmailToAddFriend}
            value={emailFriendToAdd}
            margin="normal"
            error={!emailValidate(emailFriendToAdd)}
            helperText={
              !emailValidate(emailFriendToAdd)
                ? "Email không hợp lệ"
                : "Email hợp lệ"
            }
          />
          <Box className="flex justify-end">
            <Button
              className=""
              endIcon={<SendRoundedIcon />}
              variant="contained"
              onClick={handleSendRequestFriend}
              disabled={loadingSendRequets}
            >
              {loadingSendRequets ? "Đang gửi" : "Gửi lời mời"}
            </Button>
          </Box>
        </Box>
      </Dialog>
      <Box className="h-full flex flex-col">
        <Box className="flex justify-between items-center px-5 py-5">
          <Typography
            className="text-left font-semibold"
            variant="subtitle1"
            component={"p"}
            color={(theme) => theme.palette.text.primary}
          >
            {12} lời mời kết bạn
          </Typography>
          <Button
            className=""
            startIcon={<PersonAddRoundedIcon />}
            variant="contained"
            onClick={handleOpenModalAddFriends}
          >
            Thêm bạn bè
          </Button>
        </Box>
        <Box className="flex-1 overflow-y-scroll px-5 mb-5">
          {fakeDataFriends.length > 0 ? (
            fakeDataFriends.map((friend, index) => (
              <Box
                key={friend.name + index}
                className={index === 0 ? "" : "pt-4"}
              >
                <FriendRequest name={friend.name} />
              </Box>
            ))
          ) : (
            <Box className="h-full flex justify-center items-center flex-col text-5xl">
              <Diversity3RoundedIcon fontSize="inherit" />
              <Typography>chưa có lời mời nào.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default FriendsRequest;
