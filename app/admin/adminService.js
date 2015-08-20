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
        });
})();
