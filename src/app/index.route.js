/* global UAT_MODE */

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
        .config(collectionsState)
        .config(reportsState)
        .config(resourcesState);

    if (UAT_MODE) {
        angular
            .module('chpl')
            .config(organizationsState);
    }

    function routeConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            /*.state('admin', {
                abstract: true,
                url: '/admin',
                template: '<ui-view/>',
            })*/
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
            .state('admin.reports', {
                url: '/reports',
                component: 'ReportsListingsComponent',
                data: { title: 'CHPL Adminstration' },
            })
            .state('admin.reports.listings', {
                url: '/listings',
                component: 'ReportsListingsComponent',
                data: { title: 'CHPL Adminstration' },
            })
            .state('admin.reports.listings.listingId', {
                url: '/{listingId}',
                component: 'ReportsListingsComponent',
                params: {
                    listingId: {squash: true, value: null},
                },
                data: { title: 'CHPL Adminstration' },
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
        if (UAT_MODE) {
            $stateProvider
                .state('listing', {
                    url: '/listing/{id}/{initialPanel}',
                    params: {
                        initialPanel: {squash: true, value: null},
                    },
                    component: 'chplListing',
                    data: { title: 'CHPL Product Details' },
                })
                .state('product', { //temporary redirect
                    url: '/product/{id}',
                    redirectTo: trans => {
                        return {
                            state: 'listing',
                            params: {
                                id: trans.params().id,
                            },
                        }
                    },
                })
                .state('product_initial_panel', { //temporary redirect
                    url: '/product/{id}/{initialPanel}',
                    redirectTo: trans => {
                        return {
                            state: 'listing',
                            params: {
                                id: trans.params().id,
                                initialPanel: trans.params().initialPanel,
                            },
                        }
                    },
                });
        } else {
            $stateProvider
                .state('product', {
                    url: '/product/{id}/{initialPanel}',
                    params: {
                        initialPanel: {squash: true, value: null},
                    },
                    template: require('./product/product.html'),
                    controller: 'ProductController',
                    controllerAs: 'vm',
                    data: { title: 'CHPL Product Details' },
                })
        }

        $urlRouterProvider.otherwise('/search');
    }
})();
