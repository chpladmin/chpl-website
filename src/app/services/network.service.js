export default class NetworkService {
  constructor($http, $q, API) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.API = API;
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

  createQuarterlySurveillanceReport(report) {
    return this.apiPOST('/surveillance-report/quarterly', report);
  }

  deleteAnnualSurveillanceReport(id) {
    return this.apiDELETE(`/surveillance-report/annual/${id}`);
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

  getAcbs(editable) {
    return this.apiGET(`/acbs?editable=${editable}`, { forceReload: true });
  }

  getAccessibilityStandards() {
    return this.apiGET('/accessibility-standards');
  }

  getAgeRanges() {
    return this.apiGET('/data/age_ranges');
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

  getAtls(editable) {
    return this.apiGET(`/atls?editable=${editable}`, { forceReload: true });
  }

  getCodeSets() {
    return this.apiGET('/code-sets');
  }

  getComplaintsWithSurveillance(surveillanceId) {
    return this.apiGET(`/complaints/search/v2?surveillanceIds=${surveillanceId}`);
  }

  getConformanceMethods() {
    return this.apiGET('/conformance-methods');
  }

  getDeveloper(id) {
    return this.apiGET(`/developers/${id}`);
  }

  getDeveloperHierarchy(id) {
    return this.apiGET(`/developers/${id}/hierarchy`);
  }

  getDevelopers() {
    return this.apiGET('/developers');
  }

  getEducation() {
    return this.apiGET('/data/education_types');
  }

  getFunctionalitiesTested() {
    return this.apiGET('/functionalities-tested');
  }

  getListing(listingId, forceReload) {
    return this.apiGET(`/certified_products/${listingId}/details`, { forceReload });
  }

  getListingBasic(listingId, forceReload) {
    return this.apiGET(`/certified_products/${listingId}`, { forceReload });
  }

  getMeasureTypes() {
    return this.apiGET('/data/measure-types');
  }

  getMeasures() {
    return this.apiGET('/data/measures');
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

  getProduct(id) {
    return this.apiGET(`/products/${id}`);
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

  getReportMetadata(reportKey) {
    return this.apiGET(`/report-data/report-metadata/${reportKey}`);
  }

  getSearchOptions() {
    return this.apiGET('/data/search-options');
  }

  getSimpleProduct(id) {
    return this.apiGET(`/products/${id}`);
  }

  getStandards() {
    return this.apiGET('/standards');
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

  getSystemStatus() {
    return this.$http.get('/rest/system-status');
  }

  getTargetedUsers() {
    return this.apiGET('/data/targeted_users');
  }

  getTestData() {
    return this.apiGET('/data/test_data');
  }

  getTestProcedures() {
    return this.apiGET('/data/test_procedures');
  }

  getTestStandards() {
    return this.apiGET('/data/test_standards');
  }

  getTestTools() {
    return this.apiGET('/test-tools');
  }

  getUcdProcesses() {
    return this.apiGET('/ucd-processes');
  }

  getUserById(id) {
    return this.apiGET(`/users/beta/${id}/details`);
  }

  getUsers(includeDisabled = false) {
    if (includeDisabled) {
      return this.apiGET('/users?includeDisabled=true');
    }
    return this.apiGET('/users');
  }

  getVersion(id) {
    return this.apiGET(`/versions/${id}`);
  }

  getVersionsByProduct(productId) {
    return this.apiGET(`/versions?productId=${productId}`);
  }

  impersonateUser(user) {
    return this.apiGET(`/auth/impersonate?id=${user.userId}`);
  }

  inviteUser(invitationObject) {
    return this.apiPOST('/users/invite', invitationObject);
  }

  inviteCognitoUser(invitationObject) {
    return this.apiPOST('/users/invitation', invitationObject);
  }

  inviteUser(invitationObject) {
    return this.apiPOST('/users/invite', invitationObject);
  }

  logout(logoutRequest) {
    return this.apiPOST('/auth/logout', logoutRequest);
  }

  rejectPendingListing(id) {
    return this.apiDELETE(`/listings/pending/${id}`);
  }

  requestApiKey(apiKeyRequest) {
    return this.apiPOST('/key/request', apiKeyRequest);
  }

  splitProduct(productObject) {
    return this.apiPOST(`/products/${productObject.oldProduct.id}/split`, productObject);
  }

  splitVersion(versionObject) {
    return this.apiPOST(`/versions/${versionObject.oldVersion.id}/split`, versionObject);
  }

  unimpersonateUser() {
    return this.apiGET('/auth/unimpersonate');
  }

  updateAnnualSurveillanceReport(report) {
    return this.apiPUT('/surveillance-report/annual', report);
  }

  updateCP(cpObject) {
    return this.apiPUT(`/certified_products/${cpObject.listing.id}`, cpObject);
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
}

angular.module('chpl.services')
  .service('networkService', NetworkService);
