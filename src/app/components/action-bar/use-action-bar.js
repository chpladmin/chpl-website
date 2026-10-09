import { useCallback, useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { resetActionBar, setActionBar } from './actionBar.slice';

const isSame = (a, b) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((item, idx) => item === b[idx]);
  }
  return a === b;
};

// Pushes `config` into the action bar slice: everything when it becomes
// enabled, then only the keys whose values changed. Pass `enabled` as false
// while the component is not rendering its bar, so it does not claim the slice
// from another bar. Layout effects so the bar never paints its defaults first.
//
// Returns a setter for values the component sets imperatively rather than
// through `config`. It does nothing while disabled or after unmount, so a
// request that settles after the user has moved on cannot write into whichever
// bar is showing by then.
const useActionBar = (config = {}, enabled = true) => {
  const dispatch = useDispatch();
  const active = useRef(false);
  const applied = useRef(undefined);

  useLayoutEffect(() => {
    if (!enabled) return undefined;
    active.current = true;
    dispatch(resetActionBar());
    return () => {
      active.current = false;
      applied.current = undefined;
      dispatch(resetActionBar());
    };
  }, [dispatch, enabled]);

  useLayoutEffect(() => {
    if (!enabled) return;
    const changed = Object.keys(config)
      .filter((key) => !applied.current || !isSame(applied.current[key], config[key]))
      .reduce((acc, key) => ({ ...acc, [key]: config[key] }), {});
    applied.current = config;
    if (Object.keys(changed).length > 0) {
      dispatch(setActionBar(changed));
    }
  });

  return useCallback((values) => {
    if (active.current) {
      dispatch(setActionBar(values));
    }
  }, [dispatch]);
};

export default useActionBar;
