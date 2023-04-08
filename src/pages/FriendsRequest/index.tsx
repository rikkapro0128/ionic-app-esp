import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import Diversity3RoundedIcon from "@mui/icons-material/Diversity3Rounded";
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';

import FriendRequest from "../../components/FriendRequest";

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

const FriendsRequest = () => {
  return (
    <Box className="h-full flex flex-col">
      <Box className="flex justify-between items-center px-5 py-5">
        <Typography
          className="text-left font-semibold"
          variant="subtitle1"
          component={'p'}
          color={theme => theme.palette.text.primary}
        >
          {12} lời mời kết bạn
        </Typography>
        <Button className="" startIcon={<PersonAddRoundedIcon />} variant="contained">Thêm bạn bè</Button>
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
  );
};

export default FriendsRequest;
