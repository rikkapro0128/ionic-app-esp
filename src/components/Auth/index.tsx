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

import detechOS from "detectos.js";

const OSType = new detechOS();

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unAuthOnWeb: Unsubscribe | undefined;
    let clearTimeoutNotDone: NodeJS.Timeout;
    const check = async (userProp: UserAndroid | UserWebsite | null) => {
      setLoading(true);
      try {
        let user: UserAndroid | UserWebsite | null = userProp;

        if (OSType.OS === "Android") {
          user = (await FirebaseAuthentication.getCurrentUser()).user;
        }

        if (user) {
          // check info user
          const userPath = `user-${user?.uid}/`;
          const dbRef = ref(database);
          const snapshot = await (await get(child(dbRef, userPath))).exists();

          if (!snapshot) {
            await set(ref(database, `${userPath}/info`), user);
          }
          navigate(
            location.pathname !== "/" && location.pathname !== "/sign"
              ? location.pathname
              : configRouter.afterAuthSuccess
          );
        } else {
          navigate(configRouter.afterAuthFailure);
        }
      } catch (error) {
        navigate(configRouter.afterAuthFailure);
        console.log("Is error => ", error);
      }
      setLoading(false);
    };

    if (OSType.OS === "Windows") {
      let userCtx: UserAndroid | UserWebsite | null = null;
      const auth = getAuth(appAuthWeb);
      clearTimeoutNotDone = setTimeout(() => {
        setLoading(false);
      }, 4000);
      unAuthOnWeb = onAuthStateChanged(auth, (user) => {
        if (user) {
          userCtx = {
            displayName: user.displayName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            photoURL: user.photoURL,
            providerId: user.providerId,
            uid: user.uid,
          } as UserWebsite;
          check(userCtx);
        }
      });
    } else if (OSType.OS === "Android") {
      check(null);
    }

    return () => {
      clearTimeout(clearTimeoutNotDone);
      if (typeof unAuthOnWeb === "function") {
        unAuthOnWeb();
      }
    };
  }, []);

  return loading ? (
    <Dialog
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "transparent",
          boxShadow: "none",
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
