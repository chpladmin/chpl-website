;(function () {
    'use strict';

    angular.module('app.admin')
        .service('adminService', ['$http', '$q', 'API', '$log', 'commonService', function ($http, $q, API, $log, commonService) {
            var self = this;

            self.updateVendor = function (vendorObject) {
                return commonService.postApiCall('/vendors/update', API, vendorObject);
            };

            self.updateProduct = function (productObject) {
                return commonService.postApiCall('/products/update', API, productObject);
            };

            self.updateVersion = function (versionObject) {
                return commonService.postApiCall('/versions/update', API, versionObject);
            };

            self.updateCP = function (cpObject) {
                return commonService.postApiCall('/certified_products/update', API, cpObject);
            };

            self.getAcbs = function () {
                return commonService.simpleApiCall('/acbs/', API);
            };

            self.getUsersAtAcb = function (acbId) {
                return commonService.simpleApiCall('/acbs/' + acbId + '/users', API);
            };

            self.createACB = function (acb) {
                return commonService.postApiCall('/acbs/create', API, acb)
            };

            self.modifyACB = function (acb) {
                return commonService.postApiCall('/acbs/update', API, acb)
            };

            self.deleteACB = function (acbId) {
                return commonService.postApiCall('/acbs/' + acbId + '/delete', API, {})
            };

            self.getUsers = function () {
                return commonService.simpleApiCall('/users/', API);
            };

            self.createUser = function (newUser) {
                return commonService.postApiCall('/users/create', API, newUser);
            };

            self.addUserToAcb = function (userObject) {
                return commonService.postApiCall('/acbs/create_and_add_user', API, userObject);
            };

            self.addRole = function (payload) {
                return commonService.postApiCall('/users/grant_role', API, payload);
            };

            self.revokeRole = function (payload) {
                return commonService.postApiCall('/users/revoke_role', API, payload);
            };

            self.updateUser = function (user) {
                return commonService.postApiCall('/users/update', API, user);
            };

            self.deleteUser = function (userId) {
                return commonService.postApiCall('/users/delete', API, {userId: userId});
            };

            self.removeUserFromAcb = function (userId, acbId) {
                return commonService.postApiCall('/acbs/' + acbId + '/remove_user/' + userId, API, {});
            };

            self.inviteUser = function (invitationObject) {
                return commonService.postApiCall('/users/invite', API, invitationObject);
            };

            self.createInvitedUser = function (contactDetails) {
                return commonService.postApiCall('/users/create', API, contactDetails);
            };

            self.authorizeUser = function (userAuthorization) {
                return commonService.postApiCall('/users/authorize', API, userAuthorization);
            };

            self.confirmPendingCp = function (pendingCp) {
                return commonService.postApiCall('/certified_products/pending/confirm', API, pendingCp);
            };

            self.rejectPendingCp = function (cpId) {
                return commonService.postApiCall('/certified_products/pending/' + cpId + '/reject', API, {});
            };
        }]);
})();
