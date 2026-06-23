import * as moment from 'moment';

import ChplNavigationBottomWrapper from './navigation-bottom-wrapper';
import ChplNavigationTopWrapper from './navigation-top-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

/** @ngInclude */
function authInterceptor($injector, $localStorage, $log, $q, API, authService) {
  // If a token was sent back, save it
  function parseToken(data) {
    let response = data;
    try {
      if (angular.isString(response)) {
        response = angular.fromJson(response);
      }
      if (response.token) {
        authService.saveToken(response.token);
      }
    } catch (e) {
      // console.log('data is not json', response.config.url, response.data, e);
    }
    return response;
  }

  function getAuthorizationHeader() {
    const accessToken = $localStorage.jwtToken;
    if (accessToken && authService.parseJwt(accessToken).exp > moment(new Date().getTime()).unix()) {
      return $q.when(accessToken);
    }
    const { refreshToken } = $localStorage;

    if ($localStorage.currentUser && $localStorage.refreshToken) {
      const { cognitoId } = $localStorage.currentUser;
      const $http = $injector.get('$http');
      const headers = {
        'API-Key': '12909a978483dfb8ecd0596c98ae9094',
      };
      return $http.post('auth/refresh-token', { refreshToken, cognitoId }, { headers }).then(
        (response) => {
          $localStorage.jwtToken = response.data.accessToken;
          return $localStorage.jwtToken;
        },
        (err) => {
          $log.info(err);
        },
      );
    }
    return $q.when($localStorage.jwtToken);
  }

  return {
    // automatically attach Authorization header
    request(config) {
      const apiKey = authService.getApiKey();
      const updated = {
        ...config,
      };
      if (config.url.indexOf(API) === 0) {
        updated.headers['API-Key'] = apiKey;
        if (!config.url?.includes('refresh-token')) {
          getAuthorizationHeader().then((token) => {
            if (token) {
              updated.headers.Authorization = `Bearer ${token}`;
            }
          });
        }
      }
      return updated;
    },

    response(response) {
      if (response.config.url.indexOf(API) === 0) {
        response.data = parseToken(response.data);
      }
      if (response.data && response.data.error === 'Invalid authentication token.' && authService.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'chpl-cms-staff', 'chpl-developer'])) {
        authService.logout();
      }
      return response;
    },
  };
}

angular.module('chpl.navigation', [
  'chpl.services',
  'chpl.constants',
  'ui.router',
])
  .factory('authInterceptor', authInterceptor)
  .config(($httpProvider) => {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .component('chplNavigationBottomBridge', reactToAngularComponent(ChplNavigationBottomWrapper))
  .component('chplNavigationTopBridge', reactToAngularComponent(ChplNavigationTopWrapper));
