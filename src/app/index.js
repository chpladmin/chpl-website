// Import base SCSS file and then all SCSS files in directories
import 'angular-loading-bar/build/loading-bar.min.css';
import './index.scss';
import '../assets/favicons/favicons';
import 'swagger-ui-react/swagger-ui.css';

import angular from 'angular';
import 'angular-breadcrumb';
import /* angularConfirm from */ 'angular-confirm';
import /* angularLoadingBar from */ 'angular-loading-bar';
import /* angulartics from */ 'angulartics';
import /* angularticsGoogleTagManager from */ 'angulartics-google-tag-manager';
import 'angular-feature-flags';
import /* googlechart from */ 'angular-google-chart';
import /* ngAnimate from */ 'angular-animate';
import /* ngAria from */ 'angular-aria';
import /* ngCsv from */ 'ng-csv';
import /* ngIdle from */ 'ng-idle';
import /* cytoscape from */ 'cytoscape';
import /* ngCytoscape from */ './lib/ngCytoscape.min';
import /* ngResource from */ 'angular-resource';
import /* ngSanitize from */ 'angular-sanitize';
import /* smartTable from */ 'angular-smart-table';
import /* toaster from */ 'angularjs-toaster';
import /* uiBoostrap from */ 'angular-ui-bootstrap';
import /* ngFileSaver from */ 'angular-file-saver';
import /* ngStorage from */ 'ngstorage';
import 'angular-ui-router';

// import app modules
import administration from './pages/administration/index';
import /* chartsModule from */ './pages/charts/index';
import /* collectionsModule from */ './pages/collections/index';
import compare from './pages/compare/index';
import /* componentsModule from */ './components/index';
import listing from './pages/listing/index';
import /* navigationModule from */ './navigation/index';
import organizations from './pages/organizations/index';
import reports from './pages/reports/index';
import resources from './pages/resources/index';
import /* registrationModule from */ './pages/registration/index';
import /* searchModule from */ './pages/search/index';
import services from './services/index';
import /* sharedModule from */ './shared/index';
import surveillance from './pages/surveillance/index';
import users from './pages/users/index';

function importAll(r) {
  r.keys().forEach(r);
}
importAll(
  require.context('./', true, /^.*\/.*\.scss$/),
);

require('./index.constants');

const dependencies = [
  'angular-loading-bar',
  'angulartics',
  'angulartics.google.tagmanager',
  'feature-flags',
  'googlechart',
  'ncy-angular-breadcrumb',
  'ngAnimate',
  'ngAria',
  'ngCytoscape',
  'ngFileSaver',
  'ngResource',
  'ngStorage',
  'ngSanitize',
  'smart-table',
  'toaster',
  'ui.bootstrap',
  'ui.router',
  administration.name,
  compare.name,
  listing.name,
  organizations.name,
  reports.name,
  resources.name,
  services.name,
  surveillance.name,
  users.name,
  'chpl.charts',
  'chpl.collections',
  'chpl.components',
  'chpl.constants',
  'chpl.navigation',
  'chpl.registration',
  'chpl.search',
  'chpl.shared',
];

const appModule = angular.module('chpl', dependencies);

require('./index.route');
require('./index.run');
require('./templates');
require('./index.config');

export default appModule;
