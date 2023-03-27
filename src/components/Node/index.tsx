import { memo, useState, useEffect, useCallback } from "react";

import { useTheme } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { styled, alpha } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";

import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import RoomPreferencesRoundedIcon from "@mui/icons-material/RoomPreferencesRounded";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import AccountTreeRoundedIcon from "@mui/icons-material/AccountTreeRounded";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import AlarmOnOutlinedIcon from "@mui/icons-material/AlarmOnOutlined";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import MeetingRoomRoundedIcon from "@mui/icons-material/MeetingRoomRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi"; // import locale
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { getTypeWidget } from '../Widget';

import TimerControllOption from "../Timer/OptionType/Logic";
import TimerView from "../Timer/Widget/index";
import CreateBindingDevice from "../Binding";

import { ref, set, get, child, push, update, onValue } from "firebase/database";
import { database } from "../../firebase/db";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { updateDevice, removeNode } from "../../store/slices/nodesSlice";
import {
  RoomType,
  RoomFirebase,
  removeDeviceRoom,
  updateDeviceRoom,
} from "../../store/slices/roomsSlice";

import { useSnackbar, PropsSnack } from "../../hooks/SnackBar";

import Transition from "../Transition/index";

import { WidgetType } from "../Widget/type";
import { TypeSelect } from "../Timer/OptionType/Logic";
import { DeviceType, NodeType, ModeColor } from "../Widget/type";

interface PropsType {
  devices: DeviceType[] | [];
  node: NodeType;
}

enum EditType {
  NODE = "node",
  DEVICE = "device",
}
interface BoardType {
  name: string | undefined;
  sub: string | undefined;
}
interface InfoEditType {
  type: EditType;
  payload: DeviceType;
}

interface UpdateType {
  [key: string]: any;
}
interface UpdateField {
  key: string;
  value: any;
}

const grids = {
  LOGIC: "col-span-1",
  TRANSFORM: "col-span-2",
  COLOR: "col-span-full",
  PROGRESS: "col-span-1 row-span-2",
  none: "col-span-1",
};

const dbRef = ref(database);

const StyledMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

function Node({ devices, node }: PropsType) {
  const theme = useTheme();
  const [activeSnack, closeSnack] = useSnackbar();
  const dispatch = useAppDispatch();
  const userIDCtx = useAppSelector((state) => state.commons.userId);
  const rooms = useAppSelector((state) => state.rooms.value);
  const [promtRemoveNode, setPromtRemoveNode] = useState<boolean>(false);
  const [nodeOnline, setNodeOnline] = useState<boolean>(false);
  const [pickRoom, setPickRoom] = useState<RoomType | undefined | null>();
  const [roomPresent, setRoomPresent] = useState<RoomFirebase | undefined>();
  const [expand, setExpand] = useState<boolean>(false);
  const [openSettingTimer, setOpenSettingTimer] = useState<boolean>(false);
  const [openSettingbind, setOpenSettingbind] = useState<boolean>(false);
  const [openPickModeColor, setOpenPickModeColor] = useState<boolean>(false);
  const [openListRoom, setOpenListRoom] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [infoEdit, setInfoEdit] = useState<InfoEditType>();
  const [infoSetting, setInfoSetting] = useState<DeviceType>();
  const [board, setBoard] = useState<BoardType>();
  const [selectModeColor, setSelectModeColor] = useState<ModeColor>(
    ModeColor.SINGLE
  );
  const [valueControlTimerLogic, setValueControlTimerLogic] =
    useState<TypeSelect>(TypeSelect.TURN_ON);
  const [anchorElMenuSetting, setAnchorElMenuSetting] =
    useState<null | HTMLElement>(null);
  const [timer, setTimer] = useState<Dayjs | null>(dayjs(Date.now()));
  const [stackTime, setStackTime] = useState<
    Array<{ unix: number; value: any; key: string }> | []
  >([]);
  const openMenu = Boolean(anchorElMenuSetting);

  const handleClickSetting = (
    event: React.MouseEvent<HTMLElement>,
    device: DeviceType
  ) => {
    setAnchorElMenuSetting(event.currentTarget);
    setInfoSetting(device);
  };

  useEffect(() => {
    if (infoSetting && userIDCtx) {
      const run = async () => {
        const room = await (
          await get(
            child(
              dbRef,
              `user-${userIDCtx}/nodes/node-${infoSetting.node_id}/devices/device-${infoSetting.id}/room`
            )
          )
        ).val();
        // console.log(room);

        if (room) {
          setRoomPresent(room);
        }
      };
      run();
    }
  }, [infoSetting, userIDCtx]);

  useEffect(() => {
    const run = () => {
      if (infoSetting?.id && userIDCtx) {
        const pathTimestampNode = `user-${userIDCtx}/nodes/node-${infoSetting.node_id}/devices/device-${infoSetting?.id}/timer`;
        const dbRef = ref(database, pathTimestampNode);
        return onValue(dbRef, (snapshot) => {
          if (snapshot.exists()) {
            setStackTime(() => []);
            snapshot.val() &&
              snapshot.forEach((snapChild) => {
                setStackTime((state) => [
                  ...state,
                  {
                    unix: snapChild.val().unix as number,
                    value: snapChild.val().value,
                    key: snapChild.key as string,
                  },
                ]);
              });
          } else {
            setStackTime(() => []);
          }
        });
      } else {
        return () => {};
      }
    };
    const unSubrice = run();
    if (openSettingTimer) {
      setTimer(dayjs(Date.now()));
    }
    return () => {
      unSubrice();
      setStackTime(() => []);
    };
  }, [infoSetting, openSettingTimer]);

  useEffect(() => {
    const syncTime = async () => {
      if (node.id && userIDCtx) {
        const pathTimestampNode = `user-${userIDCtx}/nodes/node-${node.id}/info/timestamp`;
        const val = await get(child(dbRef, pathTimestampNode));
        const timeDevice = Math.round(new Date().getTime() / 1000);
        if (timeDevice - val.val() > 20) {
          setNodeOnline(false);
        } else {
          setNodeOnline(true);
        }
      }
    };
    syncTime();
    const id = setInterval(syncTime, 5000);
    return () => {
      clearInterval(id);
    };
  }, [userIDCtx]);

  const onChangeControllTimer = useCallback(
    (value: any) => {
      if (infoSetting?.type === WidgetType.LOGIC) {
        setValueControlTimerLogic(value);
      }
    },
    [infoSetting]
  );

  const handleCloseMenu = () => {
    setAnchorElMenuSetting(null);
  };

  const handleClickOpenEdit = () => {
    setOpenEdit(true);
  };

  const handleClickOpenSettingTimer = () => {
    handleCloseMenu();
    setOpenSettingTimer(true);
  };

  const handleClickOpenSettingBind = () => {
    handleCloseMenu();
    setOpenSettingbind(true);
  };

  const handleClickCloseSettingBind = () => {
    setOpenSettingbind(false);
    setInfoSetting(undefined);
  };

  const handleClickCloseSettingTimer = () => {
    setOpenSettingTimer(false);
    setInfoSetting(undefined);
  };

  const handleClose = () => {
    setOpenEdit(false);
    setInfoEdit(undefined);
    setBoard(undefined);
  };

  const activeEditDevice = (device: DeviceType) => {
    setInfoEdit({ type: EditType.DEVICE, payload: device });
    setBoard({ name: device.name || "", sub: device.sub || "" });
    handleClickOpenEdit();
  };

  const changeBoard = (field: string, value: string) => {
    if (board) {
      setBoard({ ...board, [field as keyof BoardType]: value });
    }
  };

  const updateFieldByPath = async (path: string, payload: UpdateField[]) => {
    const updates: UpdateType = {};
    payload.forEach((value) => (updates[`${path}/${value.key}`] = value.value));
    await update(ref(database), updates);
  };

  const updateEdit = async () => {
    setLoadingUpdate(true);
    try {
      if (infoEdit?.type === EditType.DEVICE) {
        if (userIDCtx && infoEdit) {
          const pathRef = `user-${userIDCtx}/nodes/node-${infoEdit.payload.node_id}/devices/device-${infoEdit.payload.id}`;
          const payload: UpdateField[] = [
            { key: "name", value: board?.name },
            { key: "sub", value: board?.sub },
          ];
          await updateFieldByPath(pathRef, payload);
          // update info to redux store
          dispatch(
            updateDevice({
              nodeId: infoEdit.payload.node_id,
              device: { ...infoEdit.payload, ...board },
            })
          );
        } else {
          throw new Error("Missing field to update.");
        }
      } else {
        if (userIDCtx && infoEdit) {
          const pathRef = `user-${userIDCtx}/nodes/node-${infoEdit.payload.node_id}`;
          const payload: UpdateField[] = [
            { key: "name", value: board?.name },
            { key: "sub", value: board?.sub },
          ];
          await updateFieldByPath(pathRef, payload);
          // update info to redux store
        } else {
          throw new Error("Missing field to update.");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setLoadingUpdate(false);
    handleClose();
  };

  const createTimer = useCallback(async () => {
    const dateNow = new Date().getTime() / 1000;
    const datePick = timer?.unix();

    if (dateNow && datePick) {
      if (datePick > dateNow + 60) {
        // validate timepicker must be than one minutes

        if (stackTime.length > 0) {
          if (
            typeof stackTime.find((stack) => stack.unix === datePick) !==
            "undefined"
          ) {
            activeSnack({
              title: "Chú ý",
              message:
                "Bộ hẹn giờ đã tồn tại bạn vui lòng chọn một thời gian khác!",
            } as PropsSnack & string);
            return;
          }
        }

        if (node.id && userIDCtx && infoSetting?.id) {
          try {
            const pathTimestampNode = `user-${userIDCtx}/nodes/node-${infoSetting.node_id}/devices/device-${infoSetting?.id}/timer`;
            const dbRef = ref(database, pathTimestampNode);
            await push(dbRef, {
              unix: datePick,
              value: valueControlTimerLogic,
            });
          } catch (error) {
            activeSnack({
              title: "Lỗi rồi",
              message:
                "Tạo bộ hẹn giờ không thành công, vui lòng tạo lại bạn nhé.",
            } as PropsSnack & string);
          }
          setTimer(dayjs(Date.now()));
        }
      } else {
        // alert error pick other time
        activeSnack({
          title: "Không được rồi",
          message:
            "Bạn vui lòng chọn thời gian lớn hơn thời gian hiện tại 1 phút nhé.",
        } as PropsSnack & string);
      }
    }
  }, [valueControlTimerLogic, timer, stackTime]);

  const onExpand = () => {
    setExpand((state) => !state);
  };

  const openModalPickRooms = () => {
    handleCloseMenu();
    setOpenListRoom(true);
  };

  const closeModalPickRooms = () => {
    setOpenListRoom(false);
    setInfoSetting(undefined);
    setPickRoom(undefined);
  };

  const handleAcceptPickRoom = async () => {
    setLoadingUpdate(true);
    // console.log('Pick room = ', pickRoom);
    // console.log('Node Info = ', infoSetting);
    if (userIDCtx && pickRoom !== undefined && infoSetting) {
      try {
        const buildPath = `user-${userIDCtx}/nodes/node-${infoSetting.node_id}/devices/device-${infoSetting.id}/room`;
        // console.log("🚀 ~ file: index.tsx:521 ~ handleAcceptPickRoom ~ buildPath:", buildPath)
        const dbRef = ref(database, buildPath);
        if (pickRoom === null) {
          await set(dbRef, null);
          if (roomPresent) {
            await dispatch(
              removeDeviceRoom({
                idRoom: roomPresent?.id,
                idDevice: infoSetting.id,
              })
            );
          }
          setRoomPresent(undefined);
        } else {
          const fixRoom = {
            name: pickRoom.name,
            id: pickRoom.id,
            pickAt: Date.now(),
          };
          await set(dbRef, fixRoom);
          if (roomPresent) {
            await dispatch(
              removeDeviceRoom({
                idRoom: roomPresent?.id,
                idDevice: infoSetting.id,
              })
            );
            await dispatch(
              updateDeviceRoom({
                idRoom: fixRoom.id,
                device: devices.find((device) => device.id === infoSetting.id),
              })
            );
          }
          setRoomPresent(fixRoom);
        }
      } catch (error) {
        activeSnack({
          title: "Lỗi rồi",
          message: "Có lỗi xảy ra khi thay đổi phòng vui lòng thử lại.",
        } as PropsSnack & string);
      }
    }
    setLoadingUpdate(false);
    closeModalPickRooms();
  };

  const hanldeOpenPromtRemoveNode = () => {
    setPromtRemoveNode(true);
  };

  const hanldeClosePromtRemoveNode = () => {
    setPromtRemoveNode(false);
  };

  const handleRemoveNode = async () => {
    if (userIDCtx) {
      try {
        await set(
          ref(database, `user-${userIDCtx}/nodes/node-${node.id}`),
          null
        );
        await dispatch(removeNode(node.id));
        activeSnack({
          message: `bạn đã xoá node ${node.name || node.id}.`,
        } as PropsSnack & string);
      } catch (error) {
        activeSnack({
          title: "Lỗi rồi",
          message:
            "Đã có lỗi xảy ra khi xoá node này vui lòng thử lại bạn nhé.",
        } as PropsSnack & string);
      }
    }
    hanldeClosePromtRemoveNode();
  };

  const openModalPickModeColor = () => {
    handleCloseMenu();
    if (infoSetting && infoSetting.mode) {
      setSelectModeColor(infoSetting.mode);
    }
    setOpenPickModeColor(true);
  };

  const closeModalPickModeColor = () => {
    setOpenPickModeColor(false);
    setInfoSetting(undefined);
  };

  const pickModeColor = async () => {
    if (infoSetting && userIDCtx) {
      const mode = infoSetting.mode as ModeColor;
      const nodeId = infoSetting.node_id;
      const deviceId = infoSetting.id;

      if (mode !== selectModeColor) {
        await set(
          ref(
            database,
            `user-${userIDCtx}/nodes/node-${nodeId}/devices/device-${deviceId}/mode`
          ),
          selectModeColor
        );
        dispatch(
          updateDevice({
            nodeId: `node-${nodeId}`,
            device: { ...infoSetting, mode: selectModeColor },
          })
        );
      }
      closeModalPickModeColor();
    }
  };

  return (
    <>
      {/* Accept remove node */}
      <Dialog
        open={promtRemoveNode}
        onClose={hanldeClosePromtRemoveNode}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn muốn xoá phòng?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hành động này của bạn sẽ xoá node "{node.name || node.id}" ra khỏi
            ứng dụng bạn chắc chứ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={hanldeClosePromtRemoveNode}>Huỷ</Button>
          <Button onClick={handleRemoveNode} autoFocus>
            Đồng ý
          </Button>
        </DialogActions>
      </Dialog>
      {/* dialog for pick mode color */}
      <Dialog
        open={openPickModeColor}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModalPickModeColor}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle>
          chọn chế độ màu cho {infoSetting?.id || infoSetting?.name}
        </DialogTitle>
        <DialogContent
          sx={{
            overflow: "hidden",
          }}
        >
          <List
            sx={{
              maxHeight: 400,
              overflowY: "scroll",
            }}
            className="border rounded-md"
          >
            <ListItemButton
              onClick={() => {
                setSelectModeColor(ModeColor.SINGLE);
              }}
              selected={selectModeColor === ModeColor.SINGLE}
            >
              <ListItemIcon>
                <HighlightOffRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Đơn sắc" />
            </ListItemButton>
            <ListItemButton
              onClick={() => {
                setSelectModeColor(ModeColor.AUTO);
              }}
              selected={selectModeColor === ModeColor.AUTO}
            >
              <ListItemIcon>
                <HighlightOffRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Đa sắc" />
            </ListItemButton>
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModalPickModeColor}>Huỷ</Button>
          <Button
            variant="contained"
            endIcon={loadingUpdate ? <CircularProgress size={20} /> : null}
            onClick={pickModeColor}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
      {/* dialog for pick room */}
      <Dialog
        open={openListRoom}
        TransitionComponent={Transition}
        keepMounted
        onClose={closeModalPickRooms}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle>
          chọn phòng {infoSetting?.id || infoSetting?.name}
        </DialogTitle>
        <DialogContent
          sx={{
            overflow: "hidden",
          }}
        >
          <List
            sx={{
              maxHeight: 400,
              overflowY: "scroll",
            }}
            className="border rounded-md"
          >
            <ListItemButton
              selected={
                pickRoom
                  ? false
                  : roomPresent === undefined || pickRoom === null
              }
              onClick={() => {
                setPickRoom(null);
              }}
            >
              <ListItemIcon>
                <HighlightOffRoundedIcon />
              </ListItemIcon>
              <ListItemText primary="Bỏ chọn" />
            </ListItemButton>
            {rooms.map((room) => (
              <ListItemButton
                selected={
                  pickRoom
                    ? pickRoom.id === room.id
                    : pickRoom === null
                    ? false
                    : roomPresent?.id === room.id
                }
                onClick={() => {
                  setPickRoom(room);
                }}
                key={room.id}
              >
                <ListItemIcon>
                  <MeetingRoomRoundedIcon />
                </ListItemIcon>
                <ListItemText primary={room.name} />
              </ListItemButton>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModalPickRooms}>Huỷ</Button>
          <Button
            variant="contained"
            endIcon={loadingUpdate ? <CircularProgress size={20} /> : null}
            onClick={handleAcceptPickRoom}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
      {/* dialog for edit infomation */}
      <Dialog
        open={openEdit}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
      >
        <DialogTitle>
          Chỉnh sửa {infoEdit?.type === EditType.DEVICE ? "thiết bị" : "node"}
        </DialogTitle>
        <DialogContent>
          <Typography
            className="pb-2  whitespace-nowrap overflow-x-scroll"
            variant="subtitle2"
            gutterBottom
          >
            ID: {infoEdit?.payload.id}
          </Typography>
          <Box>
            <Divider textAlign="left">
              <Chip label={"Tên"} />
            </Divider>
            <TextField
              sx={{ paddingY: "0.5rem" }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                changeBoard("name", event.target.value)
              }
              value={board?.name || ""}
              placeholder={board?.name || "thiết bị chưa có tên"}
              fullWidth
              id="standard-name"
              variant="standard"
            />
          </Box>
          <Box>
            <Divider textAlign="left">
              <Chip label={"Mô tả"} />
            </Divider>
            <TextField
              sx={{ paddingY: "0.5rem" }}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                changeBoard("sub", event.target.value)
              }
              value={board?.sub || ""}
              placeholder={board?.sub || "thiết bị chưa có môt tả"}
              fullWidth
              id="standard-sub"
              variant="standard"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button
            endIcon={loadingUpdate ? <CircularProgress size={20} /> : null}
            onClick={updateEdit}
          >
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
      {/* dialog for edit timer */}
      <Dialog
        open={openSettingTimer}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        fullScreen
      >
        <DialogTitle className="flex justify-between">
          <span>
            Hẹn giờ{" "}
            {infoSetting?.name ? `${infoSetting?.name}` : infoSetting?.id}
          </span>
          <IconButton onClick={handleClickCloseSettingTimer} aria-label="close">
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box className="mx-5">
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"vi"}
            >
              <Box>
                <Typography variant="overline" display="block">
                  ngày
                </Typography>
                <DatePicker
                  views={["day"]}
                  value={timer}
                  toolbarTitle="Chọn ngày"
                  disablePast
                  onChange={(newValue) => {
                    setTimer(newValue);
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Box>
              <Box>
                <Typography variant="overline" display="block">
                  giờ
                </Typography>
                <TimePicker
                  toolbarTitle="Thời gian"
                  ampm={true}
                  value={timer}
                  onChange={(newValue) => {
                    setTimer(newValue);
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Box>
            </LocalizationProvider>
            <TimerControllOption
              type={infoSetting?.type}
              onChange={onChangeControllTimer}
            />
            <Box className="flex justify-end my-4">
              <Button
                startIcon={<AddRoundedIcon />}
                onClick={createTimer}
                variant="contained"
              >
                tạo mới
              </Button>
            </Box>
          </Box>
          <div className="">
            {stackTime.length > 0 ? (
              stackTime.map((time, index) => {
                const unix = new Date(time.unix * 1000);
                const timeParser = unix.toLocaleString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                const dateParser = unix.toLocaleString([], {
                  dateStyle: "short",
                });
                return (
                  <TimerView
                    key={time.unix}
                    pathUpdate={
                      infoSetting?.id && openSettingTimer
                        ? `user-${userIDCtx}/nodes/node-${node.id}/devices/device-${infoSetting?.id}/timer/${time.key}`
                        : ""
                    }
                    className={`${index !== 0 ? "mt-3" : ""}`}
                    dateParser={dateParser}
                    timeParser={timeParser}
                    type={infoSetting?.type}
                    value={time.value}
                  />
                );
              })
            ) : (
              <div className=" flex flex-col items-center mt-8">
                <AlarmOnOutlinedIcon style={{ fontSize: "5rem" }} />
                <span className="mt-4">không có bộ hẹn giờ nào được chạy.</span>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={openSettingbind}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        fullScreen
      >
        <DialogTitle className="">
          <div className="flex justify-between items-center pt-5">
            <Typography variant="h5">Ràng buộc điều khiển</Typography>
            <IconButton
              onClick={handleClickCloseSettingBind}
              aria-label="close"
            >
              <CloseRoundedIcon />
            </IconButton>
          </div>
          <Typography className="pt-2">
            <span className="font-semibold">Thiết bị áp dụng:</span>
            {infoSetting?.name
              ? ` ${infoSetting?.name}`
              : ` ${infoSetting?.id}`}
          </Typography>
        </DialogTitle>
        <DialogContent>
          {infoSetting ? (
            <CreateBindingDevice
              id={infoSetting.id}
              name={infoSetting.name}
              type={infoSetting.type}
            />
          ) : null}
        </DialogContent>
      </Dialog>

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
        <MenuItem
          disabled={infoSetting?.type !== WidgetType.LOGIC}
          onClick={handleClickOpenSettingTimer}
          disableRipple
        >
          <AvTimerIcon />
          Hẹn giờ
        </MenuItem>
        {/* <Divider sx={{ my: 0.5 }} /> */}
        <MenuItem
          disabled={infoSetting?.type !== WidgetType.LOGIC}
          onClick={handleClickOpenSettingBind}
          disableRipple
        >
          <AccountTreeRoundedIcon />
          Ràng buộc
        </MenuItem>
        <MenuItem onClick={openModalPickRooms} disableRipple>
          <RoomPreferencesRoundedIcon />
          chọn phòng
        </MenuItem>
        {infoSetting?.type === WidgetType.COLOR ? (
          <MenuItem onClick={openModalPickModeColor} disableRipple>
            <RoomPreferencesRoundedIcon />
            chọn chế độ
          </MenuItem>
        ) : null}
      </StyledMenu>

      <Box className="grid grid-cols-2 col-span-full flex-nowrap items-center">
        <Typography
          color={(theme) => theme.palette.text.primary}
          className="col-span-1 pt-4 whitespace-nowrap overflow-x-scroll"
          variant="h6"
          gutterBottom
        >
          {node.name || node.id}
        </Typography>
        <Box className="ml-5 flex flex-nowrap items-center justify-end">
          {/* <span
            className={`px-2 py-1 text-xs border-[1px]  rounded-full ${
              nodeOnline
                ? "border-green-500 text-green-500"
                : "border-slate-500 "
            }`}
          >
            {nodeOnline ? "online" : "offline"}
          </span> */}
          <IconButton aria-label="edit">
            <EditIcon />
          </IconButton>
          <IconButton aria-label="setting">
            <SettingsIcon />
          </IconButton>
          <IconButton onClick={hanldeOpenPromtRemoveNode} aria-label="remove">
            <DeleteRoundedIcon />
          </IconButton>
          <IconButton onClick={onExpand} aria-label="expand">
            {expand ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
          </IconButton>
        </Box>
      </Box>
      <Box className={`col-span-2 grid grid-cols-2 gap-2`}>
        {devices.map((device, index) =>
          device.type === WidgetType.LOGIC ? (
            <Fade in={true} timeout={{ enter: 500 * (index + 1) }} key={index}>
              <div>
                <Box
                  sx={{
                    marginTop: `${expand ? 40 : 0}px`,
                    transition: "margin 200ms ease-in-out",
                  }}
                  bgcolor={(theme) => theme.palette.background.paper}
                  className={`flex h-24 flex-nowrap ${
                    device.type in grids
                      ? grids[device.type as keyof typeof grids]
                      : grids["none"]
                  } ${
                    device.type === WidgetType.LOGIC
                      ? `col-start-${index + 1} col-end-${index + 2}`
                      : ""
                  } relative col-auto p-3 rounded-2xl shadow-sm shadow-gray-900 z-20`}
                >
                  <div
                    style={{
                      opacity: expand ? 1 : 0,
                      pointerEvents: expand ? "unset" : "none",
                    }}
                    className="absolute w-full right-0 -top-[40px] transition-opacity flex flex-nowrap"
                  >
                    <IconButton
                      onClick={(event: React.MouseEvent<HTMLElement>) =>
                        handleClickSetting(event, device)
                      }
                      style={{ fontSize: "0.9rem" }}
                      size={"small"}
                      aria-label="setting"
                    >
                      Cài đặt <SettingsIcon className="ml-1" />
                    </IconButton>
                    <IconButton
                      onClick={() => activeEditDevice(device)}
                      style={{ fontSize: "0.9rem" }}
                      size={"small"}
                      aria-label="edit"
                    >
                      Chỉnh sửa <EditIcon className="ml-1" />
                    </IconButton>
                  </div>
                  {getTypeWidget(device, userIDCtx)}
                </Box>
              </div>
            </Fade>
          ) : (
            <Box key={index} className="col-span-2 grid grid-cols-2 relative">
              <Box
                className="absolute w-full transition-opacity"
                style={{ opacity: expand ? 1 : 0 }}
              >
                <Box className="flex">
                  <Box
                    className={`flex-1 border-t-2 border-l-2 rounded-tl-lg mr-4 ml-10 translate-y-1/2 border-[${theme.palette.text.primary}]`}
                  ></Box>
                  <Box className="flex flex-nowrap">
                    <IconButton
                      onClick={(event: React.MouseEvent<HTMLElement>) =>
                        handleClickSetting(event, device)
                      }
                      size={"small"}
                      aria-label="setting"
                    >
                      Cài đặt <SettingsIcon className="ml-1" />
                    </IconButton>
                    <IconButton
                      onClick={() => activeEditDevice(device)}
                      size={"small"}
                      aria-label="edit"
                    >
                      Chỉnh sửa <EditIcon className="ml-1" />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
              <Box
                style={{
                  marginTop: expand ? 40 : 0,
                  transition: "margin 200ms ease-in-out",
                }}
                bgcolor={(theme) => theme.palette.background.paper}
                className={`flex flex-nowrap col-span-2 p-3 rounded-2xl shadow-sm relative shadow-gray-900 z-20`}
              >
                {getTypeWidget(device, userIDCtx)}
              </Box>
            </Box>
          )
        )}
      </Box>
    </>
  );
}

export default memo(Node);
