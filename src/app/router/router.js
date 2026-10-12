import { hashLocationPlugin } from '@uirouter/react';

import createRouter from './create-router';

// The application's single router instance, held at module scope so that code
// outside the React tree (services/navigation.service) can reach it.
//
// Deliberately contains no states and no hooks. Registering them here would
// import every page component, and those components import
// services/navigation.service, which imports this file - an import cycle.
// router/configure wires them up at startup instead.
//
// Also deliberately not started: the <UIRouter> component starts it during its
// mount effect, and starting twice throws.
const router = createRouter([], { locationPlugin: hashLocationPlugin });

export default router;
