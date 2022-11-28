import { Navigate } from 'react-router-dom';

import Connect from "../pages/Connect";
import Nodes from "../pages/Nodes";
import Devices from "../pages/Devices";
import Sign from "../pages/Sign";

const privateRoutes: never[] = [];

const publicRoutes = [
  { path: "/", element: () => <Navigate to="/sign" replace /> },
  { path: "/sign", element: Sign },
  { path: "/nodes", element: Nodes },
  { path: "/devices", element: Devices },
  { path: "/connect", element: Connect }
];

export { privateRoutes, publicRoutes };
