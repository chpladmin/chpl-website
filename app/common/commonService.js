;(function () {
    'use strict';

    angular.module('app.common')
        .service('commonService', function ($http, $q, devAPI, API) {
            var self = this;

            self.extractInfo = function (data) {
                var numCerts;
                var numCQMs;

                for (var i = 0; i < data.length; i++) {
                    if (data[i].certs !== null && typeof(data[i].certs) !== 'undefined') {
                        for (var j = 0; j < 3; j++) {
                            numCerts = 0;
                            for (var k = 0; k < data[i].certs[j].certs.length; k++) {
                                numCerts += data[i].certs[j].certs[k].isActive ? 1 : 0;
                            }

                            data[i].certs[j].numActive = numCerts;
                        }
                        data[i].numCerts = data[i].certs[0].numActive + data[i].certs[1].numActive;
                        data[i].numCQMs = data[i].certs[2].numActive;
                    }
                }
                return data;
            };

            self.simpleApiCall = function (endpoint, workingApi) {
                return $http.get(workingApi + endpoint)
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
                return $http.get(devAPI + '/search?q=' + query)
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
                return $http.get(devAPI + '/get_product?id=' + productId)
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
                return self.simpleApiCall('/list_certs', devAPI);
            };

            self.getCQMs = function () {
                return self.simpleApiCall('/list_cqms', devAPI);
            };

            self.getEditions = function () {
                return self.simpleApiCall('/list_editions', devAPI);
            };

            self.getClassifications = function () {
                return self.simpleApiCall('/list_classifications', devAPI);
            };

            self.getPractices = function () {
                return self.simpleApiCall('/list_practices', devAPI);
            };

            self.getVendors = function () {
                return self.simpleApiCall('/vendor/list_vendors', API);
            };

            self.getProducts = function () {
                return self.simpleApiCall('/list_products', devAPI);
            };

            self.getProductsByVendor = function (vendorId) {
                return self.simpleApiCall('/product/list_products_by_vendor?vendorId=' + vendorId, API);
            };

            self.getVersionsByProduct = function (productId) {
                return self.simpleApiCall('/product/version/list_versions_by_product?productId=' + productId, API);
            };

            self.getCertBodies = function () {
                return self.simpleApiCall('/list_certBodies', devAPI);
            };

            self.getCertsNCQMs = function () {
                return self.simpleApiCall('/list_filterCerts', devAPI);
            };

            self.getCertifiedProductActivity = function () {
                return self.simpleApiCall('/list_certifiedProductActivity', devAPI);
            };

            self.getVendorActivity = function () {
                return self.simpleApiCall('/list_vendorActivity', devAPI);
            };

            self.getProductActivity = function () {
                return self.simpleApiCall('/list_productActivity', devAPI);
            };

            self.getAcbActivity = function () {
                return self.simpleApiCall('/list_acbActivity', devAPI);
            };

            self.getUploadingCps = function () {
                return self.simpleApiCall('/list_uploadingCps', devAPI);
            };
        });
})();
