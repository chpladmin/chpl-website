// Babel's targets still include IE 11, so async/await is transpiled to a
// regenerator and the output references a global regeneratorRuntime. The
// webpack babel-loader passes presets inline, which overrides .babelrc's
// useBuiltIns setting, so babel never injects the polyfill itself. Load it
// explicitly and first: it used to be supplied by accident, by a copy bundled
// inside an eagerly loaded vendor chunk.
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
