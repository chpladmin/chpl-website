import React from 'react';
import { UIRouter, UIView } from '@uirouter/react';

import router from './router';
import SkipLink from './views/skip-link';

import { ChplRouteLoading } from 'components/util';

// The application root. <UIRouter> starts the router; UIView renders the
// active state.
//
// SkipLink and ChplRouteLoading sit outside UIView so they survive navigation,
// which is what the separate `#chpl-route-loading-react` root used to do.
//
// Note there is no AppWrapper here: each routed component still mounts its own
// provider stack through its *-wrapper.jsx, exactly as it did under the
// bridge. Hoisting the providers to this level is a separate change.
function AppRoot() {
  return (
    <UIRouter router={router}>
      <>
        <SkipLink />
        <ChplRouteLoading />
        <UIView />
      </>
    </UIRouter>
  );
}

export default AppRoot;
