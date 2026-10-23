import React, { useEffect } from 'react';
import { configureStore } from '@reduxjs/toolkit';
import { act, render, screen } from '@testing-library/react';
import { bool, number, oneOfType } from 'prop-types';
import { Provider } from 'react-redux';

import reducer, { clearPageState, setPageState } from './pageState.slice';
import usePageState from './use-page-state';

const makeStore = (pageState = {}) => configureStore({
  reducer: { pageState: reducer },
  preloadedState: { pageState },
});

// Shows the value, and hands its setter to the test
let setter;
function Probe({ defaultValue }) {
  const [value, setValue] = usePageState('key', defaultValue);
  setter = setValue;
  return <div data-testid="value">{JSON.stringify(value)}</div>;
}

Probe.propTypes = {
  defaultValue: oneOfType([bool, number]).isRequired,
};

const renderProbe = (store, defaultValue = 0) => render(
  <Provider store={store}>
    <Probe defaultValue={defaultValue} />
  </Provider>,
);

const shown = () => JSON.parse(screen.getByTestId('value').textContent);

describe('the page state slice', () => {
  it('sets and clears a value by key, leaving the others', () => {
    const state = [
      setPageState({ key: 'a', value: 1 }),
      setPageState({ key: 'b', value: { x: 2 } }),
      clearPageState('a'),
    ].reduce(reducer, {});

    expect(state).toEqual({ b: { x: 2 } });
  });
});

describe('usePageState', () => {
  it('gives the default until something is set', () => {
    renderProbe(makeStore());

    expect(shown()).toBe(0);
  });

  it('gives the stored value when there is one, even a falsy one', () => {
    renderProbe(makeStore({ key: false }), true);

    expect(shown()).toBe(false);
  });

  it('stores a set value under its key', () => {
    const store = makeStore();
    renderProbe(store);
    act(() => setter(3));

    expect(shown()).toBe(3);
    expect(store.getState().pageState).toEqual({ key: 3 });
  });

  it('passes an updater the previous value, so updates in a row build on each other', () => {
    const store = makeStore();
    renderProbe(store);
    act(() => {
      setter((previous) => previous + 1);
      setter((previous) => previous + 1);
    });

    expect(shown()).toBe(2);
  });

  it('keeps the value when the component unmounts and mounts again', () => {
    const store = makeStore();
    const { unmount } = renderProbe(store);
    act(() => setter(5));
    unmount();
    renderProbe(store);

    expect(shown()).toBe(5);
  });

  it('starts from the default again in a new store, as after a reload', () => {
    const { unmount } = renderProbe(makeStore());
    act(() => setter(5));
    unmount();
    renderProbe(makeStore());

    expect(shown()).toBe(0);
  });

  it('starts from the default again once the value is cleared', () => {
    const store = makeStore({ key: 5 });
    renderProbe(store);
    act(() => { store.dispatch(clearPageState('key')); });

    expect(shown()).toBe(0);
  });

  it('gives the same default object on every render, so effects depending on it settle', () => {
    const seen = new Set();
    function Settles() {
      const [value] = usePageState('other', {});
      const [, setCount] = usePageState('count', 0);
      seen.add(value);
      useEffect(() => { setCount((n) => n + 1); }, [value, setCount]);
      return null;
    }
    const store = makeStore();
    render(<Provider store={store}><Settles /></Provider>);

    expect(seen.size).toBe(1);
    expect(store.getState().pageState.count).toBe(1);
  });
});
