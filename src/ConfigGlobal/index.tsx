

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { getAuth } from "firebase/auth";

import { appAuthWeb } from "../firebase";

import detechOS from "detectos.js";
import { onChildAdded, ref } from "firebase/database";
import { database } from "../firebase/db";

import { WidgetType, DeviceType } from "../components/Widget/type";

export enum ColorMode {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface Map {
  [key: string]: any;
}
export interface TransferNodeType {
  nodes: {
    [node: string]: {
      type: WidgetType;
      value: any;
    };
  };
}

const OSType = new detechOS();

export const routes = {
  afterAuthSuccess: '/devices',
  afterAuthFailure: '/sign',
}

export const getUserIDByPlaform = async () => {
  let userId: string | undefined;
  if (OSType.OS === "Android") {
    userId = await (
      await FirebaseAuthentication.getCurrentUser()
    ).user?.uid;
  } else if (OSType.OS === "Windows") {
    const auth = getAuth(appAuthWeb);
    userId = auth.currentUser?.uid;
  }
  return userId;
}

export const transferNodes = (nodes: TransferNodeType) => {
  let deviceTemp: Map = {};
  Object.entries(nodes).forEach(([key, field]) => {
    // console.log(field);
    if (field.devices) {
      const keyNode = key.split("node-")[1] || "";
      deviceTemp[keyNode as keyof Map] = {};
      deviceTemp[keyNode].name = field?.name;
      deviceTemp[keyNode].sub = field?.sub;
      deviceTemp[keyNode].devices = [
        ...Object.entries(field.devices).map(
          ([key, field]): DeviceType => ({
            ...(field as DeviceType),
            id: key.slice(7),
            icon: "light",
            node_id: keyNode,
          })
        ),
      ];
    } else {
      return false;
    }
  });
  return deviceTemp;
};
