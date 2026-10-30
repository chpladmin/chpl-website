import { useCallback, useRef } from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import { setPageState } from './pageState.slice';

// A `useState` whose value lives in the page state slice under `key`, so it
// survives the component unmounting, but not a reload. As with `useState`, only
// the first render's `defaultValue` counts: it applies until something is set,
// and keeping it fixed means a default such as `{}` is the same object every
// render. The setter takes a value or a function of the previous value; the
// previous value is read from the store, so several updates in a row each see
// the one before.
const usePageState = (key, defaultValue) => {
  const dispatch = useDispatch();
  const store = useStore();
  const fallback = useRef(defaultValue).current;
  const value = useSelector((state) => (key in state.pageState ? state.pageState[key] : fallback));

  const setValue = useCallback((next) => {
    const { pageState } = store.getState();
    const previous = key in pageState ? pageState[key] : fallback;
    dispatch(setPageState({ key, value: typeof next === 'function' ? next(previous) : next }));
  }, [dispatch, fallback, key, store]);

  return [value, setValue];
};

export default usePageState;
