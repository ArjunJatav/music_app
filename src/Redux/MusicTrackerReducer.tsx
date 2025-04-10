import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MusicTrackerState {
  MUSIC_TRACKER: boolean | false;
  MINIMIZED_VIEW: boolean | false;
}

const initialState: MusicTrackerState = {
  MUSIC_TRACKER: false,
  MINIMIZED_VIEW: false,
};

const musicTrackerSlice = createSlice({
  name: 'musicTracker',
  initialState,
  reducers: {
    setMusicTracker(state, action: PayloadAction<boolean>) {
      state.MUSIC_TRACKER = action.payload;
    },
    setMinimizeView(state, action: PayloadAction<boolean>) {
      state.MINIMIZED_VIEW = action.payload;
    },
    clearMusicTracker(state ) {
      state.MUSIC_TRACKER = false;
    },
  },
});

export const { setMusicTracker, clearMusicTracker,setMinimizeView } = musicTrackerSlice.actions;
export default musicTrackerSlice.reducer;
