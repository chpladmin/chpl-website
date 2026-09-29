// Our own code no longer needs this: IE is out of the browser targets, so
// async/await is not compiled to a regenerator. Some dependencies ship
// pre-transpiled code that still expects a global regeneratorRuntime, and that
// global used to be set as a side effect of swagger-client loading eagerly.
// Now that routes load on demand it can no longer be relied on, so define it
// here. Costs ~7K.
import 'regenerator-runtime/runtime';

// Import base SCSS file and then all SCSS files in directories
import 'swagger-ui-react/swagger-ui.css';
import './index.scss';
import '../assets/favicons/favicons';

import React from 'react';
import { createRoot } from 'react-dom/client';

import AppRoot from './router/app-root';
import configureRouter from './router/configure';

function importAll(r) {
  r.keys().forEach(r);
}
importAll(
  require.context('./', true, /^.*\/.*\.scss$/),
);

// register the state tree and global hooks before anything renders
configureRouter();

// createElement rather than JSX so this entry can stay a .js file
createRoot(document.getElementById('root')).render(React.createElement(AppRoot));
