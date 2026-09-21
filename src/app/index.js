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
