/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

// Which listing widget's panel is open: 'cms', 'compare', or null for neither.
// Only one is ever open, so opening one closes the other.
const initialState = {
  open: null,
};

export const widgetSlice = createSlice({
  name: 'widget',
  initialState,
  reducers: {
    closeWidget: (state) => {
      state.open = null;
    },
    openWidget: (state, action) => {
      state.open = action.payload;
    },
    toggleWidget: (state, action) => {
      state.open = state.open === action.payload ? null : action.payload;
    },
  },
});

export const {
  closeWidget,
  openWidget,
  toggleWidget,
} = widgetSlice.actions;

export { initialState };

export default widgetSlice.reducer;
