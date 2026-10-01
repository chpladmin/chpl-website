// Our own code no longer needs this: IE is out of the browser targets, so
// async/await is not compiled to a regenerator. Some dependencies ship
// pre-transpiled code that still expects a global regeneratorRuntime, and that
// global used to be set as a side effect of swagger-client loading eagerly.
// Now that routes load on demand it can no longer be relied on, so define it
// here. Costs ~7K.
import 'regenerator-runtime/runtime';

// App styling is all JSS; this is the only stylesheet left to load
import 'swagger-ui-react/swagger-ui.css';
import '../assets/favicons/favicons';

import React from 'react';
import { createRoot } from 'react-dom/client';

import AppRoot from './router/app-root';
import configureRouter from './router/configure';

// register the state tree and global hooks before anything renders
configureRouter();

// createElement rather than JSX so this entry can stay a .js file
createRoot(document.getElementById('root')).render(React.createElement(AppRoot));
