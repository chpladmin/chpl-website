import React from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { render, screen } from '@testing-library/react';
import { bool, object } from 'prop-types';
import { Provider } from 'react-redux';

import ChplActionBar from './action-bar';
import actionBarReducer, { initialState, resetActionBar, setActionBar } from './actionBar.slice';
import useActionBar from './use-action-bar';

import { UserContext } from 'shared/contexts';

const buildStore = () => configureStore({ reducer: { actionBar: actionBarReducer } });

const renderWith = (ui, { store = buildStore(), roles = [] } = {}) => {
  const user = { hasAnyRole: (r) => r.some((role) => roles.includes(role)) };
  const utils = render(
    <Provider store={store}>
      <UserContext.Provider value={user}>
        {ui}
      </UserContext.Provider>
    </Provider>,
  );
  return { ...utils, store };
};

function Owner({ config, enabled = true }) {
  useActionBar(config, enabled);
  return <ChplActionBar dispatch={() => {}} />;
}

Owner.propTypes = {
  config: object.isRequired, // eslint-disable-line react/forbid-prop-types
  enabled: bool,
};

describe('the action bar slice', () => {
  it('merges partial updates and resets to defaults', () => {
    let state = actionBarReducer(undefined, { type: '@@init' });
    expect(state).toEqual(initialState);
    state = actionBarReducer(state, setActionBar({ canDelete: true, errors: ['x'] }));
    expect(state).toEqual({ ...initialState, canDelete: true, errors: ['x'] });
    expect(actionBarReducer(state, resetActionBar())).toEqual(initialState);
  });

  it('falls back to the default for an undefined value', () => {
    const state = actionBarReducer(undefined, setActionBar({ canSave: false, errors: ['x'] }));
    expect(actionBarReducer(state, setActionBar({ canSave: undefined, errors: undefined })))
      .toEqual(initialState);
  });
});

describe('the action bar', () => {
  it('renders the default buttons', () => {
    renderWith(<ChplActionBar dispatch={() => {}} />);
    expect(document.getElementById('action-bar-cancel')).toBeInTheDocument();
    expect(document.getElementById('action-bar-save')).toBeInTheDocument();
    expect(document.getElementById('action-bar-delete')).not.toBeInTheDocument();
  });

  it('renders buttons and disabled states from the store', () => {
    const store = buildStore();
    store.dispatch(setActionBar({
      canCancel: false, canClose: true, canDelete: true, isDeleteDisabled: true, isDisabled: true,
    }));
    renderWith(<ChplActionBar dispatch={() => {}} />, { store });
    expect(document.getElementById('action-bar-cancel')).not.toBeInTheDocument();
    expect(document.getElementById('action-bar-close')).toBeInTheDocument();
    expect(document.getElementById('action-bar-save')).toBeDisabled();
    expect(document.getElementById('action-bar-delete')).toBeDisabled();
  });

  it('only shows the error acknowledgement to admin and ONC users', () => {
    const store = buildStore();
    store.dispatch(setActionBar({ showErrorAcknowledgement: true }));
    const { unmount } = renderWith(<ChplActionBar dispatch={() => {}} />, { store, roles: ['chpl-developer'] });
    expect(screen.queryByText(/wish to proceed/)).not.toBeInTheDocument();
    unmount();
    renderWith(<ChplActionBar dispatch={() => {}} />, { store, roles: ['chpl-onc'] });
    expect(screen.getByText(/wish to proceed/)).toBeInTheDocument();
  });
});

describe('useActionBar', () => {
  it('applies its config while mounted and resets on unmount', () => {
    const { store, rerender, unmount } = renderWith(<Owner config={{ canDelete: true }} />);
    expect(store.getState().actionBar.canDelete).toBe(true);
    expect(document.getElementById('action-bar-delete')).toBeInTheDocument();

    rerender(
      <Provider store={store}>
        <Owner config={{ canDelete: false }} />
      </Provider>,
    );
    expect(store.getState().actionBar.canDelete).toBe(false);

    unmount();
    expect(store.getState().actionBar).toEqual(initialState);
  });

  it('ignores its setter once unmounted', () => {
    let update;
    function Setter() {
      update = useActionBar({});
      return null;
    }
    const { store, unmount } = renderWith(<Setter />);
    update({ isProcessing: true });
    expect(store.getState().actionBar.isProcessing).toBe(true);
    unmount();
    update({ errors: ['late'] });
    expect(store.getState().actionBar).toEqual(initialState);
  });

  it('does not claim the slice while disabled', () => {
    const store = buildStore();
    store.dispatch(setActionBar({ canEdit: true }));
    renderWith(<Owner config={{ canDelete: true }} enabled={false} />, { store });
    expect(store.getState().actionBar).toEqual({ ...initialState, canEdit: true });
  });
});
