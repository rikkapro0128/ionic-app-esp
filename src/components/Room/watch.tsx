import {
  GetCurrentUserResult,
  User,
  FirebaseAuthentication,
} from "@capacitor-firebase/authentication";
import { getAuth } from "firebase/auth";
import { ref, onChildAdded } from "firebase/database";
import { memo, useEffect, useState } from "react";
import { appAuthWeb } from "../../firebase";
import { database } from "../../firebase/db";
import { setNodes, appendNode } from "../../store/slices/nodesSlice";

import detechOS from "detectos.js";
import { transferNodes, TransferNodeType } from "../../ConfigGlobal";

import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { WidgetType, DeviceType } from "../../components/Widget/type";

const OSType = new detechOS();

type Props = {
  children: JSX.Element;
};

interface NodePayload {
  devices: {
    [key: string]: {
      room?: any,
      type: string,
    }
  },
  [key: string]: any,
}

const WrapOnNode = ({ children }: Props) => {
  const dispatch = useAppDispatch();
  const statusFB = useAppSelector((state) => state.commons.fbConnection);
  const nodes = useAppSelector((state) => state.nodes.value);
  const [idUser, setIDUser] = useState<string | undefined>();

  const parserNode = (key: string, node: NodePayload) => {
    const deviceTemp: any = {};
    const keyNode = key.split("node-")[1] || "";
    deviceTemp['name'] = node?.name || '';
    deviceTemp['sub'] = node?.sub || '';
    deviceTemp['devices'] = [
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

  useEffect(() => {
    let cbUnOn: any;
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
        const dbRef = ref(database, pathListNode);
        cbUnOn = onChildAdded(dbRef, (snapshot) => {
          const node = snapshot.val();
          const nodeKey = snapshot.key;
          if (node && nodeKey) {
            parserNode(nodeKey, node);
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
    };
  }, [statusFB]);

  return children;
};

export default memo(WrapOnNode);
