;(function () {
    'use strict';

    angular.module('app.admin')
        .service('adminService', function ($http, $q, API, $log) {
            var self = this;

            self.updateVendor = function (vendorObject) {
                return $http.post(API + '/vendor/update_vendor', vendorObject)
                    .then(function (response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            return response;
                        }
                    }, function (response) {
                        return response;
                    });
            };

            self.updateProduct = function (productObject) {
                return $http.post(API + '/product/update_product', productObject)
                    .then(function (response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            return response;
                        }
                    }, function (response) {
                        return response;
                    });
            };

            self.updateVersion = function (versionObject) {
                return $http.post(API + '/product/version/update_version', versionObject)
                    .then(function (response) {
                        if (typeof response.data === 'object') {
                            return response.data;
                        } else {
                            return response;
                        }
                    }, function (response) {
                        return response;
                    });
            };
        });
})();
