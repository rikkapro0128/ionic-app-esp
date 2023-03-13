import { createSlice } from '@reduxjs/toolkit';

import { ref, onValue } from 'firebase/database';

import { database } from '../../firebase/db';

import { getUserIDByPlaform } from '../../ConfigGlobal';

import { WidgetType, DeviceType } from '../../components/Widget/type';

export interface RoomType {
  name: string,
  sub?: string,
  id: string,
  devicesOwn?: Array<DeviceType>,
  createAt?: string,
}

interface RoomsType {
  value: RoomType[] | [],
  loading: boolean,
  error: string,
}

const initialState: RoomsType = {
  loading: false,
  error: '',
  value: [],
}

export const roomsSlice = createSlice({
  name: 'rooms',
  initialState,
  reducers: {
    setRooms: (state: RoomsType, action) => {
      state.value = action.payload;
    },
    addRoom: (state: RoomsType, action) => {
      state.value = [...state.value, action.payload]
    },
    updateDeviceRoom: (state: RoomsType, action) => {
      const { idRoom, device } = action.payload;
      const indexRoom = state.value.findIndex(room => room.id === idRoom);
      if(indexRoom >= 0) {
        if(typeof state.value[indexRoom].devicesOwn === 'undefined') {
          state.value[indexRoom].devicesOwn = [];
        }
        state.value[indexRoom].devicesOwn?.push(device);
      }
    },
    removeRoom: (state: RoomsType, action) => {
      state.value = state.value.filter(room => room.id !== action.payload);
    },
  },
})

// Action creators are generated for each case reducer function
export const { setRooms, addRoom, removeRoom, updateDeviceRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
