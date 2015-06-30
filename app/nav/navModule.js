;(function () {
    'use strict';

    function authInterceptor(API, authService) {
        return {
            // automatically attach Authorization header
            request: function(config) {
                var token = authService.getToken();
                if (config.url.indexOf(API) === 0 && token) {
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },

            // If a token was sent back, save it
            response: function(res) {
                if (res.config.url.indexOf(API) === 0 && res.data.token ) {
                    authService.saveToken(res.data.token);
                }

                return res;
            },
        }
    }

    angular.module('app.nav', ['loginServices'])
        .factory('authInterceptor', authInterceptor)
        .constant('API', 'http://test-routes.herokuapp.com')
        .config(function($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        });
})();
