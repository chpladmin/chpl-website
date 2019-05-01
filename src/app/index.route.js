/* global DEVELOPER_MODE */

import { listingStateConfig } from './pages/listing/listing.state.js';

(function () {
    'use strict';

    let administrationState = require('./pages/administration/administration.state.js');
    let collectionsState = require('./pages/collections/collections.state.js');
    let organizationsState = require('./pages/organizations/organizations.state.js');
    let reportsState = require('./pages/reports/reports.state.js');
    let resourcesState = require('./pages/resources/resources.state.js');

    angular
        .module('chpl')
        .config(routeConfig)
        .config(administrationState)
        .config(listingStateConfig)
        .config(collectionsState)
        .config(reportsState)
        .config(resourcesState);

    if (DEVELOPER_MODE) {
        angular
            .module('chpl')
            .config(organizationsState);
    }

    function routeConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('admin', {
                url: '/admin/{section}/{subSection}/{productId}?',
                params: {
                    section: {squash: true, value: null},
                    subSection: {squash: true, value: null},
                    productId: {squash: true, value: null},
                },
                template: require('./admin/admin.html'),
                controller: 'AdminController',
                controllerAs: 'vm',
                data: { title: 'CHPL Administration' },
            })
            .state('admin.authorizePasswordReset', {
                url: '/admin/authorizePasswordReset',
                template: require('./admin/admin.html'),
                controller: 'AdminController',
                controllerAs: 'vm',
                data: { title: 'Password Reset' },
            })
            .state('charts', {
                url: '/charts',
                controller: 'ChartsController',
                controllerAs: 'vm',
                template: require('./pages/charts/charts.html'),
                data: { title: 'CHPL Charts' },
            })
            .state('compare', {
                url: '/compare/{compareIds}',
                controller: 'CompareController',
                controllerAs: 'vm',
                template: require('./pages/compare/compare.html'),
                data: { title: 'CHPL Product Comparison' },
            })
            .state('registration', {
                abstract: true,
                url: '/registration',
                template: '<ui-view/>',
            })
            .state('registration.create-user}', {
                url: '/create-user/{hash}',
                template: require('./pages/registration/create-user.html'),
                controller: 'CreateController',
                controllerAs: 'vm',
                data: { title: 'CHPL Registration' },
            })
            .state('registration.confirm-user}', {
                url: '/confirm-user/{hash}',
                template: require('./pages/registration/confirm-user.html'),
                controller: 'ConfirmController',
                controllerAs: 'vm',
                data: { title: 'CHPL Registration' },
            })
            .state('search', {
                url: '/search',
                controller: 'SearchController',
                controllerAs: 'vm',
                template: require('./pages/search/search.html'),
                data: { title: 'CHPL Search' },
            });

        $urlRouterProvider.otherwise('/search');
    }
})();
