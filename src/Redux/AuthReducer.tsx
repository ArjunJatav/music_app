import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface AuthTokenState {
  AUTH_TOKEN: string | null;
}

const initialState: AuthTokenState = {
  AUTH_TOKEN: null,
};

const authTokenSlice = createSlice({
  name: 'authToken',
  initialState,
  reducers: {
    setAuthToken(state, action: PayloadAction<string>) {
      state.AUTH_TOKEN = action.payload;
    },
    clearAuthToken(state) {
      state.AUTH_TOKEN = null;
    },
  },
});

export const {setAuthToken, clearAuthToken} = authTokenSlice.actions;
export default authTokenSlice.reducer;
