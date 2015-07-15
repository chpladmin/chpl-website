;(function () {
    'use strict';

    angular.module('app.loginServices')
        .service('userService', function ($http, API) {
            var self = this;

            self.getQuote = function () {
                return $http.get(API + '/auth/quote');
            }

            self.register = function (username, password) {
                return $http.post(API + '/auth/register', {
                    username: username,
                    password: password
                });
            }

            self.login = function (username, password) {
                return $http.post(API + '/auth/login', {
                    username: username,
                    password: password
                });
            }
        })
        .service('authService', function ($window, $localStorage) {
            var self = this;

            self.parseJwt = function (token) {
                var base64 = token.split('.')[1].replace('-','+').replace('_','/');
                return JSON.parse($window.atob(base64));
            }

            self.saveToken = function (token) {
                $localStorage.jwtToken = token;
            }

            self.getToken = function () {
                return $localStorage.jwtToken;
            }

            self.isAuthed = function () {
                var token = self.getToken();
                if (token) {
                    var params = self.parseJwt(token);
                    return Math.round(new Date().getTime() / 1000) <= params.exp;
                } else {
                    return false;
                }
            }

            self.getUsername = function () {
                if (self.isAuthed()) {
                    var token = self.getToken();
                    return self.parseJwt(token).username;
                } else {
                    return 'User';
                }
            }

            self.logout = function () {
                delete $localStorage.jwtToken;
            }
        });
})();
