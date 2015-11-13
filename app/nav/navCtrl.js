;(function () {
    'use strict';

    angular.module('app.nav')
        .controller('NavigationController', ['authService', '$location', '$log', function (authService, $location, $log) {
            var self = this;

            self.isActive = function (route) {
                return route === $location.path();
            };

            self.isAuthed = function () {
                return authService.isAuthed()
            }

            self.getUsername = function () {
                return authService.getUsername();
            }
        }]);
})();
