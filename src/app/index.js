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
import /* angularConfirm from*/ 'angular-confirm';
import /* angularCronGen from*/ 'angular-cron-gen';
import /* angularLoadingBar from*/ 'angular-loading-bar';
import /* angulartics from*/ 'angulartics';
import /* angularticsGoogleTagManager from*/ 'angulartics-google-tag-manager';
import /* googlechart from*/ 'angular-google-chart';
import /* ngAnimate from*/ 'angular-animate';
import /* ngAria from*/ 'angular-aria';
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
import /* ngFileUpload from*/ 'angular-file-upload';
import /* ngFileSaver from*/ 'angular-file-saver';
import /* ngStorage from*/ 'ngstorage';
import 'angular-zxcvbn';
import 'zxcvbn';
import 'angular-ui-router';

// import app modules
import /* adminModule from*/ './admin/index';
import /* chartsModule from*/ './charts/index';
import /* chplApiModule from*/ './resources/chpl_api/index';
import /* cmsLookupModule from*/ './resources/cms_lookup/index';
import /* collectionsModule from*/ './collections/index';
import /* compareModule from*/ './compare/index';
import /* componentsModule from*/ './components/index';
import /* downloadModule from*/ './resources/download/index';
import chplListing from './listing/index';
import /* navigationModule from*/ './navigation/index';
import /* overviewModule from*/ './resources/overview/index';
import /* productModule from*/ './product/index';
import /* registrationModule from*/ './registration/index';
import /* searchModule from*/ './search/index';
import /* servicesModule from*/ './services/index';
import /* sharedModule from*/ './shared/index';

require('./index.constants');

const dependencies = [
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.tagmanager',
    'chpl.admin',
    'chpl.charts',
    'chpl.chpl_api',
    'chpl.cms_lookup',
    'chpl.collections',
    'chpl.compare',
    'chpl.components',
    'chpl.constants',
    'chpl.download',
    chplListing.name,
    'chpl.navigation',
    'chpl.overview',
    'chpl.product',
    'chpl.registration',
    'chpl.search',
    'chpl.services',
    'chpl.shared',
    'googlechart',
    'ngAnimate',
    'ngAria',
    'ngCytoscape',
    //    'ngMessages',
    'ngFileSaver',
    'ngResource',
    'ngStorage',
    'ngSanitize',
    //    'ngTouch',
    'smart-table',
    'toaster',
    'ui.bootstrap',
    'ui.router',
    //    'ui.bootstrap.fontawesome',
    'zxcvbn',
];

const appModule = angular.module('chpl', dependencies);

require('./index.route');
require('./index.run');
require('./templates');
require('./index.config');

export default appModule;
