import { memo, useState } from "react";

import AppBar from '@mui/material/AppBar';
import { styled } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import MoreIcon from '@mui/icons-material/MoreVert';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  alignItems: 'center',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
}));

const menu = [
  {
    id: 1,
    field: 'điều khiển',
  }
]

function Home() {
  const [tab, setTab] = useState(0);
  const [drawer, setDrawer] = useState(false);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleChangeIndex = (index: number) => {
    setTab(index);
  };

  const toggleDrawer = (state: boolean) => {
    setDrawer(state);
  };

  return (
    <>
      <SwipeableDrawer
        anchor={'right'}
        open={drawer}
        onClose={() => toggleDrawer(false)}
        onOpen={() => toggleDrawer(true)}
      >
        <List>
          {
            menu.map(item => (
              <ListItem key={item.id} disablePadding>
                <ListItemButton>
                  <ListItemText primary={item.field} />
                </ListItemButton>
              </ListItem>
            ))
          }
        </List>
      </SwipeableDrawer>
      <Box className='w-full h-full relative'>
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
            <Typography
              variant="h5"
              noWrap
              className='flex-1'
            >
              MUI
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
        {/* <Swiper className="w-full h-full">
          <SwiperSlide>Slide 1</SwiperSlide>
          <SwiperSlide>Slide 2</SwiperSlide>
          <SwiperSlide>Slide 3</SwiperSlide>
        </Swiper>
        <Box className="w-full absolute bottom-0 px-3 mb-3 z-10">
          <Tabs
            value={tab}
            className='w-full'
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
            TabIndicatorProps={{
              sx: {          
                top: 0
              }
            }}
          >
            <Tab label="Item One" {...a11yProps(0)} />
            <Tab label="Item Two" {...a11yProps(1)} />
            <Tab label="Item Three" {...a11yProps(2)} />
          </Tabs>
        </Box> */}
      </Box>
    </>
  );
}

export default memo(Home);
