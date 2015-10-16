;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdminController', ['$log', 'commonService', 'authService', function ($log, commonService, authService) {
            var self = this;

            self.isAuthed = function () {
                return authService.isAuthed ? authService.isAuthed() : false
            };

            self.isChplAdmin = function () {
                return authService.isChplAdmin();
            };

            self.isAcbAdmin = function () {
                return authService.isAcbAdmin();
            };

            self.getUsername = function () {
                return authService.getUsername();
            };

            self.handleLogin = function (res) {
                if (res.status === 200) {
                    var token = res.data.token ? res.data : null;
                    if (token) {
                        self.message = '';
                    } else {
                        self.message = 'Invalid username or password';
                    }
                } else {
                    self.message = 'Invalid username or password';
                }
            }

            self.login = function () {
                commonService.login({userName: self.username, password: self.password})
                    .then(self.handleLogin, self.handleLogin)
            }
        }]);
})();
