import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import AndroidIcon from '@mui/icons-material/Android';
import EmailIcon from '@mui/icons-material/Email';
import Button from '@mui/material/Button';

import LogoutIcon from '@mui/icons-material/Logout';
import IconButton from '@mui/material/IconButton';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import DetachOS from 'detectos.js';

import { useSnackbar, PropsSnack } from "../../hooks/SnackBar";

import { FirebaseAuthentication, GetCurrentUserResult } from '@capacitor-firebase/authentication';
import { getAuth, signOut, onAuthStateChanged, User, Unsubscribe } from "firebase/auth";

import { appAuthWeb } from '../../firebase';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const TypeOS = new DetachOS();

interface GeneralUser extends User, GetCurrentUserResult {}

function Profile() {
  const [activeSnack, closeSnack] = useSnackbar();
  const navigate = useNavigate();
  const [info, setInfo] = useState<GeneralUser | null>(null);
  const [dialog, setDialog] = useState(false);

  useEffect(() => {
    let unAuthStateChange: Unsubscribe | undefined;
    if(TypeOS.OS === 'Android') {
      FirebaseAuthentication.getCurrentUser()
      .then((result) => {
        setInfo(result as GeneralUser);
      })
      .catch((error) => {
        console.log('Something error =>', error);
      });
    }else if(TypeOS.OS === 'Windows') {
      const auth = getAuth(appAuthWeb);
      unAuthStateChange = onAuthStateChanged(auth, (user) => {
        setInfo(user as GeneralUser);
      })
    }
    return () => {
      if(typeof unAuthStateChange === 'function') { unAuthStateChange() }
    }
  }, [])

  const logout = async () => {
    try {
      if(TypeOS.OS === 'Android') {
        await FirebaseAuthentication.signOut();
      }else if(TypeOS.OS === 'Windows') {
        const auth = getAuth(appAuthWeb);
        await signOut(auth);
      }
      activeSnack({
        message: 'Bạn đã đăng xuất tài khoản khỏi ứng dụng!',
      } as PropsSnack & string);
      navigate('/sign');
    } catch (error) {
      console.log();
    }
    setDialog(false);
  }

  return (
    <>
      <Dialog
        open={dialog}
        onClose={() => setDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn muốn đăng xuất?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hành động này của bạn sẽ đăng xuất tài khoản này ra khỏi ứng dụng,
            bạn có chắc sẽ đăng xuất?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Huỷ</Button>
          <Button onClick={logout} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      <Box className='p-4 relative  '> 
        <Box className='flex flex-col m-auto w-full my-3'>
          <Box className='absolute top-0 right-0 mr-10 mt-5'>
            <IconButton onClick={() => setDialog(true)} aria-label="logout" size="large">
              <LogoutIcon />
            </IconButton>
          </Box>
          <Box className='flex justify-center'>
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar sx={{ width: 80, height: 80 }} alt={ info?.user?.displayName || info?.displayName || '' } src={ info?.user?.photoUrl || info?.photoURL || '' } />
            </StyledBadge>
          </Box>
          <Typography color={(theme) => theme.palette.text.primary} className='text-center py-5 font-semibold ' variant="h5" gutterBottom>
            { info?.user?.displayName || info?.displayName || '' }
          </Typography>
          <Box>
            <Divider textAlign="left">
              <Chip icon={<AndroidIcon />} label="ID" />
            </Divider>
            <Typography color={(theme) => theme.palette.text.secondary} className='text-left py-3 pl-10 font-semibold ' variant="subtitle1" gutterBottom>
              { info?.user?.uid || info?.uid || '' }
            </Typography>
          </Box>
          <Box>
            <Divider textAlign="left">
              <Chip icon={<EmailIcon />} label="Email" />
            </Divider>
            <Typography color={(theme) => theme.palette.text.secondary} className='text-left py-3 pl-10 font-semibold ' variant="subtitle1" gutterBottom>
              { info?.user?.email || info?.email || '' }
            </Typography>
          </Box>
          <Box>
            <Divider textAlign="left">
              <Chip icon={<PhoneAndroidIcon />} label="Số điện thoại" />
            </Divider>
            <Typography color={(theme) => theme.palette.text.secondary} className='text-left py-3 pl-10 font-semibold ' variant="subtitle1" gutterBottom>
              { /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/.test(info?.user?.email || info?.email || '') ? info?.user?.email || info?.email || '' : 'Số điện thoại không hợp lệ.' }
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Profile;
