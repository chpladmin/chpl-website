;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdminController', ['$scope', '$rootScope', '$log', '$location', 'commonService', 'userService', 'authService', function ($scope, $rootScope, $log, $location, commonService, userService, authService) {
            var self = this;
            self.users = [];

            self.refreshUsers = function () {
                $log.info('refreshing');
                userService.getUsers()
                    .then(function (response) {
                        self.users = response.data['users'];
                    }, function (error) {
                        $log.debug(error);
                    });
            };
            self.refreshUsers();

            self.isAuthed = function () {
                return authService.isAuthed ? authService.isAuthed() : false
            };

            self.getUsername = function () {
                return authService.getUsername();
            };

            self.login = function () {
                userService.login(self.username, self.password);
                self.refreshUsers();
            }
        }]);
})();
