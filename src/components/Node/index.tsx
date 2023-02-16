import { memo, useState, useEffect, forwardRef } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Grow from "@mui/material/Grow";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { styled, alpha } from "@mui/material/styles";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import DialogTitle from "@mui/material/DialogTitle";
import Divider from "@mui/material/Divider";
import CircularProgress from "@mui/material/CircularProgress";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";

import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import AvTimerIcon from "@mui/icons-material/AvTimer";
import SettingsIcon from "@mui/icons-material/Settings";
import EditIcon from "@mui/icons-material/Edit";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import AddRoundedIcon from "@mui/icons-material/AddRounded";

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/vi"; // import locale
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import WidgetToggle from "../Widget/Toggle";
import WidgetProgress from "../Widget/Progress";
import WidgetSlider from "../Widget/Slider";
import WidgetColor from "../Widget/Rgb";
import WidgetNotFound from "../Widget/NotFound";

import { ref, get, set, child, push, update } from "firebase/database";
import { database } from "../../firebase/db";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { setNodes, updateDevice } from "../../store/slices/nodesSlice";

interface DevicesFixType {
  id: string;
  name?: string;
  num?: number;
  pin: number;
  sub?: string;
  value?: any;
  state?: any;
  icon: string;
  type: string;
  uint?: string;
  node_id: string;
}

interface PropsType {
  devices: DevicesFixType[] | [];
  node: NodeType;
  idUser: string | undefined;
}

interface NodeType {
  id: string;
  name: string;
  sub: string;
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
  payload: DevicesFixType;
}

interface UpdateType {
  [key: string]: any;
}
interface UpdateField {
  key: string;
  value: any;
}

enum WidgetType {
  LOGIC = "LOGIC",
  COLOR = "COLOR",
  TRANSFORM = "TRANSFORM",
}

const grids = {
  LOGIC: "col-span-1",
  TRANSFORM: "col-span-2",
  COLOR: "col-span-2",
  PROGRESS: "col-span-1 row-span-2",
  none: "col-span-1",
};

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

const getTypeWidget = (device: DevicesFixType, idUser: string | undefined) => {
  if (device.type === WidgetType.LOGIC) {
    return <WidgetToggle device={device} idUser={idUser} />;
  }
  // else if (device.type === "progress") {
  //   return <WidgetProgress device={device} idUser={idUser} />;
  // }
  else if (device.type === WidgetType.TRANSFORM) {
    return <WidgetSlider device={device} idUser={idUser} />;
  } else if (device.type === WidgetType.COLOR) {
    return <WidgetColor device={device} idUser={idUser} />;
  } else {
    return <WidgetNotFound />;
  }
};

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Node({ devices, node, idUser }: PropsType) {
  const dispatch = useAppDispatch();
  const [nodeOnline, setNodeOnline] = useState<boolean>(false);
  const [expand, setExpand] = useState<boolean>(false);
  const [openSettingTimer, setOpenSettingTimer] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);
  const [infoEdit, setInfoEdit] = useState<InfoEditType>();
  const [infoSetting, setInfoSetting] = useState<DevicesFixType>();
  const [board, setBoard] = useState<BoardType>();
  const [anchorElMenuSetting, setAnchorElMenuSetting] =
    useState<null | HTMLElement>(null);
  const [timer, setTimer] = useState<Dayjs | null>(dayjs(Date.now()));
  const openMenu = Boolean(anchorElMenuSetting);

  const handleClickSetting = (
    event: React.MouseEvent<HTMLElement>,
    device: DevicesFixType
  ) => {
    setAnchorElMenuSetting(event.currentTarget);
    setInfoSetting(device);
  };

  useEffect(() => {
    const syncTime = async () => {
      if(node.id && idUser) {
        const dbRef = ref(database);
        const pathTimestampNode = `user-${idUser}/nodes/node-${node.id}/info/timestamp`;
        const val = await get(child(dbRef, pathTimestampNode));
        const timeDevice = Math.round(new Date().getTime() / 1000);
        if(timeDevice - val.val() > 20) {
          setNodeOnline(false);
        }else {
          setNodeOnline(true);
        }
      }
    }
    syncTime();
    const id = setInterval(syncTime, 5000);
    return () => {
      clearInterval(id);
    }
  }, [])

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

  const handleClickCloseSettingTimer = () => {
    setOpenSettingTimer(false);
    setInfoSetting(undefined);
  };

  const handleClose = () => {
    setOpenEdit(false);
    setInfoEdit(undefined);
    setBoard(undefined);
  };

  const activeEditDevice = (device: DevicesFixType) => {
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
        if (idUser && infoEdit) {
          const pathRef = `user-${idUser}/nodes/node-${infoEdit.payload.node_id}/devices/device-${infoEdit.payload.id}`;
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
        if (idUser && infoEdit) {
          const pathRef = `user-${idUser}/nodes/node-${infoEdit.payload.node_id}`;
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

  const createTimer = () => {
    console.log(timer);
  };

  return (
    <>
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
            className="pb-2 text-slate-700 whitespace-nowrap overflow-x-scroll"
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
      {/* dialog for edit infomation */}
      <Dialog
        open={openSettingTimer}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClickCloseSettingTimer}
        aria-describedby="alert-dialog-slide-description"
        fullWidth
        fullScreen
      >
        <DialogTitle className="flex justify-between">
          <span>
            Hẹn giờ{" "}
            {infoSetting?.name ? `"${infoSetting?.name}"` : infoSetting?.id}
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
                  // displayStaticWrapperAs="mobile"
                  value={timer}
                  onChange={(newValue) => {
                    setTimer(newValue);
                  }}
                  renderInput={(params) => <TextField fullWidth {...params} />}
                />
              </Box>
            </LocalizationProvider>
            <Divider sx={{ my: "1rem" }} />
            <Box className="flex justify-end">
              <Button
                startIcon={<AddRoundedIcon />}
                onClick={createTimer}
                variant="contained"
              >
                tạo mới
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorElMenuSetting}
        open={openMenu}
        onClose={handleCloseMenu}
      >
        <MenuItem onClick={handleClickOpenSettingTimer} disableRipple>
          <AvTimerIcon />
          Hẹn giờ
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem disableRipple>
          <AvTimerIcon />
          Ràng buộc
        </MenuItem>
      </StyledMenu>

      <Box className="grid grid-cols-2 col-span-full flex-nowrap items-center">
        <Typography
          className="col-span-1 text-slate-700 pt-4 whitespace-nowrap overflow-x-scroll"
          variant="h6"
          gutterBottom
        >
          {node.name || node.id}
        </Typography>
        <Box className="ml-5 flex flex-nowrap justify-between items-center">
          <span
            className={`px-2 py-1 text-xs border-[1px]  rounded-full ${
              nodeOnline
                ? "border-green-500 text-green-500"
                : "border-slate-500 text-slate-700"
            }`}
          >
            {nodeOnline ? "online" : "offline"}
          </span>
          <div>
            <IconButton aria-label="edit">
              <EditIcon />
            </IconButton>
            <IconButton aria-label="setting">
              <SettingsIcon />
            </IconButton>
            <IconButton
              onClick={() => {
                setExpand((state) => !state);
              }}
              aria-label="expand"
            >
              {expand ? <UnfoldLessIcon /> : <UnfoldMoreIcon />}
            </IconButton>
          </div>
        </Box>
      </Box>
      <Box className={`col-span-2 grid grid-cols-2 gap-2`}>
        {devices.map((device, index) =>
          device.type === WidgetType.LOGIC ? (
            <Box
            key={index}
              style={{
                marginTop: expand ? 40 : 0,
                transition: "margin 200ms ease-in-out",
              }}
              className={`flex flex-nowrap ${
                device.type in grids
                  ? grids[device.type as keyof typeof grids]
                  : grids["none"]
              } ${
                device.type === WidgetType.LOGIC
                  ? `col-start-${index + 1} col-end-${index + 2}`
                  : ""
              } relative col-auto p-3 rounded-2xl border-indigo-600 border-2 shadow-md z-20 bg-[#edf1f5]`}
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
                  style={{ fontSize: '0.9rem' }}
                  size={"small"}
                  aria-label="setting"
                >
                  Cài đặt <SettingsIcon className="ml-1" />
                </IconButton>
                <IconButton
                  onClick={() => activeEditDevice(device)}
                  style={{ fontSize: '0.9rem' }}
                  size={"small"}
                  aria-label="edit"
                >
                  Chỉnh sửa <EditIcon className="ml-1" />
                </IconButton>
              </div>
              {getTypeWidget(device, idUser)}
            </Box>
          ) : (
            <Box key={index} className="col-span-2 grid grid-cols-2 relative">
              <div
                className="absolute w-full transition-opacity"
                style={{ opacity: expand ? 1 : 0 }}
              >
                <Box className="flex">
                  <Box className="flex-1 border-indigo-700 border-t-2 border-l-2 rounded-tl-lg mr-4 ml-10 translate-y-1/2"></Box>
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
              </div>
              <Box
                style={{
                  marginTop: expand ? 40 : 0,
                  transition: "margin 200ms ease-in-out",
                }}
                className={`flex flex-nowrap ${
                  device.type in grids
                    ? grids[device.type as keyof typeof grids]
                    : grids["none"]
                } col-auto p-3 rounded-2xl border-indigo-600 border-2 shadow-md relative z-20 bg-[#edf1f5]`}
              >
                {getTypeWidget(device, idUser)}
              </Box>
            </Box>
          )
        )}
      </Box>
    </>
  );
}

export default memo(Node);
