import router from 'router/router';

// The single place that talks to the router. Everything else navigates through
// these helpers, so the router is a change to this file rather than a hunt
// across components.
//
// This used to reach into the AngularJS injector at call time, because the
// injector did not exist until Angular had bootstrapped. The router instance is
// a plain module export, so that indirection is gone - as is the manual
// $digest that goToUrl needed to make a location change outside Angular's
// digest cycle take effect.

const goToState = (state, params, options) => router.stateService.go(state, params, options);

const reloadState = () => router.stateService.reload();

const getRouteParams = () => router.globals.params;

const getCurrentUrl = () => router.urlService.url();

const goToUrl = (url) => router.urlService.url(url);

// Subscribes to route transitions; returns a function that removes every hook.
const onRouteChange = ({ onStart, onSuccess, onError }) => {
  const { transitionService } = router;
  const deregister = [
    onStart && transitionService.onStart({}, onStart),
    onSuccess && transitionService.onSuccess({}, onSuccess),
    onError && transitionService.onError({}, onError),
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
