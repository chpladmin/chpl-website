import { configureStore } from '@reduxjs/toolkit';

import browserInfoReducer from 'components/browser/browserInfo.slice';
import userInfoReducer from 'components/login/userInfo.slice';

const LEGACY_USER_KEY = 'ngStorage-currentUser';

// The AngularJS `authService` kept the signed-in user in its own localStorage
// key. Seed the store from it once so sessions survive the upgrade, after which
// `chplState` is the only place the user is persisted.
const loadLegacyUserInfo = () => {
  try {
    const user = JSON.parse(localStorage.getItem(LEGACY_USER_KEY));
    if (!user) return undefined;
    return { loginState: 'LOGGEDIN', user };
  } catch (err) {
    return undefined;
  }
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('chplState');
    if (serializedState === null) {
      const userInfo = loadLegacyUserInfo();
      return userInfo ? { userInfo } : undefined; // otherwise let reducers initialize state
    }
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

const localStorageMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  saveState(store.getState());
  return result;
};

const createStore = () => {
  const configured = configureStore({
    reducer: {
      browserInfo: browserInfoReducer,
      userInfo: userInfoReducer,
    },
    preloadedState: loadState(),
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(localStorageMiddleware),
  });

  try {
    saveState(configured.getState()); // make sure `chplState` exists before dropping the legacy key
    localStorage.removeItem(LEGACY_USER_KEY);
  } catch (err) {
    // Ignore storage errors
  }

  return configured;
};

// `index.html` loads every webpack entry bundle and each one gets its own copy
// of this module, so hold a single store on `window`. Otherwise each bundle has
// a private `userInfo` and a login in one is invisible to all the others.
const store = window.chplStore ?? (window.chplStore = createStore());

export default store;
