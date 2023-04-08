import { memo, useState, useEffect } from "react";

import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import Slider from "@mui/material/Slider";

import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { StyledMenu } from "../../Node";

// import Hue from '@uiw/react-color-hue';
import { Alpha, Hue, Wheel } from "@uiw/react-color";
import {
  hsvaToRgba,
  hsvaToHexa,
  rgbaToHsva,
  rgbaToHex,
  HsvaColor,
} from "@uiw/color-convert";

import {
  ref,
  get,
  set,
  child,
  onValue,
  DataSnapshot,
  Unsubscribe,
} from "firebase/database";
import { database } from "../../../firebase/db";

import { useAppSelector } from "../../../store/hooks";

import icon from "../index";

import { ReMapValue } from "../../../ConfigGlobal";
import { useSnackbar, PropsSnack } from "../../../hooks/SnackBar";

import { DeviceType, ColorType, ModeColor } from "../type";

interface PayloadType {
  device: DeviceType;
  idUser?: string | undefined;
  isOffline?: boolean;
  hostOffline?: string;
}

let blockUpdate = false;

function Rgb({ device, idUser, isOffline = false, hostOffline }: PayloadType) {
  const [activeSnack, closeSnack] = useSnackbar();
  const theme = useTheme();
  const [hsva, setHsva] = useState(() =>
    device.value && typeof device.value === "object"
      ? rgbaToHsva({
          r: device.value.r,
          g: device.value.g,
          b: device.value.b,
          a: Number((device.value.contrast / 100).toFixed(1)),
        })
      : { h: 0, s: 0, v: 68, a: 1 }
  );
  const [rgba, setRgba] = useState({ r: 0, g: 0, b: 0, a: 0 });
  const userID = useAppSelector((state) => state.commons.userId);
  const [timeBounce, setTimeBounce] = useState<number>(200);
  const [startBounce, setStartBounce] = useState<boolean>(false);
  const [idBounce, setIdBounce] = useState<undefined | NodeJS.Timeout>(
    undefined
  );
  const [anchorElMenuSetting, setAnchorElMenuSetting] =
    useState<null | HTMLElement>(null);
  const openMenu = Boolean(anchorElMenuSetting);
  const [modeOffline, setModeOffline] = useState<ModeColor | undefined>(
    device.mode
  );

  useEffect(() => {
    if (device) {
      setModeOffline(device.mode);
    }
  }, [device]);

  useEffect(() => {
    let unOn: Unsubscribe | undefined;
    if (userID) {
      if (!isOffline) {
        unOn = onValue(
          ref(
            database,
            `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/value`
          ),
          (snapshot: DataSnapshot) => {
            const color: ColorType | undefined = snapshot.val();
            if (color !== undefined) {
              if (
                color.r !== rgba.r ||
                color.g !== rgba.g ||
                color.b !== rgba.b ||
                color.contrast !== rgba.a
              ) {
                if (!blockUpdate) {
                  blockUpdate = true;
                  setHsva(
                    rgbaToHsva({
                      r: color.r,
                      g: color.g,
                      b: color.b,
                      a: Number((color.contrast / 100).toFixed(1)),
                    })
                  );
                  blockUpdate = false;
                }
              }
            }
          }
        );
      }
    }
    return () => {
      if (typeof unOn === "function") {
        unOn();
      }
    };
  }, [userID, isOffline]);

  useEffect(() => {
    if (startBounce) {
      setRgba(hsvaToRgba(hsva));
    }
    return () => {
      if (!startBounce) {
        setStartBounce(true);
      }
    };
  }, [hsva]);

  useEffect(() => {
    if (startBounce) {
      clearTimeout(idBounce);
      setIdBounce(setTimeout(handleValueRgb, timeBounce));
    }
  }, [rgba]);

  async function handleValueRgb() {
    if (userID && !blockUpdate) {
      try {
        const color = {
          r: rgba.r,
          g: rgba.g,
          b: rgba.b,
          contrast: Math.round(rgba.a * 100),
        };

        blockUpdate = true;
        if (!isOffline) {
          await set(
            ref(
              database,
              `user-${userID}/nodes/node-${device.node_id}/devices/device-${device.id}/value`
            ),
            color
          );
        } else {
          if (hostOffline) {
            const response = await fetch(`${hostOffline}/controll`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                uid: userID,
                did: device.id,
                mode: 0,
                value: {
                  r: color.r,
                  g: color.g,
                  b: color.b,
                  a: color.contrast,
                },
              }),
            });
            if (!response.ok) {
              activeSnack({
                message: `Thiết bị không phản hồi.`,
              } as PropsSnack & string);
            }
            // const result = await response.json();
            // console.log(result);
          }
        }
      } catch (error) {
        activeSnack({
          message: `Đã có lỗi gì đó xảy ra khi đổi màu.`,
        } as PropsSnack & string);
        // console.log(error);
      }

      blockUpdate = false;
    }
  }

  const changeColorModeOffline = async () => {
    if (hostOffline) {
      try {
        const color = {
          r: rgba.r,
          g: rgba.g,
          b: rgba.b,
          contrast: Math.round(rgba.a * 100),
        };
        const response = await fetch(`${hostOffline}/controll`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            uid: userID,
            did: device.id,
            mode:
              modeOffline === ModeColor.AUTO
                ? ModeColor.SINGLE
                : ModeColor.AUTO,
            value: {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.contrast,
            },
          }),
        });
        if (response.ok) {
          setModeOffline(
            modeOffline === ModeColor.AUTO ? ModeColor.SINGLE : ModeColor.AUTO
          );
        } else {
          activeSnack({
            message: `Thiết bị không phản hồi.`,
          } as PropsSnack & string);
        }
      } catch (error) {
        activeSnack({
          message: `Đã có lỗi gì đó xảy ra khi chuyển đổi chế độ màu.`,
        } as PropsSnack & string);
      }
    }
    handleCloseMenu();
  };

  const handleCloseMenu = () => {
    setAnchorElMenuSetting(null);
  };

  const handleClickSetting = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElMenuSetting(event.currentTarget);
  };

  return (
    <>
      {isOffline ? (
        <>
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            className="shadow-sm shadow-black"
            anchorEl={anchorElMenuSetting}
            open={openMenu}
            onClose={handleCloseMenu}
          >
            <MenuItem onClick={changeColorModeOffline} disableRipple>
              <AutorenewRoundedIcon />
              đổi chế độ
            </MenuItem>
          </StyledMenu>
          <Box className="flex justify-end">
            <IconButton onClick={handleClickSetting}>
              <MoreHorizIcon />
            </IconButton>
          </Box>
        </>
      ) : null}
      <Box className={`flex flex-nowrap w-full relative`}>
        <Box
          className="flex flex-col items-center"
          sx={{
            "& svg": {
              fill: theme.palette.text.primary,
              filter: `drop-shadow(-1px 1px 2px ${theme.palette.text.primary})`,
            },
          }}
        >
          {device.type in icon
            ? icon[device.type as keyof typeof icon]
            : icon["TOGGLE"]}
          <Box
            className="aspect-square rounded-full w-8 h-8 mt-3"
            sx={{
              backgroundColor: hsvaToHexa(hsva),
              boxShadow: `0px 0px 4px ${hsvaToHexa(hsva)}`,
            }}
          ></Box>
          <Box
            className={`flex-1 my-4 ${
              device.mode === ModeColor.AUTO ||
              (modeOffline === ModeColor.AUTO && isOffline)
                ? "blur-sm pointer-events-none"
                : ""
            }`}
          >
            <Slider
              sx={{
                width: "10px",
              }}
              aria-label="Temperature"
              orientation="vertical"
              getAriaValueText={(val) => `${val}%`}
              valueLabelFormat={(val) => `${val}%`}
              valueLabelDisplay="auto"
              value={hsva.a * 100}
              onChange={(_, newSat) => {
                setHsva({ ...hsva, a: (newSat as number) / 100 });
              }}
            />
          </Box>
        </Box>
        <Box className="flex flex-col flex-1 px-3">
          <Box
            sx={{
              transition: "filter 200ms ease",
            }}
            className={`grid grid-rows-1 gap-6 my-3 ${
              device.mode === ModeColor.AUTO ||
              (modeOffline === ModeColor.AUTO && isOffline)
                ? "blur-sm pointer-events-none"
                : ""
            }`}
          >
            <Wheel
              className="mx-auto"
              color={hsva}
              onChange={(color) => {
                setHsva({ ...hsva, ...color.hsva });
              }}
            />
            {/* <Hue
              radius={16}
              hue={hsva.h}
              onChange={(newHue) => {
                setHsva({ ...hsva, h: Math.round(newHue.h), s: 100, v: 100 });
              }}
            />
            <Alpha
              radius={16}
              hsva={hsva}
              onChange={(newAlpha) => {
                setHsva({ ...hsva, ...newAlpha });
              }}
            /> */}
          </Box>
          <Box
            color={(theme) => theme.palette.text.primary}
            className="grid grid-cols-2"
          >
            <Box className="col-span-1">
              <Typography
                color={(theme) => theme.palette.text.primary}
                variant="subtitle1"
                className=" capitalize"
                gutterBottom
              >
                {device.name || device.id}
              </Typography>
              <Typography
                color={(theme) => theme.palette.text.secondary}
                variant="subtitle1"
                className=""
                gutterBottom
              >
                {device.sub || "chưa có mô tả"}
              </Typography>
            </Box>
            <Box className="col-span-1">
              <Typography gutterBottom variant="subtitle1">
                Chế độ -{" "}
                {device.mode === ModeColor.SINGLE ||
                (modeOffline === ModeColor.SINGLE && isOffline)
                  ? "Đơn sắc"
                  : "Đa sắc"}
              </Typography>
              {isOffline ? (
                <Typography gutterBottom variant="subtitle1">
                  IP: {hostOffline?.split("http://")[1] ?? "NaN"}
                </Typography>
              ) : null}
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default memo(Rgb);
