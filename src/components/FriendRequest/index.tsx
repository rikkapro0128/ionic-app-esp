import { memo, useState } from "react";

import { Box, Typography, Button } from "@mui/material";

import AddReactionRoundedIcon from "@mui/icons-material/AddReactionRounded";

import { set, ref, remove } from 'firebase/database';

import { database } from "../../firebase/db";

import { useAppSelector } from "../../store/hooks";

interface FriendProps {
  name: string;
  email: string;
  uid: string;
  srcAvatar?: string;
  className?: string;
}

const FriendRequest = ({ name, email, className, srcAvatar, uid }: FriendProps) => {

  const infoUser = useAppSelector(store => store.commons.infoUser);
  const [disabledRejectFriend, setDisabledRejectFriend] = useState(false);
  const [disabledResovleFriend, setDisabledResovleFriend] = useState(false);

  const handleAcceptFriend = async () => {
    if(infoUser) {
      setDisabledResovleFriend(true);
      try {
        await set(ref(database, `user-${infoUser.uid}/my-friends/${uid}`), { name, email, uid, photoURL: srcAvatar ?? '' });
        await set(ref(database, `user-${uid}/my-friends/${infoUser.uid}`), { name: infoUser.displayName, email: infoUser.email, uid: infoUser.uid, photoURL: infoUser.photoURL ?? '' });
        await remove(ref(database, `user-${infoUser.uid}/queue-friends/${uid}`));
      } catch (error) {
        console.log(error);
      }
      setDisabledResovleFriend(false);
    }
  }

  const handleRejectFriend = async () => {
    if(infoUser) {
      setDisabledRejectFriend(true);
      try {
        await remove(ref(database, `user-${infoUser.uid}/queue-friends/${uid}`));
      } catch (error) {
        console.log(error);
      }
      setDisabledRejectFriend(false);
    }
  }

  return (
    <Box sx={{
      backgroundColor: (theme) => theme.palette.mode === 'light' ? 'white' :  theme.palette.background.paper
    }} color={theme => theme.palette.text.primary} className={`rounded-lg px-4 py-3 flex flex-nowrap items-center ${className}`}>
      <Box className="w-14 h-14 text-7xl flex justify-center items-center rounded-full shadow-md shadow-gray-700">
        {srcAvatar ? <img className="w-full object-cover rounded-full" src={srcAvatar} alt="avatar" /> : <AddReactionRoundedIcon fontSize="inherit" />}
      </Box>
      <Box className="pl-5 flex-1">
        <Typography variant="subtitle1"> {name} </Typography>
        <Typography variant="subtitle2"> {email} </Typography>
        <Box className="flex pt-2 justify-between w-full">
          <Button onClick={handleAcceptFriend} className="flex-1" sx={{
            marginRight: '.5rem'
          }} disabled={disabledResovleFriend} variant="contained">Xác nhận</Button>
          <Button disabled={disabledRejectFriend} onClick={handleRejectFriend} className="flex-1" variant="contained">Huỷ</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(FriendRequest);
