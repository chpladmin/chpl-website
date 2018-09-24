(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('EditUserController', EditUserController);

    /** @ngInject */
    function EditUserController ($uibModalInstance, acbId, action, atlId, networkService, user) {
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
            vm.userInvitation = {permissions: []};
            vm.message = '';
            vm.loadRoles();
            if (vm.roles.length === 1) {
                vm.userInvitation.permissions.push(vm.roles[0]);
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
                    userId: vm.user.user.userId,
                };
                networkService.removeUserFromAcb(userObject.userId, userObject.acbId)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close('deleted');
                        } else {
                            errorMessage(response);
                        }
                    },function (error) {
                        errorMessage(error.data.error);
                    });
            } else if (vm.atlId) {
                userObject = {
                    atlId: vm.atlId,
                    userId: vm.user.user.userId,
                };
                networkService.removeUserFromAtl(userObject.userId, userObject.atlId)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close('deleted');
                        } else {
                            errorMessage(response);
                        }
                    },function (error) {
                        errorMessage(error.data.error);
                    });
            } else {
                networkService.deleteUser(vm.user.user.userId)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close('deleted');
                        } else {
                            errorMessage(response);
                        }
                    },function (error) {
                        errorMessage(error.data.error);
                    });
            }
        }

        function invite () {
            if (vm.acbId) {
                vm.userInvitation.acbId = vm.acbId;
            }
            if (vm.atlId) {
                vm.userInvitation.testingLabId = vm.atlId;
            }
            if (vm.userInvitation.emailAddress && vm.userInvitation.emailAddress.length > 0 && vm.userInvitation.permissions.length > 0) {
                networkService.inviteUser(vm.userInvitation)
                    .then(function (response) {
                        if (!response.status || response.status === 200) {
                            $uibModalInstance.close('invited');
                        } else {
                            errorMessage(response);
                        }
                    },function (error) {
                        errorMessage(error.data.error);
                    });
            }
        }

        function loadRoles () {
            vm.roles = [];
            if (!vm.acbId && !vm.atlId) {
                vm.roles.push('ROLE_ADMIN');
                vm.roles.push('ROLE_CMS_STAFF');
                vm.roles.push('ROLE_ONC_STAFF');
            }
            if (!vm.atlId) {
                vm.roles.push('ROLE_ACB');
            }
            if (!vm.acbId) {
                vm.roles.push('ROLE_ATL');
            }
        }

        function save () {
            if (!vm.user.roles) {
                vm.user.roles = [];
            }

            var roleObject = {subjectName: vm.user.user.subjectName};
            for (var i = 0; i < vm.roles.length; i++) {
                var payload = angular.copy(roleObject);
                payload.role = vm.roles[i];
                if (vm.user.roles.indexOf(payload.role) > -1) {
                    networkService.addRole(payload);
                } else if (!vm.acbId && !vm.atlId) {
                    networkService.revokeRole(payload);
                }
            }

            networkService.updateUser(vm.user.user)
                .then(function (response) {
                    if (!response.status || response.status === 200) {
                        $uibModalInstance.close(response);
                    } else {
                        errorMessage(response);
                    }
                },function (error) {
                    errorMessage(error.data.error);
                });
        }

        ////////////////////////////////////////////////////////////////////

        function errorMessage (text) {
            vm.message = 'An error occurred. Please try again or contact the administrator. The error was: "' + text + '"';
        }
    }
})();
