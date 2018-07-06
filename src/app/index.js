//import $ from 'jquery';
//import _ from 'lodash';
// other global deps

import angular from 'angular';
//import angular-confirm from 'angular-confirm';
import 'angular-loading-bar';
import angulartics from 'angulartics';
import angularticsGoogleTagManager from 'angulartics-google-tag-manager';
import googlechart from 'angular-google-chart';
//import ngAnimate from 'ngAnimate';
//import ngAria from 'ngAria';
//import ngCsv from 'ngCsv';
//import cytoscape from 'cytoscape';
//import ngMessages from 'ngMessages';
import ngResource from 'angular-resource';
import ngRoute from 'angular-route';
import ngSanitize from 'angular-sanitize';
//import ngTouch from 'ngTouch';
import smartTable from 'angular-smart-table';
import toaster from 'angularjs-toaster';
import uiBoostrap from 'angular-ui-bootstrap';
//import ui.bootstrap.fontawesome from 'ui.bootstrap.fontawesome';
import ngFileSaver from 'angular-file-saver';
import ngStorage from 'ngstorage';

// import app modules
//import adminModule from './admin/index';
import chartsModule from './charts/index';
import chplApiModule from './resources/chpl_api/index';
import cmsLookupModule from './resources/cms_lookup/index';
import collectionsModule from './collections/index';
//import compareModule from './compare/index';
import componentsModule from './components/index';
import downloadModule from './resources/download/index';
import navigationModule from './navigation/index';
import overviewModule from './resources/overview/index';
import productModule from './product/index';
import registrationModule from './registration/index';
import searchModule from './search/index';
import servicesModule from './services/index';

require('./index.constants');

const dependencies = [
    //    'angular-confirm',
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.tagmanager',
    //    'chpl.admin',
    'chpl.charts',
    'chpl.chpl_api',
    'chpl.cms_lookup',
    'chpl.collections',
    //    'chpl.compare',
    'chpl.components',
    'chpl.constants',
    'chpl.download',
    'chpl.navigation',
    'chpl.overview',
    'chpl.product',
    'chpl.registration',
    'chpl.search',
    'chpl.services',
    'googlechart',
    //    'ngAnimate',
    //    'ngAria',
    //    'ngCsv',
    //'ngCytoscape',
    //    'ngMessages',
    'ngFileSaver',
    'ngResource',
    'ngRoute',
    'ngStorage',
    'ngSanitize',
    //    'ngTouch',
    //    'swaggerUi',
    'smart-table',
    'toaster',
    'ui.bootstrap',
    //    'ui.bootstrap',
    //    'ui.bootstrap.fontawesome',
];

const appModule = angular.module('chpl', dependencies);

require('./index.route');
require('./index.run');
require('./templates');

export default appModule;
