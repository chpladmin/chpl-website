;(function () {
    'use strict';

    angular.module('app.decertifications', ['ngRoute', 'app.common'])
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/decertifications/developers', {
                controller: 'DecertifiedDevelopersController',
                controllerAs: 'vm',
                templateUrl: 'decertifications/developers/developers.html',
                title: 'Decertified Developers'
            });
        }]);
})();
