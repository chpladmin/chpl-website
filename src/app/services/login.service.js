import { clearAuthTokens } from 'axios-jwt';

(function () {
  angular.module('chpl.services')
    .factory('authService', authService);

  /** @ngInclude */
  /** @ngInject */
  function authService($injector, $localStorage, $log, $rootScope, $window, featureFlags, API_KEY) {
    const service = {
      canImpersonate,
      canManageAcb,
      canManageDeveloper,
      getApiKey,
      getCurrentUser,
      getFullname,
      getToken,
      getUserId,
      hasAnyRole,
      isImpersonating,
      logout,
      parseJwt,
      saveCurrentUser,
      saveRefreshToken,
      saveToken,
    };
    return service;

    /// /////////////////////////////////////////////////////////////////////

    function canImpersonate(target) {
      const userRole = parseJwt(getToken())?.Authority;
      const targetRole = target.role;

      return !isImpersonating()
        && (((userRole === 'ROLE_ADMIN') && (targetRole !== 'ROLE_ADMIN'))
                 || (userRole === 'ROLE_ONC' && targetRole !== 'ROLE_ADMIN' && targetRole !== 'ROLE_ONC'));
    }

    function canManageAcb(acb) {
      if (hasAnyRole(['chpl-admin', 'chpl-onc'])) {
        return true;
      }
      if (hasAnyRole(['chpl-onc-acb'])) {
        const currentUser = getCurrentUser();
        return currentUser.organizations
          .filter((o) => o.id === acb.id)
          .length > 0;
      }
      return false;
    }

    function canManageDeveloper(developer) {
      if (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb'])) {
        return true;
      }
      if (hasAnyRole(['chpl-developer'])) {
        const currentUser = getCurrentUser();
        return currentUser.organizations
          .filter((d) => d.id === developer.id)
          .length > 0;
      }
      return false;
    }

    function getApiKey() {
      return API_KEY;
    }

    function getFullname() {
      if (hasAnyRole(['chpl-admin', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
        const token = getToken();
        const identity = parseJwt(token).Identity;
        if (identity.length === 3) {
          return identity[2];
        }
        return `Impersonating ${identity[2]}`;
      }
      logout();
      return '';
    }

    function getCurrentUser() {
      return $localStorage.currentUser;
    }

    function getToken() {
      return $localStorage.jwtToken;
    }

    function getUserId() {
      if (hasAnyRole(['chpl-admin', 'chpl-onc-acb', 'chpl-onc', 'chpl-onc-acb', 'ROLE_CMS_STAFF', 'chpl-developer'])) {
        const token = getToken();
        if (parseJwt(token).Identity) {
          const identity = parseJwt(token).Identity;
          return identity[0];
        } else {
          return parseJwt(token).sub;
        }
      } else {
        logout();
        return '';
      }
    }

    function hasAnyRole(roles) {
      if (!roles || roles.length === 0) {
        return false;
      }

      if (roles.includes('chpl-admin')) {
        roles.push('ROLE_ADMIN');
      }
      if (roles.includes('chpl-onc-acb')) {
        roles.push('ROLE_ACB');
      }
      if (roles.includes('chpl-developer')) {
        roles.push('ROLE_DEVELOPER');
      }
      if (roles.includes('chpl-onc')) {
        roles.push('ROLE_ONC');
      }

      const token = getToken();
      if (token) {
        const userRole = parseJwt(token).Authority ? parseJwt(token).Authority : parseJwt(token)['cognito:groups'].filter((grp) => !grp.endsWith('-env'))[0];
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

    function isImpersonating() {
      const token = getToken();
      const identity = parseJwt(token)?.Identity;
      return identity && identity.length !== 3;
    }

    function logout() {
      $injector.get('networkService').logout({
        email: getCurrentUser().email,
      });
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
          if (user['cognito:groups']) {
            user['cognito:groups'] = user['cognito:groups'].filter((grp) => !grp.endsWith('-env'));
          }
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
