(function () {
    'use strict';

    angular.module('chpl.loginServices')
        .factory('authService', authService);

    /** @ngInclude */
    function authService ($localStorage, $window, API_KEY) {
        var service = {
            getApiKey: getApiKey,
            getToken: getToken,
            getUsername: getUsername,
            isAcbAdmin: isAcbAdmin,
            isAcbStaff: isAcbStaff,
            isAtlAdmin: isAtlAdmin,
            isAtlStaff: isAtlStaff,
            isAuthed: isAuthed,
            isChplAdmin: isChplAdmin,
            isCmsStaff: isCmsStaff,
            isOncStaff: isOncStaff,
            logout: logout,
            parseJwt: parseJwt,
            saveToken: saveToken,
        }
        return service;

        ////////////////////////////////////////////////////////////////////////

        function getApiKey () {
            return API_KEY;
        }

        function getToken () {
            return $localStorage.jwtToken;
        }

        function getUsername () {
            if (isAuthed()) {
                var token = getToken();
                var identity = parseJwt(token).Identity;
                return identity[2] + " " + identity[3];
            } else {
                logout();
                return '';
            }
        }

        function isAuthed () {
            var token = getToken();
            if (token) {
                var params = parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        }

        function isAcbAdmin () {
            var token = getToken();
            if (token) {
                var authorities = parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ACB_ADMIN') > -1
                }
            }
            return false;
        }

        function isAcbStaff () {
            var token = getToken();
            if (token) {
                var authorities = parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ACB_STAFF') > -1
                }
            }
            return false;
        }

        function isAtlAdmin () {
            var token = getToken();
            if (token) {
                var authorities = parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ATL_ADMIN') > -1
                }
            }
            return false;
        }

        function isAtlStaff () {
            var token = getToken();
            if (token) {
                var authorities = parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ATL_STAFF') > -1
                }
            }
            return false;
        }

        function isChplAdmin () {
            var token = getToken();
            if (token) {
                var authorities = parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ADMIN') > -1
                }
            }
            return false;
        }

        function isCmsStaff () {
            var token = getToken();
            if (token) {
                var authorities = parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_CMS_STAFF') > -1
                }
            }
            return false;
        }

        function isOncStaff () {
            var token = getToken();
            if (token) {
                var authorities = parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ONC_STAFF') > -1
                }
            }
            return false;
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
