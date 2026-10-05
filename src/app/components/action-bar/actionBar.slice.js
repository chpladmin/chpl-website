/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

// Configuration of the single `ChplActionBar` on the page. Only one bar is ever
// mounted at a time, so this is a singleton; `useActionBar` resets it whenever a
// bar's owner mounts or unmounts. `store.js` deliberately does not persist it.
const initialState = {
  errors: [],
  warnings: [],
  canCancel: true,
  canClose: false,
  canConfirm: false,
  canDelete: false,
  canEdit: false,
  canReject: false,
  canSave: true,
  canWithdraw: false,
  isDeleteDisabled: false,
  isDisabled: false,
  isProcessing: false,
  showErrorAcknowledgement: false,
  showWarningAcknowledgement: false,
};

export const actionBarSlice = createSlice({
  name: 'actionBar',
  initialState,
  reducers: {
    // An undefined value falls back to its default, as an omitted prop used to.
    setActionBar: (state, action) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        state[key] = value === undefined ? initialState[key] : value;
      });
    },
    resetActionBar: () => initialState,
  },
});

export const {
  resetActionBar,
  setActionBar,
} = actionBarSlice.actions;

export { initialState };

export default actionBarSlice.reducer;
