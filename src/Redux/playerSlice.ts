import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  elapsedTime: number;
}

const initialState: PlayerState = {
  elapsedTime: 0,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setElapsedTimeVideo: (state, action: PayloadAction<number>) => {
      state.elapsedTime = action.payload;
    },
  },
});

export const { setElapsedTimeVideo } = playerSlice.actions;
export default playerSlice.reducer;
