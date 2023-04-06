import { createSlice } from '@reduxjs/toolkit';

import { DeviceType } from '../../components/Widget/type';

export interface RoomFirebase {
  id: string,
  name: string,
  pickAt: number,
}

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
      const indexRoom = state.value.findIndex(room => room.id === action.payload.id);
      if(indexRoom >= 0) {
        state.value[indexRoom] = action.payload;
      }else {
        state.value = [...state.value, action.payload]
      }
    },
    updateDeviceRoom: (state: RoomsType, action) => {
      const { idRoom, device }: { idRoom: string, device: DeviceType } = action.payload;
      // console.log('update => ', idRoom, device);

      const indexRoom = state.value.findIndex(room => room.id === idRoom);
      if (indexRoom >= 0) {
        if (typeof state.value[indexRoom].devicesOwn === 'undefined') {
          state.value[indexRoom].devicesOwn = [];
        }
        state.value[indexRoom].devicesOwn = state.value[indexRoom].devicesOwn?.filter(dv => dv.id !== device.id) as DeviceType[];
        state.value[indexRoom].devicesOwn?.push(device);
      }
    },
    removeDeviceRoom: (state: RoomsType, action) => {
      const { idRoom, idDevice }: { idRoom: string, idDevice: string } = action.payload;
      // console.log('remove => ', idRoom, idDevice);
      const indexRoom = state.value.findIndex(room => room.id === idRoom);
      
      if (indexRoom >= 0) {
        const filterDevice = state.value[indexRoom].devicesOwn?.filter(dv => dv.id !== idDevice) || [];
        state.value[indexRoom].devicesOwn = filterDevice;
      }
    },
    resetDeviceRoom: (state: RoomsType, action) => {
      state.value.forEach((room, index) => {
        state.value[index].devicesOwn = [];
      })
    },
    removeRoom: (state: RoomsType, action) => {
      state.value = state.value.filter(room => room.id !== action.payload);
    },
  },
})

// Action creators are generated for each case reducer function
export const { setRooms, addRoom, removeRoom, updateDeviceRoom, removeDeviceRoom, resetDeviceRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
