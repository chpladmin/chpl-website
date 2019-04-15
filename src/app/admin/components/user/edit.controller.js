(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditUserController', EditUserController);

    /** @ngInject */
    function EditUserController ($uibModalInstance, acbId, action, atlId, authService, networkService, user) {
        var vm = this;

        vm.cancel = cancel;
        vm.deleteUser = deleteUser;
        vm.invite = invite;
        vm.loadRoles = loadRoles;
        vm.save = save;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.user = angular.copy(user);
            vm.action = action;
            vm.acbId = acbId;
            vm.atlId = atlId;
            vm.userInvitation = {role: ''};
            vm.message = '';
            vm.loadRoles();
            if (vm.roles.length === 1) {
                vm.userInvitation.role = vm.roles[0];
            }
        }

        function cancel () {
            $uibModalInstance.dismiss('cancelled');
        }

        function deleteUser () {
            var userObject;
            if (vm.acbId) {
                userObject = {
                    acbId: vm.acbId,
                    userId: vm.user.userId,
                };
                networkService.removeUserFromAcb(userObject.userId, userObject.acbId)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close('deleted');
                        } else {
                            errorMessage(response);
                        }
                    }, function (error) {
                        errorMessage(error.data.error);
                    });
            } else if (vm.atlId) {
                userObject = {
                    atlId: vm.atlId,
                    userId: vm.user.userId,
                };
                networkService.removeUserFromAtl(userObject.userId, userObject.atlId)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close('deleted');
                        } else {
                            errorMessage(response);
                        }
                    }, function (error) {
                        errorMessage(error.data.error);
                    });
            } else {
                networkService.deleteUser(vm.user.userId)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close('deleted');
                        } else {
                            errorMessage(response);
                        }
                    }, function (error) {
                        errorMessage(error.data.error);
                    });
            }
        }

        function invite () {
            if (vm.acbId) {
                vm.userInvitation.permissionObjectId = vm.acbId;
            }
            if (vm.atlId) {
                vm.userInvitation.permissionObjectId = vm.atlId;
            }
            if (vm.userInvitation.emailAddress && vm.userInvitation.emailAddress.length > 0 && vm.userInvitation.role && vm.userInvitation.role.length > 0) {
                networkService.inviteUser(vm.userInvitation)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close('invited');
                        } else {
                            errorMessage(response);
                        }
                    }, function (error) {
                        errorMessage(error.data.error);
                    });
            }
        }

        function loadRoles () {
            vm.roles = [];
            if (!vm.acbId && !vm.atlId) {
                if (authService.hasAnyRole(['ROLE_ADMIN'])) {
                    vm.roles.push('ROLE_ADMIN');
                }
                if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) {
                    vm.roles.push('ROLE_ONC');
                }
                if (authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_CMS_STAFF'])) {
                    vm.roles.push('ROLE_CMS_STAFF');
                }
            } else if (vm.acbId && authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB'])) {
                vm.roles.push('ROLE_ACB');
            } else if (vm.atlId && authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ATL'])) {
                vm.roles.push('ROLE_ATL');
            }
        }

        function save () {
            networkService.updateUser(vm.user)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        errorMessage(response);
                    }
                }, function (error) {
                    errorMessage(error.data.error);
                });
        }

        ////////////////////////////////////////////////////////////////////

        function errorMessage (text) {
            vm.message = 'An error occurred. Please try again or contact the administrator. The error was: "' + text + '"';
        }
    }
})();
