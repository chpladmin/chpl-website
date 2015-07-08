;(function () {
    'use strict';

    angular.module('app.nav')
        .controller('NavigationController', ['$scope', 'userService', 'authService', '$log', '$location', function ($scope, userService, authService, $log, $location) {
            var self = this;

            self.isActive = function (route) {
                return route === $location.path();
            };

            $scope.isActive = self.isActive;

            function handleRequest (res) {
                var token = res.data ? res.data.token : null;
                if (token) {
                    $log.info('JWT:', token);
                }
                self.message = res.data.message;
            }

            self.login = function () {
                userService.login(self.username, self.password)
                    .then(handleRequest, handleRequest)
            }

            self.register = function () {
                userService.register(self.username, self.password)
                    .then(handleRequest, handleRequest)
            }

            self.getQuote = function () {
                userService.getQuote ()
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
