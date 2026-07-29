export default class NetworkService {
  constructor($http, $q, API) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
    this.API = API;
  }

  logout(logoutRequest) {
    return this.apiPOST('/auth/logout', logoutRequest);
  }

  /*
   * Helper functions
   */

  apiPOST(endpoint, postObject) {
    return this.$http.post(this.API + endpoint, postObject)
      .then((response) => {
        if (angular.isObject(response.data)) {
          return response.data;
        }
        return response;
      }, (response) => this.$q.reject(response));
  }
}

angular.module('chpl.services')
  .service('networkService', NetworkService);
