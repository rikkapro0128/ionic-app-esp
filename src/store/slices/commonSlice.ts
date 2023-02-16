import { createSlice } from '@reduxjs/toolkit';

interface CommonType {
  fbConnection: boolean,
}

const initialState: CommonType = {
  fbConnection: false
}

export const commonSlice = createSlice({
  name: 'commons',
  initialState,
  reducers: {
    setFbConnection: (state: CommonType, action) => {
      state.fbConnection = action.payload;
    },
  }
})

// Action creators are generated for each case reducer function
export const { setFbConnection } = commonSlice.actions

export default commonSlice.reducer;
