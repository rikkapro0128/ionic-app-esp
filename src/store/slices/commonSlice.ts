import { createSlice } from '@reduxjs/toolkit';

import { ColorMode } from '../../ConfigGlobal';

import { GetCurrentUserResult } from '@capacitor-firebase/authentication';
import { User } from "firebase/auth";

export interface GeneralUser extends User, GetCurrentUserResult {}

interface CommonType {
  fbConnection: boolean,
  userId: string | undefined,
  colorMode: ColorMode,
  infoUser: GeneralUser | null,
}

interface ActionSetUserId {
  payload: {
    userId: string | undefined,
  },
  type: string,
}

interface ActionSetUserInfo {
  payload: {
    info: GeneralUser | null,
  },
  type: string,
}

const initialState: CommonType = {
  fbConnection: true,
  userId: undefined,
  infoUser: null,
  colorMode: localStorage.getItem('color-mode') as ColorMode ?? ColorMode.LIGHT,
}

export const commonSlice = createSlice({
  name: 'commons',
  initialState,
  reducers: {
    setInfoUser: (state: CommonType, action: ActionSetUserInfo) => {
      const { info } = action.payload;
      state.infoUser = info;
    },
    clearInfoUser: (state: CommonType, action) => {
      state.infoUser = null;
    },
    setUserID: (state: CommonType, action: ActionSetUserId) => {
      const { userId } = action.payload;
      state.userId = userId;
    },
    setFbConnection: (state: CommonType, action) => {
      state.fbConnection = action.payload;
    },
    setColorMode: (state: CommonType, action) => {
      state.colorMode = action.payload;
    },
    toggleColorMode: (state: CommonType, action) => {
      if(state.colorMode === ColorMode.DARK) {
        state.colorMode = ColorMode.LIGHT;
        localStorage.setItem('color-mode', ColorMode.LIGHT);
      }else {
        state.colorMode = ColorMode.DARK;
        localStorage.setItem('color-mode', ColorMode.DARK);
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { setFbConnection, setColorMode, toggleColorMode, setUserID, setInfoUser, clearInfoUser } = commonSlice.actions

export default commonSlice.reducer;
