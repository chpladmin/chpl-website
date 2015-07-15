;(function () {
    'use strict';

    angular.module('app.product')
        .service('productService', function ($http, $q, searchAPI) {
            var self = this;

            self.search = function (query) {
                return $http.get(searchAPI + '/search?q=' + query)
                    .then(function(response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            return $q.reject(response.data);
                        }
                    }, function (reponse) {
                        return $q.reject(response.data);
                    });
            };
        });
})();
