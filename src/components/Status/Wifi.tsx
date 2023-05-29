import { memo, useState } from "react";
import { WifiPresent, WifiInfo } from "../../pages/Connect";
import { IconNode } from "../../icons/index";

import { useTheme } from "@mui/material/styles";

import Popover from "@mui/material/Popover";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import CastConnectedIcon from "@mui/icons-material/CastConnected";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import SignalWifi2BarLockOutlinedIcon from "@mui/icons-material/SignalWifi2BarLockOutlined";
import SettingsInputAntennaOutlinedIcon from "@mui/icons-material/SettingsInputAntennaOutlined";
import AddLinkIcon from '@mui/icons-material/AddLink';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import WifiTetheringRoundedIcon from '@mui/icons-material/WifiTetheringRounded';
interface PropsType {
  end: boolean;
  payload: WifiInfo;
  present?: WifiPresent;
  connectWifi: (wifi: WifiInfo) => void;
  onConfig?: (wifi: WifiInfo) => void;
  setAreaConnect?: (wifi: WifiInfo) => void;
  configWifiForEsp?: (wifi: WifiInfo) => void;
  viewConfig?: (wifi: WifiInfo) => void;
  linkApplication: () => Promise<void>;
}

const StatusWifi = ({
  payload,
  connectWifi,
  end,
  present,
  onConfig,
  viewConfig,
  linkApplication,
  setAreaConnect,
  configWifiForEsp,
}: PropsType) => {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onCLick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleConnectWifi = () => {
    connectWifi(payload);
    handleClose();
  };

  const handleSetDefaultConnect = () => {
    if (payload && typeof setAreaConnect === "function") {
      setAreaConnect(payload);
      handleClose();
    }
  };

  const handleConfigWifiEsp = () => {
    if (payload && typeof configWifiForEsp === "function") {
      configWifiForEsp(payload);
      handleClose();
    }
  };

  const handleViewConfig = () => {
    if (payload && typeof viewConfig === "function") {
      viewConfig(payload);
      handleClose();
    }
  };

  const handleLinkApp = () => {
    if (payload && typeof viewConfig === "function") {
      linkApplication();
      handleClose();
    }
  }

  return (
    <>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleConnectWifi}
              disabled={present?.BSSID === payload.BSSID ? true : false}
            >
              <ListItemIcon>
                <CastConnectedIcon />
              </ListItemIcon>
              <ListItemText primary="Kết nối" />
            </ListItemButton>
          </ListItem>
          {payload.SSID.includes("esp") ? (
            <>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleConfigWifiEsp}
                  disabled={present?.BSSID !== payload.BSSID ? true : false}
                >
                  <ListItemIcon>
                    <SignalWifi2BarLockOutlinedIcon />
                  </ListItemIcon>
                  <ListItemText primary="cấu hình wifi" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleViewConfig}
                  disabled={present?.BSSID !== payload.BSSID ? true : false}
                >
                  <ListItemIcon>
                    <ManageHistoryIcon />
                  </ListItemIcon>
                  <ListItemText primary="Xem cấu hình" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={handleLinkApp}
                  disabled={present?.BSSID !== payload.BSSID ? true : false}
                >
                  <ListItemIcon>
                    <AddLinkIcon />
                  </ListItemIcon>
                  <ListItemText primary="Liên kết ứng dụng" />
                </ListItemButton>
              </ListItem>
            </>
          ) : (
            <ListItem disablePadding>
              <ListItemButton onClick={handleSetDefaultConnect}>
                <ListItemIcon>
                  <SettingsInputAntennaOutlinedIcon />
                </ListItemIcon>
                <ListItemText primary="đặt kết nối" />
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Popover>
      <div
        onClick={onCLick}
        className={`py-4 active:opacity-50 transition-opacity grid grid-cols-6 ${
          end ? "" : "border-t-[1px]"
        }`}
      >
        <Box className="col-span-3 flex mr-4">
          {
            payload.SSID.includes('esp') ?
            <IconNode className={`w-4 h-4 mr-4 fill-inherit`} style={{ fill: theme.palette.text.secondary }} />
            :
            <WifiTetheringRoundedIcon className={`w-4 h-4 mr-4 fill-inherit`} style={{ fill: theme.palette.text.secondary }} />
          }
          <span onTouchStart={(event) => { event.currentTarget.style.textOverflow = 'clip'; }} onTouchEnd={(event) => { event.currentTarget.style.textOverflow = ''; event.currentTarget.scrollLeft = 0; }} className={`flex-1 max-w-[150px] overflow-x-scroll whitespace-nowrap text-ellipsis ${payload.SSID.includes('esp') ? 'text-indigo-600' : ''}`}>
            {payload.SSID || "NaN"}
          </span>
        </Box>
        <div className="col-span-3 flex justify-between items-center overflow-x-scroll" onTouchEnd={(event) => { event.currentTarget.scrollLeft = 0; }}>
          <span>
            {payload.frequency
              ? payload.frequency > 2000 && payload.frequency < 3000
                ? "2.4"
                : "5"
              : "NaN"}
            Ghz
          </span>
          {present?.BSSID === payload.BSSID ? (
            // <span className="border-[1px] border-green-600 text-green-600 p-1 px-2 rounded-full text-[10px]">
            //   connected
            // </span>
            <CheckCircleOutlineRoundedIcon className="text-green-600" />
          ) : null}
          <span>
            {Math.min(Math.max(2 * (payload.level + 100), 0), 100) || 0}%
          </span>
        </div>
      </div>
    </>
  );
};

export default memo(StatusWifi);
