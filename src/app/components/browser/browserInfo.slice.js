/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { summarizeListing } from 'services/listing.service';

const MAX_REMEMBERED = 20;

// `api` and `apiKey` are deploy configuration rather than state - nothing
// dispatches against them - so `store.js` overlays the current build's values
// over whatever `chplState` happens to hold.
const initialState = {
  api: '/rest',
  // `__env` is injected at runtime from outside this repo, so the underscores are not ours to rename
  // eslint-disable-next-line no-underscore-dangle
  apiKey: window.__env?.API_KEY ?? '12909a978483dfb8ecd0596c98ae9094',
  // Listings in the CMS ID and compare widgets, as `summarizeListing` summaries
  cms: [],
  // CMS IDs entered on the CMS ID Reverse Lookup page
  cmsLookupIds: [],
  compare: [],
  // Ids of the listings the user has favorited
  favorites: [],
  previouslyCompared: [],
  previouslyViewed: [],
};

const remember = (ids, id) => [
  id,
  ...ids.filter((remembered) => remembered !== id),
].slice(0, MAX_REMEMBERED);

const add = (listings, listing) => (listings.some((l) => l.id === listing.id)
  ? listings
  : [...listings, summarizeListing(listing)]);
const remove = (listings, listing) => listings.filter((l) => l.id !== listing.id);

export const browserInfoSlice = createSlice({
  name: 'browserInfo',
  initialState,
  reducers: {
    addCmsListing: (state, action) => {
      state.cms = add(state.cms, action.payload);
    },
    addCmsLookupId: (state, action) => {
      const id = action.payload.trim();
      if (!state.cmsLookupIds.includes(id)) {
        state.cmsLookupIds.push(id);
      }
    },
    addCompareListing: (state, action) => {
      state.compare = add(state.compare, action.payload);
    },
    clearCmsListings: (state) => {
      state.cms = [];
    },
    clearCompareListings: (state) => {
      state.compare = [];
    },
    pushPreviouslyCompared: (state, action) => {
      state.previouslyCompared = remember(state.previouslyCompared, action.payload.id);
    },
    pushPreviouslyViewed: (state, action) => {
      state.previouslyViewed = remember(state.previouslyViewed, action.payload.id);
    },
    removeCmsListing: (state, action) => {
      state.cms = remove(state.cms, action.payload);
    },
    removeCmsLookupId: (state, action) => {
      state.cmsLookupIds = state.cmsLookupIds.filter((id) => id !== action.payload);
    },
    removeCompareListing: (state, action) => {
      state.compare = remove(state.compare, action.payload);
    },
    // Replaces the compare widget's listings, e.g. with the CMS ID widget's
    setCompareListings: (state, action) => {
      state.compare = action.payload.reduce(add, []);
    },
    toggleFavorite: (state, action) => {
      const { id } = action.payload;
      state.favorites = state.favorites.includes(id)
        ? state.favorites.filter((favorite) => favorite !== id)
        : [...state.favorites, id];
    },
  },
});

export const {
  addCmsListing,
  addCmsLookupId,
  addCompareListing,
  clearCmsListings,
  clearCompareListings,
  pushPreviouslyCompared,
  pushPreviouslyViewed,
  removeCmsListing,
  removeCmsLookupId,
  removeCompareListing,
  setCompareListings,
  toggleFavorite,
} = browserInfoSlice.actions;

export { MAX_REMEMBERED, initialState };

export default browserInfoSlice.reducer;
