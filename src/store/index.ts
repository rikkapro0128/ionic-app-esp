import { configureStore } from '@reduxjs/toolkit';
import nodesSlice from './slices/nodesSlice';
import commonSlice from './slices/commonSlice';
import roomsSlice from './slices/roomsSlice';

const store = configureStore({
  reducer: {
    nodes: nodesSlice,
    commons: commonSlice,
    rooms: roomsSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
