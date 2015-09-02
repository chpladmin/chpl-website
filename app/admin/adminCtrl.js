;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdminController', ['$scope', '$rootScope', '$log', '$location', 'commonService', 'userService', 'authService', function ($scope, $rootScope, $log, $location, commonService, userService, authService) {
            var self = this;
            self.users = [];

            self.refreshUsers = function () {
                userService.getUsers()
                    .then(function (response) {
                        self.users = response.data['users'];
                    }, function (error) {
                        $log.debug(error);
                    });
            };

            self.refreshAll = function () {
                self.refreshUsers();
            };
            self.refreshAll();

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

            self.login = function () {
                userService.login(self.username, self.password)
                    .then(self.refreshAll);
            };

            self.createUser = function (newUser) {
                $log.info('in adminCtrl.createNewUser');
                $log.info(newUser);
                // replace this with a call to a service:
                $log.info('fake saving');
                self.users.push(angular.copy(newUser));
            };

            self.modifyUser = function (currentUser) {
                $log.info('in adminCtrl.modifyUser');
                $log.info(currentUser);
            };

            self.deleteUser = function (currentUser) {
                $log.info('in adminCtrl.deleteUser');
                $log.info(currentUser);
            };

            self.cancelUser = function (currentUser) {
                $log.info('in adminCtrl.cancelUser');
                $log.info(currentUser);
                self.refreshUsers();
            };
        }]);
})();
