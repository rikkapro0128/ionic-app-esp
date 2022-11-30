import { memo, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Outlet } from 'react-router-dom';

import { FirebaseAuthentication } from '@capacitor-firebase/authentication';


function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const check = async () => {
      try {
        navigate('/check-user');
        const hasUser = await FirebaseAuthentication.getCurrentUser(); 
        if(hasUser.user) {
          navigate(location.pathname !== '/' ? location.pathname : '/nodes');
          console.log(hasUser);
        }else {
          navigate('/sign');
          console.log('Not found user!');
        }
      } catch (error) {
        console.log('Is error => ', error);
      }
    }
    check();
  }, []);

  return (
    <Outlet />
  );
}

export default memo(Dashboard);
