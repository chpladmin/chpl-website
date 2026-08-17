/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const browserInfoSlice = createSlice({
  name: 'browserInfo',
  initialState: {
    api: '/rest',
    apiKey: '12909a978483dfb8ecd0596c98ae9094',
    previouslyCompared: [],
    previouslyViewed: [],
  },
  reducers: {
    pushPreviouslyCompared: (state, action) => {
      state.previouslyCompared = [
        action.payload.id,
        ...state.previouslyCompared.filter((id) => id !== action.payload.id),
      ].slice(0, 20);
    },
    pushPreviouslyViewed: (state, action) => {
      state.previouslyViewed = [
        action.payload.id,
        ...state.previouslyViewed.filter((id) => id !== action.payload.id),
      ].slice(0, 20);
    },
  },
});

export const {
  pushPreviouslyCompared,
  pushPreviouslyViewed,
} = browserInfoSlice.actions;

export default browserInfoSlice.reducer;
