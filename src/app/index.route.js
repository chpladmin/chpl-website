(function () {
    'use strict';

    angular
        .module('chpl')
        .config(routeConfig);

    function routeConfig ($routeProvider) {
        $routeProvider
            .when('/admin/:section?/:subSection?/:productId?', {
                templateUrl: 'app/admin/admin.html',
                controller: 'AdminController',
                controllerAs: 'vm',
                title: 'CHPL Administration'
            })
            .when('/compare/:compareIds', {
                controller: 'CompareController',
                controllerAs: 'vm',
                templateUrl: 'app/compare/compare.html',
                title: 'CHPL Product Comparison'
            })
            .when('/decertifications/developers', {
                controller: 'DecertifiedDevelopersController',
                controllerAs: 'vm',
                templateUrl: 'app/decertifications/developers/developers.html',
                title: 'Banned Developers'
            })
            .when('/decertifications/inactive', {
                controller: 'InactiveCertificationsController',
                controllerAs: 'vm',
                templateUrl: 'app/decertifications/inactive/inactive.html',
                title: 'Inactive Certificates'
            })
            .when('/decertifications/nonconformities', {
                controller: 'NonconformitiesController',
                controllerAs: 'vm',
                templateUrl: 'app/decertifications/nonconformities/nonconformities.html',
                title: 'Nonconformities'
            })
            .when('/decertifications/products', {
                controller: 'DecertifiedProductsController',
                controllerAs: 'vm',
                templateUrl: 'app/decertifications/products/products.html',
                title: 'Decertified Products'
            })
            .when('/product/:id', {
                templateUrl: 'app/product/product.html',
                controller: 'ProductController',
                controllerAs: 'vm',
                title: 'CHPL Product Details'
            })
            .when('/registration/create-user/:hash', {
                templateUrl: 'app/registration/create-user.html',
                controller: 'CreateController',
                controllerAs: 'vm',
                title: 'CHPL Registration'
            })
            .when('/registration/confirm-user/:hash', {
                templateUrl: 'app/registration/confirm-user.html',
                controller: 'ConfirmController',
                controllerAs: 'vm',
                title: 'CHPL Registration'
            })
            .when('/resources/chpl_api', {
                templateUrl: 'app/resources/chpl_api/chpl_api.html',
                controller: 'ChplApiController',
                controllerAs: 'vm',
                title: 'CHPL API'
            })
            .when('/resources/cms_lookup', {
                templateUrl: 'app/resources/cms_lookup/cms_lookup.html',
                controller: 'CmsLookupController',
                controllerAs: 'vm',
                title: 'CMS ID Reverse Lookup'
            })
            .when('/resources/download', {
                templateUrl: 'app/resources/download/download.html',
                controller: 'DownloadController',
                controllerAs: 'vm',
                title: 'Download the CHPL'
            })
            .when('/resources/overview', {
                templateUrl: 'app/resources/overview/overview.html',
                controller: 'OverviewController',
                controllerAs: 'vm',
                title: 'CHPL Overview'
            })
            .when('/search', {
                controller: 'SearchController',
                controllerAs: 'vm',
                templateUrl: 'app/search/search.html',
                title: 'CHPL Search'
            })
            .otherwise({
                redirectTo: '/search'
            });
    }
})();
