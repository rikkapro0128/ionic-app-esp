import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle, chevronForwardCircleOutline } from 'ionicons/icons';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Tab3 from './pages/Tab3';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */  
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

/* TailwindCSS */
import './index.css';

import { useEffect, useState } from 'react';
import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2';
import { IconGoogle } from './icons';
import Box from '@mui/material/Box';
import WifiIcon from '@mui/icons-material/Wifi';
import Typography from '@mui/material/Typography';
import SignalCellular1BarIcon from '@mui/icons-material/SignalCellular1Bar';
import SignalCellular2BarIcon from '@mui/icons-material/SignalCellular2Bar';
import SignalCellular3BarIcon from '@mui/icons-material/SignalCellular3Bar';
import Button from '@mui/material/Button';
import Zoom from '@mui/material/Zoom';


setupIonicReact();

const App: React.FC = () =>{

  const [scan, setScan] = useState(false);

  useEffect(() => {
    const run = async () => {
      // const stateScan = await WifiWizard2.startScan();
      // if(stateScan) {
      //   const networks = await WifiWizard2.getScanResults({ numLevels: 0 });
      //   console.log(networks);
      // }
    }
    run();
  }, []);

  useEffect(() => {
    if(scan) {
      // const id = setInterval(() => {

      // }, )
    }
  }, [scan])

  function activeScan() {
    setScan(!scan)
    // setScan(true)
  }

  return (
    <IonApp>
      <Box className='bg-[#edf1f5] w-full h-full flex flex-col'>
        <Box className='w-64 h-64 relative flex justify-center items-center my-6 mx-auto'>
          <Box component="div" className={`w-full h-full absolute top-0 left-0 m-auto rounded-full bg-indigo-200 flex justify-center items-center transition-transform ${scan ? 'scale-90 opacity-60' : 'scale-100' }`}>
            <Box component="div" className='w-3/4 h-3/4 m-auto rounded-full bg-indigo-300 flex justify-center items-center' />
            <Box component="div" className={`w-3/4 h-3/4 absolute m-auto rounded-full bg-indigo-200 flex justify-center items-center ${ scan ? 'animate-ping' : 'animate-none bg-transparent' }`} />

            <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
            <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_40ms_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
            <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_80ms_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
            <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_120ms_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
            <Box component="div" className={`w-3/4 h-3/4 ease-[cubic-bezier(0.8, -0.44, 0, 1.01)] absolute z-10 rounded-full before:absolute before:-left-[5px] before:-translate-x-full before:bg-indigo-400 before:w-4 before:h-4 before:rounded-full before:transition-opacity flex justify-center items-center ${ scan ? 'animate-[miruSpin_1.5s_160ms_ease-in-out_infinite] before:opacity-100' : 'animate-none before:opacity-0' }`} />
          </Box>
          <Box onClick={activeScan} className='w-3/4 h-3/4 rounded-full'>
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
          {/* <Zoom in={!scan} style={{ transitionDelay: '500ms', }}>
          </Zoom> */}
        </Box>
        <Box className='bg-white relative w-full flex-1 rounded-t-3xl p-6 shadow-2xl'>
          <Typography variant="h5" className='text-slate-600'>
            Danh sách node
          </Typography>
          <Typography variant="subtitle1" className='text-slate-600'>
            5 node
          </Typography>
          <Box>
            <Button sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', textTransform: 'unset' }} className='flex-nowrap w-full'>
              <Typography variant="h6" className='text-slate-600'>
                Truonghair22
              </Typography>
              <SignalCellular3BarIcon /> 
            </Button>
            <Button sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', textTransform: 'unset' }} className='flex-nowrap w-full'>
              <Typography variant="h6" className='text-slate-600'>
                huy ngoc
              </Typography>
              <SignalCellular2BarIcon /> 
            </Button>
            <Button sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', textTransform: 'unset' }} className='flex-nowrap w-full'>
              <Typography variant="h6" className='text-slate-600'>
                duy123
              </Typography>
              <SignalCellular1BarIcon /> 
            </Button>
          </Box>
        </Box>
      </Box>
    </IonApp>
    // PAGE SIGN
    // <IonApp>
    //   <div className='w-full h-full bg-[#edf1f5] p-8'>
    //     <div className='m-auto rounded-full'>
    //       <div className='bg-white w-28 h-28 m-auto rounded-full flex justify-center items-center' style={{ boxShadow: '0 14px 30px rgba(103,132,187,.1),0 4px 4px rgba(103,132,187,.04)' }}>
    //         <img className='w-full h-full scale-75 translate-x-[5px]' src="https://cdn-icons-png.flaticon.com/512/6119/6119533.png" alt="logo" />
    //       </div>
    //       <span className='text-center mt-4 text-slate-500 block'>Chào mừng bạn đến với ứng dụng</span>
    //     </div>
    //     <div className='flex flex-col'>
    //       <label className='font-semibold text-[rgb(81,97,112)] py-[10px] text-[1.5rem] capitalize' htmlFor='form-email'>email</label>
    //       <input className='rounded-md px-[16px] py-[11px] outline-none bg-white' placeholder='vd: abc@gmail.com' style={{ boxShadow: '0 14px 30px rgba(103,132,187,.1),0 4px 4px rgba(103,132,187,.04)' }} type="text" name="email" id="form-email" />
    //     </div>
    //     <div className='flex flex-col mt-1'>
    //       <label className='font-semibold text-[rgb(81,97,112)] py-[10px] text-[1.5rem] capitalize' htmlFor='form-email'>password</label>
    //       <input className='rounded-md px-[16px] py-[11px] outline-none bg-white' placeholder='Mật khẩu của bạn sẽ bị ẩn vd: ***' style={{ boxShadow: '0 14px 30px rgba(103,132,187,.1),0 4px 4px rgba(103,132,187,.04)' }} type="text" name="email" id="form-email" />
    //     </div>
    //     <button className='bg-indigo-500 group active:opacity-95 active:scale-[0.99] transition-colors shadow-lg flex rounded-full outline-none items-center p-4 relative justify-center mt-6 w-full'>
    //       <span className='uppercase text-white font-semibold'>đăng nhập</span>
    //       <IonIcon className='text-[#d9e6ff] absolute right-1 text-[3.2rem]' icon={chevronForwardCircleOutline}></IonIcon>
    //     </button>
    //     {/* Divider */}
    //     <div className='flex flex-nowrap items-center my-5'>
    //       <span className='flex-1 bg-slate-400 h-[1px]'></span>
    //       <span className='text-slate-600 font-semibold mx-2'>kết nối với</span>
    //       <span className='flex-1 bg-slate-400 h-[1px]'></span>
    //     </div>
    //     <button className='flex flex-nowrap px-4 py-3 rounded-md items-center justify-around w-full bg-white active:opacity-95 active:scale-[0.99]' style={{ boxShadow: '0 14px 30px rgba(103,132,187,.1),0 4px 4px rgba(103,132,187,.04)' }}>
    //       <IconGoogle className='text-2xl' />
    //       <span className='text-slate-500'>Đăng nhập với Google</span>
    //     </button>
    //   </div>
    // </IonApp>
  );
} 

export default App;
