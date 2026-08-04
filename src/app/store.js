import { configureStore } from '@reduxjs/toolkit';

import userInfoReducer from 'components/login/userInfo.slice';

export default configureStore({
  reducer: {
    userInfo: userInfoReducer,
  },
});
