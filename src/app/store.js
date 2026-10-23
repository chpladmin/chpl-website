import { configureStore } from '@reduxjs/toolkit';

import actionBarReducer from 'components/action-bar/actionBar.slice';
import widgetReducer from 'components/action-widget/widget.slice';
import browserInfoReducer, { MAX_REMEMBERED, initialState as browserInfoDefaults } from 'components/browser/browserInfo.slice';
import userInfoReducer from 'components/login/userInfo.slice';
import pageStateReducer from 'components/page-state/pageState.slice';
import { summarizeListing } from 'services/listing.service';

const LEGACY_USER_KEY = 'ngStorage-currentUser';
const LEGACY_COMPARED_KEY = 'ngStorage-previouslyCompared';
const LEGACY_VIEWED_KEY = 'ngStorage-previouslyViewed';
// The lists that had keys of their own before moving into `browserInfo`
const LEGACY_LIST_KEYS = {
  cms: 'cms',
  cmsLookupIds: 'storageKey-cmsLookupIds',
  compare: 'compare',
  favorites: 'favorites',
};

// Everything written to localStorage outside `chplState`: the AngularJS era's
// keys, and the widget, favorites and CMS ID lookup lists. The user and the lists are carried
// over once; the tokens are dropped outright, since `axios-jwt` owns token
// storage now.
const LEGACY_KEYS = [
  LEGACY_USER_KEY,
  LEGACY_COMPARED_KEY,
  LEGACY_VIEWED_KEY,
  'ngStorage-jwtToken',
  'ngStorage-refreshToken',
  ...Object.values(LEGACY_LIST_KEYS),
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

const loadLegacyListings = (key) => {
  try {
    const listings = JSON.parse(localStorage.getItem(key));
    return Array.isArray(listings) ? listings.filter((listing) => listing?.id !== undefined) : undefined;
  } catch (err) {
    return undefined;
  }
};

const loadLegacyStrings = (key) => {
  try {
    const values = JSON.parse(localStorage.getItem(key));
    return Array.isArray(values) ? values.filter((value) => typeof value === 'string') : undefined;
  } catch (err) {
    return undefined;
  }
};

// The widget lists keep summaries, and favorites keep ids, rather than the whole
// listings their old keys held. Only lists the old keys actually hold are returned.
const loadLegacyLists = () => {
  const cms = loadLegacyListings(LEGACY_LIST_KEYS.cms);
  const cmsLookupIds = loadLegacyStrings(LEGACY_LIST_KEYS.cmsLookupIds);
  const compare = loadLegacyListings(LEGACY_LIST_KEYS.compare);
  const favorites = loadLegacyListings(LEGACY_LIST_KEYS.favorites);
  return {
    ...(cms ? { cms: cms.map(summarizeListing) } : {}),
    ...(cmsLookupIds ? { cmsLookupIds } : {}),
    ...(compare ? { compare: compare.map(summarizeListing) } : {}),
    ...(favorites ? { favorites: favorites.map((listing) => listing.id) } : {}),
  };
};

const loadLegacyBrowserInfo = () => {
  const previouslyCompared = loadLegacyIds(LEGACY_COMPARED_KEY);
  const previouslyViewed = loadLegacyIds(LEGACY_VIEWED_KEY);
  const lists = loadLegacyLists();
  if (!previouslyCompared && !previouslyViewed && Object.keys(lists).length === 0) return undefined;
  return {
    ...browserInfoDefaults,
    ...(previouslyCompared ? { previouslyCompared } : {}),
    ...(previouslyViewed ? { previouslyViewed } : {}),
    ...lists,
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

    // `actionBar` is never persisted, but drop it in case an older `chplState` holds one.
    const { actionBar, ...persisted } = JSON.parse(serializedState);
    return {
      ...persisted,
      browserInfo: {
        ...browserInfoDefaults,
        // A `chplState` from before the lists moved in gets them from their old keys
        ...loadLegacyLists(),
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

// The action bar and the page state are per-page UI state, so they are never
// written: a reload starts them afresh rather than restoring what was showing.
// The open widget is written, so its panel stays open across a reload.
const saveState = ({ browserInfo, userInfo, widget }) => {
  try {
    const serializedState = JSON.stringify({ browserInfo, userInfo, widget });
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
      actionBar: actionBarReducer,
      browserInfo: browserInfoReducer,
      pageState: pageStateReducer,
      userInfo: userInfoReducer,
      widget: widgetReducer,
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

const store = createStore();

export default store;
