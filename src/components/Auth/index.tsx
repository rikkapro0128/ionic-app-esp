import { memo, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { Outlet } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";

import {
  FirebaseAuthentication,
  User as UserAndroid,
} from "@capacitor-firebase/authentication";
import { ref, get, set, child } from "firebase/database";
import { database } from "../../firebase/db";

import {
  getAuth,
  UserInfo as UserWebsite,
  onAuthStateChanged,
  Unsubscribe,
} from "firebase/auth";

import { appAuthWeb } from "../../firebase";

import { routes as configRouter } from "../../ConfigGlobal/index";

import { useAppSelector } from "../../store/hooks";

import detechOS from "detectos.js";

const OSType = new detechOS();

function Dashboard() {
  const user = useAppSelector((store) => store.commons.infoUser);
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeOutNavigate: NodeJS.Timer;
    const run = async () => {
      setLoading(true);
      console.log(user);
      
      try {
        if (user !== null && Object.keys(user).length > 0) {
          // check info user
          const userPath = `user-${user?.uid}/info`;
          const dbRef = ref(database);
          const snapshot = await (await get(child(dbRef, userPath))).exists();

          if (!snapshot) {
            await set(ref(database, userPath), user);
          }
          navigate(
            location.pathname !== "/" && location.pathname !== "/sign"
              ? location.pathname
              : configRouter.afterAuthSuccess
          );
        } else {
          timeOutNavigate = setTimeout(() => {
            navigate(configRouter.afterAuthFailure);
          }, 5000);
        }
      } catch (error) {
        navigate(configRouter.afterAuthFailure);
        console.log("Is error => ", error);
      }
      setLoading(false);
    };
    run();
    return () => {
      if (timeOutNavigate) {
        clearTimeout(timeOutNavigate);
      }
    };
  }, [user]);

  return loading ? (
    <Dialog
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "transparent",
          backgroundImage: "none",
        },
      }}
      open={true}
    >
      <CircularProgress sx={{ color: "white", margin: "0 auto" }} />
      <Typography className="text-white pt-5" variant="subtitle1" gutterBottom>
        Đang kiểm tra đăng nhập!
      </Typography>
    </Dialog>
  ) : (
    <Outlet />
  );
}

export default memo(Dashboard);
