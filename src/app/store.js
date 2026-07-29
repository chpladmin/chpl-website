import { configureStore } from '@reduxjs/toolkit';

import userReducer from 'components/login/user.slice';

export default configureStore({
  reducer: {
    user: userReducer,
  },
});
