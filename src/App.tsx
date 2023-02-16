import { IonApp, setupIonicReact } from "@ionic/react";

import { Toaster } from "react-hot-toast";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

/* TailwindCSS */
import "./index.css";

import { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";

import { getDatabase, ref, onValue } from "firebase/database";
import { database } from "./firebase/db";

import { setFbConnection } from "./store/slices/commonSlice";
import { useAppSelector, useAppDispatch } from "./store/hooks";

import Header from "./components/Header";
import Auth from "./components/Auth";

setupIonicReact();

const App: React.FC = () => {
  const FBConnection = useAppSelector((state) => state.commons.fbConnection);
  const dispatch = useAppDispatch();
  const [isSign, setIsSign] = useState(false);

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

  return (
    <>
      <Toaster />
      <IonApp>
        <Grow in={true}>
          <Box className="w-full h-full">
            <Router>
              <Box className="flex flex-col h-full">
                <Header />
                {FBConnection ? 
                  null : <p className="py-2 pl-2 bg-slate-300 text-slate-700 text-center italic">Chú ý: ứng dụng của bạn đang ở chế độ offline</p> }
                <Routes>
                  <Route path="/" element={<Auth />}>
                    {routes.map((route, index) => (
                      <Route
                        key={index}
                        path={route.path}
                        element={<route.element />}
                      />
                    ))}
                  </Route>
                </Routes>
              </Box>
            </Router>
          </Box>
        </Grow>
      </IonApp>
    </>
  );
};

export default App;
