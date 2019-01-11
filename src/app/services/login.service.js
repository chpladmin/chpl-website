(function () {
    'use strict';

    angular.module('chpl.services')
        .factory('authService', authService);

    /** @ngInclude */
    function authService ($localStorage, $log, $window, API_KEY) {
        var service = {
            getApiKey: getApiKey,
            getFullname: getFullname,
            getToken: getToken,
            getUsername: getUsername,
            hasAnyRole: hasAnyRole,
            logout: logout,
            parseJwt: parseJwt,
            saveToken: saveToken,
        }
        return service;

        ////////////////////////////////////////////////////////////////////////

        function getApiKey () {
            return API_KEY;
        }

        function getFullname () {
            if (hasAnyRole()) {
                var token = getToken();
                var identity = parseJwt(token).Identity;
                if (identity.length === 2) {
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
                let userRoles = parseJwt(token).Authorities;
                if (roles) {
                    if (userRoles) {
                        return roles.reduce((ret, role) => ret || (userRoles.indexOf(role) > -1), false); // true iff user has at least one role in the required list
                    }
                    return false; // logged in, role(s) required, user has no roles
                }
                return true; // logged in, no role required
            }
            return false; // not logged in
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
