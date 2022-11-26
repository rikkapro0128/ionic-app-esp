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

import Box from '@mui/material/Box';
import Grow from '@mui/material/Grow';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import Home from './pages/Home';

setupIonicReact();

const App: React.FC = () =>{
  const [isSign, setIsSign] = useState(true);

  return (
    <IonApp>
      {
        isSign
        ?
          <Grow in={true}>
            <Box className='w-full h-full'>
              <Home />
            </Box>
          </Grow>
        :
        <Box className={`flex flex-1 flex-col justify-center items-center`}>
          <Box className='text-indigo-600 mb-3'>
            <CircularProgress sx={{ color: 'currentcolor' }} />
          </Box>
          <Typography className='text-slate-600' variant="subtitle1" gutterBottom>
            Đang kiểm tra đăng nhập
          </Typography>
        </Box>
      }
    </IonApp>
  );
} 

export default App;
