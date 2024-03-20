export default class NetworkService {
  constructor($http, $log, $q, $rootScope, API) {
    'ngInject';

    this.$http = $http;
    this.$log = $log;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.API = API;
    this.store = {
      activity: {
        types: {},
      },
    };
  }

  authorizeUser(userAuthorization, userId) {
    return this.apiPOST(`/users/${userId}/authorize`, userAuthorization);
  }

  confirmApiKey(hash) {
    return this.apiPOST('/key/confirm', hash);
  }

  confirmListing(request) {
    return this.apiPOST(`/listings/pending/${request.listing.id}`, request);
  }

  confirmUser(userObject) {
    return this.apiPOST('/users/confirm', userObject);
  }

  createAnnualSurveillanceReport(report) {
    return this.apiPOST('/surveillance-report/annual', report);
  }

  createComplaint(complaint) {
    return this.apiPOST('/complaints', complaint);
  }

  createInvitedUser(contactDetails) {
    return this.apiPOST('/users/create', contactDetails);
  }

  createInvitedCognitoUser(contactDetails) {
    return this.apiPOST('/cognito/users/create', contactDetails);
  }

  createQuarterlySurveillanceReport(report) {
    return this.apiPOST('/surveillance-report/quarterly', report);
  }

  deleteAnnualSurveillanceReport(id) {
    return this.apiDELETE(`/surveillance-report/annual/${id}`);
  }

  deleteComplaint(complaintId) {
    return this.apiDELETE(`/complaints/${complaintId}`);
  }

  deleteQuarterlySurveillanceReport(id) {
    return this.apiDELETE(`/surveillance-report/quarterly/${id}`);
  }

  deleteSurveillance(surveillanceId, reason) {
    return this.apiDELETE(`/surveillance/${surveillanceId}`, {
      reason,
    });
  }

  deleteUser(userId) {
    return this.apiDELETE(`/users/${userId}`);
  }

  generateAnnualSurveillanceReport(reportId) {
    return this.apiGET(`/surveillance-report/export/annual/${reportId}`);
  }

  generateQuarterlySurveillanceReport(reportId) {
    return this.apiGET(`/surveillance-report/export/quarterly/${reportId}`);
  }

  getAcbActivity(activityRange) {
    const call = '/activity/acbs';
    return this.getActivity(call, activityRange);
  }

  getAcb(id) {
    return this.apiGET(`/acbs/${id}`);
  }

  getAcbs(editable) {
    return this.apiGET(`/acbs?editable=${editable}`, { forceReload: true });
  }

  getAccessibilityStandards() {
    return this.apiGET('/accessibility-standards');
  }

  getActivityMetadata(key, options) {
    let call = `/activity/metadata/${key}`;
    const params = [];
    const headerOptions = {};
    if (options && options.ignoreLoadingBar) {
      headerOptions.ignoreLoadingBar = true;
    }
    if (options && options.startDate) {
      params.push(`start=${options.startDate.getTime()}`);
    }
    if (options && options.endDate) {
      params.push(`end=${options.endDate.getTime()}`);
    }
    if (options && options.pageNum) {
      params.push(`pageNum=${options.pageNum}`);
    }
    if (options && options.pageSize) {
      params.push(`pageSize=${options.pageSize}`);
    }
    if (params.length > 0) {
      call += `?${params.join('&')}`;
    }
    return this.apiGET(call, headerOptions);
  }

  getActivityById(id, options = {}) {
    return this.apiGET(`/activity/${id}`, options);
  }

  getAgeRanges() {
    return this.apiGET('/data/age_ranges');
  }

  getAll() {
    return this.apiGET('/collections/certified-products');
  }

  getAllCriteria(props) {
    const params = Object
      .entries(props)
      .filter(([, value]) => value !== null && value !== undefined)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
    let query = '/certification-criteria';
    if (params.length > 0) { query += `?${params}`; }
    return this.apiGET(query);
  }

  getAnnualSurveillanceReports() {
    return this.apiGET('/surveillance-report/annual');
  }

  getAnnualSurveillanceReport(reportId) {
    return this.apiGET(`/surveillance-report/annual/${reportId}`);
  }

  getApiDocumentationDate() {
    return this.apiGET('/files/api_documentation/details');
  }

  getApiUsers(includeDeleted) {
    if (includeDeleted) {
      return this.apiGET('/key?includeDeleted=true');
    }
    return this.apiGET('/key?includeDeleted=false');
  }

  getAtl(id) {
    return this.apiGET(`/atls/${id}`);
  }

  getAtlActivity(activityRange) {
    const call = '/activity/atls';
    return this.getActivity(call, activityRange);
  }

  getAtls(editable) {
    return this.apiGET(`/atls?editable=${editable}`, { forceReload: true });
  }

  getCertBodies() {
    return this.apiGET('/data/certification_bodies');
  }

  getCertificationStatuses() {
    return this.apiGET('/data/certification_statuses');
  }

  getCertifiedProductActivity(activityRange) {
    const call = '/activity/certified_products';
    return this.getActivity(call, activityRange);
  }

  getChangeRequests() {
    return this.apiGET('/change-requests');
  }

  getCodeSets() {
    return this.apiGET('/code-sets');
  }

  getCognitoUser(ssoUserId) {
    return this.apiGET(`/cognito/users/${ssoUserId}`);
  }

  getCollection(type) {
    switch (type) {
      case 'complaintListings':
        return this.apiGET('/collections/certified-products?fields=id,acb,chplProductNumber,developer,product');
      case 'surveillanceManagement':
        return this.apiGET('/collections/certified-products?fields=id,edition,curesUpdate,developer,developerId,product,version,chplProductNumber,certificationStatus,acb,openSurveillanceCount,closedSurveillanceCount,openSurveillanceNonConformityCount,closedSurveillanceNonConformityCount,surveillanceDates');
      // no default
    }
    return null;
  }

  getComplaintsWithSurveillance(surveillanceId) {
    return this.apiGET(`/complaints/search/v2?surveillanceIds=${surveillanceId}`);
  }

  getConformanceMethods() {
    return this.apiGET('/conformance-methods');
  }

  getCriterionProductStatistics() {
    return this.apiGET('/statistics/criterion_product');
  }

  getDeveloper(id) {
    return this.apiGET(`/developers/${id}`);
  }

  getDeveloperActivity(activityRange) {
    const call = '/activity/developers';
    return this.getActivity(call, activityRange);
  }

  getDeveloperHierarchy(id) {
    return this.apiGET(`/developers/${id}/hierarchy`);
  }

  getDevelopers(showDeleted) {
    if (showDeleted) {
      return this.apiGET('/developers?showDeleted=true');
    }
    return this.apiGET('/developers');
  }

  getDirectReviews(id) {
    return this.apiGET(`/developers/${id}/direct-reviews`, { forceReload: true });
  }

  getEditions() {
    return this.apiGET('/data/certification_editions');
  }

  getEducation() {
    return this.apiGET('/data/education_types');
  }

  getFunctionalitiesTested() {
    return this.apiGET('/functionalities-tested');
  }

  getIcsFamily(id) {
    return this.apiGET(`/certified_products/${id}/ics_relationships`);
  }

  getListing(listingId, forceReload) {
    return this.apiGET(`/certified_products/${listingId}/details`, { forceReload });
  }

  getListingBasic(listingId, forceReload) {
    return this.apiGET(`/certified_products/${listingId}`, { forceReload });
  }

  getMeasures() {
    return this.apiGET('/data/measures');
  }

  getMeasureTypes() {
    return this.apiGET('/data/measure-types');
  }

  getNonconformityStatisticsCount() {
    return this.apiGET('/statistics/nonconformity_criteria_count');
  }

  getOptionalStandards() {
    return this.apiGET('/optional-standards');
  }

  getPendingListingById(id) {
    return this.apiGET(`/listings/pending/${id}`);
  }

  getPractices() {
    return this.apiGET('/data/practice_types');
  }

  getProduct(id) {
    return this.apiGET(`/products/${id}`);
  }

  getProductActivity(activityRange) {
    const call = '/activity/products';
    return this.getActivity(call, activityRange);
  }

  getProductsByDeveloper(developerId) {
    return this.apiGET(`/products?developerId=${developerId}`);
  }

  getQmsStandards() {
    return this.apiGET('/qms-standards');
  }

  getQuarterlySurveillanceQuarters() {
    return this.apiGET('/data/quarters');
  }

  getQuarterlySurveillanceReport(reportId) {
    return this.apiGET(`/surveillance-report/quarterly/${reportId}`);
  }

  getQuarterlySurveillanceReports() {
    return this.apiGET('/surveillance-report/quarterly');
  }

  getRelatedListings(id) {
    return this.apiGET(`/products/${id}/listings`);
  }

  getRelevantListings(reportId) {
    return this.apiGET(`/surveillance-report/quarterly/${reportId}/listings`);
  }

  getSearchOptions() {
    return this.apiGET('/data/search-options');
  }

  getSimpleProduct(id) {
    return this.apiGET(`/products/${id}`);
  }

  getSingleDeveloperActivityMetadata(id, options) {
    let url = `/activity/metadata/developers/${id}`;
    if (options && options.end) {
      url += `?end=${options.end}`;
    }
    return this.apiGET(url);
  }

  getSingleListingActivityMetadata(id, options) {
    let url = `/activity/metadata/listings/${id}`;
    if (options && options.end) {
      url += `?end=${options.end}`;
    }
    return this.apiGET(url);
  }

  getSingleProductActivityMetadata(id, options) {
    let url = `/activity/metadata/products/${id}`;
    if (options && options.end) {
      url += `?end=${options.end}`;
    }
    return this.apiGET(url);
  }

  getSingleVersionActivityMetadata(id, options) {
    let url = `/activity/metadata/versions/${id}`;
    if (options && options.end) {
      url += `?end=${options.end}`;
    }
    return this.apiGET(url);
  }

  getStandards() {
    return this.apiGET('/standards');
  }

  getSurveillanceActivityReport(range) {
    const url = `/surveillance/reports/activity?start=${range.startDay}&end=${range.endDay}`;
    return this.apiGET(url);
  }

  getSurveillanceLookups() {
    const data = {};
    this.apiGET('/data/surveillance_types')
      .then((response) => {
        data.surveillanceTypes = response;
      });
    this.apiGET('/data/requirement-group-types')
      .then((response) => {
        data.requirementGroupTypes = response;
      });
    this.apiGET('/data/surveillance_result_types')
      .then((response) => {
        data.surveillanceResultTypes = response;
      });
    this.apiGET('/data/nonconformity-types/v2')
      .then((response) => {
        data.nonconformityTypes = response;
      });
    this.apiGET('/data/requirement-types')
      .then((response) => {
        data.surveillanceRequirements = response;
      });
    return data;
  }

  getSurveillanceOutcomes() {
    return this.apiGET('/data/surveillance-outcomes');
  }

  getSurveillanceProcessTypes() {
    return this.apiGET('/data/surveillance-process-types');
  }

  getSvaps() {
    return this.apiGET('/svaps');
  }

  getTargetedUsers() {
    return this.apiGET('/data/targeted_users');
  }

  getTestData() {
    return this.apiGET('/data/test_data');
  }

  getTestTools() {
    return this.apiGET('/test-tools');
  }

  getTestProcedures() {
    return this.apiGET('/data/test_procedures');
  }

  getTestStandards() {
    return this.apiGET('/data/test_standards');
  }

  getUcdProcesses() {
    return this.apiGET('/ucd-processes');
  }

  getUploadTemplateVersions() {
    return this.apiGET('/data/upload_template_versions');
  }

  getUserById(id) {
    return this.apiGET(`/users/beta/${id}/details`);
  }

  getUsers() {
    return this.apiGET('/users');
  }

  getUsersAtDeveloper(id) {
    return this.apiGET(`/developers/${id}/users`);
  }

  getVersion(id) {
    return this.apiGET(`/versions/${id}`);
  }

  getVersionActivity(activityRange) {
    const call = '/activity/versions';
    return this.getActivity(call, activityRange);
  }

  getVersionsByProduct(productId) {
    return this.apiGET(`/versions?productId=${productId}`);
  }

  impersonateUser(user) {
    return this.apiGET(`/auth/impersonate?id=${user.userId}`);
  }

  initiateSurveillance(surveillance) {
    return this.apiPOST('/surveillance', surveillance);
  }

  inviteUser(invitationObject) {
    return this.apiPOST('/users/invite', invitationObject);
  }

  inviteCognitoUser(invitationObject) {
    return this.apiPOST('/cognito/users/invite', invitationObject);
  }

  keepalive() {
    return this.apiGET('/auth/keep-alive', { ignoreLoadingBar: true });
  }

  mergeDevelopers(mergeDeveloperObject) {
    return this.apiPOST('/developers/merge', mergeDeveloperObject);
  }

  rejectPendingCp(cpId) {
    return this.apiDELETE(`/certified_products/pending/${cpId}`);
  }

  rejectPendingListing(id) {
    return this.apiDELETE(`/listings/pending/${id}`);
  }

  removeUserFromDeveloper(userId, id) {
    return this.apiDELETE(`/developers/${id}/users/${userId}`);
  }

  requestApiKey(apiKeyRequest) {
    return this.apiPOST('/key/request', apiKeyRequest);
  }

  revokeApi(user) {
    return this.apiDELETE(`/key/${user.key}`);
  }

  search(queryObj) {
    return this.apiPOST('/search', queryObj);
  }

  splitDeveloper(developerSplitObject) {
    return this.apiPOST(`/developers/${developerSplitObject.oldDeveloper.id}/split`, developerSplitObject);
  }

  splitProduct(productObject) {
    return this.apiPOST(`/products/${productObject.oldProduct.id}/split`, productObject);
  }

  splitVersion(versionObject) {
    return this.apiPOST(`/versions/${versionObject.oldVersion.id}/split`, versionObject);
  }

  submitChangeRequest(request) {
    return this.apiPOST('/change-requests', request);
  }

  unimpersonateUser() {
    return this.apiGET('/auth/unimpersonate');
  }

  updateAnnualSurveillanceReport(report) {
    return this.apiPUT('/surveillance-report/annual', report);
  }

  updateChangeRequest(changeRequest) {
    return this.apiPUT('/change-requests', changeRequest);
  }

  updateComplaint(complaint) {
    return this.apiPUT(`/complaints/${complaint.id}`, complaint);
  }

  updateCP(cpObject) {
    return this.apiPUT(`/certified_products/${cpObject.listing.id}`, cpObject);
  }

  updateDeveloper(developer) {
    return this.apiPUT(`/developers/${developer.id}`, developer);
  }

  updateProduct(productObject) {
    return this.apiPUT('/products', productObject);
  }

  updateQuarterlySurveillanceReport(report) {
    return this.apiPUT('/surveillance-report/quarterly', report);
  }

  updateRelevantSurveillance(reportId, surveillance) {
    return this.apiPUT(`/surveillance-report/quarterly/${reportId}/surveillance/${surveillance.id}`, surveillance);
  }

  updateSurveillance(surveillance) {
    return this.apiPUT(`/surveillance/${surveillance.id}`, surveillance);
  }

  updateVersion(versionObject) {
    return this.apiPUT('/versions', versionObject);
  }

  getSystemStatus() {
    return this.$http.get('/rest/system-status');
  }

  /*
   * Helper functions
   */

  apiDELETE(endpoint, deleteObject) {
    return this.$http.delete(this.API + endpoint, { data: deleteObject, headers: { 'Content-Type': 'application/json;charset=utf-8' } })
      .then((response) => response, (response) => this.$q.reject(response));
  }

  apiGET(endpoint, options = {}) {
    const headers = {};
    if (options.forceReload) {
      headers['Cache-Control'] = 'no-cache';
    }
    return this.$http.get(this.API + endpoint, { data: '', headers, ignoreLoadingBar: options.ignoreLoadingBar })
      .then((response) => {
        if (angular.isObject(response.data) && response.status !== 204) {
          return response.data;
        } if (response.status === 204) {
          return this.$q.reject(204);
        }
        return this.$q.reject(response.data);
      }, (error) => this.$q.reject(error));
  }

  apiPOST(endpoint, postObject) {
    return this.$http.post(this.API + endpoint, postObject)
      .then((response) => {
        if (angular.isObject(response.data)) {
          return response.data;
        }
        return;
      }, (response) => this.$q.reject(response));
  }

  apiPUT(endpoint, postObject) {
    return this.$http.put(this.API + endpoint, postObject)
      .then((response) => {
        if (angular.isObject(response.data)) {
          return response.data;
        }
        if (response.status !== 200) {
          return this.$q.reject(response);
        }
        return response;
      }, (response) => this.$q.reject(response));
  }

  getActivity(call, activityRange) {
    const EXPIRATION_TIME = 15; // in minutes
    const params = [];
    let type = call;
    if (activityRange.startDate) {
      params.push(`start=${activityRange.startDate.getTime()}`);
    }
    if (activityRange.endDate) {
      params.push(`end=${activityRange.endDate.getTime()}`);
    }
    if (params.length > 0) {
      type += `?${params.join('&')}`;
    }
    if (!this.store.activity.types[type] || !this.store.activity.types[type].data || (Date.now() - this.store.activity.types[type].lastUpdated > (1000 * 60 * EXPIRATION_TIME))) {
      this.store.activity.types[type] = {
        data: this.apiGET(type),
        lastUpdated: Date.now(),
      };
    }
    return this.store.activity.types[type].data;
  }
}

angular.module('chpl.services')
  .service('networkService', NetworkService);
