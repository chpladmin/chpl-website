;(function () {
    'use strict';

    function authInterceptor (API, authService) {
        return {
            // automatically attach Authorization header
            request: function (config) {
                var token = authService.getToken();
                var api_key = authService.getApiKey();
                if (config.url.indexOf(API) === 0) {
                    config.headers['API-Key'] = api_key;
                    if (token) {
                        config.headers.Authorization = 'Bearer ' + token;
                    }
                }

                return config;
            },

            // If a token was sent back, save it
            response: function (response) {
                if (response.config.url.indexOf(API) === 0) {
                    if (typeof response.data === 'string') {
                        response.data = JSON.parse(response.data);
                    }
                    if (response.data.token) {
                        authService.saveToken(response.data.token);
                    }
                }
                return response;
            }
        }
    }

    angular.module('app.nav', ['ngRoute', 'app.loginServices', 'app.common'])
        .factory('authInterceptor', authInterceptor)
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        })
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/listing', {
                templateUrl: 'nav/layouts/product_listing.html'
            });
        }]);
})();
