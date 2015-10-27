;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdminController', ['$log', 'commonService', 'authService', function ($log, commonService, authService) {
            var self = this;

            self.handlers = [];
            self.refresh = refresh;
            self.triggerRefresh = triggerRefresh;

            function refresh () {
                angular.forEach(self.handlers, function (handler) {
                    handler();
                });
            }

            function triggerRefresh (handler) {
                self.handlers.push(handler);
                var removeHandler = function () {
                    self.handlers = self.handlers.filter(function (aHandler) {
                        return aHandler !== handler;
                    });
                };
                return removeHandler;
            }

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
