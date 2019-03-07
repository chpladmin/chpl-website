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
            .state('charts', {
                url: '/charts',
                controller: 'ChartsController',
                controllerAs: 'vm',
                template: require('./charts/charts.html'),
                data: { title: 'CHPL Charts' },
            })
            .state('collections', {
                abstract: true,
                url: '/collections',
                template: '<ui-view/>',
            })
            .state('collections.apiDocumentation', {
                url: '/apiDocumentation',
                controller: 'ApiDocumentationController',
                controllerAs: 'vm',
                template: require('./collections/apiDocumentation/apiDocumentation.html'),
                data: { title: 'API Information for 2015 Edition Products' },
            })
            .state('collections.correctiveAction', {
                url: '/correctiveAction',
                controller: 'CorrectiveActionController',
                controllerAs: 'vm',
                template: require('./collections/correctiveAction/correctiveAction.html'),
                data: { title: 'Products: Corrective Action Status' },
            })
            .state('collections.developers', {
                url: '/developers',
                controller: 'BannedDevelopersController',
                controllerAs: 'vm',
                template: require('./collections/developers/developers.html'),
                data: { title: 'Banned Developers' },
            })
            .state('collections.inactive', {
                url: '/inactive',
                controller: 'InactiveCertificatesController',
                controllerAs: 'vm',
                template: require('./collections/inactive/inactive.html'),
                data: { title: 'Inactive Certificates' },
            })
            .state('collections.products', {
                url: '/products',
                controller: 'DecertifiedProductsController',
                controllerAs: 'vm',
                template: require('./collections/products/products.html'),
                data: { title: 'Decertified Products' },
            })
            .state('collections.sed', {
                url: '/sed',
                controller: 'SedCollectionController',
                controllerAs: 'vm',
                template: require('./collections/sed/sed.html'),
                data: { title: 'SED Information for 2014 &amp; 2015 Edition Products' },
            })
            .state('collections.transparencyAttestations', {
                url: '/transparencyAttestations',
                controller: 'TransparencyAttestationsController',
                controllerAs: 'vm',
                template: require('./collections/transparencyAttestations/transparencyAttestations.html'),
                data: { title: 'Transparency Attestations' },
            })
            .state('compare', {
                url: '/compare/{compareIds}',
                controller: 'CompareController',
                controllerAs: 'vm',
                template: require('./compare/compare.html'),
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
                template: require('./registration/create-user.html'),
                controller: 'CreateController',
                controllerAs: 'vm',
                data: { title: 'CHPL Registration' },
            })
            .state('registration.confirm-user}', {
                url: '/confirm-user/{hash}',
                template: require('./registration/confirm-user.html'),
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
                url: '/chpl_api',
                template: require('./resources/chpl_api/chpl_api.html'),
                controller: 'ChplApiController',
                controllerAs: 'vm',
                data: { title: 'CHPL API' },
            })
            .state('resources.cms_lookup', {
                url: '/cms_lookup',
                template: require('./resources/cms_lookup/cms_lookup.html'),
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
                template: require('./search/search.html'),
                data: { title: 'CHPL Search' },
            });
        $urlRouterProvider.otherwise('/search');
    }
})();
