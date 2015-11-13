;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('EditUserController', ['$modalInstance', 'user', 'action', 'acbId', 'commonService', function ($modalInstance, user, action, acbId, commonService) {
            var vm = this;
            vm.user = angular.copy(user);
            vm.action = action;
            vm.acbId = acbId;

            vm.activate = activate;
            vm.save = save;
            vm.cancel = cancel;
            vm.deleteUser = deleteUser;
            vm.invite = invite;

            vm.activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.userInvitation = {permissions: []};
                vm.roles = ['ROLE_ACB_ADMIN','ROLE_ACB_STAFF'];
                if (!vm.acbId) {
                    vm.roles.push('ROLE_ADMIN');
                }
            }

            function save () {
                if (!vm.user.roles)
                    vm.user.roles = [];

                var roleObject = {subjectName: vm.user.user.subjectName};
                for (var i = 0; i < vm.roles.length; i++) {
                    var payload = angular.copy(roleObject);
                    payload.role = vm.roles[i];
                    if (vm.user.roles.indexOf(payload.role) > -1) {
                        commonService.addRole(payload);
                    } else if (!vm.acbId) {
                        commonService.revokeRole(payload);
                    }
                }

                commonService.updateUser(vm.user.user)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $modalInstance.close(response);
                        } else {
                            $modalInstance.dismiss('An error occurred');
                        }
                    },function (error) {
                        $modalInstance.dismiss(error.data.error);
                    });
            }

            function cancel () {
                $modalInstance.dismiss('cancelled');
            }

            function deleteUser () {
                if (vm.acbId) {
                    var userObject = {acbId: vm.acbId,
                                      userId: vm.user.user.userId};
                    commonService.removeUserFromAcb(userObject.userId, userObject.acbId)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                $modalInstance.close('deleted');
                            } else {
                                $modalInstance.dismiss('An error occurred');
                            }
                        },function (error) {
                            $modalInstance.dismiss(error.data.error);
                        });
                } else {
                    commonService.deleteUser(vm.user.user.userId)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                $modalInstance.close('deleted');
                            } else {
                                $modalInstance.dismiss('An error occurred');
                            }
                        },function (error) {
                            $modalInstance.dismiss(error.data.error);
                        });
                }
            }

            function invite () {
                if (vm.acbId) {
                    vm.userInvitation.acbId = vm.acbId;
                }
                if (vm.userInvitation.emailAddress && vm.userInvitation.emailAddress.length > 0 && vm.userInvitation.permissions.length > 0) {
                    commonService.inviteUser(vm.userInvitation)
                        .then(function (response) {
                            if (!response.status || response.status === 200) {
                                $modalInstance.close('invited');
                            } else {
                                $modalInstance.dismiss('An error occurred');
                            }
                        },function (error) {
                            $modalInstance.dismiss(error.data.error);
                        });
                }
            }
        }]);
})();
