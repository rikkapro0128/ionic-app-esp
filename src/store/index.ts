import { configureStore } from '@reduxjs/toolkit';
import nodesSlice from './slices/nodesSlice';

const store = configureStore({
  reducer: {
    nodes: nodesSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

export default store;
