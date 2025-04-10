import {configureStore} from '@reduxjs/toolkit';
import AuthReducer from './AuthReducer';
import MusicTrackerReducer from './MusicTrackerReducer';
import RunningPlayListReducer from './RunningPlayListReducer';
import playerSlice from './playerSlice';


const store = configureStore({
  reducer: {
    authToken: AuthReducer,
    musicTracker: MusicTrackerReducer,
    runningPlaylists: RunningPlayListReducer,
    player: playerSlice
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
