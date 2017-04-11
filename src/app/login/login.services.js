(function () {
    'use strict';

    angular.module('chpl.loginServices')
        .service('authService', authService);

    /** @ngInclude */
    function authService ($window, $localStorage, API_KEY) {
        var self = this;

        self.parseJwt = function (token) {
            if (angular.isString(token)) {
                var vals = token.split('.');
                if (vals.length > 1) {
                    var base64 = vals[1].replace('-','+').replace('_','/');
                    return angular.fromJson($window.atob(base64));
                }
                return {};
            }
        };

        self.saveToken = function (token) {
            $localStorage.jwtToken = token;
        };

        self.getToken = function () {
            return $localStorage.jwtToken;
        };

        self.getApiKey = function () {
            return API_KEY;
        };

        self.isAuthed = function () {
            var token = self.getToken();
            if (token) {
                var params = self.parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        };

        self.isChplAdmin = function () {
            var token = self.getToken();
            if (token) {
                var authorities = self.parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ADMIN') > -1
                }
            }
            return false;
        };

        self.isCmsStaff = function () {
            var token = self.getToken();
            if (token) {
                var authorities = self.parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_CMS_STAFF') > -1
                }
            }
            return false;
        };

        self.isAcbAdmin = function () {
            var token = self.getToken();
            if (token) {
                var authorities = self.parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ACB_ADMIN') > -1
                }
            }
            return false;
        };

        self.isAtlAdmin = function () {
            var token = self.getToken();
            if (token) {
                var authorities = self.parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ATL_ADMIN') > -1
                }
            }
            return false;
        };

        self.isAcbStaff = function () {
            var token = self.getToken();
            if (token) {
                var authorities = self.parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ACB_STAFF') > -1
                }
            }
            return false;
        };

        self.isAtlStaff = function () {
            var token = self.getToken();
            if (token) {
                var authorities = self.parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ATL_STAFF') > -1
                }
            }
            return false;
        };

        self.isOncStaff = function () {
            var token = self.getToken();
            if (token) {
                var authorities = self.parseJwt(token).Authorities;
                if (authorities) {
                    return authorities.indexOf('ROLE_ONC_STAFF') > -1
                }
            }
            return false;
        };

        self.getUsername = function () {
            if (self.isAuthed()) {
                var token = self.getToken();
                var identity = self.parseJwt(token).Identity;
                return identity[2] + " " + identity[3];
            } else {
                self.logout();
                return '';
            }
        };

        self.logout = function () {
            delete $localStorage.jwtToken;
        };
    }
})();
