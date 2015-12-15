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

            self.simpleApiCall = function (endpoint) {
                return $http.get(API + endpoint)
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

            self.externalApiCall = function (endpoint) {
                return $http.get(endpoint)
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

            self.postApiCall = function (endpoint, postObject) {
                return $http.post(API + endpoint, postObject)
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
                return self.postApiCall('/auth/authenticate', userObj);
            };

            self.changePassword = function (userObj) {
                return self.postApiCall('/auth/change_password', userObj);
            };

            self.resetPassword = function (userObj) {
                return self.postApiCall('/auth/reset_password', userObj);
            };

            self.search = function (queryObj, pageNum, pageSize) {
                return self.postApiCall('/search', queryObj);
            };

            self.getSearchOptions = function (simple) {
                if (simple)
                    return self.simpleApiCall('/data/search_options?simple=true');
                else
                    return self.simpleApiCall('/data/search_options');
            };

            self.getSimpleProduct = function (productId) {
                return self.simpleApiCall('/products/' + productId);
            };

            self.getVersion = function (versionId) {
                return self.simpleApiCall('/versions/' + versionId);
            };

            self.getProduct = function (productId) {
                return self.simpleApiCall('/certified_products/' + productId + '/details');
            };

            self.getVendors = function () {
                return self.simpleApiCall('/vendors/');
            };

            self.getVendor = function (vendorId) {
                return self.simpleApiCall('/vendors/' + vendorId);
            };

            self.getProductsByVendor = function (vendorId) {
                return self.simpleApiCall('/products/?vendorId=' + vendorId);
            };

            self.getVersionsByProduct = function (productId) {
                return self.simpleApiCall('/versions/?productId=' + productId);
            };

            self.getProductsByVersion = function (versionId, editable) {
                return self.simpleApiCall('/certified_products/?versionId=' + versionId + '&editable=' + editable);
            };

            self.getEditions = function () {
                return self.simpleApiCall('/data/certification_editions');
            };

            self.getClassifications = function () {
                return self.simpleApiCall('/data/classification_types');
            };

            self.getPractices = function () {
                return self.simpleApiCall('/data/practice_types');
            };

            self.getCertificationStatuses = function () {
                return self.simpleApiCall('/data/certification_statuses');
            };

            self.getCertBodies = function () {
                return self.simpleApiCall('/data/certification_bodies');
            };

            self.getCertifiedProductActivity = function (nDays) {
                return self.simpleApiCall('/activity/certified_products?lastNDays=' + nDays);
            };

            self.getVendorActivity = function (nDays) {
                return self.simpleApiCall('/activity/vendors?lastNDays=' + nDays);
            };

            self.getProductActivity = function (nDays) {
                return self.simpleApiCall('/activity/products?lastNDays=' + nDays);
            };

            self.getAcbActivity = function (nDays) {
                return self.simpleApiCall('/activity/acbs?lastNDays=' + nDays);
            };

            self.getUserActivity = function (nDays) {
                return self.simpleApiCall('/activity/users?lastNDays=' + nDays);
            };

            self.getUserActivities = function (nDays) {
                return self.simpleApiCall('/activity/user_activities?lastNDays=' + nDays);
            };

            self.getUploadingCps = function () {
                return self.simpleApiCall('/certified_products/pending');
            };

            self.keepalive = function () {
                return self.simpleApiCall('/auth/keep_alive');
            };

            self.updateVendor = function (vendorObject) {
                return self.postApiCall('/vendors/update', vendorObject);
            };

            self.updateProduct = function (productObject) {
                return self.postApiCall('/products/update', productObject);
            };

            self.updateVersion = function (versionObject) {
                return self.postApiCall('/versions/update', versionObject);
            };

            self.updateCP = function (cpObject) {
                return self.postApiCall('/certified_products/update', cpObject);
            };

            self.getAcbs = function () {
                return self.simpleApiCall('/acbs/');
            };

            self.getUsersAtAcb = function (acbId) {
                return self.simpleApiCall('/acbs/' + acbId + '/users');
            };

            self.createACB = function (acb) {
                return self.postApiCall('/acbs/create', acb)
            };

            self.modifyACB = function (acb) {
                return self.postApiCall('/acbs/update', acb)
            };

            self.deleteACB = function (acbId) {
                return self.postApiCall('/acbs/' + acbId + '/delete', {})
            };

            self.getUsers = function () {
                return self.simpleApiCall('/users/');
            };

            self.confirmUser = function (userObject) {
                return self.postApiCall('/users/confirm', userObject);
            };

            self.addRole = function (payload) {
                return self.postApiCall('/users/grant_role', payload);
            };

            self.revokeRole = function (payload) {
                return self.postApiCall('/users/revoke_role', payload);
            };

            self.updateUser = function (user) {
                return self.postApiCall('/users/update', user);
            };

            self.deleteUser = function (userId) {
                return self.postApiCall('/users/' + userId + '/delete', {});
            };

            self.removeUserFromAcb = function (userId, acbId) {
                return self.postApiCall('/acbs/' + acbId + '/remove_user/' + userId, {});
            };

            self.inviteUser = function (invitationObject) {
                return self.postApiCall('/users/invite', invitationObject);
            };

            self.createInvitedUser = function (contactDetails) {
                return self.postApiCall('/users/create', contactDetails);
            };

            self.authorizeUser = function (userAuthorization) {
                return self.postApiCall('/users/authorize', userAuthorization);
            };

            self.confirmPendingCp = function (pendingCp) {
                return self.postApiCall('/certified_products/pending/confirm', pendingCp);
            };

            self.rejectPendingCp = function (cpId) {
                return self.postApiCall('/certified_products/pending/' + cpId + '/reject', {});
            };

            self.initiateCap = function (cap) {
                return self.postApiCall('/corrective_action_plan/create', cap);
            };

            self.updateCap = function (cap) {
                return self.postApiCall('/corrective_action_plan/update', cap);
            };

            self.getCap = function (certifiedProductId) {
                return self.simpleApiCall('/corrective_action_plan/?certifiedProductId=' + certifiedProductId);
            };

            self.deleteCap = function (capId) {
                return self.postApiCall('/corrective_action_plan/' + capId + '/delete', {});
            };

            self.deleteDoc = function (docId) {
                return self.postApiCall('/corrective_action_plan/documentation/' + docId + '/delete', {});
            };

            self.initiateSurveillance = function (surveillance) {
                return self.postApiCall('/surveillance/create', surveillance);
            };

            self.updateSurveillance = function (surveillance) {
                return self.postApiCall('/surveillance/update', surveillance);
            };

            self.getSurveillance = function (certifiedProductId) {
                return self.simpleApiCall('/surveillance/?certifiedProductId=' + certifiedProductId);
            };

            self.deleteSurveillance = function (surveillanceId) {
                return self.postApiCall('/surveillance/' + surveillanceId + '/delete', {});
            };

            self.registerApi = function (user) {
                return self.postApiCall('/key/register', user);
            };

            self.getApiUsers = function () {
                return self.simpleApiCall('/key/');
            };

            self.revokeApi = function (user) {
                return self.postApiCall('/key/revoke', user);
            };

            self.getApiUserActivity = function (nDays) {
                return self.simpleApiCall('/activity/api_keys?lastNDays=' + nDays);
            };

            self.getApiActivity = function (pageNum, pageSize) {
                return self.postApiCall('/key/activity/?pageNumber=' + pageNum + '&pageSize=' + pageSize, {});
            };
        });
})();
