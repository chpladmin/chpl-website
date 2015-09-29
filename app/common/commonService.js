;(function () {
    'use strict';

    angular.module('app.common')
        .service('commonService', function ($http, $q, devAPI, API, $log) {
            var self = this;

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

            self.postApiCall = function (endpoint, workingApi, postObject) {
                return $http.post(workingApi + endpoint, postObject)
                    .then(function (response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            return $q.reject(response);
                        }
                    }, function (response) {
                        return $q.reject(response);
                    });
            };

            self.search = function (queryObj, pageNum, pageSize) {
                return self.postApiCall('/search', API, queryObj);
            };

            self.getSearchOptions = function () {
                return self.simpleApiCall('/populate_search_options', API);
            };

            self.getProduct = function (productId) {
                return self.simpleApiCall('/certified_products/' + productId + '/details', API);
            };

            self.getVendors = function () {
                return self.simpleApiCall('/vendors/', API);
            };

            self.getProductsByVendor = function (vendorId) {
                return self.simpleApiCall('/products/?vendorId=' + vendorId, API);
            };

            self.getVersionsByProduct = function (productId) {
                return self.simpleApiCall('/versions/?productId=' + productId, API);
            };

            self.getProductsByVersion = function (versionId) {
                return self.simpleApiCall('/certified_products/?versionId=' + versionId, API);
            };
/*
            self.getCerts = function () {
                return self.simpleApiCall('/list_certs', devAPI);
            };

            self.getCQMs = function () {
                return self.simpleApiCall('/list_cqms', devAPI);
            };
*/
            self.getEditions = function () {
                return self.simpleApiCall('/data/certification_editions', API);
            };

            self.getClassifications = function () {
                return self.simpleApiCall('/data/classification_types', API);
            };

            self.getPractices = function () {
                return self.simpleApiCall('/data/practice_types', API);
            };
/*
            self.getVendorNames = function () {
                return self.simpleApiCall('/list_vendor_names', API);
            };

            self.getProductNames = function () {
                return self.simpleApiCall('/list_product_names', API);
            };
*/
            self.getCertBodies = function () {
                return self.simpleApiCall('/data/certification_bodies', API);
            };
/*
            self.getCertsNCQMs = function () {
                return self.simpleApiCall('/list_filterCerts', devAPI);
            };
*/
            self.getCertifiedProductActivity = function () {
                return self.simpleApiCall('/activity/certified_products', API);
            };

            self.getVendorActivity = function () {
                return self.simpleApiCall('/activity/vendors', API);
            };

            self.getProductActivity = function () {
                return self.simpleApiCall('/activity/products', API);
            };

            self.getAcbActivity = function () {
                return self.simpleApiCall('/activity/acbs', API);
            };

            self.getUploadingCps = function () {
                return self.simpleApiCall('/certified_products/pending', API);
            };

            self.keepalive = function (token) {
                return self.postApiCall('/auth/keepalive', API, token)
            };
        });
})();
