;(function () {
    'use strict';

    angular.module('app.common')
        .service('commonService', function ($http, $q, API, $log) {
            var self = this;

            self.addressRequired = addressRequired;

            ////////////////////////////////////////////////////////////////////

            function addressRequired (address) {
                if (!address) return false;
                if (address.line1 && address.line1.length > 0) return true;
                if (address.line2 && address.line2.length > 0) return true;
                if (address.city && address.city.length > 0) return true;
                if (address.state && address.state.length > 0) return true;
                if (address.zipcode && address.zipcode.length > 0) return true;
                if (address.country && address.country.length > 0) return true;
                return false;
            }

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

            self.login = function (userObj) {
                return self.postApiCall('/auth/authenticate', API, userObj);
            };

            self.changePassword = function (userObj) {
                return self.postApiCall('/auth/change_password', API, userObj);
            };

            self.resetPassword = function (userObj) {
                return self.postApiCall('/auth/reset_password', API, userObj);
            };

            self.search = function (queryObj, pageNum, pageSize) {
                return self.postApiCall('/search', API, queryObj);
            };

            self.getSearchOptions = function () {
                return self.simpleApiCall('/data/search_options', API);
            };

            self.getSimpleProduct = function (productId) {
                return self.simpleApiCall('/products/' + productId, API);
            };

            self.getVersion = function (versionId) {
                return self.simpleApiCall('/versions/' + versionId, API);
            };

            self.getProduct = function (productId) {
                return self.simpleApiCall('/certified_products/' + productId + '/details', API);
            };

            self.getVendors = function () {
                return self.simpleApiCall('/vendors/', API);
            };

            self.getVendor = function (vendorId) {
                return self.simpleApiCall('/vendors/' + vendorId, API);
            };

            self.getProductsByVendor = function (vendorId) {
                return self.simpleApiCall('/products/?vendorId=' + vendorId, API);
            };

            self.getVersionsByProduct = function (productId) {
                return self.simpleApiCall('/versions/?productId=' + productId, API);
            };

            self.getProductsByVersion = function (versionId, editable) {
                return self.simpleApiCall('/certified_products/?versionId=' + versionId + '&editable=' + editable, API);
            };

            self.getEditions = function () {
                return self.simpleApiCall('/data/certification_editions', API);
            };

            self.getClassifications = function () {
                return self.simpleApiCall('/data/classification_types', API);
            };

            self.getPractices = function () {
                return self.simpleApiCall('/data/practice_types', API);
            };

            self.getCertificationStatuses = function () {
                return self.simpleApiCall('/data/certification_statuses', API);
            };

            self.getCertBodies = function () {
                return self.simpleApiCall('/data/certification_bodies', API);
            };

            self.getCertifiedProductActivity = function (nDays) {
                return self.simpleApiCall('/activity/certified_products?lastNDays=' + nDays, API);
            };

            self.getVendorActivity = function (nDays) {
                return self.simpleApiCall('/activity/vendors?lastNDays=' + nDays, API);
            };

            self.getProductActivity = function (nDays) {
                return self.simpleApiCall('/activity/products?lastNDays=' + nDays, API);
            };

            self.getAcbActivity = function (nDays) {
                return self.simpleApiCall('/activity/acbs?lastNDays=' + nDays, API);
            };

            self.getUploadingCps = function () {
                return self.simpleApiCall('/certified_products/pending', API);
            };

            self.keepalive = function () {
                return self.simpleApiCall('/auth/keep_alive', API);
            };

            self.updateVendor = function (vendorObject) {
                return self.postApiCall('/vendors/update', API, vendorObject);
            };

            self.updateProduct = function (productObject) {
                return self.postApiCall('/products/update', API, productObject);
            };

            self.updateVersion = function (versionObject) {
                return self.postApiCall('/versions/update', API, versionObject);
            };

            self.updateCP = function (cpObject) {
                return self.postApiCall('/certified_products/update', API, cpObject);
            };

            self.getAcbs = function () {
                return self.simpleApiCall('/acbs/', API);
            };

            self.getUsersAtAcb = function (acbId) {
                return self.simpleApiCall('/acbs/' + acbId + '/users', API);
            };

            self.createACB = function (acb) {
                return self.postApiCall('/acbs/create', API, acb)
            };

            self.modifyACB = function (acb) {
                return self.postApiCall('/acbs/update', API, acb)
            };

            self.deleteACB = function (acbId) {
                return self.postApiCall('/acbs/' + acbId + '/delete', API, {})
            };

            self.getUsers = function () {
                return self.simpleApiCall('/users/', API);
            };

            self.createUser = function (newUser) {
                return self.postApiCall('/users/create', API, newUser);
            };

            self.confirmUser = function (userObject) {
                return self.postApiCall('/users/confirm', API, userObject);
            };

            self.addRole = function (payload) {
                return self.postApiCall('/users/grant_role', API, payload);
            };

            self.revokeRole = function (payload) {
                return self.postApiCall('/users/revoke_role', API, payload);
            };

            self.updateUser = function (user) {
                return self.postApiCall('/users/update', API, user);
            };

            self.deleteUser = function (userId) {
                return self.postApiCall('/users/' + userId + '/delete', API, {});
            };

            self.removeUserFromAcb = function (userId, acbId) {
                return self.postApiCall('/acbs/' + acbId + '/remove_user/' + userId, API, {});
            };

            self.inviteUser = function (invitationObject) {
                return self.postApiCall('/users/invite', API, invitationObject);
            };

            self.createInvitedUser = function (contactDetails) {
                return self.postApiCall('/users/create', API, contactDetails);
            };

            self.authorizeUser = function (userAuthorization) {
                return self.postApiCall('/users/authorize', API, userAuthorization);
            };

            self.confirmPendingCp = function (pendingCp) {
                return self.postApiCall('/certified_products/pending/confirm', API, pendingCp);
            };

            self.rejectPendingCp = function (cpId) {
                return self.postApiCall('/certified_products/pending/' + cpId + '/reject', API, {});
            };
        });
})();
