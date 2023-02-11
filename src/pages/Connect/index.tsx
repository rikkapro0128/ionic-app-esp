import React, { memo, useState, useEffect, useCallback, useMemo } from "react";
import { CapacitorHttp, HttpResponse } from "@capacitor/core";
import { useNavigate } from "react-router-dom";

import { IconEmptyWifi } from "../../icons";

import { WifiWizard2 } from "@awesome-cordova-plugins/wifi-wizard-2";
import SwipeableViews from "react-swipeable-views";
import { v1 as genIDByTimeStamp } from "uuid";
import {
  FirebaseAuthentication,
  User,
} from "@capacitor-firebase/authentication";

import toast from "react-hot-toast";

import Notify from "../../components/Notify";
import { Box } from "@mui/material";

import BtnScan from "../../components/Btn/Scan";
import StatusWifi from "../../components/Status/Wifi";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

export interface WifiInfo {
  BSSID: string;
  SSID: string;
  capabilities: string;
  centerFreq0: number;
  centerFreq1: number;
  channelWidth: number;
  frequency: number;
  level: number;
  timestamp: number;
}
export interface WifiPresent {
  BSSID: string;
  SSID: string;
}

interface WifiNode extends WifiPresent {}
interface WifiStation extends WifiPresent {}

const notify = ({ title = "Thông báo", body = "Push notìy thành công!" }) =>
  toast.custom((t) => <Notify title={title} body={body} state={t} />, {
    duration: 5000,
  });

function Connect() {
  const [wifiPresent, setWifiPresent] = useState<WifiPresent>();
  const [wifiTarget, setWifiTarget] = useState<string>(
    () => localStorage.getItem("wifi-target") || ""
  );
  const [wifis, setWifis] = useState<Array<WifiInfo>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDiaNode, setOpenDiaNode] = useState<boolean>(false);
  const [openDiaNodeTarget, setOpenDiaNodeTarget] = useState<boolean>(false);
  const [passwordNode, setPasswordNode] = useState<string>("");
  const [pickNode, setPickNode] = useState<WifiNode>();
  const [pickStation, setPickStation] = useState<WifiStation>();
  const [passwordStation, setPasswordStation] = useState<string>("");
  const [passwordTarget, setPasswordTarget] = useState<string>("");

  useEffect(() => {
    let idTimeOut: NodeJS.Timeout;
    const checkWifiPresent = () => {
      idTimeOut = setInterval(async () => {
        const ssid = await WifiWizard2.getConnectedSSID();
        const bssid = await WifiWizard2.getConnectedBSSID();
        setWifiPresent({ SSID: ssid, BSSID: bssid });
      }, 2000);
    };
    checkWifiPresent();
    return () => {
      clearInterval(idTimeOut);
    };
  }, []);

  useEffect(() => {
    if (!wifiTarget && wifiPresent?.SSID) {
      setHandleWifiTarget(wifiPresent.SSID);
    }
  }, [wifiPresent]);

  useEffect(() => {
    handleConnectToStation(pickStation);
  }, [pickStation]);

  const clickScan = useCallback(async () => {
    // excute scan wifi
    setLoading(true);
    try {
      const state: string = await WifiWizard2.startScan();
      if (state === "OK") {
        const listWifi: Array<WifiInfo> = await WifiWizard2.getScanResults({
          numLevels: 0,
        });
        console.log(listWifi);

        setWifis(listWifi);
      }
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  }, []);

  const wifiPickHander = useCallback(async (wifi: WifiInfo) => {
    // excute scan wifi
    console.log(wifi.SSID, wifi.BSSID);
    if (wifi.SSID.includes("esp")) {
      setPickNode({ SSID: wifi.SSID, BSSID: wifi.BSSID });
      onOpenDiaNode();
    } else {
      setPickStation({ SSID: wifi.SSID, BSSID: wifi.BSSID });
    }
  }, []);

  const configWifiToNode = useCallback(async (wifi: WifiInfo) => {
    console.log(wifi);
    onOpenDiaNodeTarget();
  }, []);

  const onOpenDiaNode = () => {
    setOpenDiaNode(true);
  };
  const onOpenDiaNodeTarget = () => {
    setOpenDiaNodeTarget(true);
  };
  const onCloseDiaNode = () => {
    setOpenDiaNode(false);
    setPasswordNode("");
  };
  const onCloseDiaNodeTarget = () => {
    setOpenDiaNodeTarget(false);
    setPasswordTarget("");
  };

  const handleConnectToStation = async (wifi: WifiStation | undefined) => {
    console.log(pickStation);

    if (wifi?.SSID && wifi?.BSSID) {
      try {
        let networksSaved: string[] = await WifiWizard2.listNetworks();
        networksSaved = networksSaved.map((network) =>
          network.replaceAll('"', "")
        );
        console.log(networksSaved);

        const state = await WifiWizard2.connect(
          wifi?.SSID,
          true,
          passwordStation ? passwordStation : undefined,
          "WPA"
        );
        console.log(state);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleConnectToNode = async () => {
    if (pickNode?.SSID && pickNode?.BSSID) {
      try {
        const state = await WifiWizard2.connect(
          pickNode?.SSID,
          true,
          passwordNode,
          "WPA"
        );
        console.log(state); // NETWORK_CONNECTION_COMPLETED -
      } catch (error) {
        console.log(error);
      }
      onCloseDiaNode();
    }
  };

  const hanldeConnectFromNodeToTarget = async () => {
    try {
      if(wifiPresent) {
        const result = await CapacitorHttp.post({
          url: `http://192.168.4.1/config-wifi`,
          data: JSON.stringify({ ssid: wifiPresent.SSID, password: passwordTarget }),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        notify({ body: `Cấu hình WIFI ${wifiTarget} cho ${wifiPresent.SSID} thành công.` });
      }
    } catch (error) {
      console.log(error);notify({ body: 'Có lỗi xảy ra khi cấu hình WIFI!', title: 'Lỗi rồi' });
    }
    onCloseDiaNodeTarget();
  };

  const setHandleWifiTarget = (ssid: string) => {
    setWifiTarget(ssid);
    localStorage.setItem("wifi-target", ssid);
  };

  return (
    <>
      <Dialog
        open={openDiaNode}
        onClose={onCloseDiaNode}
        aria-labelledby="alert-dialog-node-title"
        aria-describedby="alert-dialog-node-description"
      >
        <DialogTitle id="alert-dialog--title">
          {`Thiết lập kết nối đến ${pickNode?.SSID}?`}
        </DialogTitle>
        <DialogContent style={{ paddingTop: "1rem" }}>
          <TextField
            fullWidth
            value={passwordNode}
            onChange={(event) => {
              setPasswordNode(event.target.value);
            }}
            id="outlined-node-basic"
            label="Mật khẩu"
            variant="outlined"
            focused={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDiaNode}>huỷ</Button>
          <Button onClick={handleConnectToNode}>kết nối</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDiaNodeTarget}
        onClose={onCloseDiaNodeTarget}
        aria-labelledby="alert-dialog-node-wifi-setup-title"
        aria-describedby="alert-dialog-node-wifi-setup-description"
      >
        <DialogTitle id="alert-dialog--title">
          {`Cấu hình kết nối ${pickNode?.SSID} tới wifi ${wifiTarget}?`}
        </DialogTitle>
        <DialogContent style={{ paddingTop: "1rem" }}>
          <TextField
            fullWidth
            value={passwordTarget}
            onChange={(event) => {
              setPasswordTarget(event.target.value);
            }}
            id="outlined-node-wifi-setup-basic"
            label="Mật khẩu"
            variant="outlined"
            focused={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDiaNodeTarget}>huỷ</Button>
          <Button onClick={hanldeConnectFromNodeToTarget}>kết nối</Button>
        </DialogActions>
      </Dialog>
      <div style={{ height: "100vh" }} className="bg-slate-100 flex flex-col">
        <Box>
          <BtnScan onCLick={clickScan} />
        </Box>
        <Box className="bg-white w-full flex-1 rounded-t-3xl shadow-lg px-8 pt-8">
          <div className="mb-3 flex justify-between">
            <h2 className="text-slate-700 text-lg uppercase font-bold">
              wifi có sẵn
            </h2>
            <h2 className="text-slate-700 text-md uppercase font-bold">
              thiết lập cho:
              <span style={{ textTransform: "none" }} className="font-normal">
                {" " + wifiTarget || "chưa thiết lập"}
              </span>
            </h2>
          </div>
          <div
            style={{ maxHeight: wifis.length ? 8 * 53.58 + "px" : "100%" }}
            className="text-slate-600 h-full overflow-y-scroll"
          >
            {/* render list wifi */}
            {wifis.length > 0 ? (
              loading ? (
                <div className="h-full flex flex-col justify-center items-center">
                  <h2>đang quét wifi...</h2>
                </div>
              ) : (
                wifis.map((wifi, index) => (
                  <StatusWifi
                    present={wifiPresent}
                    onConfig={
                      wifi.SSID.includes("esp") ? configWifiToNode : undefined
                    }
                    end={index === 0 ? true : false}
                    onClick={wifiPickHander}
                    payload={wifi}
                    key={wifi.SSID + wifi.BSSID}
                  />
                ))
              )
            ) : (
              <div className="h-full flex flex-col justify-center items-center">
                <h2>chưa có wifi nào được quét.</h2>
              </div>
            )}
          </div>
        </Box>
      </div>
    </>
  );
}

export default memo(Connect);
