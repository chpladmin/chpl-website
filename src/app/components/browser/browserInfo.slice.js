/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const browserInfoSlice = createSlice({
  name: 'browserInfo',
  initialState: {
    api: '/rest',
    apiKey: window.__env?.API_KEY ?? '12909a978483dfb8ecd0596c98ae9094',
    previouslyCompared: JSON.parse(localStorage.getItem('ngStorage-previouslyCompared')) ?? [], // temporary use of localstorage until redux store is truly global
    previouslyViewed: JSON.parse(localStorage.getItem('ngStorage-previouslyViewed')) ?? [], // temporary use of localstorage until redux store is truly global
  },
  reducers: {
    pushPreviouslyCompared: (state, action) => {
      state.previouslyCompared = [
        action.payload.id,
        ...state.previouslyCompared.filter((id) => id !== action.payload.id),
      ].slice(0, 20);
      localStorage.setItem('ngStorage-previouslyCompared', JSON.stringify(state.previouslyCompared)); // temporary until redux store is truly global
    },
    pushPreviouslyViewed: (state, action) => {
      state.previouslyViewed = [
        action.payload.id,
        ...state.previouslyViewed.filter((id) => id !== action.payload.id),
      ].slice(0, 20);
      localStorage.setItem('ngStorage-previouslyViewed', JSON.stringify(state.previouslyViewed)); // temporary until redux store is truly global
    },
  },
});

export const {
  pushPreviouslyCompared,
  pushPreviouslyViewed,
} = browserInfoSlice.actions;

export default browserInfoSlice.reducer;
