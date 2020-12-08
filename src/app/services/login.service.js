(function () {
    'use strict';

    angular.module('chpl.services')
        .factory('authService', authService);

    /** @ngInclude */
    function authService ($localStorage, $log, $rootScope, $window, API_KEY) {
        var service = {
            canImpersonate: canImpersonate,
            canManageAcb: canManageAcb,
            canManageDeveloper: canManageDeveloper,
            getApiKey: getApiKey,
            getCurrentUser: getCurrentUser,
            getFullname: getFullname,
            getToken: getToken,
            getUserId: getUserId,
            hasAnyRole: hasAnyRole,
            isImpersonating: isImpersonating,
            logout: logout,
            parseJwt: parseJwt,
            saveCurrentUser: saveCurrentUser,
            saveToken: saveToken,
        };
        return service;

        ////////////////////////////////////////////////////////////////////////

        function canImpersonate (target) {
            let userRole = parseJwt(getToken()).Authority;
            let targetRole = target.role;
            return !isImpersonating() &&
                ((userRole === 'ROLE_ADMIN' && targetRole !== 'ROLE_ADMIN')
                 || (userRole === 'ROLE_ONC' && targetRole !== 'ROLE_ADMIN' && targetRole !== 'ROLE_ONC'));
        }

        function canManageAcb (acb) {
            if (hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                return true;
            }
            if (hasAnyRole(['ROLE_ACB'])) {
                let currentUser = getCurrentUser();
                return currentUser.organizations
                    .filter(o => o.id === acb.id)
                    .length > 0;
            }
            return false;
        }

        function canManageDeveloper (developer) {
            if (hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                return true;
            }
            if (hasAnyRole(['ROLE_DEVELOPER'])) {
                let currentUser = getCurrentUser();
                return currentUser.organizations
                    .filter(d => d.id === developer.developerId)
                    .length > 0;
            }
            return false;
        }

        function getApiKey () {
            return API_KEY;
        }

        function getFullname () {
            if (hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
                var token = getToken();
                var identity = parseJwt(token).Identity;
                if (identity.length === 3) {
                    return identity[2];
                } else {
                    return 'Impersonating ' + identity[2];
                }
            } else {
                logout();
                return '';
            }
        }

        function getCurrentUser () {
            return $localStorage.currentUser;
        }

        function getToken () {
            return $localStorage.jwtToken;
        }

        function getUserId () {
            if (hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ONC_STAFF', 'ROLE_ACB', 'ROLE_ATL', 'ROLE_CMS_STAFF', 'ROLE_DEVELOPER'])) {
                var token = getToken();
                var identity = parseJwt(token).Identity;
                return identity[0];
            } else {
                logout();
                return '';
            }
        }

        function hasAnyRole (roles) {
            if (!roles || roles.length === 0) {
                return false;
            }
            var token = getToken();
            if (token) {
                let userRole = parseJwt(token).Authority;
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

        function isImpersonating () {
            var token = getToken();
            var identity = parseJwt(token).Identity;
            return identity.length !== 3;
        }

        function logout () {
            delete $localStorage.jwtToken;
            delete $localStorage.currentUser;
        }

        function parseJwt (token) {
            if (angular.isString(token)) {
                var vals = token.split('.');
                if (vals.length > 1) {
                    var base64 = vals[1].replace('-','+').replace('_','/');
                    return angular.fromJson($window.atob(base64));
                }
                return {};
            }
        }

        function saveCurrentUser (user) {
            $localStorage.currentUser = user;
        }

        function saveToken (token) {
            $localStorage.jwtToken = token;
        }
    }
})();
