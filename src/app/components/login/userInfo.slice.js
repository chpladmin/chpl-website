/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    loginState: 'SIGNIN',
    user: undefined,
  },
  reducers: {
    setLoginState: (state, action) => {
      state.loginState = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = undefined;
    },
  },
});

export const {
  clearUser,
  setLoginState,
  setUser,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
