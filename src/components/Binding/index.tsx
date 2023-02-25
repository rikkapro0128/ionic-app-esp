import { memo, useEffect, useState } from "react";

import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import ControlCameraRoundedIcon from "@mui/icons-material/ControlCameraRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import GpsFixedRoundedIcon from "@mui/icons-material/GpsFixedRounded";
import HighlightOffRoundedIcon from "@mui/icons-material/HighlightOffRounded";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

import { WidgetType } from "../Widget/type";

import WrapCondition from "../Binding/Condition";
import WrapExcute from "../Binding/Execute";

import { useAppSelector } from "../../store/hooks";
import { MapNode } from "../../store/slices/nodesSlice";
import { DeviceType } from "../Widget/type";

export interface PropsType {
  id: string;
  name?: string;
  type: WidgetType;
}

const filterDevice = async ({ value }: MapNode): Promise<Array<DeviceType>> => {
  const devices: Array<DeviceType> = [];
  return new Promise((res) => {
    const nodes = Object.entries(value);
    if (nodes.length > 0) {
      nodes.forEach(([key, value], indexNode, arrNode) => {
        if (value.devices.length > 0) {
          value.devices.forEach((value, indexDevice, arrDevice) => {
            devices.push(value);
            if (
              indexNode === arrNode.length - 1 &&
              indexDevice === arrDevice.length - 1
            ) {
              res(devices);
            }
          });
        } else if (indexNode === arrNode.length - 1) {
          res(devices);
        }
      });
    } else {
      res(devices);
    }
  });
};

const CreateBinding = ({ id, name, type }: PropsType) => {
  const nodes = useAppSelector((state) => state.nodes);
  const [devices, setDevices] = useState<Array<DeviceType> | null>(null);
  const [controllDevice, setControllDevice] = useState<DeviceType | null>(null);
  const [openListControll, setOpenListControll] = useState<boolean>(false);

  useEffect(() => {
    const run = async () => {
      const devices = await filterDevice(nodes);
      setDevices(devices);
    };
    run();
  }, [nodes]);

  const handleCloseViewListControll = () => {
    setOpenListControll(false);
  };

  const handleOpenViewListControll = (
    event: React.MouseEvent<HTMLDivElement>
  ) => {
    setOpenListControll(true);
  };

  const pickControllDevice = (device: DeviceType | null) => {
    setControllDevice(device);
  };

  return (
    <>
      <Dialog
        open={openListControll}
        onClose={handleCloseViewListControll}
        aria-labelledby="alert-dialog-wifi-title"
        aria-describedby="alert-dialog-wifi-description"
        fullWidth
      >
        <DialogTitle id="alert-dialog--title">Thiết bị bạn chọn?</DialogTitle>
        <DialogContent>
          <List
            className="border rounded-md"
            sx={{
              maxHeight: 400,
            }}
          >
            <ListItem
              onClick={() => {
                pickControllDevice(null);
              }}
              disablePadding
            >
              <ListItemButton selected={controllDevice === null}>
                <ListItemIcon>
                  <HighlightOffRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Bỏ chọn" />
              </ListItemButton>
            </ListItem>
            {devices && devices.length > 0 ? (
              devices.map((device) => device.id === id ? null : (
                <ListItem
                  onClick={() => {
                    pickControllDevice(device);
                  }}
                  key={device.id}
                  disablePadding
                >
                  <ListItemButton selected={controllDevice?.id === device.id}>
                    <ListItemIcon>
                      <GpsFixedRoundedIcon />
                    </ListItemIcon>
                    <ListItemText primary={device.name || device.id} />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Typography
                variant="subtitle1"
                className="uppercase flex items-center"
              >
                Điều kiện
                <TaskAltRoundedIcon className="ml-1" />
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewListControll}>lưu lựa chọn</Button>
        </DialogActions>
      </Dialog>
      <div>
        <div className="mt-4">
          <Typography
            variant="subtitle1"
            className="uppercase flex items-center"
          >
            Điều kiện
            <TaskAltRoundedIcon className="ml-1" />
          </Typography>
          <Stack spacing={2} direction="column" className="mt-2">
            <Stack direction="row" spacing={1} className="flex w-full">
              <Chip label="Nếu Thiết bị" />
              <Chip
                variant="outlined"
                label={<Typography>{name || id}</Typography>}
                className="mx-2 whitespace-nowrap flex-1"
              />
            </Stack>
            <Stack direction="row" spacing={1} className="w-full">
              <Chip className="flex-1" label="Đang" />
              <Chip variant="outlined" label={<WrapCondition type={type} />} />
            </Stack>
          </Stack>
        </div>
        <div className="mt-8">
          <Typography
            variant="subtitle1"
            className="uppercase flex items-center"
          >
            Điều khiển
            <ControlCameraRoundedIcon className="ml-1" />
          </Typography>
          <Stack spacing={2} direction="column" className="mt-2">
            <Stack direction="row" spacing={1} className="flex w-full">
              <Chip label="Chọn thiết bị" />
              <Chip
                variant="outlined"
                label={
                  <Typography>
                    {controllDevice
                      ? controllDevice.name || controllDevice.id
                      : "chưa chọn."}
                  </Typography>
                }
                className="mx-2 whitespace-nowrap flex-1"
                onClick={handleOpenViewListControll}
              />
            </Stack>
            <Stack direction="row" spacing={1} className="flex w-full">
              <Chip className="flex-1" label="Trạng thái" />
              <Chip
                variant="outlined"
                label={
                  controllDevice ? (
                    <WrapCondition type={controllDevice.type} />
                  ) : (
                    <span>sẽ không xảy ra.</span>
                  )
                }
              />
            </Stack>
          </Stack>
        </div>
        <div className="flex justify-end pt-5">
          <Button disabled={ controllDevice === null } startIcon={<AddCircleOutlineRoundedIcon />} variant="contained">Tạo ràng buộc</Button>
        </div>
      </div>
    </>
  );
};

export default memo(CreateBinding);
