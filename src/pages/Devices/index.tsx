import { memo, useState, useEffect } from "react";

import { useTheme } from '@mui/material/styles';

import Box from "@mui/material/Box";
import Grow from "@mui/material/Grow";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";

import Node from "../../components/Node";

import { IconNotFound } from "../../icons";

import DetachOS from "detectos.js";

import {
  FirebaseAuthentication,
  GetCurrentUserResult,
} from "@capacitor-firebase/authentication";
import { getAuth, User } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { database } from "../../firebase/db";
import { appAuthWeb } from "../../firebase";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setNodes } from "../../store/slices/nodesSlice";
import { transferNodes, ColorMode } from "../../ConfigGlobal";

import WrapOnNode from "../../components/Room/watch";
import { WidgetType, DeviceType } from "../../components/Widget/type";

const TypeOS = new DetachOS();

const transferTypeModel = {
  LOGIC: "toggle",
  TRANSFORM: "slider",
  COLOR: "color",
  PROGRESS: "progress",
  none: "none",
};
interface Map {
  [key: string]: any;
}

interface TransferNodeType {
  nodes: {
    [node: string]: {
      type: WidgetType;
      value: any;
    };
  };
}

function Devices() {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  // const [nodes, setNodes] = useState<Map>({});
  const statusFB = useAppSelector((state) => state.commons.fbConnection);
  const nodes = useAppSelector((state) => state.nodes.value);
  const [loading, setLoading] = useState<boolean>(true);
  const [idUser, setIDUser] = useState<string | undefined>();

  useEffect(() => {
    let idTimeout: NodeJS.Timeout;
    setLoading(true);
    if(Object.entries(nodes).length > 0) {
      setLoading(false);
    }
    idTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => {
      if(idTimeout) {
        clearTimeout(idTimeout);
      }
    }
  }, [nodes])

  return (
    <WrapOnNode>
      {loading ? (
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
          <Typography
            className="text-white pt-5"
            variant="subtitle1"
            gutterBottom
          >
            Đang tải thiết bị!
          </Typography>
        </Dialog>
      ) : Object.entries(nodes).length > 0 ? (
        <Box
          sx={{
            maxHeight: window.innerHeight - 72,
            height: window.innerHeight - 72,
          }}
          bgcolor={ theme.palette.mode === ColorMode.LIGHT ? '#f1f5f9' : '#212121' }
          className={`overflow-y-scroll`}
        >
          {Object.entries(nodes).map(([key, node]) => {
            return (
              <div key={key} className="grid grid-cols-2 gap-3 p-3">
                <Node
                  devices={node.devices}
                  node={{ id: key, name: node.name, sub: node.sub }}
                />
              </div>
            );
          })}
        </Box>
      ) : (
        <Box className="h-full w-full flex justify-between items-center bg-slate-100">
          <Box className="m-auto">
            <IconNotFound className="w-48 h-48 m-auto" />
            <Typography
              sx={{ fontSize: "1.2rem", fontWeight: 600 }}
              className="pt-3 text-slate-700"
            >
              Không tìm thấy thiết bị nào.
            </Typography>
          </Box>
        </Box>
      )}
    </WrapOnNode>
  );
}

export default memo(Devices);
