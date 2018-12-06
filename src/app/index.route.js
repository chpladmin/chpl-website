(function () {
    'use strict';

    angular
        .module('chpl')
        .config(routeConfig);

    function routeConfig ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('/admin/:section?/:subSection?/:productId?', {
                url: '/admin/:section?/:subSection?/:productId?',
                template: require('./admin/admin.html'),
                controller: 'AdminController',
                controllerAs: 'vm',
                title: 'CHPL Administration',
            })
            .state('/admin/authorizePasswordReset', {
                url: '/admin/authorizePasswordReset',
                template: require('./admin/admin.html'),
                controller: 'AdminController',
                controllerAs: 'vm',
                title: 'Password Reset',
            })
            .state('/charts', {
                url: '/charts',
                controller: 'ChartsController',
                controllerAs: 'vm',
                template: require('./charts/charts.html'),
                title: 'CHPL Charts',
            })
            .state('/collections/apiDocumentation', {
                url: '/collections/apiDocumentation',
                controller: 'ApiDocumentationController',
                controllerAs: 'vm',
                template: require('./collections/apiDocumentation/apiDocumentation.html'),
                title: 'API Information for 2015 Edition Products',
            })
            .state('/collections/correctiveAction', {
                url: '/collections/correctiveAction',
                controller: 'CorrectiveActionController',
                controllerAs: 'vm',
                template: require('./collections/correctiveAction/correctiveAction.html'),
                title: 'Products: Corrective Action Status',
            })
            .state('/collections/developers', {
                url: '/collections/developers',
                controller: 'BannedDevelopersController',
                controllerAs: 'vm',
                template: require('./collections/developers/developers.html'),
                title: 'Banned Developers',
            })
            .state('/collections/inactive', {
                url: '/collections/inactive',
                controller: 'InactiveCertificatesController',
                controllerAs: 'vm',
                template: require('./collections/inactive/inactive.html'),
                title: 'Inactive Certificates',
            })
            .state('/collections/products', {
                url: '/collections/products',
                controller: 'DecertifiedProductsController',
                controllerAs: 'vm',
                template: require('./collections/products/products.html'),
                title: 'Decertified Products',
            })
            .state('/collections/sed', {
                url: '/collections/sed',
                controller: 'SedCollectionController',
                controllerAs: 'vm',
                template: require('./collections/sed/sed.html'),
                title: 'SED Information for 2014 &amp; 2015 Edition Products',
            })
            .state('/collections/transparencyAttestations', {
                url: '/collections/transparencyAttestations',
                controller: 'TransparencyAttestationsController',
                controllerAs: 'vm',
                template: require('./collections/transparencyAttestations/transparencyAttestations.html'),
                title: 'Transparency Attestations',
            })
            .state('/compare/:compareIds', {
                url: '/compare/:compareIds',
                controller: 'CompareController',
                controllerAs: 'vm',
                template: require('./compare/compare.html'),
                title: 'CHPL Product Comparison',
            })
            .state('/product', {
                url: '/product/:id/:initialPanel?',
                template: require('./product/product.html'),
                controller: 'ProductController',
                controllerAs: 'vm',
                title: 'CHPL Product Details',
            })
            .state('/registration/create-user/:hash', {
                url: '/registration/create-user/:hash',
                template: require('./registration/create-user.html'),
                controller: 'CreateController',
                controllerAs: 'vm',
                title: 'CHPL Registration',
            })
            .state('/registration/confirm-user/:hash', {
                url: '/registration/confirm-user/:hash',
                template: require('./registration/confirm-user.html'),
                controller: 'ConfirmController',
                controllerAs: 'vm',
                title: 'CHPL Registration',
            })
            .state('/resources/chpl_api', {
                url: '/resources/chpl_api',
                template: require('./resources/chpl_api/chpl_api.html'),
                controller: 'ChplApiController',
                controllerAs: 'vm',
                title: 'CHPL API',
            })
            .state('/resources/cms_lookup', {
                url: '/resources/cms_lookup',
                template: require('./resources/cms_lookup/cms_lookup.html'),
                controller: 'CmsLookupController',
                controllerAs: 'vm',
                title: 'CMS ID Reverse Lookup',
            })
            .state('/resources/download', {
                url: '/resources/download',
                template: require('./resources/download/download.html'),
                controller: 'DownloadController',
                controllerAs: 'vm',
                title: 'Download the CHPL',
            })
            .state('/resources/overview', {
                url: '/resources/overview',
                template: require('./resources/overview/overview.html'),
                controller: 'OverviewController',
                controllerAs: 'vm',
                title: 'CHPL Overview',
            })
            .state('/search', {
                url: '/search',
                controller: 'SearchController',
                controllerAs: 'vm',
                template: require('./search/search.html'),
                title: 'CHPL Search',
            });
        $urlRouterProvider.otherwise('/search');
    }
})();
