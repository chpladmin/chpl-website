import { configureStore } from '@reduxjs/toolkit';

import browserInfoReducer from 'components/browser/browserInfo.slice';
import userInfoReducer from 'components/login/userInfo.slice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('reduxState');
    if (serializedState === null) return undefined; // Let reducers initialize state
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('reduxState', serializedState);
  } catch (err) {
    console.error(err);
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: {
    browserInfo: browserInfoReducer,
    userInfo: userInfoReducer,
  },
  preloadedState,
});

store.subscribe(() => {
  saveState({
    browserInfo: store.getState().browserInfo,
    userInfo: store.getState().userInfo,
  });
});

export default store;
