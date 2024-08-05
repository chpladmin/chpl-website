import * as moment from 'moment';

import ChplNavigationBottomWrapper from './navigation-bottom-wrapper';

import { reactToAngularComponent } from 'services/angular-react-helper';

/** @ngInclude */
function authInterceptor($injector, $localStorage, $log, $q, API, authService, toaster) {
  // Notify if a cache is being cleared
  function parseCacheCleared(value) {
    const caches = value.split(',');
    let body;
    let title;
    for (let i = 0; i < caches.length; i += 1) {
      switch (caches[i]) {
        case 'listingCollection':
          title = 'Update processing';
          body = 'Your changes may not be reflected immediately in the search results and shortcuts pages. Please contact CHPL admin if you have any concerns';
          break;
          // no default
      }
    }
    toaster.pop({
      type: 'warning',
      title,
      body,
    });
  }

  // Notify if the CHPL ID changed
  function parseChplIdChanged(id) {
    let body;
    let title;
    if (id.indexOf(',') > -1) {
      title = 'CHPL IDs Changed';
      body = 'Your activity caused CHPL Product Numbers to change';
    } else {
      title = 'CHPL ID Changed';
      body = 'Your activity caused a CHPL Product Number to change';
    }
    toaster.pop({
      type: 'success',
      title,
      body,
    });
  }

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
      const nghttp = $injector.get('$http');
      const headers = {
        'API-Key': '12909a978483dfb8ecd0596c98ae9094',
      };
      return nghttp.post('http://localhost:3000/rest/cognito/users/refresh-token', { refreshToken, cognitoId }, { headers }).then(
        (response) => {
          $localStorage.jwtToken = response.data.accessToken;
          return $localStorage.jwtToken;
        },
        (err) => {
          $log.info(err);
        }
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
      if (response.headers && response.headers()['cache-cleared']) {
        parseCacheCleared(response.headers()['cache-cleared']);
      }
      if (response.headers && response.headers()['chpl-id-changed']) {
        parseChplIdChanged(response.headers()['chpl-id-changed']);
      }
      if (response.config.url.indexOf(API) === 0) {
        response.data = parseToken(response.data);
      }
      if (response.data && response.data.error === 'Invalid authentication token.' && authService.hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
        authService.logout();
      }
      return response;
    },
  };
}

angular.module('chpl.navigation', [
  'chpl.services',
  'chpl.constants',
  'feature-flags',
  'toaster',
  'ui.router',
])
  .factory('authInterceptor', authInterceptor)
  .config(($httpProvider) => {
    $httpProvider.interceptors.push('authInterceptor');
  })
  .component('chplNavigationBottomBridge', reactToAngularComponent(ChplNavigationBottomWrapper));
