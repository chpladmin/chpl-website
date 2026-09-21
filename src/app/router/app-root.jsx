import React from 'react';
import { UIRouter, UIView } from '@uirouter/react';

import router from './router';
import SkipLink from './views/skip-link';

import AppWrapper from 'app-wrapper';
import { ChplRouteLoading } from 'components/util';

// The application root. <UIRouter> starts the router; UIView renders the
// active state.
//
// AppWrapper (the provider stack and the page chrome) is mounted here, once,
// above the router outlet. Under the AngularJS bridge every route mounted its
// own copy, so the whole stack was torn down and rebuilt on each navigation -
// which reset FlagWrapper's state, so there was a frame on every route change
// where every feature flag read false and isProduction read true.
//
// SkipLink and ChplRouteLoading stay outside AppWrapper: the skip link has to
// be the first focusable element in the document, and the loading overlay has
// never been inside the theme provider. Both sit outside UIView so they
// survive navigation, which is what the separate `#chpl-route-loading-react`
// root used to do.
function AppRoot() {
  return (
    <UIRouter router={router}>
      <>
        <SkipLink />
        <ChplRouteLoading />
        <AppWrapper>
          <UIView />
        </AppWrapper>
      </>
    </UIRouter>
  );
}

export default AppRoot;
