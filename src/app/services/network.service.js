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

  changePassword(userObj) {
    let url;
    if (userObj.userName && userObj.userName.length > 0) {
      url = '/auth/change_expired_password';
    } else {
      url = '/auth/change_password';
    }
    return this.apiPOST(url, userObj);
  }

  confirmApiKey(hash) {
    return this.apiPOST('/key/confirm', hash);
  }

  confirmPendingCp(request) {
    return this.apiPOST(`/certified_products/pending/${request.pendingListing.id}/beta/confirm`, request);
  }

  confirmPendingSurveillance(surveillance) {
    return this.apiPOST('/surveillance/pending/confirm', surveillance);
  }

  confirmUser(userObject) {
    return this.apiPOST('/users/confirm', userObject);
  }

  createACB(acb) {
    return this.apiPOST('/acbs', acb);
  }

  createATL(atl) {
    return this.apiPOST('/atls', atl);
  }

  createAnnouncement(announcement) {
    return this.apiPOST('/announcements', announcement);
  }

  createAnnualSurveillanceReport(report) {
    return this.apiPOST('/surveillance-report/annual', report);
  }

  createCmsId(ids) {
    return this.apiPOST(`/certification_ids?ids=${ids.join(',')}`, {});
  }

  createComplaint(complaint) {
    return this.apiPOST('/complaints', complaint);
  }

  createFilter(filter) {
    return this.apiPOST('/filters', filter);
  }

  createInvitedUser(contactDetails) {
    return this.apiPOST('/users/create', contactDetails);
  }

  createQuarterlySurveillanceReport(report) {
    return this.apiPOST('/surveillance-report/quarterly', report);
  }

  createScheduleOneTimeTrigger(trigger) {
    return this.apiPOST('/schedules/triggers/one_time', trigger);
  }

  createScheduleTrigger(trigger) {
    return this.apiPOST('/schedules/triggers', trigger);
  }

  createSvap(svap) {
    return this.apiPOST('/svaps', svap);
  }

  deleteAnnouncement(announcementId) {
    return this.apiDELETE(`/announcements/${announcementId}`);
  }

  deleteAnnualSurveillanceReport(id) {
    return this.apiDELETE(`/surveillance-report/annual/${id}`);
  }

  deleteComplaint(complaintId) {
    return this.apiDELETE(`/complaints/${complaintId}`);
  }

  deleteFilter(filterId) {
    return this.apiDELETE(`/filters/${filterId}`);
  }

  deleteQuarterlySurveillanceReport(id) {
    return this.apiDELETE(`/surveillance-report/quarterly/${id}`);
  }

  deleteScheduleTrigger(trigger) {
    return this.apiDELETE(`/schedules/triggers/${trigger.group}/${trigger.name}`);
  }

  deleteSurveillance(surveillanceId, reason) {
    return this.apiDELETE(`/surveillance/${surveillanceId}`, {
      reason,
    });
  }

  deleteSurveillanceDocument(survId, docId) {
    return this.apiDELETE(`/surveillance/${survId}/document/${docId}`);
  }

  deleteSvap(svap) {
    return this.apiDELETE('/svaps', svap);
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
    return this.apiGET('/data/accessibility_standards');
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

  getAnnouncement(announcementId) {
    return this.apiGET(`/announcements/${announcementId}`);
  }

  getAnnouncementActivity(activityRange) {
    const call = '/activity/announcements';
    return this.getActivity(call, activityRange);
  }

  getAnnouncements(pending, forceReload) {
    return this.apiGET(`/announcements?future=${pending}`, { forceReload });
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

  getCertificationCriteriaForSvap() {
    return this.apiGET('/svaps/criteria');
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

  getChangeRequestStatusTypes() {
    return this.apiGET('/data/change-request-status-types');
  }

  getChangeRequestTypes() {
    return this.apiGET('/data/change-request-types');
  }

  getCmsDownload() {
    return this.apiGET('/certification_ids');
  }

  getCmsId(key, includeCriteria) {
    return this.apiGET(`/certification_ids/${key}?includeCriteria=${includeCriteria ? 'true' : 'false'}`);
  }

  getCmsIds(ids) {
    return this.apiGET(`/certification_ids/search?ids=${ids}`);
  }

  getCollection(type) {
    switch (type) {
      case 'apiDocumentation':
        return this.apiGET('/collections/certified-products?fields=id,edition,developer,developerId,product,version,chplProductNumber,certificationStatus,criteriaMet,apiDocumentation,transparencyAttestationUrl,serviceBaseUrlList');
      case 'bannedDevelopers':
        return this.apiGET('/collections/decertified-developers');
      case 'complaintListings':
        return this.apiGET('/collections/certified-products?fields=id,acb,chplProductNumber,developer,product');
      case 'correctiveAction':
        return this.apiGET('/collections/certified-products?fields=id,edition,curesUpdate,developer,developerId,product,version,chplProductNumber,certificationStatus,acb,openSurveillanceNonConformityCount,closedSurveillanceNonConformityCount,openDirectReviewNonConformityCount,closedDirectReviewNonConformityCount');
      case 'decertifiedProducts':
      case 'inactiveCertificates':
        return this.apiGET('/collections/certified-products?fields=id,edition,curesUpdate,developer,developerId,product,version,chplProductNumber,acb,decertificationDate,certificationStatus,numMeaningfulUse,numMeaningfulUseDate');
      case 'sed':
        return this.apiGET('/collections/certified-products?fields=id,edition,developer,developerId,product,version,chplProductNumber,acb,certificationStatus,criteriaMet');
      case 'surveillanceManagement':
        return this.apiGET('/collections/certified-products?fields=id,edition,curesUpdate,developer,developerId,product,version,chplProductNumber,certificationStatus,acb,openSurveillanceCount,closedSurveillanceCount,openSurveillanceNonConformityCount,closedSurveillanceNonConformityCount,surveillanceDates');
      // no default
    }
    return null;
  }

  getComplaints() {
    return this.apiGET('/complaints');
  }

  getComplainantTypes() {
    return this.apiGET('/data/complainant-types');
  }

  getCriteria() {
    return this.apiGET('/data/certification-criteria');
  }

  getCriterionProductStatistics() {
    return this.apiGET('/statistics/criterion_product');
  }

  getDeveloper(developerId) {
    return this.apiGET(`/developers/${developerId}`);
  }

  getDeveloperActivity(activityRange) {
    const call = '/activity/developers';
    return this.getActivity(call, activityRange);
  }

  getDeveloperHierarchy(developerId) {
    return this.apiGET(`/developers/${developerId}/hierarchy`);
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

  getFilters(filterTypeId) {
    return this.apiGET(`/filters?filterTypeId=${filterTypeId}`);
  }

  getFilterTypes() {
    return this.apiGET('/data/filter_types');
  }

  getFuzzyTypes(forceReload) {
    return this.apiGET('/data/fuzzy_choices', { forceReload });
  }

  getIncumbentDevelopersStatistics() {
    return this.apiGET('/statistics/incumbent_developers');
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

  getListingCountStatistics() {
    return this.apiGET('/statistics/listing_count');
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

  getScheduledSystemJobs() {
    return this.apiGET('/schedules/triggers?jobType=system');
  }

  getScheduleTriggers() {
    return this.apiGET('/schedules/triggers');
  }

  getScheduleJobs() {
    return this.apiGET('/schedules/jobs');
  }

  getParticipantAgeStatistics() {
    return this.apiGET('/statistics/participant_age_count');
  }

  getParticipantComputerExperienceStatistics() {
    return this.apiGET('/statistics/participant_computer_experience_count');
  }

  getParticipantEducationStatistics() {
    return this.apiGET('/statistics/participant_education_count');
  }

  getParticipantGenderStatistics() {
    return this.apiGET('/statistics/participant_gender_count');
  }

  getParticipantProductExperienceStatistics() {
    return this.apiGET('/statistics/participant_product_experience_count');
  }

  getParticipantProfessionalExperienceStatistics() {
    return this.apiGET('/statistics/participant_professional_experience_count');
  }

  getPendingListings(beta) {
    if (beta) {
      return this.apiGET('/listings/pending', { ignoreLoadingBar: true });
    }
    return this.apiGET('/certified_products/pending/metadata');
  }

  getPendingListingById(id) {
    return this.apiGET(`/certified_products/pending/${id}`);
  }

  getPendingListingByIdBeta(id) {
    return this.apiGET(`/listings/pending/${id}`);
  }

  getPractices() {
    return this.apiGET('/data/practice_types');
  }

  getProduct(productId) {
    return this.apiGET(`/products/${productId}`);
  }

  getProductActivity(activityRange) {
    const call = '/activity/products';
    return this.getActivity(call, activityRange);
  }

  getProductsByDeveloper(developerId) {
    return this.apiGET(`/products?developerId=${developerId}`);
  }

  getProductsByVersion(versionId, editable) {
    return this.apiGET(`/certified_products?versionId=${versionId}&editable=${editable}`);
  }

  getQmsStandards() {
    return this.apiGET('/data/qms_standards');
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

  getRelatedListings(productId) {
    return this.apiGET(`/products/${productId}/listings`);
  }

  getRelevantComplaints(report) {
    return this.apiGET(`/surveillance-report/quarterly/${report.id}/complaints`);
  }

  getRelevantListings(reportId) {
    return this.apiGET(`/surveillance-report/quarterly/${reportId}/listings`);
  }

  getSearchOptions() {
    return this.apiGET('/data/search-options');
  }

  getSedParticipantStatisticsCount() {
    return this.apiGET('/statistics/sed_participant_count');
  }

  getSimpleProduct(productId) {
    return this.apiGET(`/products/${productId}`);
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

  getSurveillanceActivityReport(range) {
    const url = `/surveillance/reports/activity?start=${range.startDate}&end=${range.endDate}`;
    return this.apiGET(url);
  }

  getSurveillanceLookups() {
    const data = {};
    this.apiGET('/data/surveillance_types')
      .then((response) => {
        data.surveillanceTypes = response;
      });
    this.apiGET('/data/surveillance_requirement_types')
      .then((response) => {
        data.surveillanceRequirementTypes = response;
      });
    this.apiGET('/data/surveillance_result_types')
      .then((response) => {
        data.surveillanceResultTypes = response;
      });
    this.apiGET('/data/surveillance-requirements')
      .then((response) => {
        data.surveillanceRequirements = response;
      });
    this.apiGET('/data/nonconformity-types')
      .then((response) => {
        data.nonconformityTypes = response;
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

  getTestFunctionality() {
    return this.apiGET('/data/test_functionality');
  }

  getTestProcedures() {
    return this.apiGET('/data/test_procedures');
  }

  getTestStandards() {
    return this.apiGET('/data/test_standards');
  }

  getTestTools() {
    return this.apiGET('/data/test_tools');
  }

  getUcdProcesses() {
    return this.apiGET('/data/ucd_processes');
  }

  getUploadingSurveillances() {
    return this.apiGET('/surveillance/pending');
  }

  getUploadTemplateVersions() {
    return this.apiGET('/data/upload_template_versions');
  }

  getUserActivities(activityRange) {
    const call = '/activity/user_activities';
    return this.getActivity(call, activityRange);
  }

  getUserActivity(activityRange) {
    const call = '/activity/users';
    return this.getActivity(call, activityRange);
  }

  getUserById(id) {
    return this.apiGET(`/users/beta/${id}/details`);
  }

  getUsers() {
    return this.apiGET('/users');
  }

  getUsersAtAcb(acbId) {
    return this.apiGET(`/acbs/${acbId}/users`);
  }

  getUsersAtAtl(atlId) {
    return this.apiGET(`/atls/${atlId}/users`);
  }

  getUsersAtDeveloper(developerId) {
    return this.apiGET(`/developers/${developerId}/users`);
  }

  getVersion(versionId) {
    return this.apiGET(`/versions/${versionId}`);
  }

  getVersionActivity(activityRange) {
    const call = '/activity/versions';
    return this.getActivity(call, activityRange);
  }

  getVersionsByProduct(productId) {
    return this.apiGET(`/versions?productId=${productId}`);
  }

  impersonateUser(user) {
    return this.apiGET(`/auth/beta/impersonate?id=${user.userId}`);
  }

  initiateSurveillance(surveillance) {
    return this.apiPOST('/surveillance', surveillance);
  }

  inviteUser(invitationObject) {
    return this.apiPOST('/users/invite', invitationObject);
  }

  keepalive() {
    return this.apiGET('/auth/keep_alive', { ignoreLoadingBar: true });
  }

  login(userObj) {
    return this.apiPOST('/auth/authenticate', userObj);
  }

  lookupCertificationId(certId) {
    return this.apiGET(`/certification_ids/${certId}`);
  }

  massRejectPendingListings(ids) {
    return this.apiDELETE('/certified_products/pending', { ids });
  }

  massRejectPendingListingsBeta(ids) {
    return this.apiDELETE('/listings/pending', { ids });
  }

  massRejectPendingSurveillance(ids) {
    return this.apiDELETE('/surveillance/pending', { ids });
  }

  mergeDevelopers(mergeDeveloperObject) {
    return this.apiPOST('/developers/merge', mergeDeveloperObject);
  }

  modifyACB(acb) {
    return this.apiPUT(`/acbs/${acb.id}`, acb);
  }

  modifyATL(atl) {
    return this.apiPUT(`/atls/${atl.id}`, atl);
  }

  modifyAnnouncement(announcement) {
    return this.apiPUT(`/announcements/${announcement.id}`, announcement);
  }

  registerApi(user) {
    return this.apiPOST('/key', user);
  }

  rejectPendingCp(cpId) {
    return this.apiDELETE(`/certified_products/pending/${cpId}`);
  }

  rejectPendingListing(id) {
    return this.apiDELETE(`/listings/pending/${id}`);
  }

  rejectPendingSurveillance(survId) {
    return this.apiDELETE(`/surveillance/pending/${survId}`);
  }

  removeUserFromAcb(userId, acbId) {
    return this.apiDELETE(`/acbs/${acbId}/users/${userId}`);
  }

  removeUserFromAtl(userId, atlId) {
    return this.apiDELETE(`/atls/${atlId}/users/${userId}`);
  }

  removeUserFromDeveloper(userId, developerId) {
    return this.apiDELETE(`/developers/${developerId}/users/${userId}`);
  }

  requestApiKey(apiKeyRequest) {
    return this.apiPOST('/key/request', apiKeyRequest);
  }

  resetPassword(userObj) {
    return this.apiPOST('/auth/reset_password_request', userObj);
  }

  emailResetPassword(userObj) {
    return this.apiPOST('/auth/email_reset_password', userObj);
  }

  revokeApi(user) {
    return this.apiDELETE(`/key/${user.key}`);
  }

  search(queryObj) {
    return this.apiPOST('/search', queryObj);
  }

  splitDeveloper(developerSplitObject) {
    return this.apiPOST(`/developers/${developerSplitObject.oldDeveloper.developerId}/split`, developerSplitObject);
  }

  splitProduct(productObject) {
    return this.apiPOST(`/products/${productObject.oldProduct.productId}/split`, productObject);
  }

  splitVersion(versionObject) {
    return this.apiPOST(`/versions/${versionObject.oldVersion.versionId}/split`, versionObject);
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
    return this.apiPUT(`/developers/${developer.developerId}`, developer);
  }

  updateFuzzyType(fuzzyType) {
    return this.apiPUT(`/data/fuzzy_choices/${fuzzyType.id}`, fuzzyType);
  }

  updateJob(job) {
    return this.apiPUT('/schedules/jobs', job);
  }

  updateProduct(productObject) {
    return this.apiPUT('/products', productObject);
  }

  updateQuarterlySurveillanceReport(report) {
    return this.apiPUT('/surveillance-report/quarterly', report);
  }

  updateRelevantListing(reportId, listing) {
    return this.apiPUT(`/surveillance-report/quarterly/${reportId}/listings/${listing.id}`, listing);
  }

  updateRelevantSurveillance(reportId, surveillance) {
    return this.apiPUT(`/surveillance-report/quarterly/${reportId}/surveillance/${surveillance.id}`, surveillance);
  }

  updateScheduleTrigger(trigger) {
    return this.apiPUT('/schedules/triggers', trigger);
  }

  updateSurveillance(surveillance) {
    return this.apiPUT(`/surveillance/${surveillance.id}`, surveillance);
  }

  updateSvap(svap) {
    return this.apiPUT('/svaps', svap);
  }

  updateUser(user) {
    return this.apiPUT(`/users/${user.userId}`, user);
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
        return this.$q.reject(response);
      }, (response) => this.$q.reject(response));
  }

  apiPUT(endpoint, postObject) {
    return this.$http.put(this.API + endpoint, postObject)
      .then((response) => {
        if (angular.isObject(response.data)) {
          return response.data;
        }
        return this.$q.reject(response);
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
