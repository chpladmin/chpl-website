;(function () {
    'use strict';

    angular.module('app.common')
        .service('commonService', function ($http, $q, searchAPI) {
            var self = this;

            self.extractInfo = function (data) {
                var numCerts;
                var numCQMs;

                for (var i = 0; i < data.length; i++) {
                    if (data[i].certs !== null && typeof(data[i].certs) !== 'undefined') {
                        for (var j = 0; j < 4; j++) {
                            numCerts = 0;
                            for (var k = 0; k < data[i].certs[j].certs.length; k++) {
                                numCerts += data[i].certs[j].certs[k].isActive ? 1 : 0;
                            }

                            data[i].certs[j].numActive = numCerts;
                        }
                        data[i].numCerts = data[i].certs[0].numActive + data[i].certs[1].numActive;
                        data[i].numCQMs = data[i].certs[2].numActive + data[i].certs[3].numActive;
                    }
                }
                return data;
            };

            self.simpleApiCall = function (endpoint) {
                return $http.get(searchAPI + endpoint)
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

            self.search = function (query) {
                return $http.get(searchAPI + '/search?q=' + query)
                    .then(function (response) {
                        if (typeof response.data === 'object') {
                            return self.extractInfo(response.data);
                        } else {
                            return $q.reject(response.data);
                        }
                    }, function (response) {
                        return $q.reject(response.data);
                    });
            };

            self.getProduct = function (productId) {
                return $http.get(searchAPI + '/get_product?id=' + productId)
                    .then(function (response) {
                        if (typeof response.data === 'object') {
                            return self.extractInfo([response.data])[0];
                        } else {
                            return $q.reject(response.data);
                        }
                    }, function (response) {
                        return $q.reject(response.data);
                    });
            };

            self.getCerts = function () {
                return self.simpleApiCall('/list_certs');
            };

            self.getCQMs = function () {
                return self.simpleApiCall('/list_cqms');
            };

            self.getEditions = function () {
                return self.simpleApiCall('/list_editions');
            };

            self.getClassifications = function () {
                return self.simpleApiCall('/list_classifications');
            };

            self.getPractices = function () {
                return self.simpleApiCall('/list_practices');
            };

            self.getVendors = function () {
                return self.simpleApiCall('/list_vendors');
            };

            self.getProducts = function () {
                return self.simpleApiCall('/list_products');
            };

            self.getCertBodies = function () {
                return self.simpleApiCall('/list_certBodies');
            };

            self.getCertsNCQMs = function () {
                return self.simpleApiCall('/list_filterCerts');
            };
        });
})();
