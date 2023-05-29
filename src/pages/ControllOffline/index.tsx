import { memo, useCallback, useEffect, useState } from "react";

import { Box, Typography, Button, Tooltip  } from "@mui/material";

import WifiTetheringErrorIcon from "@mui/icons-material/WifiTetheringError";
import RouterIcon from "@mui/icons-material/Router";
import SensorsIcon from "@mui/icons-material/Sensors";

import BtnScan from "../../components/Btn/Scan";

import { useScanDevice } from "../../hooks/ScanDevice";
import { useSnackbar, PropsSnack } from "../../hooks/SnackBar";

import {
  ColorType,
  DeviceType,
  WidgetType,
} from "../../components/Widget/type";

import { useTheme } from "@mui/material/styles";

import { getTypeWidget } from "../../components/Widget";

interface MutiDevice {
  id: string;
  type: string;
  state?: boolean;
  value?: number | ColorType;
}

interface NodeType {
  uid: string;
  host: string,
  nodeId: string;
  devices: MutiDevice[];
}

const ControllOffline = () => {
  const [activeSnack, closeSnack] = useSnackbar();
  const theme = useTheme();

  const [scan, setScan] = useState(false);

  const [devices, setDevices] = useState<DeviceType[]>([]);
  const [networks, setNetworks] = useState([]);
  const [progress, scanDevices] = useScanDevice();

  const clickScan = useCallback(() => {
    setScan(!scan);
  }, [scan]);

  const parserDevice = (nodes: NodeType[]): DeviceType[] => {
    const devices: DeviceType[] = [];
    nodes.forEach((nodes) => {
      for (let device of nodes.devices) {
        const deviceInstance = {
          id: device.id,
          host: nodes.host,
          node_id: nodes.nodeId,
          icon: "",
          type: device.type as WidgetType,
        } as DeviceType;
        if (device.type === WidgetType.LOGIC) {
          deviceInstance.state = device.state;
        } else if (
          device.type === WidgetType.COLOR ||
          device.type == WidgetType.TRANSFORM
        ) {
          deviceInstance.value = device.value;
        }
        devices.push(deviceInstance);
      }
    });
    return devices;
  };

  useEffect(() => {
    const deviceJson = localStorage.getItem('devices-offline');
    if(deviceJson) {
      const deviceParser = JSON.parse(deviceJson) as DeviceType[];
      setDevices(deviceParser);
    }
    
  }, [])

  useEffect(() => {
    const run = async () => {
      if (scan) {
        const nodes: NodeType[] = (await scanDevices()).filter(
          (nodes) => nodes !== null
        );
        const device = parserDevice(nodes);
        if(device.length === 0) {
          activeSnack({
            message: `Không tìm thấy thiết bị nào trong mạng.`,
          } as PropsSnack & string);
        }
        console.log(device);
        localStorage.setItem('devices-offline', JSON.stringify(device));
        setDevices(device);
        setScan(false);
      } else {
        setNetworks([]);
      }
    };
    run();
  }, [scan]);

  return (
    <div className="h-full flex flex-col">
      <Box
        bgcolor={(theme) => theme.palette.background.paper}
        className="relative h-full flex flex-col flex-1 px-5 pt-5"
      >
        <Box color={theme => theme.palette.text.primary} className="flex justify-between items-center pb-5">
          <Typography variant="subtitle1">
            Thiết bị có sẵn: {devices.length}
          </Typography>
          <Tooltip open={scan} title={`${ progress ? progress.toFixed(1) + '%' : '...'}`} arrow placement="left">
            <Button
              onClick={clickScan}
              variant="contained"
              endIcon={<SensorsIcon />}
            >
              {scan ? `Dừng tìm` : `Tìm thiết bị`}
            </Button>
          </Tooltip >
        </Box>
        {devices.length > 0 ? (
          <div className="flex-1 overflow-y-scroll">
            {devices.map((device, index) =>
              <div key={`${device.node_id}-${device.id}`} className={`border p-4 rounded-md ${index !== 0 ? 'mt-4' : ''}`} style={{
                borderColor: theme.palette.text.primary,
              }} >
                {
                  // getTypeWidget(device)
                  getTypeWidget(device, undefined, { isOffline: true, host: device.host as string })
                }
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center items-center">
            <RouterIcon className="mb-2" sx={{ fontSize: 70, fill: 'inherit' }} />
            <Typography variant="subtitle2" color={theme => theme.palette.text.secondary}>
              chưa có thiết bị nào được tìm thấy.
            </Typography>
          </div>
        )}
      </Box>
    </div>
  );
};

export default memo(ControllOffline);
