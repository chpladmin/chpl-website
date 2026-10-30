/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

// Values a page keeps while the user moves around the app, such as a table's
// sort and page or a filter panel's selections, keyed by the page's storage key.
// `store.js` deliberately does not persist it, so a reload starts them afresh.
const initialState = {};

export const pageStateSlice = createSlice({
  name: 'pageState',
  initialState,
  reducers: {
    clearPageState: (state, action) => {
      delete state[action.payload];
    },
    setPageState: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

export const {
  clearPageState,
  setPageState,
} = pageStateSlice.actions;

export { initialState };

export default pageStateSlice.reducer;
