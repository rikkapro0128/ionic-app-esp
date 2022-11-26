import { memo, useState } from 'react';

import Box from '@mui/material/Box';
import WifiIcon from '@mui/icons-material/Wifi';
import Typography from '@mui/material/Typography';
import SignalCellular1BarIcon from '@mui/icons-material/SignalCellular1Bar';
import SignalCellular2BarIcon from '@mui/icons-material/SignalCellular2Bar';
import SignalCellular3BarIcon from '@mui/icons-material/SignalCellular3Bar';
import SignalCellular4BarIcon from '@mui/icons-material/SignalCellular4Bar';
import Button from '@mui/material/Button';
import Zoom from '@mui/material/Zoom';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';

import { IconEmptyWifi } from '../../icons';

import { WifiWizard2 } from '@awesome-cordova-plugins/wifi-wizard-2';

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

function Connect() {
  const [scan, setScan] = useState(false);
  const [networks, setNetworks] = useState([]);

  async function activeScan() {
    try {
      if(!scan) {
        setScan(true)
        const networks = await WifiWizard2.scan({ numLevels: 0 });
        setNetworks(networks);
        setScan(false);
        console.log(networks);
      }
    } catch (error) {
      console.log(error);
      setScan(false);
    }
  }

  return (
    
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
    <Box className='max-h-[530px] bg-white flex flex-col relative w-full flex-1 rounded-t-3xl p-6 shadow-2xl'>
      <Box>
        <Typography variant="h5" className='text-slate-600'>
          Danh sách node
        </Typography>
        <Typography variant="subtitle1" className='text-slate-600'>
          { networks.length } node
        </Typography>
      </Box>
      <Box className='flex-1 overflow-y-scroll my-2'>
        {
          networks.length
          ?
          <Fade in={true}>
            <Box>
              {
                networks.map(network => (
                  <Button key={network['BSSID']} sx={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', textTransform: 'unset' }} className='flex-nowrap w-full'>
                    <Typography variant="h6" className='text-slate-600'>
                      { network['SSID'] }
                    </Typography>
                    { checkLevelSignal(network['level']) }
                  </Button>
                ))
              }
            </Box>
          </Fade>
          :
          <Grow
            in={true}
            style={{ transformOrigin: '0 0 0' }}
            {...(networks.length > 0 ? { timeout: 1000 } : {})}
          >
            <Box className='flex flex-col items-center justify-center h-full'>
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
  );
}

export default memo(Connect);
