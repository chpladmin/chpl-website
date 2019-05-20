(function () {
    'use strict';

    angular.module('chpl.services')
        .factory('authService', authService);

    /** @ngInclude */
    function authService ($localStorage, $log, $rootScope, $window, API_KEY) {
        var service = {
            canImpersonate: canImpersonate,
            getApiKey: getApiKey,
            getFullname: getFullname,
            getToken: getToken,
            getUsername: getUsername,
            hasAnyRole: hasAnyRole,
            isImpersonating: isImpersonating,
            logout: logout,
            parseJwt: parseJwt,
            saveToken: saveToken,
        }
        return service;

        ////////////////////////////////////////////////////////////////////////

        function canImpersonate (target) {
            let userRole = parseJwt(getToken()).Authority;
            let targetRole = target.role;
            return !isImpersonating() &&
                ((userRole === 'ROLE_ADMIN' && targetRole !== 'ROLE_ADMIN')
                 || (userRole === 'ROLE_ONC' && targetRole !== 'ROLE_ADMIN' && targetRole !== 'ROLE_ONC'));
        }

        function getApiKey () {
            return API_KEY;
        }

        function getFullname () {
            if (hasAnyRole()) {
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

        function getToken () {
            return $localStorage.jwtToken;
        }

        function getUsername () {
            if (hasAnyRole()) {
                var token = getToken();
                var identity = parseJwt(token).Identity;
                return identity[1];
            } else {
                logout();
                return '';
            }
        }

        function hasAnyRole (roles) {
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

        function saveToken (token) {
            $localStorage.jwtToken = token;
        }
    }
})();
