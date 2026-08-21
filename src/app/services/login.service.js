import { clearAuthTokens } from 'axios-jwt';

(function () {
  angular.module('chpl.services')
    .factory('authService', authService);

  /** @ngInclude */
  /** @ngInject */
  function authService($injector, $log, $rootScope) {
    const service = {
      getToken,
      hasAnyRole,
      saveCurrentUser,
      saveRefreshToken,
      saveToken,
    };
    return service;

    /// /////////////////////////////////////////////////////////////////////

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
