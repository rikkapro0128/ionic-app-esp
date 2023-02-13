import { memo, useState } from "react";
import { WifiPresent, WifiInfo } from "../../pages/Connect";
import { IconNode } from "../../icons/index";

import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import CastConnectedIcon from "@mui/icons-material/CastConnected";
import ManageHistoryIcon from "@mui/icons-material/ManageHistory";
import SignalWifi2BarLockOutlinedIcon from "@mui/icons-material/SignalWifi2BarLockOutlined";
import SettingsInputAntennaOutlinedIcon from "@mui/icons-material/SettingsInputAntennaOutlined";
interface PropsType {
  end: boolean;
  payload: WifiInfo;
  present?: WifiPresent;
  connectWifi: (wifi: WifiInfo) => void;
  onConfig?: (wifi: WifiInfo) => void;
  setAreaConnect?: (wifi: WifiInfo) => void;
  configWifiForEsp?: (wifi: WifiInfo) => void;
  viewConfig?: (wifi: WifiInfo) => void;
}

const StatusWifi = ({
  payload,
  connectWifi,
  end,
  present,
  onConfig,
  viewConfig,
  setAreaConnect,
  configWifiForEsp,
}: PropsType) => {
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
        className={`py-4 active:bg-slate-200 transition-colors grid grid-cols-6 ${
          end ? "" : "border-t-[1px]"
        }`}
      >
        <div className="col-span-3 flex mr-4">
          <IconNode className="fill-slate-700 w-4 h-4 mr-4" />
          <span className="flex-1 max-w-[150px] overflow-x-scroll whitespace-nowrap text-ellipsis">
            {payload.SSID || "NaN"}
          </span>
        </div>
        <div className="col-span-3 flex justify-between items-center">
          <span>
            {payload.frequency
              ? payload.frequency > 2000 && payload.frequency < 3000
                ? "2.4"
                : "5"
              : "NaN"}
            Ghz
          </span>
          {present?.BSSID === payload.BSSID ? (
            <span className="border-[1px] border-green-600 text-green-600 py-1 px-2 rounded-full text-xs">
              connected
            </span>
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
