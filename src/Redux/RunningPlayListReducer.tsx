import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Song {
  id: string;
  title: string;
}

interface Playlist {
  id: string;
  name: string;
  songs: Song[];
}

interface PlaylistState {
  runningPlaylists: Playlist[];
  currentSong: Song | null; // Add a key to store the current song
}

const initialState: PlaylistState = {
  runningPlaylists: [], // Array to store playlists
  currentSong: null, // Initialize current song as null
};

const runningPlaylistSlice = createSlice({
  name: 'runningPlaylists',
  initialState,
  reducers: {
    addRunningPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.runningPlaylists.push(action.payload);
    },

    clearRunningPlaylists: (state) => {
      state.runningPlaylists = [];
    },

    setCurrentSong: (state, action: PayloadAction<Song>) => {
      state.currentSong = action.payload;
    },
  },
});

export const { addRunningPlaylist, clearRunningPlaylists, setCurrentSong } = runningPlaylistSlice.actions;
export default runningPlaylistSlice.reducer;
