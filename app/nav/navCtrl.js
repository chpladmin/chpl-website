;(function () {
    'use strict';

    angular.module('app.nav')
        .controller('NavigationController', ['$scope', 'userService', 'authService', '$log', '$location', function ($scope, userService, authService, $log, $location) {
            var self = this;

            self.isActive = function (route) {
                return route === $location.path();
            };

            self.handleLogin = function (res) {
                if (res.status === 200) {
                    var token = res.data.token ? res.data : null;
                    if (token) {
                        self.message = '';
                        $location.path('/admin');
                    } else {
                        self.message = 'Invalid username or password';
                    }
                } else {
                    self.message = 'Invalid username or password';
                }
            }

            self.login = function () {
                userService.login(self.username, self.password)
                    .then(self.handleLogin, self.handleLogin)
            }

            self.logout = function () {
                authService.logout()
            }

            self.isAuthed = function() {
                return authService.isAuthed()
            }

            self.getUsername = function() {
                return authService.getUsername();
            }
        }]);
})();
