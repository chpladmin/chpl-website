/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    loginState: JSON.parse(localStorage.getItem('userInfo-loginState')) ?? 'SIGNIN', // temporary use of localstorage until redux store is truly global
    user: { },
  },
  reducers: {
    setLoginState: (state, action) => {
      state.loginState = action.payload;
      localStorage.setItem('userInfo-loginState', JSON.stringify(state.loginState)); // temporary until redux store is truly global
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
