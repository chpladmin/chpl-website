;(function () {
    'use strict';

    function authInterceptor (API, authService) {
        return {
            // automatically attach Authorization header
            request: function (config) {
                var token = authService.getToken();
                if (config.url.indexOf(API) === 0 && token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },

            // If a token was sent back, save it
            response: function (response) {
                if (response.config.url.indexOf(API) === 0 && response.data.token ) {
                    authService.saveToken(response.data.token);
                }

                return response;
            }
        }
    }

    angular.module('app.nav', ['ngRoute', 'app.loginServices'])
        .factory('authInterceptor', authInterceptor)
        .constant('API', 'http://test-routes.herokuapp.com')
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        })
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/privacy', {
                templateUrl: 'nav/layouts/privacy.html'
            });
        }]);
})();
