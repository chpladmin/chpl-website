(function () {
    'use strict';

    angular.module('chpl.common')
        .factory('commonService', commonService);

    /** @ngInject */
    function commonService ($http, $q, API) {
        var service = {
            addRole: addRole,
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
            getRelatedListings: getRelatedListings,
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
            massRejectPendingSurveillance: massRejectPendingSurveillance,
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

        function addRole (payload) {
            return postApiCall('/users/grant_role', payload);
        }

        function authorizeUser (userAuthorization) {
            return postApiCall('/users/authorize', userAuthorization);
        }

        function changePassword (userObj) {
            return postApiCall('/auth/change_password', userObj);
        }

        function confirmPendingCp (pendingCp) {
            return postApiCall('/certified_products/pending/confirm', pendingCp);
        }

        function confirmPendingSurveillance (surveillance) {
            return postApiCall('/surveillance/pending/confirm', surveillance);
        }

        function confirmUser (userObject) {
            return postApiCall('/users/confirm', userObject);
        }

        function createACB (acb) {
            return postApiCall('/acbs/create', acb);
        }

        function createATL (atl) {
            return postApiCall('/atls/create', atl);
        }

        function createAnnouncement (announcement) {
            return postApiCall('/announcements/create', announcement);
        }

        function createInvitedUser (contactDetails) {
            return postApiCall('/users/create', contactDetails);
        }

        function createRecipient (recipient) {
            return postApiCall('/notifications/recipients/create', recipient);
        }

        function deleteACB (acbId) {
            return postApiCall('/acbs/' + acbId + '/delete', {});
        }

        function deleteATL (atlId) {
            return postApiCall('/atls/' + atlId + '/delete', {});
        }

        function deleteAnnouncement (announcementId) {
            return postApiCall('/announcements/' + announcementId + '/delete', {});
        }

        function deleteCap (capId) {
            return postApiCall('/corrective_action_plan/' + capId + '/delete', {});
        }

        function deleteDoc (docId) {
            return postApiCall('/corrective_action_plan/documentation/' + docId + '/delete', {});
        }

        function deleteRecipient (recipient) {
            return postApiCall('/notifications/recipients/' + recipient.id + '/delete', recipient, true);
        }

        function deleteSurveillance (surveillanceId) {
            return postApiCall('/surveillance/' + surveillanceId + '/delete', {});
        }

        function deleteSurveillanceDocument (survId, nonconId, docId) {
            return postApiCall('/surveillance/' + survId + '/nonconformity/' + nonconId + '/document/' + docId + '/delete', {});
        }

        function deleteUser (userId) {
            return postApiCall('/users/' + userId + '/delete', {});
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

        function getAcbs (editable, deleted) {
            if (angular.isUndefined(deleted)) { deleted = false; }
            return simpleApiCall('/acbs/?editable=' + editable + '&showDeleted=' + deleted);
        }

        function getAccessibilityStandards () {
            return simpleApiCall('/data/accessibility_standards');
        }

        function getAgeRanges () {
            return simpleApiCall('/data/age_ranges');
        }

        function getAll () {
            return simpleApiCall('/certified_products');
        }

        function getAnnouncement (announcementId) {
            return simpleApiCall('/announcements/' + announcementId);
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

        function getAnnouncements (pending) {
            return simpleApiCall('/announcements/?future=' + pending);
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

        function getApiUsers () {
            return simpleApiCall('/key/');
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

        function getAtls (editable, deleted) {
            if (angular.isUndefined(deleted)) { deleted = false; }
            return simpleApiCall('/atls/?editable=' + editable + '&showDeleted=' + deleted);
        }

        function getCap (certifiedProductId) {
            return simpleApiCall('/corrective_action_plan/?certifiedProductId=' + certifiedProductId);
        }

        function getCertBodies () {
            return simpleApiCall('/data/certification_bodies');
        }

        function getCertificationStatuses () {
            return simpleApiCall('/data/certification_statuses');
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

        function getCmsDownload () {
            return simpleApiCall('/certification_ids/');
        }

        function getCollection (type) {
            switch (type) {
            case 'apiDocumentation':
                return simpleApiCall('/certified_products?fields=id,edition,developer,product,version,chplProductNumber,certificationStatus,criteriaMet,apiDocumentation,transparencyAttestationUrl');
            case 'bannedDevelopers':
                return simpleApiCall('/decertifications/developers');
            case 'correctiveAction':
                return simpleApiCall('/certified_products?fields=id,edition,developer,product,version,chplProductNumber,certificationStatus,acb,surveillanceCount,openNonconformityCount,closedNonconformityCount');
            case 'decertifiedProducts':
            case 'inactiveCertificates':
                return simpleApiCall('/certified_products?fields=id,edition,developer,product,version,chplProductNumber,acb,decertificationDate,certificationStatus,numMeaningfulUse');
            case 'transparencyAttestations':
                return simpleApiCall('/collections/developers/');
                //no default
            }
        }

        function getDeveloper (developerId) {
            return simpleApiCall('/developers/' + developerId);
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

        function getDevelopers (showDeleted) {
            if (showDeleted) {
                return simpleApiCall('/developers/?showDeleted=true');
            } else {
                return simpleApiCall('/developers/');
            }
        }

        function getEditions () {
            return simpleApiCall('/data/certification_editions');
        }

        function getEducation () {
            return simpleApiCall('/data/education_types');
        }

        function getMeaningfulUseUsersAccurateAsOfDate () {
            return simpleApiCall('/meaningful_use/accurate_as_of');
        }

        function getSubscriptionRecipients () {
            return simpleApiCall('/notifications/recipients');
        }

        function getSubscriptionReportTypes () {
            return simpleApiCall('/data/notification_types');
        }

        function getPractices () {
            return simpleApiCall('/data/practice_types');
        }

        function getProduct (productId) {
            return simpleApiCall('/certified_products/' + productId + '/details');
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

        function getProductsByDeveloper (developerId) {
            return simpleApiCall('/products/?developerId=' + developerId);
        }

        function getProductsByVersion (versionId, editable) {
            return simpleApiCall('/certified_products/?versionId=' + versionId + '&editable=' + editable);
        }

        function getQmsStandards () {
            return simpleApiCall('/data/qms_standards');
        }

        function getRelatedListings (productId) {
            return simpleApiCall('/products/' + productId + '/listings');
        }

        function getSearchOptions (showDeleted) {
            if (showDeleted) {
                return simpleApiCall('/data/search_options?showDeleted=true');
            } else {
                return simpleApiCall('/data/search_options');
            }
        }

        function getSimpleProduct (productId) {
            return simpleApiCall('/products/' + productId);
        }

        function getSingleCertifiedProductActivity (productId) {
            return simpleApiCall('/activity/certified_products/' + productId);
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

        function getTargetedUsers () {
            return simpleApiCall('/data/targeted_users');
        }

        function getTestFunctionality () {
            return simpleApiCall('/data/test_functionality');
        }

        function getTestStandards () {
            return simpleApiCall('/data/test_standards');
        }

        function getTestTools () {
            return simpleApiCall('/data/test_tools');
        }

        function getUcdProcesses () {
            return simpleApiCall('/data/ucd_processes');
        }

        function getUploadingCps () {
            return simpleApiCall('/certified_products/pending');
        }

        function getUploadingSurveillances () {
            return simpleApiCall('/surveillance/pending');
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

        function getUsers () {
            return simpleApiCall('/users');
        }

        function getUsersAtAcb (acbId) {
            return simpleApiCall('/acbs/' + acbId + '/users');
        }

        function getUsersAtAtl (atlId) {
            return simpleApiCall('/atls/' + atlId + '/users');
        }

        function getVersion (versionId) {
            return simpleApiCall('/versions/' + versionId);
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

        function getVersionsByProduct (productId) {
            return simpleApiCall('/versions/?productId=' + productId);
        }

        function initiateCap (cap) {
            return postApiCall('/corrective_action_plan/create', cap);
        }

        function initiateSurveillance (surveillance) {
            return postApiCall('/surveillance/create', surveillance);
        }

        function inviteUser (invitationObject) {
            return postApiCall('/users/invite', invitationObject);
        }

        function keepalive () {
            return simpleApiCall('/auth/keep_alive');
        }

        function login (userObj) {
            return postApiCall('/auth/authenticate', userObj);
        }

        function lookupCertificationId (certId) {
            return simpleApiCall('/certification_ids/' + certId);
        }

        function massRejectPendingListings (ids) {
            return postApiCall('/certified_products/pending/reject', {ids: ids});
        }

        function massRejectPendingSurveillance (ids) {
            return postApiCall('/surveillance/pending/reject', {ids: ids});
        }

        function modifyACB (acb) {
            return postApiCall('/acbs/update', acb);
        }

        function modifyATL (atl) {
            return postApiCall('/atls/update', atl);
        }

        function modifyAnnouncement (announcement) {
            return postApiCall('/announcements/update', announcement);
        }

        function registerApi (user) {
            return postApiCall('/key/register', user);
        }

        function rejectPendingCp (cpId) {
            return postApiCall('/certified_products/pending/' + cpId + '/reject', {});
        }

        function rejectPendingSurveillance (survId) {
            return postApiCall('/surveillance/pending/' + survId + '/reject', {});
        }

        function removeUserFromAcb (userId, acbId) {
            return postApiCall('/acbs/' + acbId + '/remove_user/' + userId, {});
        }

        function removeUserFromAtl (userId, atlId) {
            return postApiCall('/atls/' + atlId + '/remove_user/' + userId, {});
        }

        function resetPassword (userObj) {
            return postApiCall('/auth/reset_password', userObj);
        }

        function revokeApi (user) {
            return postApiCall('/key/revoke', user);
        }

        function revokeRole (payload) {
            return postApiCall('/users/revoke_role', payload);
        }

        function search (queryObj) {
            return postApiCall('/search', queryObj);
        }

        function setMeaningfulUseUsersAccurateAsOfDate (date) {
            return postApiCall('/meaningful_use/accurate_as_of', date);
        }

        function splitProduct (productObject) {
            return postApiCall('/products/' + productObject.oldProduct.productId + '/split', productObject);
        }

        function undeleteACB (acbId) {
            return postApiCall('/acbs/' + acbId + '/undelete', {});
        }

        function undeleteATL (atlId) {
            return postApiCall('/atls/' + atlId + '/undelete', {});
        }

        function undeleteAnnouncement (announcementId) {
            return postApiCall('/announcements/' + announcementId + '/undelete', {});
        }

        function updateCP (cpObject) {
            return postApiCall('/certified_products/update', cpObject);
        }

        function updateCap (cap) {
            return postApiCall('/corrective_action_plan/update', cap);
        }

        function updateDeveloper (developerObject) {
            return postApiCall('/developers/update', developerObject);
        }

        function updateProduct (productObject) {
            return postApiCall('/products/update', productObject);
        }

        function updateRecipient (recipient) {
            return postApiCall('/notifications/recipients/' + recipient.id + '/update', recipient);
        }

        function updateSurveillance (surveillance) {
            return postApiCall('/surveillance/update', surveillance);
        }

        function updateUser (user) {
            return postApiCall('/users/update', user);
        }

        function updateVersion (versionObject) {
            return postApiCall('/versions/update', versionObject);
        }

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
