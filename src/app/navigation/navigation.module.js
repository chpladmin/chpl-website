(function () {
    'use strict';

    /** @ngInclude */
    function authInterceptor (API, authService, toaster) {
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

            response: function (response) {
                // Pop up a notification if the CHPL ID changed
                if (response.headers && response.headers()['chpl-id-changed']) {
                    toaster.pop({
                        type: 'success',
                        title: 'CHPL ID Changed',
                        body: 'Your activity caused the CHPL Product Identifier to change. It used to be: "' + response.headers()['chpl-id-changed'] + '"'
                    });
                }
                // If a token was sent back, save it
                if (response.config.url.indexOf(API) === 0) {
                    try {
                        if (angular.isString(response.data)) {
                            response.data = angular.fromJson(response.data);
                        }
                        if (response.data.token) {
                            authService.saveToken(response.data.token);
                        }
                    } catch (e) {
                        //console.log('data is not json', response.config.url, response.data, e);
                    }
                }
                return response;
            }
        }
    }

    angular.module('chpl.navigation', ['chpl.loginServices', 'chpl.common', 'chpl.constants', 'ngRoute', 'toaster'])
        .factory('authInterceptor', authInterceptor)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        });
})();
