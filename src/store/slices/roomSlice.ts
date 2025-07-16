import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RoomState, MediaSettings } from '@/types';

const initialState: RoomState = {
  isConnected: false,
  roomName: null,
  participants: [],
  quality: {
    connectionQuality: 'good',
    latency: 0,
    bandwidth: 0,
  },
  error: null,
};

const roomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {
    connectStart: (state, action: PayloadAction<string>) => {
      state.roomName = action.payload;
      state.error = null;
    },
    connectSuccess: (state) => {
      state.isConnected = true;
      state.error = null;
    },
    connectFailure: (state, action: PayloadAction<string>) => {
      state.isConnected = false;
      state.error = action.payload;
    },
    disconnect: (state) => {
      state.isConnected = false;
      state.roomName = null;
      state.participants = [];
      state.error = null;
    },
    updateParticipants: (state, action: PayloadAction<RoomState['participants']>) => {
      state.participants = action.payload;
    },
    updateQuality: (state, action: PayloadAction<RoomState['quality']>) => {
      state.quality = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  connectStart,
  connectSuccess,
  connectFailure,
  disconnect,
  updateParticipants,
  updateQuality,
  clearError,
} = roomSlice.actions;

export default roomSlice.reducer;
