import { ChangeEvent, memo, useState, useEffect } from "react";
import { IonToast } from "@ionic/react";
import { useNavigate } from "react-router";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  GoogleAuthProvider,
  signInWithPopup,
  User,
  onAuthStateChanged,
  Unsubscribe,
} from "firebase/auth";

import {
  FirebaseAuthentication,
  SignInResult,
} from "@capacitor-firebase/authentication";

import { appAuthWeb } from "../../firebase";

import { IconGoogle } from "../../icons";

import detechOS from "detectos.js";

import Divider from "@mui/material/Divider";
import Avatar from "@mui/material/Avatar";
import Collapse from "@mui/material/Collapse";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import LoginIcon from "@mui/icons-material/Login";

import { useSnackbar, PropsSnack } from "../../hooks/SnackBar";

import { setUserID } from '../../store/slices/commonSlice';
import { useAppDispatch } from "../../store/hooks";

const theme = createTheme();
const defaultRouteEnter = "devices";

const OSType = new detechOS();
const provider = new GoogleAuthProvider();

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        miru
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function Sign() {
  const dispatch = useAppDispatch();
  const [activeSnack, closeSnack] = useSnackbar();
  const navigate = useNavigate();
  const [sign, setSign] = useState({ email: "", password: "", confirm: "" });
  const [validate, setValidate] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [tab, setTab] = useState("sign-in");
  const [state, setState] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    let UnAuthState: Unsubscribe | undefined;
    if(OSType.OS === "Windows") { 
      const auth = getAuth(appAuthWeb);
      UnAuthState = onAuthStateChanged(auth, (result) => {
        dispatch(setUserID({ userId: result?.uid }));
      });
    }else if(OSType.OS === "Android") {
      FirebaseAuthentication.addListener('authStateChange', (result) => {
        dispatch(setUserID({ userId: result.user?.uid }));
      })
    }
    return () => {
      if(OSType.OS === "Windows") {
        if(typeof UnAuthState === 'function') { UnAuthState() }
      }else if(OSType.OS === "Android") {
        FirebaseAuthentication.removeAllListeners();
      }
    }
  }, [])

  useEffect(() => {
    // load option login in website enviroment
    if(OSType.OS === "Windows") {
      const auth = getAuth(appAuthWeb);
      provider.addScope("https://www.googleapis.com/auth/contacts.readonly");
      auth.languageCode = 'it';
      auth.useDeviceLanguage();
    }
  }, []);

  useEffect(() => {
    if (sign.email) {
      if (validate.email) {
        setValidate({ ...validate, email: "" });
      }
    } else {
      setValidate({ ...validate, email: "email không được bỏ trống" });
    }
  }, [sign.email]);

  useEffect(() => {
    if (sign.password) {
      if (validate.password) {
        setValidate({ ...validate, password: "" });
      }
    } else {
      setValidate({ ...validate, password: "mật khẩu không được để trống" });
    }
  }, [sign.password]);

  useEffect(() => {
    if (sign.confirm) {
      if (sign.password !== sign.confirm) {
        setValidate({ ...validate, confirm: "mật khẩu xác nhận không đúng" });
      } else {
        setValidate({ ...validate, confirm: "" });
      }
    } else {
      setValidate({
        ...validate,
        confirm: "mật khẩu xác nhận không được để trống",
      });
    }
  }, [sign.confirm]);

  const signInWithGoogle = async () => {
    try {
      let result: SignInResult | User | undefined;
      if (OSType.OS === "Android") {
        result = await FirebaseAuthentication.signInWithGoogle();
      } else if (OSType.OS === "Windows") {
        const auth = getAuth(appAuthWeb);
        const resultWeb = await signInWithPopup(auth, provider);
        result = resultWeb.user; 
      } else {
        activeSnack({
          title: "Không hợp lệ",
          message: `Ứng dụng không hỗ trợ đăng nhập trên ${OSType.OS}!`,
        } as PropsSnack & string);
        return;
      }
      if(result) {
        activeSnack({
          message: "Bạn đã đăng nhập thành công!",
        } as PropsSnack & string);
        navigate(`/${defaultRouteEnter}`);
      }
    } catch (error) {
      console.log(error);
      setToast(`Đã xảy ra lỗi khi bạn đăng nhập với google`);
    }
  };

  const changeEmail = (event: ChangeEvent<HTMLInputElement>) => {
    setSign({ ...sign, email: event.currentTarget.value });
  };

  const changePassword = (event: ChangeEvent<HTMLInputElement>) => {
    setSign({ ...sign, password: event.currentTarget.value });
  };

  const changeConfirm = (event: ChangeEvent<HTMLInputElement>) => {
    setSign({ ...sign, confirm: event.currentTarget.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(validate);
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  const signNormalize = async () => {
    try {
      const auth = getAuth(appAuthWeb);
      if (tab === "sign-in") {
        if (validate.email === "" && validate.password === "") {
          let result: SignInResult | UserCredential | undefined;
          setState(true);
          if (OSType.OS === "Windows") {
            result = await signInWithEmailAndPassword(
              auth,
              sign.email,
              sign.password
            );
          } else if (OSType.OS === "Android") {
            result = await FirebaseAuthentication.signInWithEmailAndPassword({
              email: sign.email,
              password: sign.password,
            });
          }
          console.log(result);
          setState(false);
          if (result?.user) {
            activeSnack({
              message: "Bạn đã đăng nhập thành công!",
            } as PropsSnack & string);
            navigate(`/${defaultRouteEnter}`);
          }
        }
      } else {
        setState(true);
        let result: SignInResult | UserCredential | undefined;
        if (OSType.OS === "Windows") {
          result = await createUserWithEmailAndPassword(
            auth,
            sign.email,
            sign.password
          );
        } else if (OSType.OS === "Android") {
          if (
            validate.email === "" &&
            validate.password === "" &&
            validate.confirm === ""
          ) {
            result =
              await FirebaseAuthentication.createUserWithEmailAndPassword({
                email: sign.email,
                password: sign.password,
              });
          }
        }
        console.log(result);
        setState(false);
        if (result?.user) {
          // setToast('Bạn đã đăng ký thành công');
          activeSnack({
            message: "Bạn đã đăng ký thành công!",
          } as PropsSnack & string);
          navigate(`/${defaultRouteEnter}`);
        }
      }
    } catch (error) {
      setState(false);
      setToast(
        `Đã xảy ra lỗi khi bạn ${tab === "sign-in" ? "đăng nhập" : "đăng ký"}`
      );
      console.log(error);
    }
  };

  return (
    <>
      <IonToast
        isOpen={toast ? true : false}
        onDidDismiss={() => setToast("")}
        message={toast}
        duration={5000}
        position={"top"}
      />
      <Dialog
        sx={{
          "& .MuiPaper-root": {
            backgroundColor: "transparent",
            backgroundImage: 'none'
          },
        }}
        open={state}
      >
        <CircularProgress sx={{ color: "white", margin: "0 auto" }} />
        <Typography
          className="text-white pt-5"
          variant="subtitle1"
          gutterBottom
        >
          Đang xử lí {tab === "sign-in" ? "đăng nhập" : "đăng ký"}, bạn đợi chút
          xíu!
        </Typography>
      </Dialog>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              {tab === "sign-in" ? "Đăng nhập" : "Đăng ký"}
            </Typography>
            <Box className="mb-3 mt-5" sx={{ width: "100%" }}>
              <Tabs
                value={tab}
                onChange={(event: React.SyntheticEvent, value: any) =>
                  setTab(value)
                }
                textColor="secondary"
                indicatorColor="secondary"
                aria-label="secondary tabs example"
                className="flex flex-nowrap"
              >
                <Tab className="flex-1" value={"sign-in"} label="Đăng nhập" />
                <Tab className="flex-1" value={"sign-up"} label="Đăng ký" />
              </Tabs>
            </Box>
            <Box
              component="form"
              onSubmit={handleSubmit}
              noValidate
              sx={{ mt: 1 }}
            >
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
              <Collapse in={tab === "sign-up" ? true : false}>
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
              {/* <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="nhớ tài khoản"
              /> */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                onClick={signNormalize}
                endIcon={<LoginIcon />}
                sx={{ mt: 3, mb: 2 }}
              >
                {tab === "sign-in" ? "Đăng nhập" : "Đăng ký"}
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
          <Divider className="py-3">hoặc kết nối</Divider>
          <Button
            onClick={signInWithGoogle}
            fullWidth
            size="large"
            variant="outlined"
            endIcon={<IconGoogle className="w-5 h-5" />}
          >
            đăng nhập với google
          </Button>
          <Copyright sx={{ mt: 8, mb: 4 }} />
        </Container>
      </ThemeProvider>
    </>
  );
}

export default memo(Sign);
