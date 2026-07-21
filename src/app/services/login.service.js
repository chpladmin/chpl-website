import { clearAuthTokens } from 'axios-jwt';

(function () {
  angular.module('chpl.services')
    .factory('authService', authService);

  /** @ngInclude */
  /** @ngInject */
  function authService($injector, $log, $rootScope, $window, API_KEY) {
    const service = {
      getApiKey,
      getCurrentUser,
      getToken,
      hasAnyRole,
      logout,
      parseJwt,
      saveCurrentUser,
      saveRefreshToken,
      saveToken,
    };
    return service;

    /// /////////////////////////////////////////////////////////////////////

    function getApiKey() {
      return API_KEY;
    }

    function getCurrentUser() {
      return JSON.parse(localStorage.getItem('ngStorage-currentUser'));
    }

    function getToken() {
      return JSON.parse(localStorage.getItem('ngStorage-jwtToken'));
    }

    function hasAnyRole(roles) {
      if (!roles || roles.length === 0) {
        return false;
      }

      const user = getCurrentUser();
      if (user) {
        const userRole = user.role;
        if (roles) {
          if (userRole) {
            return roles.reduce((ret, role) => ret || userRole === role, false); // true iff user has a role in the required list
          }
          return false; // logged in, role(s) required, user has no role
        }
        return true; // logged in, no role required
      }
      return false; // not logged in
    }

    function logout() {
      if (getCurrentUser().cognitoId) {
        $injector.get('networkService').logout({
          email: getCurrentUser().email,
        });
        document.cookie = 'refresh_token=; Max-Age=0; path=/; domain=.healthit.gov;expires=Thu, 01 Jan 1970 00:00:01 GMT';
      }
      localStorage.removeItem('ngStorage-jwtToken');
      localStorage.removeItem('ngStorage-refreshToken');
      localStorage.removeItem('ngStorage-currentUser');
      clearAuthTokens();
      $rootScope.$broadcast('loggedOut');
    }

    function parseJwt(token) {
      if (angular.isString(token)) {
        const vals = token.split('.');
        if (vals.length > 1) {
          const base64 = vals[1].replace('-', '+').replace('_', '/');
          const user = angular.fromJson($window.atob(base64));
          return user;
        }
      }
      return {};
    }

    function saveCurrentUser(user) {
      localStorage.setItem('ngStorage-currentUser', JSON.stringify(user));
    }

    function saveToken(token) {
      localStorage.setItem('ngStorage-jwtToken', JSON.stringify(token));
    }

    function saveRefreshToken(token) {
      localStorage.setItem('ngStorage-refreshToken', JSON.stringify(token));
    }
  }
}());
