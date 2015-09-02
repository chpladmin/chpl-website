;(function () {
    'use strict';

    angular.module('app.admin')
        .service('adminService', ['$http', '$q', 'API', '$log', 'commonService', function ($http, $q, API, $log, commonService) {
            var self = this;

            self.updateVendor = function (vendorObject) {
                return commonService.postApiCall('/vendor/update_vendor', API, vendorObject);
            };

            self.updateProduct = function (productObject) {
                return commonService.postApiCall('/product/update_product', API, productObject);
            };

            self.updateVersion = function (versionObject) {
                return commonService.postApiCall('/product/version/update_version', API, versionObject);
            };

            self.getAcbs = function () {
                return commonService.simpleApiCall('/acb/list_acbs', API);
            };

            self.getUsersAtAcb = function (acbId) {
                return commonService.simpleApiCall('/acb/list_users/' + acbId, API);
            };

            self.createACB = function (acb) {
                return commonService.postApiCall('/acb/create', API, acb)
            };

            self.modifyACB = function (acb) {
                return commonService.postApiCall('/acb/update', API, acb)
            };

            self.deleteACB = function (acbId) {
                return commonService.postApiCall('/acb/delete/' + acbId, API, {})
            };
        }]);
})();
