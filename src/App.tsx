import { useEffect, useState, useMemo } from "react";

import { IonApp, setupIonicReact } from "@ionic/react";

import { useTheme, ThemeProvider, createTheme } from "@mui/material/styles";

import { Toaster } from "react-hot-toast";

import { WifiWizard2 } from "@awesome-cordova-plugins/wifi-wizard-2";

/* Core CSS required for Ionic components to work properly */
// import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
// import "@ionic/react/css/normalize.css";
// import "@ionic/react/css/structure.css";
// import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
// import "@ionic/react/css/padding.css";
// import "@ionic/react/css/float-elements.css";
// import "@ionic/react/css/text-alignment.css";
// import "@ionic/react/css/text-transformation.css";
// import "@ionic/react/css/flex-utils.css";
// import "@ionic/react/css/display.css";

/* Theme variables */
// import "./theme/variables.css";

/* TailwindCSS */
import "./index.css";

import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

import { getDatabase, ref, onValue, goOnline } from "firebase/database";
import { database } from "./firebase/db";

import { setFbConnection, setUserID } from "./store/slices/commonSlice";
import { useAppSelector, useAppDispatch } from "./store/hooks";

import Header from "./components/Header";
import Auth from "./components/Auth";

import DetachOS from "detectos.js";

import { getUserIDByPlaform, ColorMode } from "./ConfigGlobal";

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { getAuth, onAuthStateChanged, Unsubscribe } from "firebase/auth";

import { appAuthWeb } from "./firebase";

import { GeneralUser, setInfoUser } from "./store/slices/commonSlice";

import { useSnackbar, PropsSnack } from "./hooks/SnackBar";

setupIonicReact();

const TypeOS = new DetachOS();

const App: React.FC = () => {
  const colorMode = useAppSelector((state) => state.commons.colorMode);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: colorMode,
          primary: {
            main: "#4F46E5",
            light: "#6366F1",
            dark: "#4339CA",
          },
          background: {
            default: colorMode === ColorMode.LIGHT ? "#F1F5F9" : "#121212",
            paper: colorMode === ColorMode.LIGHT ? "#F1F5F9" : "#2a2828",
          },
          text: {
            primary: colorMode === ColorMode.LIGHT ? "rgb(51, 65, 85)" : "#fff",
            secondary:
              colorMode === ColorMode.LIGHT ? "rgb(71, 85, 105)" : "#fff",
          },
        },
      }),
    [colorMode]
  );
  const FBConnection = useAppSelector((state) => state.commons.fbConnection);
  const dispatch = useAppDispatch();
  const [activeSnack, closeSnack] = useSnackbar();

  useEffect(() => {
    let unAuthStateChange: Unsubscribe | undefined;
    if (TypeOS.OS === "Android") {
      FirebaseAuthentication.getCurrentUser()
        .then((result) => {
          console.log(result.user);
          if (result.user) {
            if (Object.keys(result.user).length > 0) {
              dispatch(
                setInfoUser({
                  info: {
                    ...result.user,
                    photoURL: result.user?.photoUrl ?? "",
                  } as unknown as GeneralUser,
                })
              );
            }
          }
        })
        .catch((error) => {
          console.log("Something error =>", error);
        });
    } else if (TypeOS.OS === "Windows") {
      const auth = getAuth(appAuthWeb);
      unAuthStateChange = onAuthStateChanged(auth, (user) => {
        dispatch(
          setInfoUser({
            info: {
              displayName: user?.displayName,
              email: user?.email,
              emailVerified: user?.emailVerified,
              isAnonymous: user?.isAnonymous,
              metadata: user?.metadata,
              phoneNumber: user?.phoneNumber,
              photoURL: user?.photoURL,
              providerData: user?.providerData,
              providerId: user?.providerId,
              refreshToken: user?.refreshToken,
              uid: user?.uid,
              tenantId: user?.tenantId,
            } as GeneralUser,
          })
        );
      });
    }
    return () => {
      if (typeof unAuthStateChange === "function") {
        unAuthStateChange();
      }
    };
  }, []);

  useEffect(() => {
    getUserIDByPlaform().then((userId) => {
      dispatch(setUserID({ userId }));
    });
  }, []);

  useEffect(() => {
    const connectedRef = ref(database, ".info/connected");
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        dispatch(setFbConnection(true));
      } else {
        dispatch(setFbConnection(false));
      }
    });
  }, []);

  useEffect(() => {
    let idTimeOut: NodeJS.Timeout;
    if (!FBConnection) {
      idTimeOut = setInterval(() => {
        goOnline(database);
      }, 2000);
    }
    return () => {
      if (idTimeOut) {
        clearInterval(idTimeOut);
      }
    };
  }, [FBConnection]);

  return (
    <ThemeProvider theme={theme}>
      <Toaster />
      <Box>
        <Grow in={true}>
          <Box
            bgcolor={(theme) => theme.palette.background.default}
            className="w-full h-full"
          >
            <Router>
              <Box className="flex flex-col h-full overflow-hidden">
                <Header />
                {FBConnection ? null : (
                  <Typography
                    className="py-2 pl-2 text-center italic"
                    color={(theme) => theme.palette.text.primary}
                    variant="subtitle2"
                  >
                    Chú ý: ứng dụng của bạn đang ở chế độ offline
                  </Typography>
                )}
                <Routes>
                  <Route path="/" element={<Auth />}>
                    {routes.map((route, index) => (
                      <Route
                        key={index}
                        path={route.path}
                        element={
                          <Box
                            className="overflow-hidden"
                            sx={{
                              maxHeight: window.innerHeight - 72,
                              height: window.innerHeight - 72,
                            }}
                          >
                            <route.element />
                          </Box>
                        }
                      />
                    ))}
                  </Route>
                </Routes>
              </Box>
            </Router>
          </Box>
        </Grow>
      </Box>
    </ThemeProvider>
  );
};

export default App;
