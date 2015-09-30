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

    angular.module('app.nav', ['ngRoute', 'ngIdle', 'app.loginServices', 'app.common'])
        .factory('authInterceptor', authInterceptor)
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        })
        .config(['$routeProvider', function($routeProvider) {
            $routeProvider.when('/privacy', {
                templateUrl: 'nav/layouts/privacy.html'
            });
        }])
        .config(function(IdleProvider, KeepaliveProvider) {
            // configure Idle settings
            IdleProvider.idle(60 * 20); // in seconds
            IdleProvider.timeout(false); // in seconds
            KeepaliveProvider.interval(60 * 10); // in seconds
        });
})();
