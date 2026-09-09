import { configureStore } from '@reduxjs/toolkit';

import browserInfoReducer, { MAX_REMEMBERED, initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';
import userInfoReducer from 'components/login/userInfo.slice';

const LEGACY_USER_KEY = 'ngStorage-currentUser';
const LEGACY_COMPARED_KEY = 'ngStorage-previouslyCompared';
const LEGACY_VIEWED_KEY = 'ngStorage-previouslyViewed';

// Everything the AngularJS era wrote to its own localStorage keys. The user and
// the compare/viewed lists are carried over once; the tokens are dropped
// outright, since `axios-jwt` owns token storage now.
const LEGACY_KEYS = [
  LEGACY_USER_KEY,
  LEGACY_COMPARED_KEY,
  LEGACY_VIEWED_KEY,
  'ngStorage-jwtToken',
  'ngStorage-refreshToken',
];

const loadLegacyUserInfo = () => {
  try {
    const user = JSON.parse(localStorage.getItem(LEGACY_USER_KEY));
    if (!user) return undefined;
    return { loginState: 'LOGGEDIN', user };
  } catch (err) {
    return undefined;
  }
};

const loadLegacyIds = (key) => {
  try {
    const ids = JSON.parse(localStorage.getItem(key));
    return Array.isArray(ids) && ids.length > 0 ? ids.slice(0, MAX_REMEMBERED) : undefined;
  } catch (err) {
    return undefined;
  }
};

const loadLegacyBrowserInfo = () => {
  const previouslyCompared = loadLegacyIds(LEGACY_COMPARED_KEY);
  const previouslyViewed = loadLegacyIds(LEGACY_VIEWED_KEY);
  if (!previouslyCompared && !previouslyViewed) return undefined;
  return {
    ...browserInfoDefaults,
    ...(previouslyCompared ? { previouslyCompared } : {}),
    ...(previouslyViewed ? { previouslyViewed } : {}),
  };
};

// `preloadedState` replaces a slice wholesale rather than merging into its
// `initialState`, so every branch below has to return complete slices.
const loadState = () => {
  try {
    const serializedState = localStorage.getItem('chplState');

    if (serializedState === null) {
      // Nothing persisted yet: carry over whatever the legacy keys still hold.
      const userInfo = loadLegacyUserInfo();
      const browserInfo = loadLegacyBrowserInfo();
      if (!userInfo && !browserInfo) return undefined; // let the reducers initialize state
      const migrated = {};
      if (userInfo) migrated.userInfo = userInfo;
      if (browserInfo) migrated.browserInfo = browserInfo;
      return migrated;
    }

    const persisted = JSON.parse(serializedState);
    return {
      ...persisted,
      browserInfo: {
        ...browserInfoDefaults,
        ...persisted.browserInfo,
        // Configuration always comes from this build, never from a past visit.
        api: browserInfoDefaults.api,
        apiKey: browserInfoDefaults.apiKey,
      },
    };
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
    saveState(configured.getState()); // make sure `chplState` exists before dropping the legacy keys
    LEGACY_KEYS.forEach((key) => localStorage.removeItem(key));
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
