(function () {
    'use strict';

    angular.module('chpl.services')
        .factory('networkService', networkService);

    /** @ngInject */
    function networkService ($http, $q, API) {
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
            getJobTypes: getJobTypes,
            getJobs: getJobs,
            getIcsFamily: getIcsFamily,
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
            return apiPOST('/users/grant_role', payload);
        }

        function authorizeUser (userAuthorization) {
            return apiPOST('/users/authorize', userAuthorization);
        }

        function changePassword (userObj) {
            return apiPOST('/auth/change_password', userObj);
        }

        function confirmPendingCp (pendingCp) {
            return apiPOST('/certified_products/pending/confirm', pendingCp);
        }

        function confirmPendingSurveillance (surveillance) {
            return apiPOST('/surveillance/pending/confirm', surveillance);
        }

        function confirmUser (userObject) {
            return apiPOST('/users/confirm', userObject);
        }

        function createACB (acb) {
            return apiPOST('/acbs/create', acb);
        }

        function createATL (atl) {
            return apiPOST('/atls/create', atl);
        }

        function createAnnouncement (announcement) {
            return apiPOST('/announcements/create', announcement);
        }

        function createInvitedUser (contactDetails) {
            return apiPOST('/users/create', contactDetails);
        }

        function createRecipient (recipient) {
            return apiPOST('/notifications/recipients/create', recipient);
        }

        function deleteACB (acbId) {
            return apiPOST('/acbs/' + acbId + '/delete', {});
        }

        function deleteATL (atlId) {
            return apiPOST('/atls/' + atlId + '/delete', {});
        }

        function deleteAnnouncement (announcementId) {
            return apiPOST('/announcements/' + announcementId + '/delete', {});
        }

        function deleteCap (capId) {
            return apiPOST('/corrective_action_plan/' + capId + '/delete', {});
        }

        function deleteDoc (docId) {
            return apiPOST('/corrective_action_plan/documentation/' + docId + '/delete', {});
        }

        function deleteRecipient (recipient) {
            return apiPOST('/notifications/recipients/' + recipient.id + '/delete', recipient, true);
        }

        function deleteSurveillance (surveillanceId) {
            return apiPOST('/surveillance/' + surveillanceId + '/delete', {});
        }

        function deleteSurveillanceDocument (survId, docId) {
            return apiPOST('/surveillance/' + survId + '/document/' + docId + '/delete', {});
        }

        function deleteUser (userId) {
            return apiPOST('/users/' + userId + '/delete', {});
        }

        function getAcbActivity (activityRange) {
            var call = '/activity/acbs';
            return getActivity(call, activityRange);
        }

        function getAcbs (editable, deleted) {
            if (angular.isUndefined(deleted)) { deleted = false; }
            return apiGET('/acbs?editable=' + editable + '&showDeleted=' + deleted);
        }

        function getAccessibilityStandards () {
            return apiGET('/data/accessibility_standards');
        }

        function getAgeRanges () {
            return apiGET('/data/age_ranges');
        }

        function getAll () {
            return apiGET('/collections/certified_products');
        }

        function getAnnouncement (announcementId) {
            return apiGET('/announcements/' + announcementId);
        }

        function getAnnouncementActivity (activityRange) {
            var call = '/activity/announcements';
            return getActivity(call, activityRange);
        }

        function getAnnouncements (pending) {
            return apiGET('/announcements?future=' + pending);
        }

        function getApiActivity (options) {
            var params = [];
            var queryParams = '';
            if (angular.isDefined(options.pageNumber)) { params.push('pageNumber=' + options.pageNumber); }
            if (options.pageSize) { params.push('pageSize=' + options.pageSize); }
            if (options.startDate) { params.push('start=' + options.startDate.getTime()); }
            if (options.endDate) { params.push('end=' + options.endDate.getTime()); }
            if (options.dateAscending) { params.push('dateAscending=' + options.dateAscending); }
            if (options.filter) {
                var tmp = 'filter=';
                if (!options.showOnly) { tmp += '!' }
                tmp += options.filter
                params.push(tmp);
            }
            if (params.length > 0) { queryParams = '?' + params.join('&'); }
            return apiPOST('/key/activity/' + queryParams, {});
        }

        function getApiUserActivity (activityRange) {
            var call = '/activity/api_keys';
            return getActivity(call, activityRange);
        }

        function getApiUsers () {
            return apiGET('/key');
        }

        function getAtlActivity (activityRange) {
            var call = '/activity/atls';
            return getActivity(call, activityRange);
        }

        function getAtls (editable, deleted) {
            if (angular.isUndefined(deleted)) { deleted = false; }
            return apiGET('/atls?editable=' + editable + '&showDeleted=' + deleted);
        }

        function getCap (certifiedProductId) {
            return apiGET('/corrective_action_plan?certifiedProductId=' + certifiedProductId);
        }

        function getCertBodies () {
            return apiGET('/data/certification_bodies');
        }

        function getCertificationStatuses () {
            return apiGET('/data/certification_statuses');
        }

        function getCertifiedProductActivity (activityRange) {
            var call = '/activity/certified_products';
            return getActivity(call, activityRange);
        }

        function getCmsDownload () {
            return apiGET('/certification_ids');
        }

        function getCollection (type) {
            switch (type) {
            case 'apiDocumentation':
                return apiGET('/collections/certified_products?fields=id,edition,developer,product,version,chplProductNumber,certificationStatus,criteriaMet,apiDocumentation,transparencyAttestationUrl');
            case 'bannedDevelopers':
                return apiGET('/decertifications/developers');
            case 'correctiveAction':
                return apiGET('/collections/certified_products?fields=id,edition,developer,product,version,chplProductNumber,certificationStatus,acb,surveillanceCount,openNonconformityCount,closedNonconformityCount');
            case 'decertifiedProducts':
            case 'inactiveCertificates':
                return apiGET('/collections/certified_products?fields=id,edition,developer,product,version,chplProductNumber,acb,decertificationDate,certificationStatus,numMeaningfulUse');
            case 'transparencyAttestations':
                return apiGET('/collections/developers');
                //no default
            }
        }

        function getDeveloper (developerId) {
            return apiGET('/developers/' + developerId);
        }

        function getDeveloperActivity (activityRange) {
            var call = '/activity/developers';
            return getActivity(call, activityRange);
        }

        function getDevelopers (showDeleted) {
            if (showDeleted) {
                return apiGET('/developers?showDeleted=true');
            } else {
                return apiGET('/developers');
            }
        }

        function getEditions () {
            return apiGET('/data/certification_editions');
        }

        function getEducation () {
            return apiGET('/data/education_types');
        }

        function getJobTypes () {
            return apiGET('/data/job_types');
        }

        function getJobs () {
            return apiGET('/jobs');
        }

        function getIcsFamily (id) {
            return apiGET('/certified_products/' + id + '/ics_relationships');
        }

        function getMeaningfulUseUsersAccurateAsOfDate () {
            return apiGET('/meaningful_use/accurate_as_of');
        }

        function getSubscriptionRecipients () {
            return apiGET('/notifications/recipients');
        }

        function getSubscriptionReportTypes () {
            return apiGET('/data/notification_types');
        }

        function getPractices () {
            return apiGET('/data/practice_types');
        }

        function getProduct (productId) {
            return apiGET('/certified_products/' + productId + '/details');
        }

        function getProductActivity (activityRange) {
            var call = '/activity/products';
            return getActivity(call, activityRange);
        }

        function getProductsByDeveloper (developerId) {
            return apiGET('/products?developerId=' + developerId);
        }

        function getProductsByVersion (versionId, editable) {
            return apiGET('/certified_products?versionId=' + versionId + '&editable=' + editable);
        }

        function getQmsStandards () {
            return apiGET('/data/qms_standards');
        }

        function getRelatedListings (productId) {
            return apiGET('/products/' + productId + '/listings');
        }

        function getSearchOptions (showDeleted) {
            if (showDeleted) {
                return apiGET('/data/search_options?showDeleted=true');
            } else {
                return apiGET('/data/search_options');
            }
        }

        function getSimpleProduct (productId) {
            return apiGET('/products/' + productId);
        }

        function getSingleCertifiedProductActivity (productId) {
            return apiGET('/activity/certified_products/' + productId);
        }

        function getSurveillanceLookups () {
            var data = {};
            apiGET('/data/surveillance_types')
                .then(function (response) {
                    data.surveillanceTypes = response;
                });
            apiGET('/data/surveillance_requirement_types')
                .then(function (response) {
                    data.surveillanceRequirementTypes = response;
                });
            apiGET('/data/surveillance_result_types')
                .then(function (response) {
                    data.surveillanceResultTypes = response;
                });
            apiGET('/data/nonconformity_status_types')
                .then(function (response) {
                    data.nonconformityStatusTypes = response;
                });
            apiGET('/data/surveillance_requirements')
                .then(function (response) {
                    data.surveillanceRequirements = response;
                });
            apiGET('/data/nonconformity_types')
                .then(function (response) {
                    data.nonconformityTypes = response;
                });
            return data;
        }

        function getTargetedUsers () {
            return apiGET('/data/targeted_users');
        }

        function getTestFunctionality () {
            return apiGET('/data/test_functionality');
        }

        function getTestStandards () {
            return apiGET('/data/test_standards');
        }

        function getTestTools () {
            return apiGET('/data/test_tools');
        }

        function getUcdProcesses () {
            return apiGET('/data/ucd_processes');
        }

        function getUploadingCps () {
            return apiGET('/certified_products/pending');
        }

        function getUploadingSurveillances () {
            return apiGET('/surveillance/pending');
        }

        function getUserActivities (activityRange) {
            var call = '/activity/user_activities';
            return getActivity(call, activityRange);
        }

        function getUserActivity (activityRange) {
            var call = '/activity/users';
            return getActivity(call, activityRange);
        }

        function getUsers () {
            return apiGET('/users');
        }

        function getUsersAtAcb (acbId) {
            return apiGET('/acbs/' + acbId + '/users');
        }

        function getUsersAtAtl (atlId) {
            return apiGET('/atls/' + atlId + '/users');
        }

        function getVersion (versionId) {
            return apiGET('/versions/' + versionId);
        }

        function getVersionActivity (activityRange) {
            var call = '/activity/versions';
            return getActivity(call, activityRange);
        }

        function getVersionsByProduct (productId) {
            return apiGET('/versions?productId=' + productId);
        }

        function initiateCap (cap) {
            return apiPOST('/corrective_action_plan/create', cap);
        }

        function initiateSurveillance (surveillance) {
            return apiPOST('/surveillance/create', surveillance);
        }

        function inviteUser (invitationObject) {
            return apiPOST('/users/invite', invitationObject);
        }

        function keepalive () {
            return apiGET('/auth/keep_alive');
        }

        function login (userObj) {
            return apiPOST('/auth/authenticate', userObj);
        }

        function lookupCertificationId (certId) {
            return apiGET('/certification_ids/' + certId);
        }

        function massRejectPendingListings (ids) {
            return apiPOST('/certified_products/pending/reject', {ids: ids});
        }

        function massRejectPendingSurveillance (ids) {
            return apiPOST('/surveillance/pending/reject', {ids: ids});
        }

        function modifyACB (acb) {
            return apiPOST('/acbs/update', acb);
        }

        function modifyATL (atl) {
            return apiPOST('/atls/update', atl);
        }

        function modifyAnnouncement (announcement) {
            return apiPOST('/announcements/update', announcement);
        }

        function registerApi (user) {
            return apiPOST('/key/register', user);
        }

        function rejectPendingCp (cpId) {
            return apiPOST('/certified_products/pending/' + cpId + '/reject', {});
        }

        function rejectPendingSurveillance (survId) {
            return apiPOST('/surveillance/pending/' + survId + '/reject', {});
        }

        function removeUserFromAcb (userId, acbId) {
            return apiPOST('/acbs/' + acbId + '/remove_user/' + userId, {});
        }

        function removeUserFromAtl (userId, atlId) {
            return apiPOST('/atls/' + atlId + '/remove_user/' + userId, {});
        }

        function resetPassword (userObj) {
            return apiPOST('/auth/reset_password', userObj);
        }

        function revokeApi (user) {
            return apiPOST('/key/revoke', user);
        }

        function revokeRole (payload) {
            return apiPOST('/users/revoke_role', payload);
        }

        function search (queryObj) {
            return apiPOST('/search', queryObj);
        }

        function setMeaningfulUseUsersAccurateAsOfDate (date) {
            return apiPOST('/meaningful_use/accurate_as_of', date);
        }

        function splitProduct (productObject) {
            return apiPOST('/products/' + productObject.oldProduct.productId + '/split', productObject);
        }

        function undeleteACB (acbId) {
            return apiPOST('/acbs/' + acbId + '/undelete', {});
        }

        function undeleteATL (atlId) {
            return apiPOST('/atls/' + atlId + '/undelete', {});
        }

        function undeleteAnnouncement (announcementId) {
            return apiPOST('/announcements/' + announcementId + '/undelete', {});
        }

        function updateCP (cpObject) {
            return apiPOST('/certified_products/update', cpObject);
        }

        function updateCap (cap) {
            return apiPOST('/corrective_action_plan/update', cap);
        }

        function updateDeveloper (developerObject) {
            return apiPOST('/developers/update', developerObject);
        }

        function updateProduct (productObject) {
            return apiPOST('/products/update', productObject);
        }

        function updateRecipient (recipient) {
            return apiPOST('/notifications/recipients/' + recipient.id + '/update', recipient);
        }

        function updateSurveillance (surveillance) {
            return apiPOST('/surveillance/update', surveillance);
        }

        function updateUser (user) {
            return apiPOST('/users/update', user);
        }

        function updateVersion (versionObject) {
            return apiPOST('/versions/update', versionObject);
        }

        ////////////////////////////////////////////////////////////////////

        function apiGET (endpoint) {
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

        function apiPOST (endpoint, postObject, allowEmptyResponse) {
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

        function getActivity (call, activityRange) {
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
            return apiGET(call);
        }
    }
})();
