import { memo } from "react";

import { Box, Typography, Button } from "@mui/material";

import AddReactionRoundedIcon from "@mui/icons-material/AddReactionRounded";

interface FriendProps {
  name: string;
  srcAvatar?: string;
  pathResolveFB?: string;
  pathRejectFB?: string;
  className?: string;
}

const FriendRequest = ({ name, className, srcAvatar }: FriendProps) => {
  return (
    <Box sx={{
      backgroundColor: (theme) => theme.palette.mode === 'light' ? 'white' :  theme.palette.background.paper
    }} color={theme => theme.palette.text.primary} className={`rounded-lg px-4 py-3 flex flex-nowrap items-center ${className}`}>
      <Box className="w-14 h-14 text-7xl flex justify-center items-center rounded-full shadow-md shadow-gray-700">
        {srcAvatar ? null : <AddReactionRoundedIcon fontSize="inherit" />}
      </Box>
      <Box className="pl-5 flex-1">
        <Typography variant="subtitle2"> {name} </Typography>
        <Box className="flex pt-2 justify-between w-full">
          <Button className="flex-1" sx={{
            marginRight: '.5rem'
          }} variant="contained">Xác nhận</Button>
          <Button className="flex-1" variant="contained">Huỷ</Button>
        </Box>
      </Box>
    </Box>
  );
};

export default memo(FriendRequest);
