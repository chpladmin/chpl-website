;(function () {
    'use strict';

    angular.module('app.common')
        .service('commonService', function ($http, $q, API, $log) {
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

            self.login = function (userObj) {
                return self.postApiCall('/auth/authenticate', API, userObj);
            };

            self.search = function (queryObj, pageNum, pageSize) {
                return self.postApiCall('/search', API, queryObj);
            };

            self.getSearchOptions = function () {
                return self.simpleApiCall('/data/search_options', API);
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

            self.addUserToAcb = function (userObject) {
                return self.postApiCall('/acbs/create_and_add_user', API, userObject);
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
                return self.postApiCall('/users/delete', API, {userId: userId});
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
