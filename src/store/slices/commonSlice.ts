import { createSlice } from '@reduxjs/toolkit';

import { ColorMode } from '../../ConfigGlobal';

interface CommonType {
  fbConnection: boolean,
  colorMode: ColorMode,
}

const initialState: CommonType = {
  fbConnection: true,
  colorMode: localStorage.getItem('color-mode') as ColorMode ?? ColorMode.LIGHT,
}

export const commonSlice = createSlice({
  name: 'commons',
  initialState,
  reducers: {
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
export const { setFbConnection, setColorMode, toggleColorMode } = commonSlice.actions

export default commonSlice.reducer;
