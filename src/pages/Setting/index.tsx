import {
  LocalNotifications,
  LocalNotificationSchema,
} from "@capacitor/local-notifications";
import Typography from "@mui/material/Typography";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";

import WebAssetIcon from "@mui/icons-material/WebAsset";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import PodcastsRoundedIcon from "@mui/icons-material/PodcastsRounded";

import AntSwitch from "../../components/Switch/index";
import { MaterialUISwitch } from "../../components/Switch/MuiDesigner";
import { Android12Switch } from "../../components/Switch/Ant12Designer";
import { useState } from "react";

import { useSnackbar, PropsSnack } from "../../hooks/SnackBar";
import { setColorMode, toggleColorMode } from "../../store/slices/commonSlice";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { ColorMode } from "../../ConfigGlobal";

function Setting() {
  const dispatch = useAppDispatch();
  const colorMode = useAppSelector((state) => state.commons.colorMode);
  const [activeSnack, closeSnack] = useSnackbar();
  const [notifyOpened, setNotifyOpened] = useState(false);

  const toggleNotify = () => {
    setNotifyOpened(!notifyOpened);
  };

  const handleClick = () => {
    const key = activeSnack({ message: "Hello mọi người" } as PropsSnack &
      string);
  };

  const switchColorMode = () => {
    dispatch(toggleColorMode({}));
  };

  return (
    <Box
      color={(theme) => theme.palette.text.primary}
      className="  pt-1"
    >
      <Box>
        <Typography
          className="flex items-center py-1 px-4 pt-2 "
          variant="h6"
          component={"div"}
        >
          Giao diện
        </Typography>
        <Box className="shadow">
          {/* ITEM INTERFACE */}
          <Box className="flex items-center justify-between px-4 py-3 ">
            <Box className="flex items-center">
              <Box className=" rounded-md p-2 mr-2">
                <NightsStayOutlinedIcon className=" text-lg" />
              </Box>
              <Typography variant="h6" component={"div"}>
                Chế độ {colorMode === ColorMode.LIGHT ? " sáng" : " tối"}
              </Typography>
            </Box>
            <MaterialUISwitch
              checked={colorMode === ColorMode.LIGHT ? false : true}
              onClick={switchColorMode}
              size="small"
            />
          </Box>
        </Box>
      </Box>
      <Box className="mt-1">
        <Typography
          className="flex items-center py-1  px-4 pt-2 "
          variant="h6"
          component={"div"}
        >
          Thông báo
        </Typography>
        <Box className="shadow">
          {/* ITEM NOTIFY */}
          <Box
            onClick={toggleNotify}
            className="flex items-center justify-between px-4 py-3"
          >
            <Box className="flex items-center">
              <Box className="rounded-md p-2 mr-2">
                <NotificationsActiveOutlinedIcon className=" text-lg" />
              </Box>
              <Typography variant="h6" component={"div"}>
                Tuỳ chọn ẩn
              </Typography>
            </Box>
            <KeyboardArrowRightRoundedIcon
              sx={{
                transition: "transform ease-in-out 200ms",
                transform: `rotate(${notifyOpened ? 90 : 0}deg)`,
              }}
              fontSize="large"
            />
          </Box>
          <Box color={(theme) => theme.palette.text.secondary}>
            <Collapse in={notifyOpened} unmountOnExit>
              <List component={"div"} disablePadding>
                <ListItemButton disableRipple className="flex" sx={{ pl: 5 }}>
                  <ListItemIcon>
                    <PodcastsRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Kết nối Node" />
                  <Android12Switch />
                </ListItemButton>
                <ListItemButton disableRipple className="flex" sx={{ pl: 5 }}>
                  <ListItemIcon>
                    <PodcastsRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Thiết bị thay đổi trạng thái" />
                  <Android12Switch />
                </ListItemButton>
                <ListItemButton disableRipple className="flex" sx={{ pl: 5 }}>
                  <ListItemIcon>
                    <PodcastsRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Ứng dụng offline" />
                  <Android12Switch />
                </ListItemButton>
              </List>
            </Collapse>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default Setting;
