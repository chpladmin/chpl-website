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

            self.updateCP = function (cpObject) {
                return commonService.postApiCall('/certified_product/update', API, cpObject);
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

            self.getUsers = function () {
                return commonService.simpleApiCall('/auth/list_users', API);
            };

            self.createUser = function (newUser) {
                return commonService.postApiCall('/auth/create_user_with_roles', API, newUser);
            };

            self.addUserToAcb = function (userObject) {
                return commonService.postApiCall('/acb/create_and_add_user', API, userObject);
            };

            self.addRole = function (payload) {
                return commonService.postApiCall('/auth/grant_user_role', API, payload);
            };

            self.revokeRole = function (payload) {
                return commonService.postApiCall('/auth/revoke_user_role', API, payload);
            };

            self.updateUser = function (user) {
                return commonService.postApiCall('/auth/update_user', API, user);
            };

            self.deleteUser = function (userId) {
                return commonService.postApiCall('/auth/delete_user/' + userId, API, {});
            };

            self.removeUserFromAcb = function (userObject) {
                return commonService.postApiCall('/acb/delete_user', API, userObject);
            };

            self.inviteUser = function (invitationObject) {
                return commonService.postApiCall('/invite_user', API, invitationObject);
            };

            self.createInvitedUser = function (contactDetails) {
                return commonService.postApiCall('/create_invited_user', '/ainq.com', contactDetails);
            };

            self.authorizeUser = function (userAuthorization) {
                return commonService.postApiCall('/authorize_user', '/ainq.com', userAuthorization);
            };
        }]);
})();
