(function () {
    'use strict';

    angular.module('chpl.common')
        .factory('commonService', commonService);

    /** @ngInject */
    function commonService ($http, $q, API) {
        var service = {
            addRole: addRole,
            addressRequired: addressRequired,
            authorizeUser: authorizeUser,
            changePassword: changePassword,
            confirmPendingCp: confirmPendingCp,
            confirmPendingSurveillance: confirmPendingSurveillance,
            confirmUser: confirmUser,
            createACB: createACB,
            createATL: createATL,
            createAnnouncement: createAnnouncement,
            createInvitedUser: createInvitedUser,
            createRecipient: createRecipient,
            deleteACB: deleteACB,
            deleteATL: deleteATL,
            deleteAnnouncement: deleteAnnouncement,
            deleteCap: deleteCap,
            deleteDoc: deleteDoc,
            deleteRecipient: deleteRecipient,
            deleteSurveillance: deleteSurveillance,
            deleteSurveillanceDocument: deleteSurveillanceDocument,
            deleteUser: deleteUser,
            getAcbActivity: getAcbActivity,
            getAcbs: getAcbs,
            getAccessibilityStandards: getAccessibilityStandards,
            getAgeRanges: getAgeRanges,
            getAll: getAll,
            getAnnouncement: getAnnouncement,
            getAnnouncementActivity: getAnnouncementActivity,
            getAnnouncements: getAnnouncements,
            getApiActivity: getApiActivity,
            getApiUserActivity: getApiUserActivity,
            getApiUsers: getApiUsers,
            getAtlActivity: getAtlActivity,
            getAtls: getAtls,
            getCap: getCap,
            getCertBodies: getCertBodies,
            getCertificationStatuses: getCertificationStatuses,
            getCertifiedProductActivity: getCertifiedProductActivity,
            getCmsDownload: getCmsDownload,
            getCollection: getCollection,
            getDecertifiedDevelopers: getDecertifiedDevelopers,
            getDeveloper: getDeveloper,
            getDeveloperActivity: getDeveloperActivity,
            getDevelopers: getDevelopers,
            getEditions: getEditions,
            getEducation: getEducation,
            getMeaningfulUseUsersAccurateAsOfDate: getMeaningfulUseUsersAccurateAsOfDate,
            getSubscriptionRecipients: getSubscriptionRecipients,
            getSubscriptionReportTypes: getSubscriptionReportTypes,
            getPractices: getPractices,
            getProduct: getProduct,
            getProductActivity: getProductActivity,
            getProductsByDeveloper: getProductsByDeveloper,
            getProductsByVersion: getProductsByVersion,
            getQmsStandards: getQmsStandards,
            getSearchOptions: getSearchOptions,
            getSimpleProduct: getSimpleProduct,
            getSingleCertifiedProductActivity: getSingleCertifiedProductActivity,
            getSurveillanceLookups: getSurveillanceLookups,
            getTargetedUsers: getTargetedUsers,
            getTestFunctionality: getTestFunctionality,
            getTestStandards: getTestStandards,
            getTestTools: getTestTools,
            getUcdProcesses: getUcdProcesses,
            getUploadingCps: getUploadingCps,
            getUploadingSurveillances: getUploadingSurveillances,
            getUserActivities: getUserActivities,
            getUserActivity: getUserActivity,
            getUsers: getUsers,
            getUsersAtAcb: getUsersAtAcb,
            getUsersAtAtl: getUsersAtAtl,
            getVersion: getVersion,
            getVersionActivity: getVersionActivity,
            getVersionsByProduct: getVersionsByProduct,
            initiateCap: initiateCap,
            initiateSurveillance: initiateSurveillance,
            inviteUser: inviteUser,
            keepalive: keepalive,
            login: login,
            lookupCertificationId: lookupCertificationId,
            massRejectPendingListings: massRejectPendingListings,
            modifyACB: modifyACB,
            modifyATL: modifyATL,
            modifyAnnouncement: modifyAnnouncement,
            registerApi: registerApi,
            rejectPendingCp: rejectPendingCp,
            rejectPendingSurveillance: rejectPendingSurveillance,
            removeUserFromAcb: removeUserFromAcb,
            removeUserFromAtl: removeUserFromAtl,
            resetPassword: resetPassword,
            revokeApi: revokeApi,
            revokeRole: revokeRole,
            search: search,
            setMeaningfulUseUsersAccurateAsOfDate: setMeaningfulUseUsersAccurateAsOfDate,
            splitProduct: splitProduct,
            undeleteACB: undeleteACB,
            undeleteATL: undeleteATL,
            undeleteAnnouncement: undeleteAnnouncement,
            updateCP: updateCP,
            updateCap: updateCap,
            updateDeveloper: updateDeveloper,
            updateProduct: updateProduct,
            updateRecipient: updateRecipient,
            updateSurveillance: updateSurveillance,
            updateUser: updateUser,
            updateVersion: updateVersion,
        }
        return service

        ////////////////////////////////////////////////////////////////////

        function addressRequired (address) {
            if (!address) { return false; }
            if (address.line1 && address.line1.length > 0) { return true; }
            if (address.line2 && address.line2.length > 0) { return true; }
            if (address.city && address.city.length > 0) { return true; }
            if (address.state && address.state.length > 0) { return true; }
            if (address.zipcode && address.zipcode.length > 0) { return true; }
            if (address.country && address.country.length > 0) { return true; }
            return false;
        }

        function login (userObj) {
            return postApiCall('/auth/authenticate', userObj);
        }

        function changePassword (userObj) {
            return postApiCall('/auth/change_password', userObj);
        }

        function resetPassword (userObj) {
            return postApiCall('/auth/reset_password', userObj);
        }

        function search (queryObj) {
            return postApiCall('/search', queryObj);
        }

        function getAll () {
            return simpleApiCall('/certified_products');
        }

        function getCollection (type) {
            switch (type) {
            case 'nonconformities':
                return simpleApiCall('/certified_products?fields=id,edition,developer,product,version,chplProductNumber,acb,surveillanceCount,openNonconformityCount,closedNonconformityCount');
            case 'decertifiedProducts':
            case 'inactiveCertificates':
                return simpleApiCall('/certified_products?fields=id,edition,developer,product,version,chplProductNumber,acb,decertificationDate,certificationStatus,numMeaningfulUse');
            case 'apiCriteria':
                return simpleApiCall('/certified_products?fields=id,edition,developer,product,version,chplProductNumber,acb,certificationDate,criteriaMet,apiDocumentation,mandatoryDisclosures');
            case 'bannedDevelopers':
                return simpleApiCall('/decertifications/developers');
            }
        }

        function getSearchOptions (showDeleted) {
            if (showDeleted) {
                return simpleApiCall('/data/search_options?showDeleted=true');
            } else {
                return simpleApiCall('/data/search_options');
            }
        }

        function getEducation () {
            return simpleApiCall('/data/education_types');
        }

        function getAgeRanges () {
            return simpleApiCall('/data/age_ranges');
        }

        function getTestStandards () {
            return simpleApiCall('/data/test_standards');
        }

        function getQmsStandards () {
            return simpleApiCall('/data/qms_standards');
        }

        function getUcdProcesses () {
            return simpleApiCall('/data/ucd_processes');
        }

        function getAccessibilityStandards () {
            return simpleApiCall('/data/accessibility_standards');
        }

        function getTestFunctionality () {
            return simpleApiCall('/data/test_functionality');
        }

        function getTestTools () {
            return simpleApiCall('/data/test_tools');
        }

        function getTargetedUsers () {
            return simpleApiCall('/data/targeted_users');
        }

        function getSurveillanceLookups () {
            var data = {};
            simpleApiCall('/data/surveillance_types')
                .then(function (response) {
                    data.surveillanceTypes = response;
                    simpleApiCall('/data/surveillance_requirement_types')
                        .then(function (response) {
                            data.surveillanceRequirementTypes = response;
                            simpleApiCall('/data/surveillance_result_types')
                                .then(function (response) {
                                    data.surveillanceResultTypes = response;
                                    simpleApiCall('/data/nonconformity_status_types')
                                        .then(function (response) {
                                            data.nonconformityStatusTypes = response;
                                            simpleApiCall('/data/surveillance_requirements')
                                                .then(function (response) {
                                                    data.surveillanceRequirements = response;
                                                    simpleApiCall('/data/nonconformity_types')
                                                        .then(function (response) {
                                                            data.nonconformityTypes = response;
                                                        })
                                                })
                                        })
                                })
                        })
                })
            return data;
        }

        function getCmsDownload () {
            return simpleApiCall('/certification_ids/');
        }

        function getAnnouncements (pending) {
            return simpleApiCall('/announcements/?future=' + pending);
        }

        function getSimpleProduct (productId) {
            return simpleApiCall('/products/' + productId);
        }

        function getVersion (versionId) {
            return simpleApiCall('/versions/' + versionId);
        }

        function getProduct (productId) {
            return simpleApiCall('/certified_products/' + productId + '/details');
        }

        function getDevelopers (showDeleted) {
            if (showDeleted) {
                return simpleApiCall('/developers/?showDeleted=true');
            } else {
                return simpleApiCall('/developers/');
            }
        }

        function getDeveloper (developerId) {
            return simpleApiCall('/developers/' + developerId);
        }

        function getProductsByDeveloper (developerId) {
            return simpleApiCall('/products/?developerId=' + developerId);
        }

        function getVersionsByProduct (productId) {
            return simpleApiCall('/versions/?productId=' + productId);
        }

        function getProductsByVersion (versionId, editable) {
            return simpleApiCall('/certified_products/?versionId=' + versionId + '&editable=' + editable);
        }

        function getEditions () {
            return simpleApiCall('/data/certification_editions');
        }

        function getPractices () {
            return simpleApiCall('/data/practice_types');
        }

        function getCertificationStatuses () {
            return simpleApiCall('/data/certification_statuses');
        }

        function getCertBodies () {
            return simpleApiCall('/data/certification_bodies');
        }

        function getCertifiedProductActivity (activityRange) {
            var call = '/activity/certified_products';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getSingleCertifiedProductActivity (productId) {
            return simpleApiCall('/activity/certified_products/' + productId);
        }

        function getDeveloperActivity (activityRange) {
            var call = '/activity/developers';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getProductActivity (activityRange) {
            var call = '/activity/products';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getVersionActivity (activityRange) {
            var call = '/activity/versions';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getAcbActivity (activityRange) {
            var call = '/activity/acbs';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getAtlActivity (activityRange) {
            var call = '/activity/atls';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getUserActivity (activityRange) {
            var call = '/activity/users';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getUserActivities (activityRange) {
            var call = '/activity/user_activities';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getAnnouncementActivity (activityRange) {
            var call = '/activity/announcements';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getUploadingCps () {
            return simpleApiCall('/certified_products/pending');
        }

        function getUploadingSurveillances () {
            return simpleApiCall('/surveillance/pending');
        }

        function keepalive () {
            return simpleApiCall('/auth/keep_alive');
        }

        function updateDeveloper (developerObject) {
            return postApiCall('/developers/update', developerObject);
        }

        function updateProduct (productObject) {
            return postApiCall('/products/update', productObject);
        }

        function splitProduct (productObject) {
            return postApiCall('/products/' + productObject.oldProduct.productId + '/split', productObject);
        }

        function updateVersion (versionObject) {
            return postApiCall('/versions/update', versionObject);
        }

        function updateCP (cpObject) {
            return postApiCall('/certified_products/update', cpObject);
        }

        function getAcbs (editable, deleted) {
            if (angular.isUndefined(deleted)) { deleted = false; }
            return simpleApiCall('/acbs/?editable=' + editable + '&showDeleted=' + deleted);
        }

        function getAtls (editable, deleted) {
            if (angular.isUndefined(deleted)) { deleted = false; }
            return simpleApiCall('/atls/?editable=' + editable + '&showDeleted=' + deleted);
        }

        function getUsersAtAcb (acbId) {
            return simpleApiCall('/acbs/' + acbId + '/users');
        }

        function getAnnouncement (announcementId) {
            return simpleApiCall('/announcements/' + announcementId + '/');
        }

        function getUsersAtAtl (atlId) {
            return simpleApiCall('/atls/' + atlId + '/users');
        }

        function createACB (acb) {
            return postApiCall('/acbs/create', acb);
        }

        function createATL (atl) {
            return postApiCall('/atls/create', atl);
        }

        function createAnnouncement (announcement) {
            return postApiCall('/announcements/create/', announcement);
        }

        function modifyAnnouncement (announcement) {
            return postApiCall('/announcements/update', announcement);
        }

        function modifyACB (acb) {
            return postApiCall('/acbs/update', acb);
        }

        function modifyATL (atl) {
            return postApiCall('/atls/update', atl);
        }

        function deleteAnnouncement (announcementId) {
            return postApiCall('/announcements/' + announcementId + '/delete', {});
        }

        function undeleteAnnouncement (announcementId) {
            return postApiCall('/announcements/' + announcementId + '/undelete', {});
        }

        function deleteACB (acbId) {
            return postApiCall('/acbs/' + acbId + '/delete', {});
        }

        function undeleteACB (acbId) {
            return postApiCall('/acbs/' + acbId + '/undelete', {});
        }

        function deleteATL (atlId) {
            return postApiCall('/atls/' + atlId + '/delete', {});
        }

        function undeleteATL (atlId) {
            return postApiCall('/atls/' + atlId + '/undelete', {});
        }

        function getUsers () {
            return simpleApiCall('/users/');
        }

        function confirmUser (userObject) {
            return postApiCall('/users/confirm', userObject);
        }

        function addRole (payload) {
            return postApiCall('/users/grant_role', payload);
        }

        function revokeRole (payload) {
            return postApiCall('/users/revoke_role', payload);
        }

        function updateUser (user) {
            return postApiCall('/users/update', user);
        }

        function deleteUser (userId) {
            return postApiCall('/users/' + userId + '/delete', {});
        }

        function removeUserFromAcb (userId, acbId) {
            return postApiCall('/acbs/' + acbId + '/remove_user/' + userId, {});
        }

        function removeUserFromAtl (userId, atlId) {
            return postApiCall('/atls/' + atlId + '/remove_user/' + userId, {});
        }

        function inviteUser (invitationObject) {
            return postApiCall('/users/invite', invitationObject);
        }

        function createInvitedUser (contactDetails) {
            return postApiCall('/users/create', contactDetails);
        }

        function authorizeUser (userAuthorization) {
            return postApiCall('/users/authorize', userAuthorization);
        }

        function confirmPendingCp (pendingCp) {
            return postApiCall('/certified_products/pending/confirm', pendingCp);
        }

        function confirmPendingSurveillance (surveillance) {
            return postApiCall('/surveillance/pending/confirm', surveillance);
        }

        function rejectPendingCp (cpId) {
            return postApiCall('/certified_products/pending/' + cpId + '/reject', {});
        }

        function massRejectPendingListings (ids) {
            return postApiCall('/certified_products/pending/reject', {ids: ids});
        }

        function rejectPendingSurveillance (survId) {
            return postApiCall('/surveillance/pending/' + survId + '/reject', {});
        }

        function lookupCertificationId (certId) {
            return simpleApiCall('/certification_ids/' + certId);
        }
        function initiateCap (cap) {
            return postApiCall('/corrective_action_plan/create', cap);
        }

        function updateCap (cap) {
            return postApiCall('/corrective_action_plan/update', cap);
        }

        function getCap (certifiedProductId) {
            return simpleApiCall('/corrective_action_plan/?certifiedProductId=' + certifiedProductId);
        }

        function deleteCap (capId) {
            return postApiCall('/corrective_action_plan/' + capId + '/delete', {});
        }

        function deleteDoc (docId) {
            return postApiCall('/corrective_action_plan/documentation/' + docId + '/delete', {});
        }

        function deleteSurveillanceDocument (survId, nonconId, docId) {
            return postApiCall('/surveillance/' + survId + '/nonconformity/' + nonconId + '/document/' + docId + '/delete', {});
        }

        function initiateSurveillance (surveillance) {
            return postApiCall('/surveillance/create', surveillance);
        }

        function updateSurveillance (surveillance) {
            return postApiCall('/surveillance/update', surveillance);
        }

        function deleteSurveillance (surveillanceId) {
            return postApiCall('/surveillance/' + surveillanceId + '/delete', {});
        }

        function registerApi (user) {
            return postApiCall('/key/register', user);
        }

        function getApiUsers () {
            return simpleApiCall('/key/');
        }

        function revokeApi (user) {
            return postApiCall('/key/revoke', user);
        }

        function getApiUserActivity (activityRange) {
            var call = '/activity/api_keys';
            var params = [];
            if (activityRange.startDate) {
                params.push('start=' + activityRange.startDate.getTime());
            }
            if (activityRange.endDate) {
                params.push('end=' + activityRange.endDate.getTime());
            }
            if (params.length > 0) {
                call += '?' + params.join('&');
            }
            return simpleApiCall(call);
        }

        function getApiActivity (options) {
            var params = [];
            var queryParams = '';
            if (angular.isDefined(options.pageNumber)) { params.push('pageNumber=' + options.pageNumber); }
            if (options.pageSize) { params.push('pageSize=' + options.pageSize); }
            if (options.startDate) { params.push('startDate=' + options.startDate.getTime()); }
            if (options.endDate) { params.push('endDate=' + options.endDate.getTime()); }
            if (options.dateAscending) { params.push('dateAscending=' + options.dateAscending); }
            if (options.filter) {
                var tmp = 'filter=';
                if (!options.showOnly) { tmp += '!' }
                tmp += options.filter
                params.push(tmp);
            }
            if (params.length > 0) { queryParams = '?' + params.join('&'); }
            return postApiCall('/key/activity/' + queryParams, {});
        }

        function getDecertifiedDevelopers () {
            return simpleApiCall('/decertifications/developers');
        }

        function getMeaningfulUseUsersAccurateAsOfDate () {
            return simpleApiCall('/meaningful_use/accurate_as_of');
        }

        function setMeaningfulUseUsersAccurateAsOfDate (date) {
            return postApiCall('/meaningful_use/accurate_as_of', date);
        }

        /*
         * Email notification services
         */
        function getSubscriptionReportTypes () {
            return simpleApiCall('/data/notification_types');
        }

        function getSubscriptionRecipients () {
            return simpleApiCall('/notifications/recipients');
        }

        function createRecipient (recipient) {
            return postApiCall('/notifications/recipients/create', recipient);
        }

        function updateRecipient (recipient) {
            return postApiCall('/notifications/recipients/' + recipient.id + '/update', recipient);
        }

        function deleteRecipient (recipient) {
            return postApiCall('/notifications/recipients/' + recipient.id + '/delete', recipient, true);
        }
        /*
         * End email notification services
         */

        ////////////////////////////////////////////////////////////////////

        function simpleApiCall (endpoint) {
            return $http.get(API + endpoint)
                .then(function (response) {
                    if (angular.isObject(response.data)) {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    return $q.reject(response.data);
                });
        }

        /*
        function externalApiCall (endpoint) {
            return $http.get(endpoint)
                .then(function (response) {
                    if (angular.isObject(response.data)) {
                        return response.data;
                    } else {
                        return $q.reject(response.data);
                    }
                }, function (response) {
                    return $q.reject(response.data);
                });
        }
        */

        function postApiCall (endpoint, postObject, allowEmptyResponse) {
            return $http.post(API + endpoint, postObject)
                .then(function (response) {
                    if (angular.isObject(response.data)) {
                        return response.data;
                    } else {
                        if (allowEmptyResponse) {
                            return response;
                        } else {
                            return $q.reject(response);
                        }
                    }
                }, function (response) {
                    return $q.reject(response);
                });
        }
    }
})();
