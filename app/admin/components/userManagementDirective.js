;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('UserManagementController', ['adminService', '$log', '$timeout', '$scope', function (adminService, $log, $timeout, $scope) {
            var self = this;
            self.newUser = {roles: []};
            self.acbId = $scope.acbId;
            self.roles = [{name: 'ROLE_ACB_ADMIN'},{name: 'ROLE_ACB_STAFF'}];
            if (!self.acbId) {
                self.roles.push({name: 'ROLE_ADMIN'});
            }

            self.freshenUsers = function () {
                if (self.acbId) {
                    adminService.getUsersAtAcb(self.acbId)
                        .then(function (response) {
                            self.users = response.users;
                        }, function (error) {
                            $log.debug(error);
                        });
                } else {
                    adminService.getUsers()
                        .then(function (response) {
                            self.users = response.users;
                        }, function (error) {
                            $log.debug(error);
                        });
                }
            };
            self.freshenUsers();

            self.createUser = function () {
                adminService.createUser(self.newUser)
                    .then(function (response) {
                            $log.debug(response);
                        if (self.acbId) {
                            var userObject = {acbId: self.acbId,
                                              userId: response.userId,
                                              authority: 'ADMIN'};
                            $timeout(adminService.addUserToAcb,
                                     1000,
                                     true,
                                     userObject);
                        }
                        $timeout(self.freshenUsers,1000);
                    });
                self.newUser = {roles: []};
            };

            self.updateUser = function (user) {
                if (!user.roles)
                    user.roles = [];

                var roleObject = {subjectName: user.user.subjectName};
                for (var i = 0; i < self.roles.length; i++) {
                    roleObject.role = self.roles[i].name;
                    if (user.roles.indexOf(self.roles[i]) > -1) {
                        adminService.addRole(roleObject);
                    } else if (!self.acbId) {
                        adminService.revokeRole(roleObject);
                    }
                }
                adminService.updateUser(user.user)
                    .then($timeout(self.freshenUsers,1000));
            };

            self.deleteUser = function (user) {
                if (self.acbId) {
                    var userObject = {acbId: self.acbId,
                                      userId: user.user.userId};

                    adminService.removeUserFromAcb(userObject)
                        .then($timeout(self.freshenUsers,1000));
                } else {
                    adminService.deleteUser(user.user.userId)
                        .then($timeout(self.freshenUsers,1000));
                }
            };

            self.cancelUser = function (user) {
                $log.info('cancelling changes');
                self.freshenUsers();
            };
        }])
        .directive('aiUserManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/userManagement.html',
                scope: {
                    acbId: '@acbId'
                },
                controllerAs: 'vm',
                controller: 'UserManagementController'
            };
        });
})();
