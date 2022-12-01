import { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Outlet } from 'react-router-dom';

import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';
import { ref, get, set, child } from "firebase/database";
import { database } from '../../firebase/db';

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const hasUser = await FirebaseAuthentication.getCurrentUser(); 
        setLoading(true);
        if(hasUser.user) {
          navigate(location.pathname !== '/' ? location.pathname : '/nodes');
          console.log(hasUser);
        }else {
          navigate('/sign');
          console.log('Not found user!');
        }
        // check info user 
        const userPath = `user-${hasUser.user?.uid}/`;
        const dbRef = ref(database);
        const snapshot = await get(child(dbRef, userPath));
        const val = snapshot.val();
        if(!val || !val?.info) {
          await set(ref(database, `${userPath}/info`), hasUser.user);
        }
      } catch (error) {
        console.log('Is error => ', error);
      }
    }
    check();
  }, []);

  return (
    loading
    ?
    <Outlet />
    :
    <Dialog sx={{ '& .MuiPaper-root': {
      backgroundColor: 'transparent',
      boxShadow: 'none'
    } }} open={true}>
      <CircularProgress sx={{ color: 'white', margin: '0 auto' }} />
      <Typography className="text-white pt-5" variant="subtitle1" gutterBottom>
        Đang kiểm tra đăng nhập!
      </Typography>
    </Dialog>
  );
}

export default memo(Dashboard);
