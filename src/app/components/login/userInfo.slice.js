/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState: {
    loginState: localStorage.getItem('ngStorage-currentUser') ? 'LOGGEDIN' : 'SIGNIN',
    user: JSON.parse(localStorage.getItem('ngStorage-currentUser')) ?? {}, // temporary use of localstorage until redux store is truly global
  },
  reducers: {
    setLoginState: (state, action) => {
      state.loginState = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload?.user;
      if (state.user !== undefined) {
        localStorage.setItem('ngStorage-currentUser', JSON.stringify(state.user)); // temporary until redux store is truly global
      } else {
        localStorage.removeItem('ngStorage-currentUser');
      }
    },
  },
});

export const {
  setLoginState,
  setUser,
} = userInfoSlice.actions;

export default userInfoSlice.reducer;
