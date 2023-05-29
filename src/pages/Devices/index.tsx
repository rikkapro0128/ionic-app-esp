import { memo, useState, useEffect } from "react";

import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import CircularProgress from "@mui/material/CircularProgress";

import Node from "../../components/Node";

import { IconNotFound } from "../../icons";

import { useAppSelector } from "../../store/hooks";
import { ColorMode } from "../../ConfigGlobal";

import WrapOnNode from "../../components/Room/watch";

function Devices() {
  const theme = useTheme();
  const nodes = useAppSelector((state) => state.nodes.value);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let idTimeout: NodeJS.Timeout;
    setLoading(true);
    if (Object.entries(nodes).length > 0) {
      setLoading(false);
    }
    idTimeout = setTimeout(() => {
      setLoading(false);
    }, 5000);
    return () => {
      if (idTimeout) {
        clearTimeout(idTimeout);
      }
    };
  }, [nodes]);

  return (
    <WrapOnNode>
      {loading ? (
        <Box className="h-full w-full flex justify-between items-center">
          <Box
            color={(theme) => theme.palette.text.primary}
            className="m-auto flex flex-col items-center"
          >
            <CircularProgress color="inherit" size={20} />
            <Typography
              sx={{ fontSize: "1.2rem", fontWeight: 600 }}
              className="pt-3 "
            >
              Đang tải thiết bị...
            </Typography>
          </Box>
        </Box>
      ) : Object.entries(nodes).length > 0 ? (
        <Box className={`overflow-y-scroll max-h-full`}>
          {Object.entries(nodes).map(([key, node]) => {
            return (
              <Box key={key} className="grid grid-cols-2 gap-3 p-3">
                <Node
                  devices={node.devices}
                  node={{
                    id: key.includes("node") ? key.split("node-")[1] : key,
                    name: node.name,
                    sub: node.sub,
                  }}
                />
              </Box>
            );
          })}
        </Box>
      ) : (
        <Box className="h-full w-full flex justify-between items-center">
          <Box className="m-auto">
            <IconNotFound className="w-48 h-48 m-auto" />
            <Typography
              sx={{ fontSize: "1.2rem", fontWeight: 600 }}
              className="pt-3 "
              color={theme => theme.palette.text.primary}
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
