import Button from "@mui/material/Button";
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

import WebAssetIcon from "@mui/icons-material/WebAsset";
import NightsStayOutlinedIcon from "@mui/icons-material/NightsStayOutlined";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import PodcastsRoundedIcon from '@mui/icons-material/PodcastsRounded';

import AntSwitch from "../../components/Switch/index";
import { MaterialUISwitch } from "../../components/Switch/MuiDesigner";
import { Android12Switch } from "../../components/Switch/Ant12Designer";
import { useState } from "react";

function Setting() {
  const [notifyOpened, setNotifyOpened] = useState(false);

  const toggleNotify = () => {
    setNotifyOpened(!notifyOpened);
  }

  return (
    <div className="bg-slate-50 h-screen text-slate-600 pt-1">
      <div>
        <Typography
          className="flex items-center py-1 bg-slate-100 px-4 pt-2 text-slate-400"
          variant="h6"
          component="div"
        >
          Giao diện
        </Typography>
        <div className="shadow">
          {/* ITEM INTERFACE */}
          <div className="flex items-center justify-between px-4 py-3 ">
            <div className="flex items-center">
              <div className="bg-slate-700 rounded-md p-2 mr-2">
                <NightsStayOutlinedIcon className="text-slate-50 text-lg" />
              </div>
              <Typography variant="h6" component="div">
                Chế độ tối
              </Typography>
            </div>
            <MaterialUISwitch size="small" />
          </div>
        </div>
      </div>
      <div className="mt-1">
        <Typography
          className="flex items-center py-1 bg-slate-100 px-4 pt-2 text-slate-400"
          variant="h6"
          component="div"
        >
          Thông báo
        </Typography>
        <div className="shadow">
          {/* ITEM NOTIFY */}
          <div onClick={toggleNotify} className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center">
              <div className="bg-purple-500 rounded-md p-2 mr-2">
                <NotificationsActiveOutlinedIcon className="text-slate-50 text-lg" />
              </div>
              <Typography variant="h6" component="div">
                Tuỳ chọn ẩn
              </Typography>
            </div>
            <KeyboardArrowRightRoundedIcon sx={{
              transition: 'transform ease-in-out 200ms',
              transform: `rotate(${ notifyOpened ? 90 : 0 }deg)`,
            }} fontSize="large" />
          </div>
          <Collapse in={notifyOpened} unmountOnExit>
            <List component="div" disablePadding>
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
        </div>
      </div>
    </div>
  );
}

export default Setting;
