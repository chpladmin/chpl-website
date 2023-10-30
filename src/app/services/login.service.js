(function () {
  angular.module('chpl.services')
    .factory('authService', authService);

  /** @ngInclude */
  /** @ngInject */
  function authService($localStorage, $log, $rootScope, $window, featureFlags, API_KEY) {
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
      saveToken,
    };
    return service;

    /// /////////////////////////////////////////////////////////////////////

    function canImpersonate(target) {
      const userRole = parseJwt(getToken())?.Authority;
      const targetRole = target.role;
      return !isImpersonating()
                && ((userRole === 'chpl-admin' && targetRole !== 'CHPL_ADMIN')
                 || (userRole === 'ROLE_ONC' && targetRole !== 'chpl-admin' && targetRole !== 'ROLE_ONC'));
    }

    function canManageAcb(acb) {
      if (hasAnyRole(['chpl-admin', 'ROLE_ONC'])) {
        return true;
      }
      if (hasAnyRole(['ROLE_ACB'])) {
        const currentUser = getCurrentUser();
        return currentUser.organizations
          .filter((o) => o.id === acb.id)
          .length > 0;
      }
      return false;
    }

    function canManageDeveloper(developer) {
      if (hasAnyRole(['chpl-admin', 'ROLE_ONC', 'ROLE_ACB'])) {
        return true;
      }
      if (hasAnyRole(['ROLE_DEVELOPER'])) {
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
      if (hasAnyRole(['chpl-admin', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
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
      if (hasAnyRole(['chpl-admin', 'ROLE_ONC', 'ROLE_ACB', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
        const token = getToken();
        if (featureFlags.isOn('sso')) {
          return parseJwt(token).email;
        } else {
          const identity = parseJwt(token).Identity;
          return identity[0];
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
        console.log('addding ROLE_ADMIN');
        roles.push('ROLE_ADMIN');
      }
      
      const token = getToken();
      if (token) {
        var userRole;
        if (featureFlags.isOn('sso')) {
          userRole = parseJwt(token)['cognito:groups'][0];
        } else {
          userRole = parseJwt(token).Authority;
        }
        if (roles) {
          if (userRole) {
            console.log('Checking:' + userRole + ' is in ' + roles.toString());
            console.log(roles.reduce((ret, role) => ret || userRole === role, false));
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
      console.log('Logging out!')
      delete $localStorage.jwtToken;
      delete $localStorage.currentUser;
      $rootScope.$broadcast('loggedOut');
    }

    function parseJwt(token) {
      if (angular.isString(token)) {
        const vals = token.split('.');
        if (vals.length > 1) {
          const base64 = vals[1].replace('-', '+').replace('_', '/');
          return angular.fromJson($window.atob(base64));
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
  }
}());
