import { createSlice } from '@reduxjs/toolkit';

import { ref, onValue } from 'firebase/database';

import { database } from '../../firebase/db';

import { getUserIDByPlaform } from '../../ConfigGlobal';

export interface RoomType {
  name: string,
  sub?: string,
  id: string,
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
    removeRoom: (state: RoomsType, action) => {
      state.value = state.value.filter(room => room.id !== action.payload);
    },
  },
})

// Action creators are generated for each case reducer function
export const { setRooms, addRoom, removeRoom } = roomsSlice.actions;

export default roomsSlice.reducer;
