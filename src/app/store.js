import { configureStore } from '@reduxjs/toolkit';

import browserInfoReducer from 'components/browser/browserInfo.slice';
import userInfoReducer from 'components/login/userInfo.slice';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('chplState');
    if (serializedState === null) return undefined; // Let reducers initialize state
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('chplState', serializedState);
  } catch (err) {
    // Ignore write errors or log them
  }
};

const preloadedState = loadState();

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  saveState(store.getState());
  return result;
};

const store = configureStore({
  reducer: {
    browserInfo: browserInfoReducer,
    userInfo: userInfoReducer,
  },
  preloadedState,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
});

export default store;
