import { memo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import { styled } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import MoreIcon from "@mui/icons-material/MoreVert";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TuneIcon from "@mui/icons-material/Tune";
import RouterIcon from "@mui/icons-material/Router";
import SettingsEthernetIcon from "@mui/icons-material/SettingsEthernet";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import SettingsIcon from "@mui/icons-material/Settings";

// Import Swiper styles
import "swiper/css";

import { useAppSelector } from "../../store/hooks";
import { WifiWizard2 } from "@awesome-cordova-plugins/wifi-wizard-2";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: "center",
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
}));

const notShow = ["/sign", "/check-user"];

const menu = [
  {
    id: 1,
    field: "quản lí điều khiển",
    icon: <TuneIcon />,
    path: "/devices",
  },
  // {
  //   id: 2,
  //   field: 'danh sách node',
  //   icon: <RouterIcon />,
  //   path: '/nodes'
  // },
  {
    id: 3,
    field: "kết nối node",
    icon: <SettingsEthernetIcon />,
    path: "/connect",
  },
  {
    id: 4,
    field: "Thông tin người dùng",
    icon: <AccountCircleIcon />,
    path: "/profile",
  },
  {
    id: 5,
    field: "Cài đặt",
    icon: <SettingsIcon />,
    path: "/setting",
  },
];

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const stateFbConnection = useAppSelector(
    (state) => state.commons.fbConnection
  );
  const [tab, setTab] = useState(0);
  const [drawer, setDrawer] = useState(false);
  const [currentTitle, setCurrentTitle] = useState(() => {
    const result = menu.find((item) => item.path === location.pathname);
    return result ? result.field : "application iot";
  });

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setTab(index);
  };

  const validateWifi = async (ssid: string) => {
    let networksSaved: string[] = await WifiWizard2.listNetworks();
    networksSaved = networksSaved.map((network) => network.replaceAll('"', ""));
    return networksSaved.includes(ssid || "") ? true : false;
  };

  const selectDrawerItem = async (path: string, title: string) => {
    let conditionNavigate = true;

    setDrawer(false);
    if (!stateFbConnection) {
      if (path === "/connect") {
        conditionNavigate = true;
      }

      const ssidTarget = localStorage.getItem("wifi-target");
      if (ssidTarget) {
        try {
          const ssidIsConfig = await validateWifi(ssidTarget);
          if (ssidIsConfig) {
            const state = await WifiWizard2.connect(
              ssidTarget,
              true,
              undefined,
              "WPA"
            );
            if (state === "NETWORK_CONNECTION_COMPLETED") {
              conditionNavigate = true;
            }
          }
        } catch (error) {}
      }
    }
    if (conditionNavigate) {
      setCurrentTitle(title);
      navigate(path);
    }
  };

  const navigateContinue = () => {};

  const toggleDrawer = (state: boolean) => {
    setDrawer(state);
  };

  return !notShow.includes(location.pathname) ? (
    <>
      <SwipeableDrawer
        anchor={"right"}
        open={drawer}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <Typography variant="h6" noWrap className="text-center pt-3">
          Menu
        </Typography>
        <List>
          {menu.map((item) => (
            <ListItem key={item.id} disablePadding>
              <ListItemButton
                onClick={() => selectDrawerItem(item.path, item.field)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText className="capitalize" primary={item.field} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </SwipeableDrawer>
      <Box className="w-full relative">
        <AppBar position="static">
          <StyledToolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
              onClick={() => toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h5" noWrap className="flex-1 capitalize">
              {currentTitle}
            </Typography>
            <IconButton
              size="large"
              aria-label="display more actions"
              edge="end"
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </StyledToolbar>
        </AppBar>
      </Box>
    </>
  ) : null;
}

export default memo(Header);
