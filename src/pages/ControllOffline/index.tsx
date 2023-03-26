import { memo, useCallback, useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import WifiTetheringErrorIcon from "@mui/icons-material/WifiTetheringError";
import RouterIcon from "@mui/icons-material/Router";

import BtnScan from "../../components/Btn/Scan";

import { useScanDevice } from '../../hooks/ScanDevice';

const ControllOffline = () => {
  const [scan, setScan] = useState(false);

  const [devices, setDevices] = useState([]);
  const [networks, setNetworks] = useState([]);
  const [progress, scanDevices] = useScanDevice();

  const clickScan = useCallback(() => {
    setScan(!scan);
  }, [scan]);

  useEffect(() => {
    const run = async () => {
      if (scan) {
        const ips = await scanDevices();
        console.log(ips);
      } else {
        setNetworks([]);
      }
    };
    run();
  }, [scan]);

  return (
    <div className="h-full flex flex-col">
      <BtnScan
        title={scan ? `Dừng thiết bị` : `Tìm thiết bị`}
        isScan={scan}
        onCLick={clickScan}
        size={140}
        fontSizePrimary={13}
        fontSizeSecond={8}
      />
      <Box
        bgcolor={(theme) => theme.palette.background.paper}
        className="relative flex-1 rounded-tl-3xl rounded-tr-3xl shadow-lg shadow-slate-500 px-5 pt-5"
      >
        <Typography variant="subtitle1">
          Thiết bị có sẵn: {devices.length}
        </Typography>
        {devices.length > 0 ? null : (
          <div className="h-full flex flex-col justify-center items-center">
            <RouterIcon className="mb-2" sx={{ fontSize: 89 }} />
            <h2>chưa có thiết bị nào được tìm thấy.</h2>
          </div>
        )}
      </Box>
    </div>
  );
};

export default memo(ControllOffline);
