import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';

interface Map {
  value: {
    [key: string]: {
      devices: DevicesFixType[],
      [key: string]: any,
    }
  }
}

interface DevicesFixType {
  id: string,
  name?: string;
  num?: number;
  pin: number;
  sub?: string;
  value?: any;
  state?: any;
  icon: string;
  type: string;
  uint?: string;
  node_id: string,
}

const initialState: Map = {
  value: {},
}

export const counterSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    setNodes: (state, action) => {
      state.value = action.payload;
    },
    updateDevice: (state, { payload }) => {
      const { nodeId, device } = payload;
      if(nodeId && device) {
        state.value[nodeId].devices.find((dv, index) => {
          if(dv.id === device.id) {
            state.value[nodeId].devices[index] = device;
            return true;
          }
          return false;
        });
      }
    }
  }
})

// Action creators are generated for each case reducer function
export const { setNodes, updateDevice } = counterSlice.actions

export const selectCount = (state: RootState) => state.nodes.value

export default counterSlice.reducer;