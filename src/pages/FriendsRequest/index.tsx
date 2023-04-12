import { useState, ChangeEvent, useEffect, useCallback, ErrorInfo } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import PersonAddRoundedIcon from "@mui/icons-material/PersonAddRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";

import FriendRequest from "../../components/FriendRequest";

import { emailValidate } from "../../ConfigGlobal";

import { useSnackbar, PropsSnack } from "../../hooks/SnackBar";

import {
  ref,
  orderByChild,
  query,
  equalTo,
  onValue,
  onChildAdded,
  onChildRemoved,
  set,
  push,
  get,
  
} from "firebase/database";
import { UserInfo } from "firebase/auth";
import { database } from "../../firebase/db";

import { useAppSelector } from "../../store/hooks";

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

interface RequestFriend {
  email: string,
  uid: string,
  name?: string,
  photoURL?: string,
}

const db = ref(database);

const FriendsRequest = () => {
  const infoUser = useAppSelector((store) => store.commons.infoUser);
  const [activeSnack, closeSnack] = useSnackbar();
  const [stateAddFriendsModal, setStateAddFriendsModal] =
    useState<boolean>(false);
  const [loadingSendRequets, setLoadingSendRequets] = useState<boolean>(false);
  const [emailFriendToAdd, setEmailFriendToAdd] = useState<string>("");
  const [listRequest, setListRequest] = useState<RequestFriend[] | []>([]);

  useEffect(() => {
    if(infoUser) {
      const unSubAdd = onChildAdded(ref(database, `user-${infoUser.uid}/queue-friends`), (value) => {
        console.log(value.val());
        
        setListRequest(state => [ ...state, value.val() as RequestFriend ]);
      })
      const unSubRemove = onChildRemoved(ref(database, `user-${infoUser.uid}/queue-friends`), (value) => {
        
        setListRequest(state => state.filter(friend => friend.uid !== (value.val() as RequestFriend).uid));
      })
      return () => {
        unSubAdd();
        unSubRemove();
      };
    }
  }, [infoUser])

  useEffect(() => {
    if(!stateAddFriendsModal) {
      setEmailFriendToAdd('');
    }
  }, [stateAddFriendsModal])

  const handleSendRequestFriend = useCallback(async () => {
    let unSub: any;

    if (emailValidate(emailFriendToAdd)) {
      setLoadingSendRequets(true);
      const queryFriend = query(
        db,
        orderByChild("info/email"),
        equalTo(emailFriendToAdd)
      );
      const resultFriend = await get(queryFriend);

      const payload = resultFriend.val() as {
        [key: string]: { info: UserInfo };
      } | null;

      if (payload === null) {
        activeSnack({
          title: "Hmm...",
          message: "Email người dùng hiện không tìm thấy bạn nhé!",
        } as PropsSnack & string);
      } else {
        const friend = Object.values(payload)[0] as { info: UserInfo | null };

        if (friend.info?.uid && infoUser) {
          console.log(infoUser);
          
          try {

            const newSendRequestFriend = ref(
              database,
              `user-${friend.info?.uid}/queue-friends/${infoUser.uid}`
            );
            await set(newSendRequestFriend, {
              email: infoUser.email,
              uid: infoUser.uid,
              name: infoUser.displayName,
              photoURL: infoUser.photoURL,
            });
            activeSnack({
              title: "Wao...",
              message: "Bạn đã gửi lời mời kết bạn rồi đó!",
            } as PropsSnack & string);
          } catch (error: any) {
            console.log(error?.message);
            if(error?.message === 'PERMISSION_DENIED: Permission denied') {
              activeSnack({
                title: "Hmm...",
                message:
                  "Bạn hãy đợi đối phương chấp nhận kết bạn nhé!",
              } as PropsSnack & string);
            }else {
              activeSnack({
                title: "Hmm...",
                message:
                  "Có vẻ như đã có lỗi gì đó xảy ra, hãy thử lại lần nữa xem nào!",
              } as PropsSnack & string);
            }
          }
        } else {
          activeSnack({
            title: "Hmm...",
            message:
              "Có vẻ như email của bạn, hoặc của đối phương không tồn tại trên hệ thống!",
          } as PropsSnack & string);
        }
      }
      setLoadingSendRequets(false);
      handleCloseModalAddFriends();
    }
    return () => {
      if (typeof unSub === "function") {
        unSub();
      }
    };
  }, [emailFriendToAdd]);

  const handleCloseModalAddFriends = () => {
    setStateAddFriendsModal(false);
  };

  const handleOpenModalAddFriends = () => {
    setStateAddFriendsModal(true);
  };

  const onChangeEmailToAddFriend = (event: ChangeEvent<HTMLInputElement>) => {
    setEmailFriendToAdd(event.currentTarget.value);
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
            color={ emailFriendToAdd.length > 0 ? emailValidate(emailFriendToAdd) ? "success" : "error" : 'warning'}
            onChange={onChangeEmailToAddFriend}
            value={emailFriendToAdd}
            margin="normal"
            error={ emailFriendToAdd.length > 0 ?!emailValidate(emailFriendToAdd) : false }
            helperText={
              emailFriendToAdd.length > 0 ? !emailValidate(emailFriendToAdd)
                ? "Email không hợp lệ"
                : "Email hợp lệ"
                : 'Email bị trống'
            }
          />
          <Box className="flex justify-end">
            <Button
              className=""
              endIcon={
                loadingSendRequets ? (
                  <CircularProgress color="inherit" size={20} />
                ) : (
                  <SendRoundedIcon />
                )
              }
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
            {listRequest.length} lời mời kết bạn
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
          {listRequest.length > 0 ? (
            listRequest.map((friend, index) => (
              <Box
                key={`${friend.name}-index`}
                className={index === 0 ? "" : "pt-4"}
              >
                <FriendRequest uid={friend.uid} name={friend.name || '{chưa có tên}'} email={friend.email} srcAvatar={friend.photoURL} />
              </Box>
            ))
          ) : (
            <Box color={theme => theme.palette.text.primary} className="h-full flex justify-center items-center flex-col text-5xl">
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
