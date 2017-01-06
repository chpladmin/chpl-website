(function() {
    'use strict';

    angular
        .module('chpl')
        .config(routeConfig);

    function routeConfig($routeProvider) {
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
                title: 'Decertified Developers'
            })
            .when('/decertifications/products', {
                controller: 'DecertifiedProductsController',
                controllerAs: 'vm',
                templateUrl: 'app/decertifications/products/products.html',
                title: 'Decertified Products'
            })
            .when('/overview', {
                templateUrl: 'app/overview/overview.html',
                controller: 'OverviewController',
                controllerAs: 'vm',
                title: 'CHPL Overview'
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
            .when('/resources', {
                templateUrl: 'app/resources/resources.html',
                controller: 'ResourcesController',
                controllerAs: 'vm',
                title: 'CHPL Resources'
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
