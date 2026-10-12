import { UIRouterReact, hashLocationPlugin, servicesPlugin } from '@uirouter/react';

// Builds a UIRouterReact instance. The app uses a single instance created at
// bootstrap; tests create isolated ones (usually with memoryLocationPlugin).
//
// `servicesPlugin` is required when bootstrapping by hand. The <UIRouter>
// component registers it for you when you pass the `plugins` prop, but we hold
// the instance ourselves so that non-React code can reach the router, so we
// have to register it here or transitions fail with "cannot read 'defer'".
//
// `hashLocationPlugin` reproduces the `#/search` URLs that AngularJS produced
// via `$locationProvider.hashPrefix('')`.
const createRouter = (states = [], { locationPlugin = hashLocationPlugin } = {}) => {
  const router = new UIRouterReact();
  router.plugin(servicesPlugin);
  router.plugin(locationPlugin);
  states.forEach((state) => router.stateRegistry.register(state));
  return router;
};

export default createRouter;
