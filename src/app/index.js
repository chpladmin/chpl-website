//import $ from 'jquery';
//import _ from 'lodash';
// other global deps

import angular from 'angular';
// other angular deps
//import angular-confirm from 'angular-confirm';
import 'angular-loading-bar';
//import angulartics from 'angulartics';
//import angulartics.google.tagmanager from 'angulartics.google.tagmanager';
//import googlechart from 'googlechart';
//import ngAnimate from 'ngAnimate';
//import ngAria from 'ngAria';
//import ngCsv from 'ngCsv';
//import ngCytoscape from 'ngCytoscape';
//import ngMessages from 'ngMessages';
//import ngResource from 'ngResource';
import ngRoute from 'angular-route';
//import ngSanitize from 'ngSanitize';
//import ngTouch from 'ngTouch';
//import swaggerUi from 'swaggerUi';
//import toaster from 'toaster';
//import ui.bootstrap from 'ui.bootstrap';
//import ui.bootstrap.fontawesome from 'ui.bootstrap.fontawesome';
import ngFileSaver from 'angular-file-saver';
import ngStorage from 'ngstorage';

// import app modules
//import adminModule from './admin/index';
//import chartsModule from './charts/index';
//import chpl_apiModule from './resources/chpl_api/index';
//import cms_lookupModule from './resources/cms_lookup/index';
//import collectionsModule from './collections/index';
//import compareModule from './compare/index';
//import compare-widgetModule from './compare-widget/index';
//import constantsModule from './common/index';
//import downloadModule from './resources/download/index';
//import navigationModule from './navigation/index';
import overviewModule from './resources/overview/index';
//import productModule from './product/index';
//import registrationModule from './registration/index';
//import searchModule from './search/index';
import servicesModule from './services/index';
require('./index.constants');

const dependencies = [
    //    'angular-confirm',
    'angular-loading-bar',
    //    'angulartics',
    //    'angulartics.google.tagmanager',
    //    'chpl.admin',
    //    'chpl.charts',
    //    'chpl.chpl_api',
    //    'chpl.cms_lookup',
    //    'chpl.collections',
    //    'chpl.compare',
    //    'chpl.compare-widget',
    'chpl.constants',
    //    'chpl.download',
    //    'chpl.navigation',
    'chpl.overview',
    //    'chpl.product',
    //    'chpl.registration',
    //    'chpl.search',
    'chpl.services',
    //    'googlechart',
    //    'ngAnimate',
    //    'ngAria',
    //    'ngCsv',
    //    'ngCytoscape',
    //    'ngMessages',
    //    'ngResource',
    'ngRoute',
    'ngFileSaver',
    'ngStorage',
    //    'ngSanitize',
    //    'ngTouch',
    //    'swaggerUi',
    //    'toaster',
    //    'ui.bootstrap',
    //    'ui.bootstrap.fontawesome',
];

function routeConfig ($routeProvider) {
    $routeProvider
        .when('/resources/overview', {
            templateUrl: 'src/app/overview/overview.html',
            controller: 'OverviewController',
            controllerAs: 'vm',
            title: 'CHPL Overview',
        })
        .otherwise({
            redirectTo: '/resources/overview',
        });
}

const appModule = angular
          .module('chpl', dependencies);

require('./index.route');
require('./templates');

export default appModule;
