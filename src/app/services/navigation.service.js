import { getAngularService } from 'services/angular-react-helper';

// The single place that talks to the AngularJS router. Everything else
// navigates through these helpers, so swapping ui-router out later is a change
// to this file rather than a hunt across components.
//
// Each function looks its service up at call time rather than at module load,
// because the Angular injector does not exist until the app has bootstrapped.

const goToState = (state, params, options) => getAngularService('$state').go(state, params, options);

const reloadState = () => getAngularService('$state').reload();

const getRouteParams = () => getAngularService('$stateParams');

const getCurrentUrl = () => getAngularService('$location').url();

// A `$location` change made from a React event handler happens outside Angular's
// digest cycle and will not take effect on its own, hence the explicit digest.
const goToUrl = (url) => {
  getAngularService('$location').url(url);
  getAngularService('$rootScope').$digest();
};

// Subscribes to route transitions; returns a function that removes every hook.
const onRouteChange = ({ onStart, onSuccess, onError }) => {
  const transitions = getAngularService('$transitions');
  const deregister = [
    onStart && transitions.onStart({}, onStart),
    onSuccess && transitions.onSuccess({}, onSuccess),
    onError && transitions.onError({}, onError),
  ].filter((deregisterHook) => deregisterHook);
  return () => deregister.forEach((deregisterHook) => deregisterHook());
};

export {
  getCurrentUrl,
  getRouteParams,
  goToState,
  goToUrl,
  onRouteChange,
  reloadState,
};
