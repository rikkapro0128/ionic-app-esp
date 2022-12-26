import { Navigate } from 'react-router-dom';

import Connect from "../pages/Connect";
import ReconnectWifi from "../pages/ReconnectWifi";
import Devices from "../pages/Devices";
import Sign from "../pages/Sign";
import CheckUser from "../pages/Check";
import Profile from "../pages/Profile";
import Setting from "../pages/Setting";

const publicRoutes: never[] = [];

const routes = [
  { path: "/sign", element: Sign },
  { path: "/devices", element: Devices },
  { path: "/connect", element: Connect },
  { path: "/re-connect", element: ReconnectWifi },
  { path: "/check-user", element: CheckUser },
  { path: "/profile", element: Profile },
  { path: "/setting", element: Setting },
];

export { routes };
