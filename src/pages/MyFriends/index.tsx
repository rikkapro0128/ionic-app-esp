import { useState, useEffect } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import CircularProgress from '@mui/material/CircularProgress';

import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import GroupAddIcon from '@mui/icons-material/GroupAdd';

import MyFriend from "../../components/MyFriend";

import { useSnackbar, PropsSnack } from "../../hooks/SnackBar";

import { useNavigate } from "react-router-dom";

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
  email: string;
  uid: string;
  name?: string;
  photoURL?: string;
}

const db = ref(database);

const MyFriends = () => {
  const navigate = useNavigate();
  const infoUser = useAppSelector((store) => store.commons.infoUser);
  const [activeSnack, closeSnack] = useSnackbar();
  const [listFriends, setListFriends] = useState<RequestFriend[] | []>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (infoUser) {
      const unSubAdd = onChildAdded(
        ref(database, `user-${infoUser.uid}/my-friends`),
        (value) => {
          console.log(value.val());

          setListFriends((state) => [...state, value.val() as RequestFriend]);
          if (loading) {
            setLoading(false);
          }
        }
      );
      const unSubRemove = onChildRemoved(
        ref(database, `user-${infoUser.uid}/my-friends`),
        (value) => {
          setListFriends((state) =>
            state.filter(
              (friend) => friend.uid !== (value.val() as RequestFriend).uid
            )
          );
        }
      );
      return () => {
        unSubAdd();
        unSubRemove();
      };
    }
  }, [infoUser]);

  useEffect(() => {
    const idTimeOut = setTimeout(() => {
      setLoading(false);
    }, 1500);
    return () => {
      clearTimeout(idTimeOut);
    };
  }, [listFriends]);

  const handleNavigateToPageAddFriend = () => {
    navigate('/friends-request');
  }

  return (
    <>
      <Box className="h-full flex flex-col">
        <Box className="flex justify-between items-center px-5 py-5">
          <Typography
            className="text-left font-semibold"
            variant="subtitle1"
            component={"p"}
            color={(theme) => theme.palette.text.primary}
          >
            Bạn đang có {listFriends.length} bạn bè.
          </Typography>
          <Button onClick={handleNavigateToPageAddFriend} startIcon={<GroupAddIcon />} variant="contained">Thêm bạn ngay</Button>
        </Box>
        <Box className="flex-1 overflow-y-scroll px-5 mb-5">
          {!loading ? (
            listFriends.length > 0 ? (
              listFriends.map((friend, index) => (
                <Box
                  key={`${friend.name}-index`}
                  className={index === 0 ? "" : "pt-4"}
                >
                  <MyFriend
                    uid={friend.uid}
                    name={friend.name || "{chưa có tên}"}
                    email={friend.email}
                    srcAvatar={friend.photoURL}
                  />
                </Box>
              ))
            ) : (
              <Box className="h-full flex justify-center items-center flex-col text-5xl">
                <Diversity3RoundedIcon fontSize="inherit" />
                <Typography>bạn đang cô đơn rồi.</Typography>
              </Box>
            )
          ) : (
            <Box className="h-full flex justify-center items-center flex-col text-5xl">
              <CircularProgress color="inherit" size={20} />
              <Typography className="pt-2">đang tải danh sách bạn bè.</Typography>
            </Box>
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyFriends;
