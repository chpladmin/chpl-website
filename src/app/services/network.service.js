export default class NetworkService {
  constructor($http, $q, API) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.API = API;
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

  deleteSurveillance(surveillanceId, reason) {
    return this.apiDELETE(`/surveillance/${surveillanceId}`, {
      reason,
    });
  }

  deleteUser(userId) {
    return this.apiDELETE(`/users/${userId}`);
  }

  getAcbs(editable) {
    return this.apiGET(`/acbs?editable=${editable}`, { forceReload: true });
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

  getComplaintsWithSurveillance(surveillanceId) {
    return this.apiGET(`/complaints/search/v2?surveillanceIds=${surveillanceId}`);
  }

  getDeveloper(id) {
    return this.apiGET(`/developers/${id}`);
  }

  getDevelopers() {
    return this.apiGET('/developers');
  }

  getListing(listingId, forceReload) {
    return this.apiGET(`/certified_products/${listingId}/details`, { forceReload });
  }

  getListingBasic(listingId, forceReload) {
    return this.apiGET(`/certified_products/${listingId}`, { forceReload });
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

  getRelatedListings(id) {
    return this.apiGET(`/products/${id}/listings`);
  }

  getReportMetadata(reportKey) {
    return this.apiGET(`/report-data/report-metadata/${reportKey}`);
  }

  getSimpleProduct(id) {
    return this.apiGET(`/products/${id}`);
  }

  getSystemStatus() {
    return this.$http.get('/rest/system-status');
  }

  getUsers() {
    return this.apiGET('/users');
  }

  getVersion(id) {
    return this.apiGET(`/versions/${id}`);
  }

  getVersionsByProduct(productId) {
    return this.apiGET(`/versions?productId=${productId}`);
  }

  inviteUser(invitationObject) {
    return this.apiPOST('/users/invitation', invitationObject);
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

  updateSurveillance(surveillance) {
    return this.apiPUT(`/surveillance/${surveillance.id}`, surveillance);
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
        return response;
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
