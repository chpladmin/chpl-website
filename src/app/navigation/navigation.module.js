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
                    var message, title, id = response.headers()['chpl-id-changed'];
                    if (id.indexOf(',') > -1) {
                        title = 'CHPL IDs Changed';
                        message = 'Your activity caused CHPL Product Numbers to change';
                    } else {
                        title = 'CHPL ID Changed';
                        message = 'Your activity caused a CHPL Product Number to change';
                    }
                    toaster.pop({
                        type: 'success',
                        title: title,
                        body: message,
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
            },
        }
    }

    angular.module('chpl.navigation', ['chpl.loginServices', 'chpl.common', 'chpl.constants', 'ngRoute', 'toaster'])
        .factory('authInterceptor', authInterceptor)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        });
})();
