;(function () {
    'use strict';

    angular.module('app.nav')
        .controller('NavigationController', ['$scope', 'userService', 'authService', '$log', '$location', function ($scope, userService, authService, $log, $location) {
            var self = this;

            self.isActive = function (route) {
                return route === $location.path();
            };

            function handleLogin (res) {
                if (res.status === 200) {
                    var token = res.data.token ? res.data : null;
                    if (token) {
                        $log.info('JWT:', token);
                    }
                    self.message = 'Log in successful';
                } else {
                    self.message = 'Invalid username/password';
                }
            }

            function handleRequest (res) {
                $log.info(res);
                if (res.status === 200) {
                    self.message = res.data;
                } else {
                }
            }

            self.login = function () {
                userService.login(self.username, self.password)
                    .then(handleLogin, handleLogin)
            }

            self.getUsers = function () {
                userService.getUsers ()
                    .then(handleRequest, handleRequest)
            }

            self.logout = function () {
                authService.logout && authService.logout()
            }

            self.isAuthed = function() {
                return authService.isAuthed ? authService.isAuthed() : false
            }

            self.getUsername = function() {
                return authService.getUsername();
            }
        }]);
})();
