// Import base SCSS file and then all SCSS files in directories
import 'angular-loading-bar/build/loading-bar.min.css';
import 'angular-swagger-ui/dist/css/swagger-ui.min.css';
import './index.scss';
import '../assets/favicons/favicons';

function importAll (r) {
    r.keys().forEach(r);
}
importAll(
    require.context('./', true, /^.*\/.*\.scss$/)
);

import angular from 'angular';
import 'angular-avatar';
import 'angular-breadcrumb';
import /* angularConfirm from*/ 'angular-confirm';
import /* angularCronGen from*/ 'angular-cron-gen';
import /* angularLoadingBar from*/ 'angular-loading-bar';
import /* angulartics from*/ 'angulartics';
import /* angularticsGoogleTagManager from*/ 'angulartics-google-tag-manager';
import 'angular-feature-flags';
import /* googlechart from*/ 'angular-google-chart';
import /* ngAnimate from*/ 'angular-animate';
import /* ngAria from*/ 'angular-aria';
import 'angular-moment';
import /* ngCsv from*/ 'ng-csv';
import /* ngIdle from*/ 'ng-idle';
import /* cytoscape from*/ 'cytoscape';
import /* ngCytoscape from*/ './lib/ngCytoscape.min';
//import ngMessages from 'ngMessages';
import /* ngResource from*/ 'angular-resource';
import /* ngSanitize from*/ 'angular-sanitize';
//import ngTouch from 'ngTouch';
import /* smartTable from*/ 'angular-smart-table';
import /* toaster from*/ 'angularjs-toaster';
import /* uiBoostrap from*/ 'angular-ui-bootstrap';
//import ui.bootstrap.fontawesome from 'ui.bootstrap.fontawesome';
//import /* ngFileUpload from*/ 'angular-file-upload';
import /* ngFileSaver from*/ 'angular-file-saver';
import /* ngStorage from*/ 'ngstorage';
import 'angular-zxcvbn';
import 'zxcvbn';
import 'angular-ui-router';

// import app modules
import administration from './pages/administration/index';
import /* adminModule from*/ './admin/index';
import /* chartsModule from*/ './pages/charts/index';
import /* chplApiModule from*/ './pages/resources/chpl-api/index';
import /* cmsLookupModule from*/ './pages/resources/cms-lookup/index';
import /* collectionsModule from*/ './pages/collections/index';
import /* compareModule from*/ './pages/compare/index';
import /* componentsModule from*/ './components/index';
import dashboard from './pages/dashboard/index';
import /* downloadModule from*/ './pages/resources/download/index';
import listing from './pages/listing/index';
import /* navigationModule from*/ './navigation/index';
import /* overviewModule from*/ './pages/resources/overview/index';
import organizations from './pages/organizations/index';
import reports from './pages/reports/index';
import /* registrationModule from*/ './pages/registration/index';
import /* searchModule from*/ './pages/search/index';
import services from './services/index';
import /* sharedModule from*/ './shared/index';
import surveillance from './pages/surveillance/index';
import users from './pages/users/index';

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
    'zxcvbn',
    administration.name,
    dashboard.name,
    listing.name,
    organizations.name,
    reports.name,
    services.name,
    surveillance.name,
    users.name,
    'chpl.admin',
    'chpl.charts',
    'chpl.chpl_api',
    'chpl.cms_lookup',
    'chpl.collections',
    'chpl.compare',
    'chpl.components',
    'chpl.constants',
    'chpl.download',
    'chpl.navigation',
    'chpl.overview',
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
