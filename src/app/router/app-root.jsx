import React, { Suspense } from 'react';
import { UIRouter, UIView } from '@uirouter/react';

import router from './router';
import SkipLink from './views/skip-link';

import AppWrapper from 'app-wrapper';
import { ChplLoadingSpinner, ChplRouteLoading } from 'components/util';

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
          {/*
            Route components are React.lazy, so each page is its own chunk.
            The chunk resolves after the transition completes, which is after
            ChplRouteLoading has hidden its overlay - without a fallback here
            the content area would flash empty. The chrome above stays mounted
            throughout, so only the content region shows the spinner. One
            boundary covers every nested UIView too.
          */}
          <Suspense fallback={<ChplLoadingSpinner />}>
            <UIView />
          </Suspense>
        </AppWrapper>
      </>
    </UIRouter>
  );
}

export default AppRoot;
