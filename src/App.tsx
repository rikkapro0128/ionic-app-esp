import {
  IonApp,
  setupIonicReact
} from '@ionic/react';

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

import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { publicRoutes } from './routes';

import Header from './components/Header';

setupIonicReact();

const App: React.FC = () =>{
  const [isSign, setIsSign] = useState(false);


  useEffect(() => {
    console.log('Run check user');
  }, [])

  return (
    <IonApp>
      <Grow in={true}>
        <Box className='w-full h-full'>
          <Router>
            <Header />
            <Routes>
              {
                publicRoutes.map((route, index) => (
                  <Route
                    key={index}
                    path={route.path}
                    element={<route.element />}
                  />
                ))
              }
            </Routes>
          </Router>
        </Box>
      </Grow>
      {/* <Box className={`flex flex-1 flex-col justify-center items-center`}>
        <Box className='text-indigo-600 mb-3'>
          <CircularProgress sx={{ color: 'currentcolor' }} />
        </Box>
        <Typography className='text-slate-600' variant="subtitle1" gutterBottom>
          Đang kiểm tra đăng nhập
        </Typography>
      </Box> */}
    </IonApp>
  );
} 

export default App;
