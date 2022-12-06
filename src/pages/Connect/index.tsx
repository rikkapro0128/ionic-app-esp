import React, { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { CapacitorHttp, HttpResponse, } from '@capacitor/core';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SignalCellular1BarIcon from '@mui/icons-material/SignalCellular1Bar';
import SignalCellular2BarIcon from '@mui/icons-material/SignalCellular2Bar';
import SignalCellular3BarIcon from '@mui/icons-material/SignalCellular3Bar';
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Grow from '@mui/material/Grow';
import Chip from '@mui/material/Chip';
import WifiIcon from '@mui/icons-material/Wifi';
import RouterIcon from '@mui/icons-material/Router';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import Divider from '@mui/material/Divider';
import SignalWifi2BarLockIcon from '@mui/icons-material/SignalWifi2BarLock';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Popover from '@mui/material/Popover';
import CircularProgress from '@mui/material/CircularProgress';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Input from '@mui/material/Input';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';

import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal';
import SettingsIcon from '@mui/icons-material/Settings';
import LabelIcon from '@mui/icons-material/Label';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IosShareIcon from '@mui/icons-material/IosShare';

import { IconEmptyWifi } from '../../icons';

import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2';
import SwipeableViews from 'react-swipeable-views';
import { v1 as genIDByTimeStamp } from 'uuid';
import { FirebaseAuthentication, User } from '@capacitor-firebase/authentication';

import toast from 'react-hot-toast';

import Notify from '../../components/Notify';


const notify = ({ title= 'Thông báo', body = 'Push notìy thành công!' }) => toast.custom((t) => (
  <Notify title={title} body={body} state={t} />
), {
  duration: 5000,
});

interface NetworkType {   
  "level"?: any
  "SSID": string,
  "BSSID": string,
  "frequency"?: number,
  "capabilities"?: any,
  "timestamp"?: any,
  "channelWidth"?: any,
  "centerFreq0"?: any,
  "centerFreq1"?: any,
}

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}
interface ListWifiType {
  scan: boolean,
  presentNetwork: NetworkType | undefined,
  networks: [NetworkType] | undefined,
  handleScan: () => void,
  onPresentNetworkChange: (network: NetworkType | undefined) => void,
}
interface InfoWifiType {
  presentNetwork: PresentNetworkType | undefined,
}

interface PresentNetworkType {
  SSID: string | undefined,
  BSSID: string | undefined,
  ip?: string,
  subnet?: string,
  RouterIP?: string,
}

interface InfoNodeType {
  SSID: string,
  password: string,
  IPStation: string,
  statusConnection: boolean,
  QualityNetwork: number,
  message?: string,
}

interface onClickType {
  ssid?: string,
  dns?: string,
  nodeName?: string,
  password?: string,
  setLoading?: (state: boolean) => void, 
  stateDialog?: (state: boolean) => void,
}

interface ResponseInfoNodeType {
  ssid: string,
  password: string,
  'ip-station': string,
  'status-station': boolean,
  'quality-station': number,
  message?: string,
}

const vnPresentNetworkType = {
  SSID: 'hidden',
  BSSID: 'Địa chỉ MAC',
  ip: 'IP Application',
  subnet: 'Subnet',
  RouterIP: 'IP Router',
}

const modeSelect = {
  'node': [
    {
      type: 'reset-wifi',
      icon: <RestartAltIcon />,
      content: 'Reset wifi',
      dialogMessage: 'Node này sẽ bị khôi phục cài đặt kết nối wifi, bạn chắc chứ?',
      onclick: async ({ ssid, dns }: onClickType): Promise<any> => {
        console.log(ssid, dns);
        if(ssid && dns) {
          try {
            const result = await CapacitorHttp.post({ url: `http://${dns}/reset-config-wifi`, method: 'POST' });
            console.log(result);
            notify({ body: `Reset cấu hình WIFI cho ${ssid} thành công.` });
          } catch (error) {
            console.log(error);
            notify({ body: 'Có lỗi xảy ra khi cấu hình WIFI!', title: 'Lỗi rồi' });
          }
        }else {
          notify({ body: 'Dữ liệu reset WIFI không đầy đủ!', title: 'Chú ý' });
        }
      },
    },
    {
      type: 'config-wifi',
      icon: <AutoFixNormalIcon />,
      content: 'Cấu hình WIFI',
      dialogMessage: undefined,
      onclick: async ({ ssid, nodeName, password, dns, setLoading, stateDialog }: onClickType): Promise<any> => {
        if(setLoading && stateDialog) {
          if(ssid && password && dns && nodeName) {
            setLoading(true);
            try {
              const result = await CapacitorHttp.post({ url: `http://${dns}/config-wifi`, data: JSON.stringify({ ssid, password }), method: 'POST', headers: { 'Content-Type': 'application/json' } });
              setLoading(false);
              notify({ body: `Cấu hình WIFI ${ssid} cho ${nodeName} thành công.` });
            } catch (error) {
              notify({ body: 'Có lỗi xảy ra khi cấu hình WIFI!', title: 'Lỗi rồi' });
            }
          }else {
            notify({ body: 'Dữ liệu cấu hình WIFI không đầy đủ!', title: 'Chú ý' });
          }
          stateDialog(false);
        }
      },
    },
    {
      type: 'link-app',
      icon: <IosShareIcon />,
      content: 'Liên kết ứng dụng',
      dialogMessage: 'Node này sẽ tiến hành liên kết với ứng dụng(tài khoản), bạn chắc chứ?',
      onclick: async ({ ssid, dns }: onClickType): Promise<any> => {
        if(ssid) {
          try {
            const genID = 'node-' + genIDByTimeStamp();
            const result = await FirebaseAuthentication.getCurrentUser();
            if(dns && genID && result) {
              const response = await CapacitorHttp.post({ url: `http://${dns}/link-app`, data: JSON.stringify({ idUser: result.user?.uid, idNode: genID }), method: 'POST', headers: { 'Content-Type': 'application/json' } });
              if(response.data?.message === 'LINK APP HAS BEEN SUCCESSFULLY') {
                notify({ body: `Liên kết ${ssid} với ứng dụng thành công.` });
              }else {
                notify({ body: `Không thể liên kết ${ssid} với ứng dụng!`, title: 'Lỗi rồi' });
              }
            }else { 
              notify({ body: 'Dữ liệu liên kết ứng dụng không đầy đủ!', title: 'Chú ý' });
            }
          } catch (error) {
            console.log(error);
            notify({ body: `Đã có lỗi xảy ra khi liên kết!`, title: 'Lỗi rồi' });
          }
        }else {
          notify({ body: 'Dữ liệu SSID bị thiếu!', title: 'Chú ý' });
        }
      },
    }
  ],
  'wifi': [
    {
      type: 'disconect-wifi',
      icon: <WifiOffIcon />,
      content: 'Ngắt kết nối',
      dialogMessage: 'Wifi này sẽ bị tắt kết nối, bạn chắc chứ?',
      onclick: async (SSID?: string): Promise<void> => {
        try {
          if(SSID) {
            await WifiWizard2.disable(SSID);
            notify({ body: `wifi ${SSID} đã bị disconect.` });
          }
        } catch (error) {
          console.log(error);
          notify({ body: `wifi ${SSID} không thể disconect!`, title: 'Lỗi rồi' });
        }
      }
    },
    {
      type: 'default-network',
      icon: <SignalWifi2BarLockIcon />,
      content: 'Đặt mặc định',
      dialogMessage: 'Wifi này sẽ tự động kết nối lại mỗi khi cấu hình node xong?',
      onclick: (SSID: string): void => {
        localStorage.setItem('wifi-default', SSID);
        notify({ body: `wifi ${SSID} đã được đặt thành mặt định.` });
      },
    }
  ]
}

function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`,
  };
}

function checkLevelSignal(level: number) {
  let convert = level * (-1);
  if(convert > 30 && convert < 50) {
    // signal large
    return <SignalCellular4BarIcon />
  }else if(convert >= 50 && convert < 70) {
    // signal medium - 2
    return <SignalCellular3BarIcon />
  }else if(convert >= 70 && convert < 90) {
    // signal medium - 1
    return <SignalCellular2BarIcon />
  }
  else {
    // signal small
    return <SignalCellular1BarIcon />
  }
}

function ListWifi({ networks, handleScan, scan, presentNetwork, onPresentNetworkChange }: ListWifiType) {
  const [wifiDefault, setWifiDefault] = useState<string>('');
  const [connectWifi, setConnectWifi] = useState<NetworkType>()
  const [password, setPassword] = useState<string>('');
  const [loadingWifi, setLoadingWifi] = useState<boolean>(false);
  const [loadingIcon, setLoadingIcon] = useState<boolean>(false);
  const [sizeIconLoading, setSizeIconLoading] = useState<number>(20);
  const [ssidIconLoading, setSsidIconLoading] = useState<string>();

  useEffect(() => {
    const wifi = localStorage.getItem('wifi-default') || '';
    setWifiDefault(wifi);
  }, [])

  const handleConnectToWifi = async (network: NetworkType) => {
    setLoadingIcon(true);
    setSsidIconLoading(network.SSID);
    try {
      if(network.SSID === presentNetwork?.SSID) {
        notify({ body: `wifi ${network.SSID} đã được kết nối.` });
      }else {
        let networksSaved: string[] = await WifiWizard2.listNetworks();
        networksSaved = networksSaved.map(network => network.replaceAll("\"", ""));
        if(networksSaved.includes(network.SSID)) {
          const checkWifiEnabled = await WifiWizard2.isWifiEnabled();
          if(!checkWifiEnabled) {
            await WifiWizard2.enableWifi();
          }
          const algorithm = network.capabilities.split("-")[0].replace('[', '') || 'WPA';
          await WifiWizard2.connect(network.SSID, true, undefined, algorithm === 'WPA2' ? 'WPA' : algorithm);
          onPresentNetworkChange(network);
          notify({ body: `Đã kết nối với wifi ${network.SSID}.` });
        }else {
          setConnectWifi(network);
        }
      }
    } catch (error) {
      console.log(error);
      notify({ body: `Có lỗi xảy ra khi kết nối với wifi ${network.SSID}.`, title: 'Lỗi rồi' });
    }
    setLoadingIcon(false);
    setSsidIconLoading(undefined);
  }

  const changePassword = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPassword(event.currentTarget.value);
  }

  const handleCloseDialog = () => {
    setConnectWifi(undefined);
  }

  const connectWifiWithPassword = async () => {
    setLoadingWifi(true);
    try {
      const checkWifiEnabled = await WifiWizard2.isWifiEnabled();
      if(!checkWifiEnabled) {
        await WifiWizard2.enableWifi();
      }
      if(connectWifi?.SSID) {
        const algorithm = connectWifi.capabilities.split("-")[0].replace('[', '') || 'WPA';
        console.log(algorithm);
        const result = await WifiWizard2.connect(connectWifi?.SSID, true, password, algorithm === 'WPA2' ? 'WPA' : algorithm);
        onPresentNetworkChange(connectWifi);
        notify({ body: `Đã kết nối với wifi ${connectWifi?.SSID}.` });
        console.log(result);
      }else {
        throw new Error('target SSID connect is undefined');
      }
    } catch (error) {
      console.log(error);
      notify({ body: `Có lỗi xảy ra khi kết nối với wifi ${connectWifi?.SSID}.`, title: 'Lỗi rồi' });
    }
    setLoadingWifi(false);
    handleCloseDialog();
  }

  return (
    <>
      <Dialog
        open={connectWifi?.SSID ? true : false }
        onClose={handleCloseDialog}
        fullWidth
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Thiết lập kết nối đến ${connectWifi?.SSID}?`}</DialogTitle>
        <DialogContent sx={{ paddingTop: '10px !important' }}>
          <TextField fullWidth value={password} onChange={changePassword} id="outlined-basic" label="Mật khẩu WIFI" variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Huỷ</Button>
          <Button onClick={connectWifiWithPassword} startIcon={loadingWifi ? <CircularProgress size={sizeIconLoading} /> : null}>
            Kết nối
          </Button>
        </DialogActions>
      </Dialog>
      <Box className='flex flex-col flex-1'>
        <Box className='py-6'>
          <Box className='w-52 min-h-[13rem] relative mx-auto'>
            <Box component="div" className={`w-full h-full absolute top-0 left-0 m-auto rounded-full bg-indigo-200 flex justify-center items-center transition-transform ${scan ? 'scale-90 opacity-60' : 'scale-100' }`}>
              <Box component="div" className='w-3/4 h-3/4 m-auto rounded-full bg-indigo-300 flex justify-center items-center' />
              <Box component="div" className={`w-3/4 h-3/4 absolute m-auto rounded-full bg-indigo-200 flex justify-center items-center ${ scan ? 'animate-ping' : 'animate-none bg-transparent' }`} />
              <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
              <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_40ms_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
              <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_80ms_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
              <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_120ms_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
              <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_160ms_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
            </Box>
            <Box onClick={handleScan} className='w-3/4 h-3/4 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <Button component="div" sx={{ borderRadius: '50%' }} className='w-full h-full bg-indigo-300 flex justify-center items-center'>
                <Box className={`flex flex-col items-center transition-colors ${scan ? 'text-white' : 'text-slate-50' }`}>
                  <Box className='text-6xl'>
                    <WifiIcon sx={{ color: 'currentcolor' }} fontSize='inherit' />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'currentcolor' }} className='uppercase'>
                    { scan ? 'đang quét' : 'quét ngay' }
                  </Typography>
                </Box>
              </Button>
            </Box>
          </Box>
          {/* <Zoom in={!scan} style={{ transitionDelay: '500ms', }}>
          </Zoom> */}
        </Box>
        <Box className='flex-1 bg-white flex flex-col relative w-full rounded-t-3xl p-6 shadow-2xl'>
          <Box>
            <Typography variant="h5" className='text-slate-600'>
              Danh sách node
            </Typography>
            <Typography variant="subtitle1" className='text-green-400'>
              { networks?.length ? networks.length : 0 } node
            </Typography>
          </Box>
          <Box className='flex-1 my-2'>
            {
              networks?.length
              ?
              <Box className='overflow-y-scroll max-h-[355px]'>
                {
                  networks?.map((network: NetworkType) => (
                    <Button key={network['BSSID']} onClick={() => handleConnectToWifi(network)} sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', textTransform: 'unset' }} className='flex-nowrap w-full'>
                      { network.SSID.includes('esp') ? <Chip icon={ loadingIcon && ssidIconLoading === network.SSID ? <CircularProgress size={sizeIconLoading} /> : <RouterIcon />} label="node" /> : <Chip icon={ loadingIcon && ssidIconLoading === network.SSID ? <CircularProgress size={sizeIconLoading} /> : <WifiIcon /> } label="Wifi" /> } 
                      { network.BSSID === presentNetwork?.BSSID ? <Chip className='ml-2' label="connected" variant="outlined" color="success" /> : null }
                      { network.SSID === wifiDefault ? <Chip className='ml-2' label="default" variant="outlined" color="success" /> : null }
                      <Typography variant="h6" className='text-slate-600 flex-1 text-right pr-5'>
                        { network['SSID'] }
                      </Typography>
                      { checkLevelSignal(network['level']) }
                    </Button>
                  ))
                }
              </Box>
              :
              <Grow
                in={true}
                style={{ transformOrigin: '0 0 0' }}
                {...(networks?.length ? { timeout: 1000 } : {})}
              >
                <Box className='flex flex-col items-center justify-center h-full -m-8'>
                  <IconEmptyWifi className='w-32 h-32' />
                  <Typography variant="subtitle2" className='text-slate-600 text-center'>
                    wifi đang trống nhấn quét để tìm kiếm xung quanh.
                  </Typography>
                </Box>
              </Grow>
            }
          </Box>
        </Box>
      </Box>
    </>
  )
}

function InfoWifi({ presentNetwork }: InfoWifiType) {

  const [info, setInfo] = useState<PresentNetworkType>();
  const [infoNode, setInfoNode] = useState<InfoNodeType>();
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [messageSelect, setMessageSelect] = useState<string>('');
  const [passwordDialog, setPasswordDialog] = useState<string>('');
  const [wifiDefault, setWifiDefault] = useState<string>(() => localStorage.getItem('wifi-default') || '');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showDialogPassword, setShowDialogPassword] = useState<boolean>(false);
  const [functionDialog, setFunctionDialog] = useState<(some: any) => void>();
  const [functionDialogPassword, setFunctionDialogPassword] = useState<(some: any) => void>();
  const [typeWifi, setTypeWifi] = useState<string>(presentNetwork?.SSID?.includes('esp') ? 'node' : 'wifi');
  const [loadingWifi, setLoadingWifi] = useState<boolean>(false);
  const [sizeIconLoading, setSizeIconLoading] = useState<number>(20);
  const [typeOption, setTypeOption] = useState<string>();
  const passwordCached = useMemo(() => passwordDialog, [passwordDialog]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const infoWifi = async () => {
      const { ip, subnet } = await WifiWizard2.getWifiIPInfo()
      const RouterIP = await WifiWizard2.getWifiRouterIP()
      setTypeWifi(presentNetwork?.SSID?.includes('esp') ? 'node' : 'wifi')
      setInfo({ SSID: presentNetwork?.SSID, BSSID: presentNetwork?.BSSID, ip, subnet, RouterIP });
    }
    infoWifi();
    setWifiDefault(localStorage.getItem('wifi-default') || '');
  } ,[presentNetwork])

  useEffect(() => {
    const checkNodeIsConfigWifi = async () => {
      setInfoNode(undefined);
      if(typeWifi === 'node' || !showDialogPassword) {

        const response: HttpResponse = await CapacitorHttp.get({ url: `http://${info?.RouterIP}/is-config` });
        console.log(response.data);
        const message = response?.data?.message;
        if(message === 'WIFI HAS BEEN CONFIG') {
          const { ssid, password, 'ip-station': IPStation, 'status-station': statusConnection, 'quality-station': QualityNetwork }: ResponseInfoNodeType = response.data;
          setInfoNode({ SSID: ssid, password, IPStation, QualityNetwork, statusConnection });
        }else if(message === 'WIFI NOT YET CONFIG') {
          if(infoNode) {
            setInfoNode(undefined);
          }
        }
        
      }

    }
    checkNodeIsConfigWifi();
  }, [info])

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const closeDialog = () => {
    setMessageSelect('');
  }

  const askBeforeExecute = (type: string, dialogMessage: string | undefined, callback: (some: any) => void) => {
    // setTypeOption(type);
    if(type === 'disconect-wifi' || type === 'default-network') {
      setMessageSelect(dialogMessage || '');
      setFunctionDialog(() => () => { callback(info?.SSID || ''); closeDialog(); setFunctionDialog(undefined); })
    }else if(type === 'config-wifi') {
      if(wifiDefault) {
        setFunctionDialogPassword(() => callback);
        handleDialogPassword(true);
      }else {
        notify({ body: 'Bạn chưa chọn wifi mặc định cho ứng dụng', title: 'Chú ý' });
      }
    }else if(type === 'reset-wifi' || type === 'link-app') {
      if(wifiDefault) {
        setMessageSelect(dialogMessage || '');
        setFunctionDialog(() => () => { callback({ ssid: info?.SSID, dns: info?.RouterIP }); closeDialog(); setFunctionDialog(undefined); })
      }else {
        notify({ body: 'Bạn chưa chọn wifi mặc định cho ứng dụng', title: 'Chú ý' });
      }
    }
    handleClose();
  }

  const handleDialogPassword = (state: boolean) => {
    setShowDialogPassword(state);
  }

  const changePassword = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPasswordDialog(event.currentTarget.value);
  }

  const handleConfigWifi = () => {
    if(functionDialogPassword) {
      functionDialogPassword({ ssid: wifiDefault, nodeName: info?.SSID, password: passwordCached, dns: info?.RouterIP, setLoading: (state: boolean) => { setLoadingWifi(state) }, stateDialog: (state: boolean) => { handleDialogPassword(state); } });
      setFunctionDialogPassword(undefined);
    }
  }

  return (
    <>
      <Dialog
        open={messageSelect ? true : false}
        onClose={() => closeDialog() }
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Chú ý"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            { messageSelect }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => closeDialog() }>Huỷ</Button>
          <Button onClick={functionDialog} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog set Wifi password for NODE */}
      <Dialog
        open={showDialogPassword}
        onClose={() => handleDialogPassword(false)}
        fullWidth
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{`Thiết lập tới WIFI ${wifiDefault}?`}</DialogTitle>
        <DialogContent sx={{ paddingTop: '10px !important' }}>
          <TextField fullWidth value={passwordDialog} onChange={changePassword} id="outlined-basic" label="Mật khẩu WIFI" variant="outlined" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleDialogPassword(false)}>Huỷ</Button>
          <Button onClick={handleConfigWifi} startIcon={loadingWifi ? <CircularProgress size={sizeIconLoading} /> : null}>
            Kết nối
          </Button>
        </DialogActions>
      </Dialog>
      <Box className='p-5'>
        <Box className='flex flex-nowrap items-center justify-between'>
          <Typography variant="h6" sx={{ color: 'currentcolor' }} className='uppercase flex items-center'>
            { typeWifi === 'node' ? <RouterIcon className='mr-3' /> : <WifiIcon className='mr-3' /> }
            { info?.SSID || '' }
          </Typography>
          <Button onClick={handleClick} variant='outlined' endIcon={<SettingsIcon />} >
            cài đặt
          </Button>
        </Box>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
            {
              typeof info?.SSID === 'string'
              ?
                <List>
                  {
                    modeSelect[typeWifi as keyof typeof modeSelect].map(({ icon, type, dialogMessage, content, onclick }, index) => (
                      <ListItem key={content + index} onClick={() => { askBeforeExecute(type, dialogMessage, (some) => { onclick(some) }) }} disablePadding>
                        <ListItemButton>
                          <ListItemIcon>
                            { icon }
                          </ListItemIcon>
                          <ListItemText primary={content} />
                        </ListItemButton>
                      </ListItem>
                    ))
                  }
                </List>
              :
              <Box sx={{ display: 'flex' }}>
                <CircularProgress />
              </Box>
            }
        </Popover>
        <Box className='mt-10'>
          {
            Object.keys(info || {}).length > 0
            ?
              Object.entries(info || {}).map(([key, val]) => (
                
                vnPresentNetworkType[key as keyof typeof vnPresentNetworkType] === 'hidden'
                ?
                  null
                :
                <Box key={key}>
                  <Divider textAlign="left">
                    <Chip label={vnPresentNetworkType[key as keyof typeof vnPresentNetworkType]} />
                  </Divider>
                  <Typography sx={{ fontSize: '1.4rem' }} variant="subtitle1" className='py-3 text-slate-800 text-3xl'>
                    <LabelIcon className='mr-2 text-slate-700' />
                    { val }
                  </Typography>
                </Box>
              ))
            :
              null
          }
        </Box>
        {
          typeWifi === 'node'
          ?
          <>
            <Divider className='font-bold' sx={{ paddingBottom: '1rem' }} textAlign="center">
              <Chip label={'Trạng thái cấu hình'} />
            </Divider>
            <Box>
              {
                infoNode
                ?
                <>
                  <Box>
                    <Divider textAlign="left">
                      <Chip label={'WIFI của Node'} />
                    </Divider>
                    <Typography sx={{ fontSize: '1.4rem' }} variant="subtitle1" className='py-3 text-slate-800'>
                      <LabelIcon className='mr-2 text-slate-700' />
                      { infoNode.SSID }
                    </Typography>
                  </Box>
                  <Box>
                    <Divider textAlign="left">
                      <Chip label={'IP Station'} />
                    </Divider>
                    <Typography sx={{ fontSize: '1.4rem' }} variant="subtitle1" className='py-3 text-slate-800'>
                      <LabelIcon className='mr-2 text-slate-700' />
                      { infoNode.IPStation }
                    </Typography>
                  </Box>
                  <Box>
                    <Divider textAlign="left">
                      <Chip label={'Trạng thái kết nối'} />
                    </Divider>
                    <Typography sx={{ fontSize: '1.4rem' }} variant="subtitle1" className='py-3 text-slate-800'>
                      <LabelIcon className='mr-2 text-slate-700' />
                      { infoNode.statusConnection ? 'Đã kết nối' : 'Ngắt kết nối' }
                    </Typography>
                  </Box>
                  <Box>
                    <Divider textAlign="left">
                      <Chip label={'Chất lượng tín hiệu'} />
                    </Divider>
                    <Typography sx={{ fontSize: '1.4rem' }} variant="subtitle1" className='py-3 text-slate-800'>
                      <LabelIcon className='mr-2 text-slate-700' />
                      { Math.min(Math.max(2 * (infoNode.QualityNetwork + 100), 0), 100) }%
                    </Typography>
                  </Box>
                  <Box>
                    <Divider textAlign="left">
                      <Chip label={'Mật khẩu WIFI'} />
                    </Divider>
                    <FormControl sx={{ paddingY: '0.5rem' }} fullWidth variant="standard">
                      <Input
                        disabled
                        id="outlined-adornment-password"
                        type={showPassword ? 'text' : 'password'}
                        value={infoNode.password}
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="toggle password visibility"
                              onClick={() => setShowPassword((state) => !state)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Box>
                </>
                :
                <Typography variant="subtitle1" className='py-3 pt-5 text-slate-800 text-center'>
                  Cấu hình WIFI không được tìm thấy
                </Typography>
              }
            </Box>
          </>
          :
          null
        }
      </Box>
    </>
  )
}

function Connect() {
  const theme = useTheme();
  const [scan, setScan] = useState(false);
  const [networks, setNetworks] = useState<[NetworkType]>();
  const [presentNetwork, setPresentNetwork] = useState<NetworkType>();
  const [tab, setTab] = useState(0);
  const [pooling, setPooling] = useState(3000);

  const handleChange = (event: React.SyntheticEvent, tab: number) => {
    setTab(tab);
  };

  const handleChangeTabIndex = (tab: number) => {
    setTab(tab);
  };

  useEffect(() => {
    return () => {
      const runCheckWifiOnUnMount = async () => {
        const getDefaultNetwork = localStorage.getItem('wifi-default');
        if(presentNetwork?.SSID !== getDefaultNetwork) {
          if(getDefaultNetwork) {
             await WifiWizard2.connect(getDefaultNetwork, true, undefined, 'WPA');
          }
        }
      }
      runCheckWifiOnUnMount();
    }
  }, [])

  useEffect(() => {
    try {
      console.log('change tab');
      const request = async () => {
        const ssid = await WifiWizard2.getConnectedSSID();
        const bssid = await WifiWizard2.getConnectedBSSID();
        setPresentNetwork({ SSID: ssid, BSSID: bssid });
      };
      request();
    } catch (error) {
      console.log('Permision fail => ', error);
    }
  } ,[tab])

  useEffect(() => {
    const id = setInterval(async () => {
      const ssid = await WifiWizard2.getConnectedSSID();
      if(ssid !== presentNetwork?.SSID) {
        const bssid = await WifiWizard2.getConnectedBSSID();
        setPresentNetwork({ SSID: ssid, BSSID: bssid });
      }
    }, pooling)
    return () => {
      clearInterval(id);
    }
  }, [presentNetwork])

  const handleScan = useCallback(async () => {
    try {
      if(!scan) {
        setScan(true);
        const permission = await WifiWizard2.requestPermission();
        if(permission) {
          const networks = await WifiWizard2.scan({ numLevels: 0 });
          setNetworks(networks);
        }
        setScan(false);
        console.log(networks);
      }
    } catch (error) {
      console.log(error);
      setScan(false);
    }
  }, []);

  const handlePresentNetwork = useCallback((network: NetworkType | undefined) => {
    console.log(network);
    setPresentNetwork(network);
  }, []);

  return (
    // <Grow in={true}>
    <Box className='flex-1'>
      <Tabs
        value={tab}
        className='bg-white'
        onChange={handleChange}
        textColor="inherit"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        <Tab label="scan wifi" {...a11yProps(0)} />
        <Tab label="info wifi" {...a11yProps(1)} />
      </Tabs>
      <SwipeableViews
        className='bg-[#edf1f5]'
        style={{ height: '100%' }}
        containerStyle={{ height: '100%' }}
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tab}
        onChangeIndex={handleChangeTabIndex}
      >
        <Box  className='w-full h-full flex flex-col'>
          <ListWifi onPresentNetworkChange={handlePresentNetwork} networks={networks} scan={scan} presentNetwork={presentNetwork} handleScan={handleScan} />
        </Box>
        <Box sx={{ maxHeight: `${window.innerHeight - 120}px`, overflowY: 'scroll', marginBottom: '-4.15rem', paddingBottom: '1rem' }} className='w-full h-full flex flex-col'>
          <InfoWifi presentNetwork={presentNetwork} />
        </Box>
      </SwipeableViews>
    </Box>
    // {/* </Grow> */}
  );
}

export default memo(Connect);
