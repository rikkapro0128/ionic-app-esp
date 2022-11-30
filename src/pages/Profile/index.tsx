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
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import toast from 'react-hot-toast';

import Notify from '../../components/Notify';

import { FirebaseAuthentication, GetCurrentUserResult } from '@capacitor-firebase/authentication';

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

const notify = ({ title= 'Thông báo', body = 'Push notìy thành công!' }) => toast.custom((t) => (
  <Notify title={title} body={body} state={t} />
), {
  duration: 5000,
});

function Profile() {
  const navigate = useNavigate();
  const [info, setInfo] = useState<GetCurrentUserResult>();
  const [dialog, setDialog] = useState(false);

  useEffect(() => {
    FirebaseAuthentication.getCurrentUser()
    .then((result) => {
      setInfo(result);
    })
    .catch((error) => {
      console.log('Something error =>', error);
    });
  }, [])

  const logout = async () => {
    try {
      await FirebaseAuthentication.signOut();
      notify({ body: 'Bạn đã đăng xuất tài khoản khỏi ứng dụng!' });
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
      <Box className='p-4 relative'> 
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
              <Avatar sx={{ width: 80, height: 80 }} alt={info?.user?.displayName || undefined} src={info?.user?.photoUrl || undefined} />
            </StyledBadge>
          </Box>
          <Typography className='text-center py-5 font-semibold text-slate-900' variant="h5" gutterBottom>
            { info?.user?.displayName || null }
          </Typography>
          <Box>
            <Divider textAlign="left">
              <Chip icon={<AndroidIcon />} label="ID" />
            </Divider>
            <Typography className='text-left py-3 pl-10 font-semibold text-slate-900' variant="subtitle1" gutterBottom>
              { info?.user?.uid || null }
            </Typography>
          </Box>
          <Box>
            <Divider textAlign="left">
              <Chip icon={<EmailIcon />} label="Email" />
            </Divider>
            <Typography className='text-left py-3 pl-10 font-semibold text-slate-900' variant="subtitle1" gutterBottom>
              { info?.user?.email || null }
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Profile;
