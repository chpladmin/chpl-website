/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const MAX_REMEMBERED = 20;

// `api` and `apiKey` are deploy configuration rather than state - nothing
// dispatches against them - so `store.js` overlays the current build's values
// over whatever `chplState` happens to hold.
const initialState = {
  api: '/rest',
  // `__env` is injected at runtime from outside this repo, so the underscores are not ours to rename
  // eslint-disable-next-line no-underscore-dangle
  apiKey: window.__env?.API_KEY ?? '12909a978483dfb8ecd0596c98ae9094',
  previouslyCompared: [],
  previouslyViewed: [],
};

const remember = (ids, id) => [
  id,
  ...ids.filter((remembered) => remembered !== id),
].slice(0, MAX_REMEMBERED);

export const browserInfoSlice = createSlice({
  name: 'browserInfo',
  initialState,
  reducers: {
    pushPreviouslyCompared: (state, action) => {
      state.previouslyCompared = remember(state.previouslyCompared, action.payload.id);
    },
    pushPreviouslyViewed: (state, action) => {
      state.previouslyViewed = remember(state.previouslyViewed, action.payload.id);
    },
  },
});

export const {
  pushPreviouslyCompared,
  pushPreviouslyViewed,
} = browserInfoSlice.actions;

export { MAX_REMEMBERED, initialState };

export default browserInfoSlice.reducer;
