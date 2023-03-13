import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../index';

import { WidgetType, DeviceType } from '../../components/Widget/type';

export interface NodePayload {
  [key: string]: {
    devices: DeviceType[],
    [key: string]: any,
  }
}

export interface MapNode {
  value: NodePayload,
}

const initialState: MapNode = {
  value: {},
}

export const counterSlice = createSlice({
  name: 'nodes',
  initialState,
  reducers: {
    appendNode: (state, { payload }) => {
      const { nodeId, node } = payload;
      state.value[nodeId] = node;
    },
    setNodes: (state, action) => {
      state.value = action.payload;
    },
    updateDevice: (state, { payload }) => {
      const { nodeId, device } = payload;
      if (nodeId && device) {
        if (state.value[nodeId]?.devices && state.value[nodeId].devices.length > 0) {
          state.value[nodeId].devices.find((dv, index) => {
            if (dv.id === device.id) {
              state.value[nodeId].devices[index] = device;
              return true;
            }
            return false;
          });
        }
      }
    },
    updateValueDevice: (state, { payload }) => {
      const { nodeId, deviceId, value } = payload;

      if (nodeId && deviceId) {
        if (state.value[nodeId]?.devices && state.value[nodeId].devices.length > 0) {
          state.value[nodeId].devices.find((dv, index) => {
            if (dv.id === deviceId) {
              if (state.value[nodeId].devices[index].type === 'LOGIC') {
                state.value[nodeId].devices[index].state = value;
              }
            }
          })
        }
      }
    }
  },
})

// Action creators are generated for each case reducer function
export const { setNodes, updateDevice, updateValueDevice, appendNode } = counterSlice.actions

export const selectCount = (state: RootState) => state.nodes.value

export default counterSlice.reducer;