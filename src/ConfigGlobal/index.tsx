

import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { getAuth } from "firebase/auth";

import { appAuthWeb } from "../firebase";

import detechOS from "detectos.js";

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
