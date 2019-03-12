(function () {
    'use strict';

    angular
        .module('chpl')
        .config(routeConfig);

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
            .state('administration', {
                abstract: true,
                url: '/administration',
                template: '<ui-view/>',
            })
            .state('administration.merge', {
                abstract: true,
                url: '/merge',
                template: '<ui-view/>',
            })
            .state('administration.merge.developers', {
                url: '/developers/{developerId}',
                component: 'chplDeveloperMerge',
                resolve: {
                    developer: (networkService, $transition$) => networkService.getDeveloper($transition$.params().developerId),
                    developers: networkService => networkService.getDevelopers(),
                },
                data: { title: 'CHPL Administration - Merge - Developers' },
            })
            .state('charts', {
                url: '/charts',
                controller: 'ChartsController',
                controllerAs: 'vm',
                template: require('./pages/charts/charts.html'),
                data: { title: 'CHPL Charts' },
            })
            .state('collections', {
                abstract: true,
                url: '/collections',
                template: '<ui-view/>',
            })
            .state('collections.apiDocumentation', {
                url: '/api-documentation',
                controller: 'ApiDocumentationController',
                controllerAs: 'vm',
                template: require('./pages/collections/api-documentation/api-documentation.html'),
                data: { title: 'API Information for 2015 Edition Products' },
            })
            .state('collections.correctiveAction', {
                url: '/corrective-action',
                controller: 'CorrectiveActionController',
                controllerAs: 'vm',
                template: require('./pages/collections/corrective-action/corrective-action.html'),
                data: { title: 'Products: Corrective Action Status' },
            })
            .state('collections.developers', {
                url: '/developers',
                controller: 'BannedDevelopersController',
                controllerAs: 'vm',
                template: require('./pages/collections/developers/developers.html'),
                data: { title: 'Banned Developers' },
            })
            .state('collections.inactive', {
                url: '/inactive',
                controller: 'InactiveCertificatesController',
                controllerAs: 'vm',
                template: require('./pages/collections/inactive/inactive.html'),
                data: { title: 'Inactive Certificates' },
            })
            .state('collections.products', {
                url: '/products',
                controller: 'DecertifiedProductsController',
                controllerAs: 'vm',
                template: require('./pages/collections/products/products.html'),
                data: { title: 'Decertified Products' },
            })
            .state('collections.sed', {
                url: '/sed',
                controller: 'SedCollectionController',
                controllerAs: 'vm',
                template: require('./pages/collections/sed/sed.html'),
                data: { title: 'SED Information for 2014 &amp; 2015 Edition Products' },
            })
            .state('collections.transparencyAttestations', {
                url: '/transparency-attestations',
                controller: 'TransparencyAttestationsController',
                controllerAs: 'vm',
                template: require('./pages/collections/transparency-attestations/transparency-attestations.html'),
                data: { title: 'Transparency Attestations' },
            })
            .state('compare', {
                url: '/compare/{compareIds}',
                controller: 'CompareController',
                controllerAs: 'vm',
                template: require('./pages/compare/compare.html'),
                data: { title: 'CHPL Product Comparison' },
            })
            .state('listing', {
                url: '/listing/{id}/{initialPanel}',
                params: {
                    initialPanel: {squash: true, value: null},
                },
                component: 'chplListing',
                data: { title: 'CHPL Product Details' },
            })
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
            .state('resources', {
                abstract: true,
                url: '/resources',
                template: '<ui-view/>',
            })
            .state('resources.chpl_api', {
                url: '/chpl-api',
                template: require('./pages/resources/chpl-api/chpl-api.html'),
                controller: 'ChplApiController',
                controllerAs: 'vm',
                data: { title: 'CHPL API' },
            })
            .state('resources.cms_lookup', {
                url: '/cms-lookup',
                template: require('./pages/resources/cms-lookup/cms-lookup.html'),
                controller: 'CmsLookupController',
                controllerAs: 'vm',
                data: { title: 'CMS ID Reverse Lookup' },
            })
            .state('resources.download', {
                url: '/download',
                component: 'aiResourcesDownload',
                data: { title: 'Download the CHPL' },
            })
            .state('resources.overview', {
                url: '/overview',
                component: 'aiOverview',
                data: { title: 'CHPL Overview' },
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
