import { clearAuthTokens } from 'axios-jwt';

(function () {
  angular.module('chpl.services')
    .factory('authService', authService);

  /** @ngInclude */
  /** @ngInject */
  function authService($injector, $localStorage, $log, $rootScope, $window, API_KEY) {
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
      return $localStorage.currentUser;
    }

    function getToken() {
      return $localStorage.jwtToken;
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
      delete $localStorage.jwtToken;
      delete $localStorage.refreshToken;
      delete $localStorage.currentUser;
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
        return {};
      }
    }

    function saveCurrentUser(user) {
      $localStorage.currentUser = user;
    }

    function saveToken(token) {
      $localStorage.jwtToken = token;
    }

    function saveRefreshToken(token) {
      $localStorage.refreshToken = token;
    }
  }
}());
