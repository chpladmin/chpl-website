import registerHooks from './hooks';
import router from './router';
import states from './states';

// Registers the state tree and the global hooks on the router instance.
//
// This is separate from router.js so that services/navigation.service can
// import the bare instance without pulling in the whole page-component graph,
// which imports navigation.service in turn.
//
// Called once, from the application entry, before the root is rendered.
const configureRouter = () => {
  states.forEach((state) => router.stateRegistry.register(state));
  registerHooks(router);
  return router;
};

export default configureRouter;
