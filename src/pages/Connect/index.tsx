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
import IconButton from "@mui/material/IconButton";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Drawer from "@mui/material/Drawer";
import Divider from "@mui/material/Divider";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import LabelIcon from "@mui/material/Typography";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import { ref, get, set, child, remove } from "firebase/database";
import { database } from "../../firebase/db";

const ipESPDefault = "192.168.4.1";

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

interface ConfigESP {
  ssid: string;
  password: string;
  "ip-station": string;
  "status-station": string;
  "quality-station": string;
  message: string;
}

const StatusConnectWifiESP = {
  0: "Wifi chưa thiết lập kết nối", // WL_IDLE_STATUS
  1: "Không tìm thấy WIFI cấu hình", // WL_NO_SSID_AVAIL
  2: "Quét mạng thành công", // WL_SCAN_COMPLETED
  3: "Đã kết nối tới WIFI cấu hình", // WL_CONNECTED
  4: "Kết nối WIFI cấu hình không thành công", // WL_CONNECT_FAILED
  5: "Mất kết nối WIFI", // WL_CONNECTION_LOST
  6: "WIFI cấu hình bị sai mật khẩu", // WL_WRONG_PASSWORD
  7: "WIFI bị ngắt kết nối", // WL_DISCONNECTED
};

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
  const [loadingViewConfigESP, setLoadingViewConfigESP] =
    useState<boolean>(false);
  const [drawer, setDrawer] = useState<boolean>(false);
  const [openDia, setOpenDia] = useState<boolean>(false);
  const [openDiaNodeTarget, setOpenDiaNodeTarget] = useState<boolean>(false);
  const [pickWifi, setPickWifi] = useState<WifiStation>();
  const [wifiViewConfig, setWifiViewConfig] = useState<ConfigESP>();
  const [pickWifiViewConfig, setPickWifiViewConfig] = useState<WifiInfo>();
  const [pickWifiConfigNode, setPickWifiConfigNode] = useState<WifiInfo>();
  const [passwordWifi, setPasswordWifi] = useState<string>("");
  const [passwordWifiConfig, setPasswordWifiConfig] = useState<string>("");

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
    if (pickWifi) {
      const initConnect = async () => {
        const stateValidate = await validateWifi(pickWifi);
        console.log("state validate = ", stateValidate);

        if (stateValidate) {
          await handleConnectToWifi();
        } else {
          onOpenDia();
        }
      };
      initConnect();
    }
  }, [pickWifi]);

  useEffect(() => {
    if (pickWifiViewConfig) {
      getViewConfig();
    }
  }, [pickWifiViewConfig]);

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

  const setDefaultConnect = useCallback(async (wifi: WifiInfo) => {
    setHandleWifiTarget(wifi.SSID);
  }, []);

  const handleConnectWifiForEsp = useCallback(async (wifi: WifiInfo) => {
    setPickWifiConfigNode(wifi);
    onOpenDiaConfigNode();
  }, []);

  const hanldeViewInfoWifi = useCallback((wifi: WifiInfo) => {
    setPickWifiViewConfig(wifi);
  }, []);

  const handleConnectToWifi = async () => {
    console.log("Wifi pick", pickWifi);

    if (pickWifi?.SSID && pickWifi?.BSSID) {
      try {
        const state = await WifiWizard2.connect(
          pickWifi?.SSID,
          true,
          passwordWifi ? passwordWifi : undefined,
          "WPA"
        );
        console.log(state);
      } catch (error) {
        console.log(error);
      }
      onCloseDia();
    }
  };

  const hanldeConnectFromNodeToTarget = async () => {
    try {
      if (wifiPresent) {
        const result = await CapacitorHttp.post({
          url: `http://${ipESPDefault}/config-wifi`,
          data: JSON.stringify({
            ssid: wifiTarget,
            password: passwordWifiConfig,
          }),
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });
        console.log(result);

        notify({
          body: `Cấu hình WIFI ${wifiTarget} cho ${wifiPresent.SSID} thành công.`,
        });
      }
    } catch (error) {
      console.log(error);
      notify({ body: "Có lỗi xảy ra khi cấu hình WIFI!", title: "Lỗi rồi" });
    }
    setPickWifi(undefined);
    onCloseDiaConfigNode();
  };

  const checkLinkFirebaseThenAction = async () => {
    try {
      if (wifiPresent?.SSID.includes("esp")) {
        const userID =
          (await FirebaseAuthentication.getCurrentUser()).user?.uid || "";
        const genIDNode = genIDByTimeStamp();
        if (userID && genIDNode) {
          const stateLinkApp = await CapacitorHttp.post({
            url: `http://${ipESPDefault}/link-app`,
            data: JSON.stringify({
              idNode: genIDNode,
              idUser: userID,
            }),
            headers: { "Content-Type": "application/json" },
          });
          console.log(userID, genIDNode, stateLinkApp);
          if (stateLinkApp.data.message === "LINK APP HAS BEEN SUCCESSFULLY") {
            notify({
              body: "Phần cứng liên kết ứng dụng thành công!",
              title: "Lỗi rồi",
            });
          }
        }
      }
    } catch (error) {
      notify({
        body: "Có lỗi xảy ra khi cấu hình liên kết ứng dụng vui lòng thử lại!",
        title: "Lỗi rồi",
      });
      console.log(error);
    }
  };

  const setHandleWifiTarget = (ssid: string) => {
    setWifiTarget(ssid);
    localStorage.setItem("wifi-target", ssid);
  };

  const validateWifi = async (wifi: WifiStation | undefined) => {
    let networksSaved: string[] = await WifiWizard2.listNetworks();
    networksSaved = networksSaved.map((network) => network.replaceAll('"', ""));
    console.log(wifi);
    console.log(networksSaved);
    return networksSaved.includes(wifi?.SSID || "") ? true : false;
  };

  const getViewConfig = async () => {
    openDrawer();
    setLoadingViewConfigESP(true);
    try {
      const response: HttpResponse = await CapacitorHttp.get({
        url: `http://${ipESPDefault}/is-config`,
      });
      console.log(response);
      setWifiViewConfig(response.data);
    } catch (error) {
      console.log(error);
      notify({
        body: "Không thể đọc được thông tin cấu hình ESP8266!",
        title: "Lỗi rồi",
      });
    }
    setLoadingViewConfigESP(false);
  };

  const onCloseDia = () => {
    setOpenDia(false);
    setPasswordWifi("");
  };

  const onCloseDiaConfigNode = () => {
    setOpenDiaNodeTarget(false);
    setPasswordWifiConfig("");
  };

  const onOpenDiaConfigNode = () => {
    setOpenDiaNodeTarget(true);
  };

  const onOpenDia = () => {
    setOpenDia(true);
  };

  const pickWifiConnect = (wifi: WifiInfo) => {
    setPickWifi(wifi);
  };

  const openDrawer = () => {
    setDrawer(true);
  };

  const closeDrawer = () => {
    setDrawer(false);
    setPickWifiViewConfig(undefined);
  };

  return (
    <>
      {/* FOR NODE ESP */}
      <Drawer
        PaperProps={{
          style: { width: "100%" },
        }}
        anchor={"bottom"}
        open={drawer}
        onClose={closeDrawer}
      >
        <div className="px-5">
          <div className="flex justify-between items-center pt-5">
            <span className="text-lg">
              Cấu hình ${wifiPresent?.SSID || "ESP8266"}
            </span>
            <IconButton
              size="large"
              color="primary"
              aria-label="upload picture"
              component="button"
              onClick={() => {
                closeDrawer();
              }}
            >
              <CloseRoundedIcon />
            </IconButton>
          </div>
          <div>
            {loadingViewConfigESP ? (
              <Box
                className="py-5"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyItems: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress />
                đang tìm kiếm dữ liệu.
              </Box>
            ) : (
              <>
                {/* SSID */}
                <Box>
                  <Divider textAlign="left">
                    <Chip label={"Wifi đang kết nối"} />
                  </Divider>
                  <Typography
                    sx={{ fontSize: "1.2rem" }}
                    variant="subtitle1"
                    className="py-3 text-slate-800"
                  >
                    <LabelIcon className="mr-2 text-slate-700" />
                    {wifiViewConfig?.ssid || "không tìm thấy."}
                  </Typography>
                </Box>
                {/* PASSWORD */}
                <Box>
                  <Divider textAlign="left">
                    <Chip label={"Mật khẩu kết nối"} />
                  </Divider>
                  <Typography
                    sx={{ fontSize: "1.2rem" }}
                    variant="subtitle1"
                    className="py-3 text-slate-800"
                  >
                    <LabelIcon className="mr-2 text-slate-700" />
                    {wifiViewConfig?.password || "không tìm thấy."}
                  </Typography>
                </Box>
                {/* IP */}
                <Box>
                  <Divider textAlign="left">
                    <Chip label={"IP cấp phát"} />
                  </Divider>
                  <Typography
                    sx={{ fontSize: "1.2rem" }}
                    variant="subtitle1"
                    className="py-3 text-slate-800"
                  >
                    <LabelIcon className="mr-2 text-slate-700" />
                    {wifiViewConfig?.["ip-station"] || "không được cấp phát."}
                  </Typography>
                </Box>
                {/* STATUS */}
                <Box className="mb-5">
                  <Divider textAlign="left">
                    <Chip label={"Trạng thái kết nối"} />
                  </Divider>
                  <Typography
                    sx={{ fontSize: "1.2rem" }}
                    variant="subtitle1"
                    className="py-3 text-slate-800"
                  >
                    <LabelIcon className="mr-2 text-slate-700" />
                    {wifiViewConfig &&
                    wifiViewConfig?.["status-station"] in StatusConnectWifiESP
                      ? StatusConnectWifiESP[
                          wifiViewConfig?.[
                            "status-station"
                          ] as unknown as number as keyof typeof StatusConnectWifiESP
                        ]
                      : "Trạng thái không xác định."}
                  </Typography>
                </Box>
              </>
            )}
          </div>
        </div>
      </Drawer>
      <Dialog
        open={openDia}
        onClose={onCloseDia}
        aria-labelledby="alert-dialog-wifi-title"
        aria-describedby="alert-dialog-wifi-description"
      >
        <DialogTitle id="alert-dialog--title">
          {`Thiết lập kết nối đến ${pickWifi?.SSID}?`}
        </DialogTitle>
        <DialogContent style={{ paddingTop: "1rem" }}>
          <TextField
            fullWidth
            value={passwordWifi}
            onChange={(event) => {
              setPasswordWifi(event.target.value);
            }}
            id="outlined-wifi-basic"
            label="Mật khẩu"
            variant="outlined"
            focused={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDia}>huỷ</Button>
          <Button onClick={handleConnectToWifi}>kết nối</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openDiaNodeTarget}
        onClose={onCloseDiaConfigNode}
        aria-labelledby="alert-dialog-node-wifi-title"
        aria-describedby="alert-dialog-node-wifi-description"
      >
        <DialogTitle id="alert-dialog-node-title">
          <p>
            {`Cấu hình kết nối '${wifiTarget}' tới ${pickWifiConfigNode?.SSID}?`}
          </p>
          <span className="text-sm italic">
            lưu ý: sau khi cấu hình esp sẽ reset nên hãy kết nối lại nó nếu bạn
            muốn xem cấu hình!
          </span>
        </DialogTitle>
        <DialogContent style={{ paddingTop: "1rem" }}>
          <TextField
            fullWidth
            value={passwordWifiConfig}
            onChange={(event) => {
              setPasswordWifiConfig(event.target.value);
            }}
            id="outlined-wifi-node-basic"
            label="Mật khẩu"
            variant="outlined"
            focused={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDiaConfigNode}>huỷ</Button>
          <Button onClick={hanldeConnectFromNodeToTarget}>lưu kết nối</Button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          height: "100vh",
        }}
        className="bg-slate-100 flex flex-col"
      >
        <Box>
          <BtnScan onCLick={clickScan} />
        </Box>
        <Box className="bg-white w-full flex-1 rounded-t-3xl shadow-lg px-8 pt-8 shadow-slate-900">
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
                  <CircularProgress />
                  <h2 className="pt-2">Đang quét wifi...</h2>
                </div>
              ) : (
                wifis.map((wifi, index) => (
                  <StatusWifi
                    present={wifiPresent}
                    end={index === 0 ? true : false}
                    connectWifi={pickWifiConnect}
                    setAreaConnect={setDefaultConnect}
                    configWifiForEsp={handleConnectWifiForEsp}
                    payload={wifi}
                    linkApplication={checkLinkFirebaseThenAction}
                    viewConfig={hanldeViewInfoWifi}
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
