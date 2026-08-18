import React, { useEffect, useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';

import ChplLoadingSpinner from './chpl-loading-spinner';

import { getAngularService } from 'services/angular-react-helper';

const MIN_VISIBLE_MS = 500;

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 2000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
  },
});

function ChplRouteLoading() {
  const classes = useStyles();
  const [active, setActive] = useState(false);

  useEffect(() => {
    // Dismiss the vanilla cold-boot overlay in index.html; React now owns the
    // route-transition loader.
    const vanillaOverlay = document.getElementById('chpl-route-loading');
    if (vanillaOverlay) {
      vanillaOverlay.classList.remove('is-active');
    }

    const $transitions = getAngularService('$transitions');
    let shownAt = 0;
    let hideTimeout = null;

    // UI-Router transitions without async resolves complete synchronously, so
    // onStart -> onSuccess can happen within a single frame. Keep the loader
    // visible for a minimum duration so it always paints when the URL changes.
    const show = () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
        hideTimeout = null;
      }
      shownAt = Date.now();
      setActive(true);
    };

    const hide = () => {
      const remaining = Math.max(0, MIN_VISIBLE_MS - (Date.now() - shownAt));
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      hideTimeout = setTimeout(() => {
        setActive(false);
        hideTimeout = null;
      }, remaining);
    };

    const deregisterStart = $transitions.onStart({}, () => { show(); });
    const deregisterSuccess = $transitions.onSuccess({}, () => { hide(); });
    const deregisterError = $transitions.onError({}, () => { hide(); });

    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout);
      }
      deregisterStart();
      deregisterSuccess();
      deregisterError();
    };
  }, []);

  if (!active) {
    return null;
  }

  return (
    <Box className={classes.overlay} role="status" aria-live="polite" aria-label="Loading">
      <ChplLoadingSpinner />
    </Box>
  );
}

export default ChplRouteLoading;
