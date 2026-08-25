import { configureStore } from '@reduxjs/toolkit';

import browserInfoReducer from 'components/browser/browserInfo.slice';
import userInfoReducer from 'components/login/userInfo.slice';

const store = configureStore({
  reducer: {
    browserInfo: browserInfoReducer,
    userInfo: userInfoReducer,
  },
});

export default store;
