import { memo, useState } from "react";

import { Box, Typography, Button, IconButton, MenuItem } from "@mui/material";

import AddReactionRoundedIcon from "@mui/icons-material/AddReactionRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EmergencyShareIcon from '@mui/icons-material/EmergencyShare';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';

import { StyledMenu } from '../Node';

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

const FriendRequest = ({
  name,
  email,
  className,
  srcAvatar,
  uid,
}: FriendProps) => {
  const infoUser = useAppSelector(store => store.commons.infoUser);
  const [anchorElMenuSetting, setAnchorElMenuSetting] =
    useState<null | HTMLElement>(null);         
    const openMenu = Boolean(anchorElMenuSetting);
  const [disabledOptions, setDisabledOptions] = useState({ shareControll: true, unFriend: false });

  const handleCloseMenu = () => {
    setAnchorElMenuSetting(null);
  };

  const handleClickPickAction = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAnchorElMenuSetting(event.currentTarget);
  };

  const handleUnFriend = async () => {
    if(infoUser) {
      setDisabledOptions({ ...disabledOptions, unFriend: true });
      try {
        await remove(ref(database, `user-${infoUser.uid}/my-friends/${uid}`));
        await remove(ref(database, `user-${uid}/my-friends/${infoUser.uid}`));
      } catch (error) {
        console.log(error);
      }
      setDisabledOptions({ ...disabledOptions, unFriend: false });
    }
  }

  return (
    <>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        className="shadow-sm shadow-black"
        anchorEl={anchorElMenuSetting}
        open={openMenu}
        onClose={handleCloseMenu}
      >
        <MenuItem
          disabled={disabledOptions.shareControll}
          disableRipple
        >
          <EmergencyShareIcon />
          chia sẻ điều khiển
        </MenuItem>
        {/* <Divider sx={{ my: 0.5 }} /> */}
        <MenuItem
          disabled={disabledOptions.unFriend}
          disableRipple
          onClick={handleUnFriend}
        >
          <PersonRemoveIcon />
          huỷ kết bạn
        </MenuItem>
      </StyledMenu>
      <Box
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? "white"
              : theme.palette.background.paper,
        }}
        color={(theme) => theme.palette.text.primary}
        className={`rounded-lg px-4 py-3 flex flex-nowrap items-center ${className}`}
      >
        <Box className="w-14 h-14 text-7xl flex justify-center items-center rounded-full shadow-md shadow-gray-700">
          {srcAvatar ? (
            <img
              className="h-full object-cover rounded-full overflow-hidden"
              src={srcAvatar}
              srcSet={""}
              alt="avatar"
            />
          ) : (
            <AddReactionRoundedIcon fontSize="inherit" />
          )}
        </Box>
        <Box className="pl-5 flex-1">
          <Typography className="max-w-full truncate " variant="subtitle1">
            {" "}
            {name}{" "}
          </Typography>
          <Typography className="max-w-full truncate " variant="subtitle2">
            {" "}
            {email}{" "}
          </Typography>
        </Box>
        <Box className="">
          <IconButton onClick={handleClickPickAction} aria-label="delete" size="medium">
            <MoreVertIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>
    </>
  );
};

export default memo(FriendRequest);
