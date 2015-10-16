;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('UserManagementController', ['commonService', '$log', '$scope', function (commonService, $log, $scope) {
            var self = this;
            self.userInvitation = {permissions: []};
            self.acbId = $scope.acbId;
            self.roles = ['ROLE_ACB_ADMIN','ROLE_ACB_STAFF'];
            if (!self.acbId) {
                self.roles.push('ROLE_ADMIN');
            }

            self.freshenUsers = function () {
                if (self.acbId) {
                    commonService.getUsersAtAcb(self.acbId)
                        .then(function (response) {
                            self.users = response.users;
                        }, function (error) {
                            $log.debug(error);
                        });
                } else {
                    commonService.getUsers()
                        .then(function (response) {
                            self.users = response.users;
                        }, function (error) {
                            $log.debug(error);
                        });
                }
            };
            self.freshenUsers();

            self.updateUser = function (user) {
                if (!user.roles)
                    user.roles = [];

                var roleObject = {subjectName: user.user.subjectName};
                for (var i = 0; i < self.roles.length; i++) {
                    var payload = angular.copy(roleObject);
                    payload.role = self.roles[i];
                    if (user.roles.indexOf(self.roles[i]) > -1) {
                        commonService.addRole(payload);
                    } else if (!self.acbId) {
                        commonService.revokeRole(payload);
                    }
                }

                commonService.updateUser(user.user)
                    .then(function (response) {
                        self.freshenUsers();
                    });

            };

            self.deleteUser = function (user) {
                if (self.acbId) {
                    var userObject = {acbId: self.acbId,
                                      userId: user.user.userId};
                    commonService.removeUserFromAcb(userObject.userId, userObject.acbId)
                        .then(function (response) {
                            self.freshenUsers();
                        });
                } else {
                    commonService.deleteUser(user.user.userId)
                        .then(function (response) {
                            self.freshenUsers();
                    });
                }
            };

            self.cancelUser = function (user) {
                $log.info('cancelling changes');
                self.freshenUsers();
            };

            self.inviteUser = function () {
                if (self.acbId) {
                    self.userInvitation.acbId = self.acbId;
                }
                if (self.userInvitation.emailAddress && self.userInvitation.emailAddress.length > 0 && self.userInvitation.permissions.length > 0) {
                    commonService.inviteUser(self.userInvitation)
                        .then(function (response) {
                            self.inviteMessage = response.hash;
                            // dev setup until email's working
                        });
                    $scope.userManagementInviteUser.$setPristine();
                    $scope.userManagementInviteUser.$setUntouched();
                    self.userInvitation = {roles:[]};
                }
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
