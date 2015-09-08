;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdminController', ['$scope', '$rootScope', '$log', '$location', 'commonService', 'userService', 'authService', function ($scope, $rootScope, $log, $location, commonService, userService, authService) {
            var self = this;
            self.users = [];
            self.acbs = [{ name: 'ACB 1', website: 'http://www.example.com', address: {line1: '123 Main St', line2: 'Suite 456', city: 'Springfield', region: 'State', country: 'USA'},
                           users: [{subjectName: 'admin1', firstName: 'ad', lastName: 'min', email: '123@example.com', phoneNumber: '123-456-7890'}]}];

            self.refreshUsers = function () {
                userService.getUsers()
                    .then(function (response) {
                        self.users = response.data['users'];
                    }, function (error) {
                        $log.debug(error);
                    });
            };

            self.refreshACBs = function () {
                // do service things here
            };

            self.refreshAll = function () {
                self.refreshUsers();
                self.refreshACBs();
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

            self.createACB = function (newACB) {
                $log.info('in adminCtrl.createACB');
                $log.info(newACB);
                //replace this with a service call:
                self.acbs.push(angular.copy(newACB));
            };
        }]);
})();
