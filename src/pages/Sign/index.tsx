import { ChangeEvent, memo, useState, useEffect } from "react";
import { IonToast } from '@ionic/react';
import { useNavigate } from "react-router";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth';

import {
  IonIcon,
} from '@ionic/react';

import { IconGoogle } from '../../icons';
import { chevronForwardCircleOutline } from 'ionicons/icons';

import Avatar from '@mui/material/Avatar';
import Collapse from '@mui/material/Collapse';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Dialog from '@mui/material/Dialog';
import CircularProgress from '@mui/material/CircularProgress';

import app from '../../firebase';

const theme = createTheme();

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Sign() {

  const navigate = useNavigate();
  const [sign, setSign] = useState({ email: '', password: '', confirm: '' });
  const [validate, setValidate] = useState({ email: '', password: '', confirm: '' });
  const [tab, setTab] = useState('sign-in');
  const [state, setState] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if(sign.email) {
      if(validate.email) {
        setValidate({ ...validate, email: '' });
      }
    }else {
      setValidate({ ...validate, email: 'email không được bỏ trống' });
    }
  }, [sign.email]);

  useEffect(() => {
    if(sign.password) {
      if(validate.password) {
        setValidate({ ...validate, password: '' });
      }
    }else {
      setValidate({ ...validate, password: 'mật khẩu không được để trống' });
    }
  }, [sign.password]);

  useEffect(() => {
    if(sign.confirm) {
      if(sign.password !== sign.confirm) {
        setValidate({ ...validate, confirm: 'mật khẩu xác nhận không đúng' });
      }else {
        setValidate({ ...validate, confirm: '' });
      }
    }else {
      setValidate({ ...validate, confirm: 'mật khẩu xác nhận không được để trống' });
    }
  }, [sign.confirm]);

  const signInWithGoogle = async () => {
    try {

    } catch (error) {
      console.log(error);
    }
  };

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setSign({ ...sign, email: event.currentTarget.value })
  }
  
  const changePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setSign({ ...sign, password: event.currentTarget.value })
  }

  const changeConfirm = (event: ChangeEvent<HTMLInputElement>) => {
    setSign({ ...sign, confirm: event.currentTarget.value })
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(validate);
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  const signNormalize = async () => {
    try {
      if(tab === 'sign-in') {
        if(validate.email === '' && validate.password === '') {
          setState(true);
          const auth = getAuth(app);
          const result = await signInWithEmailAndPassword(auth, sign.email, sign.password);
          if(result.user) {
            setToast('Bạn đã đăng nhập thành công');
            navigate('/nodes');
          }
          console.log(result);
          setState(false);
        }
      }else {
        if(validate.email === '' && validate.password === '' && validate.confirm === '') {
          setState(true);
          const auth = getAuth(app);
          const result = await createUserWithEmailAndPassword(auth, sign.email, sign.password);
          if(result.user) {
            setToast('Bạn đã đăng ký thành công');
          }
          console.log(result);
          setState(false);
        }
      }
    } catch (error) {
      setState(false);
      setToast(`Đã xảy ra lỗi khi bạn ${ tab === 'sign-in' ? 'đăng nhập' : 'đăng ký' }`);
      console.log(error);
    }
  }

  return (
    <>
      <IonToast
        isOpen={toast ? true : false}
        onDidDismiss={() => setToast('')}
        message={toast}
        duration={ 5000 }
        position={'top'}
      />
      <Dialog sx={{ '& .MuiPaper-root': {
        backgroundColor: 'transparent',
        boxShadow: 'none'
      } }} open={state}>
        <CircularProgress sx={{ color: 'white', margin: '0 auto' }} />
        <Typography className="text-white pt-5" variant="subtitle1" gutterBottom>
          Đang xử lí { tab === 'sign-in' ? 'đăng nhập' : 'đăng ký' }, bạn đợi chút xíu!
        </Typography>
      </Dialog>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              { tab === 'sign-in' ? 'Đăng nhập' : 'Đăng ký' }
            </Typography>
            <Box className="mb-3 mt-5" sx={{ width: '100%' }}>
              <Tabs
                value={tab}
                onChange={(event: React.SyntheticEvent, value: any) => setTab(value)}
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
                className='flex flex-nowrap'
              >
                <Tab className="flex-1" value={'sign-in'} label="Đăng nhập" />
                <Tab className="flex-1" value={'sign-up'} label="Đăng ký" />
              </Tabs>
            </Box>
            <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                error={validate.email ? true : false}
                helperText={validate.email}
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                onChange={changeEmail}
                autoFocus
              />
              <TextField
                margin="normal"
                error={validate.password ? true : false}
                helperText={validate.password}
                required
                fullWidth
                name="password"
                label="Mật khẩu"
                type="password"
                onChange={changePassword}
                id="password"
                autoComplete="current-password"
              />
              <Collapse in={ tab === 'sign-up' ? true : false }>
                <TextField
                  margin="normal"
                  error={validate.confirm ? true : false}
                  helperText={validate.confirm}
                  required
                  fullWidth
                  name="confirm"
                  label="Mật khẩu xác nhận"
                  type="password"
                  onChange={changeConfirm}
                  id="password-confirm"
                  autoComplete="current-password"
                />
              </Collapse>
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="nhớ tài khoản"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                onClick={signNormalize}
                sx={{ mt: 3, mb: 2 }}
              >
                { tab === 'sign-in' ? 'Đăng nhập' : 'Đăng ký' }
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Bạn quên mật khẩu?
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </>
  )
}

export default memo(Sign);
