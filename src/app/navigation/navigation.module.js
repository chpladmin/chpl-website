(function () {
    'use strict';

    angular.module('chpl.navigation', [
        'chpl.services',
        'chpl.constants',
        'feature-flags',
        'ngIdle',
        'toaster',
        'ui.router',
    ])
        .factory('authInterceptor', authInterceptor)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        });

    /** @ngInclude */
    function authInterceptor ($log, API, authService, toaster) {
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
                if (response.headers && response.headers()['cache-cleared']) {
                    parseCacheCleared(response.headers()['cache-cleared']);
                }
                if (response.headers && response.headers()['chpl-id-changed']) {
                    parseChplIdChanged(response.headers()['chpl-id-changed']);
                }
                if (response.config.url.indexOf(API) === 0) {
                    response.data = parseToken(response.data);
                }
                if (response.data && response.data.error === 'Invalid authentication token.' && authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
                    authService.logout();
                }
                return response;
            },
        }

        ////////////////////////////////////////////////////////////////////////

        // Notify if a cache is being cleared
        function parseCacheCleared (value) {
            var caches = value.split(',');
            var body, title;
            for (var i = 0; i < caches.length; i++) {
                switch (caches[i]) {
                case 'listingCollection':
                    title = 'Update processing';
                    body = 'Your changes may not be reflected immediately in the search results and shortcuts pages. Please contact CHPL admin if you have any concerns';
                    break;
                    //no default
                }
            }
            toaster.pop({
                type: 'warning',
                title: title,
                body: body,
            });
        }

        // Notify if the CHPL ID changed
        function parseChplIdChanged (id) {
            var body, title;
            if (id.indexOf(',') > -1) {
                title = 'CHPL IDs Changed';
                body = 'Your activity caused CHPL Product Numbers to change';
            } else {
                title = 'CHPL ID Changed';
                body = 'Your activity caused a CHPL Product Number to change';
            }
            toaster.pop({
                type: 'success',
                title: title,
                body: body,
            });
        }

        // If a token was sent back, save it
        function parseToken (data) {
            try {
                if (angular.isString(data)) {
                    data = angular.fromJson(data);
                }
                if (data.token) {
                    authService.saveToken(data.token);
                }
            } catch (e) {
                //console.log('data is not json', response.config.url, response.data, e);
            }
            return data;
        }
    }
})();
