;(function () {
    'use strict';

    angular.module('app.api')
        .service('apiService', function ($http, $q, searchAPI) {
            var self = this;

            self.getApiCalls = function () {
                return $http.get(searchAPI + '/list_api_calls')
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            return $q.reject(response.data);
                        }
                    }, function (response) {
                        return $q.reject(response.data);
                    });
            };

            self.getApiEntities = function () {
                return $http.get(searchAPI + '/list_api_entities')
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            return $q.reject(response.data);
                        }
                    }, function (response) {
                        return $q.reject(response.data);
                    });
            };
        });
})();
