/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    loginState: localStorage.getItem('ngStorage-currentUser') ? 'LOGGEDIN' : 'SIGNIN',
    user: {},
  },
  reducers: {
    setLoginState: (state, action) => {
      state.loginState = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload.user;
    },
  },
});

export const {
  setLoginState,
  setUser,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
