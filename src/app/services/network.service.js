export default class NetworkService {
  constructor($http, $q) {
    'ngInject';

    this.$http = $http;
    this.$q = $q;
  }

  logout(logoutRequest) {
    return this.apiPOST('/auth/logout', logoutRequest);
  }

  /*
   * Helper functions
   */

  apiPOST(endpoint, postObject) {
    return this.$http.post(`/rest${endpoint}`, postObject)
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
