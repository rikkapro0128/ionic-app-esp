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

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface WifiInfo {
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

const notify = ({ title = "Thông báo", body = "Push notìy thành công!" }) =>
  toast.custom((t) => <Notify title={title} body={body} state={t} />, {
    duration: 5000,
  });

function Connect() {
  const [wifiPresent, setWifiPresent] = useState<WifiPresent>();
  const [wifis, setWifis] = useState<Array<WifiInfo>>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openDiaNode, setOpenDiaNode] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');

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

  const wifiPickHander = useCallback(async (ssid: string, bssid: string) => {
    // excute scan wifi
    console.log(ssid, bssid);
    if (ssid.includes("esp")) {
      onOpenDiaNode();
    } else {
    }
  }, []);

  const onOpenDiaNode = () => {
    setOpenDiaNode(true);
  }
  const onCloseDiaNode = () => {
    setOpenDiaNode(false);
    setPassword('');
  }

  return (
    <>
      <Dialog
        open={openDiaNode}
        onClose={onCloseDiaNode}
        aria-labelledby="alert-dialog-node-title"
        aria-describedby="alert-dialog-node-description"
      >
        <DialogTitle id="alert-dialog--title">
          {`Thiết lập kết nối wifi đến ${wifiPresent?.SSID}?`}
        </DialogTitle>
        <DialogContent style={{ paddingTop: '1rem' }}>
          <TextField fullWidth value={password} onChange={(event) => { setPassword(event.target.value) }} id="outlined-node-basic" label="Mật khẩu" variant="outlined" focused={true} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDiaNode}>huỷ</Button>
          <Button onClick={onCloseDiaNode}>
            kết nối
          </Button>
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
              <span style={{ textTransform: 'none' }} className="font-normal">
                {" " + wifiPresent?.SSID || "chưa thiết lập"}
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
                    end={index === 0 ? true : false}
                    onClick={wifiPickHander}
                    type={wifi.frequency}
                    ssid={wifi.SSID}
                    key={wifi.SSID + wifi.BSSID}
                    bssid={wifi.BSSID}
                    quality={wifi.level}
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
