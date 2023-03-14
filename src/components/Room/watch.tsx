import {
  GetCurrentUserResult,
  User,
  FirebaseAuthentication,
} from "@capacitor-firebase/authentication";
import { getAuth } from "firebase/auth";
import { ref, onChildAdded, onChildRemoved } from "firebase/database";
import { memo, useEffect, useState } from "react";
import { appAuthWeb } from "../../firebase";
import { database } from "../../firebase/db";
import { setNodes, appendNode, NodePayload } from "../../store/slices/nodesSlice";
import { removeRoom, addRoom, updateDeviceRoom, resetDeviceRoom } from "../../store/slices/roomsSlice";

import detechOS from "detectos.js";
import { transferNodes, TransferNodeType } from "../../ConfigGlobal";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { WidgetType, DeviceType } from "../../components/Widget/type";

const OSType = new detechOS();

type Props = {
  children: JSX.Element;
};

const WrapOnNode = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const statusFB = useAppSelector((state) => state.commons.fbConnection);
  const rooms = useAppSelector((state) => state.rooms.value);
  const nodes = useAppSelector((state) => state.nodes.value);
  const [devices, setDevices] = useState<DeviceType[] | []>([]);
  const [idUser, setIDUser] = useState<string | undefined>();

  const parserNode = (key: string, node: NodePayload) => {
    const deviceTemp: any = {};
    const keyNode = key.split("node-")[1] || "";
    deviceTemp["name"] = node?.name || "";
    deviceTemp["sub"] = node?.sub || "";
    deviceTemp["devices"] = [
      ...Object.entries(node.devices).map(
        ([key, field]): DeviceType => ({
          ...(field as DeviceType),
          id: key.slice(7),
          icon: "light",
          node_id: keyNode,
        })
      ),
    ];
    dispatch(appendNode({ nodeId: key, node: deviceTemp }));
  };

  const getDevicesFromNodes = (nodes: NodePayload): DeviceType[] | [] => {
    let devices: DeviceType[] | [] = [];
    Object.entries(nodes).forEach(([key, node]) => {
      if (node.devices.length > 0) {
        devices = [...devices, ...node.devices];
      }
    });
    return devices;
  };

  useEffect(() => {
    if (Object.entries(nodes).length > 0) {
      const devices = getDevicesFromNodes(nodes);
      setDevices(devices);
    }
    return () => {
      setDevices([]);
    }
  }, [nodes]);

  useEffect(() => {
    if(devices.length > 0) {
      devices.forEach(async (device) => {
        if (device.room?.id) {
          await dispatch(updateDeviceRoom({ idRoom: device.room.id, device }));
        }
      });
    }
  }, [devices]);

  useEffect(() => {
    let cbUnOn: any;
    let UnRemove: any;
    let UnAdd: any;
    const getNode = async () => {
      let user: GetCurrentUserResult | User | null;
      let idUser;
      if (OSType.OS === "Android") {
        user = await FirebaseAuthentication.getCurrentUser();
        idUser = user.user?.uid;
      } else if (OSType.OS === "Windows") {
        idUser = getAuth(appAuthWeb).currentUser?.uid;
      }

      if (idUser) {
        const pathListNode = `user-${idUser}/nodes`;
        const roomsRef = ref(database, `user-${idUser}/rooms`);
        const dbRef = ref(database, pathListNode);
        cbUnOn = onChildAdded(dbRef, (snapshot) => {
          const node = snapshot.val();
          const nodeKey = snapshot.key;
          
          if (node && nodeKey) {
            parserNode(nodeKey, node);
          }
        });
        UnAdd = onChildAdded(roomsRef, async (snapshot) => {
          const snapRoom = snapshot.val();
          if (snapRoom) {
            const {
              name,
              sub,
              createAt,
            }: { name: string; sub: string; createAt: number } = snapRoom;
            const idRoom = snapshot.key?.split("room-")[1];
            const rooomExist = rooms.find((room) => room.id === idRoom);
            if (!rooomExist) {
              const unix = createAt ? new Date(createAt) : null;
              const dateParser = unix ? unix.toLocaleDateString("en-US") : "";
              await dispatch(
                addRoom({ id: idRoom, name, sub, createAt: dateParser })
              );
              if (devices.length > 0) {
                devices.forEach(async (device) => {
                  if (device.room?.id === idRoom) {
                    await dispatch(
                      updateDeviceRoom({ idRoom: idRoom, device })
                    );
                  }
                });
              }
            }
          }
        });
        UnRemove = onChildRemoved(roomsRef, async (snapshot) => {
          const idRoom = snapshot.key?.split("room-")[1];
          console.log('room remove');
          
          if (idRoom) {
            await dispatch(removeRoom(idRoom));
          }
        });
      }
      setIDUser(idUser);
    };
    if (statusFB) {
      getNode();
    }
    return () => {
      dispatch(setNodes({}));
      typeof cbUnOn === "function" && cbUnOn();
      typeof UnAdd === "function" && UnAdd();
      typeof UnRemove === "function" && UnRemove();
    };
  }, [statusFB]);

  return children;
};

export default memo(WrapOnNode);
