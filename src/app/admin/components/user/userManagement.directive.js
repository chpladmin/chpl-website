(function () {
    'use strict';

    angular.module('chpl.admin')
        .controller('UserManagementController', UserManagementController)
        .directive('aiUserManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/admin/components/user/userManagement.html',
                scope: {},
                bindToController: {
                    acbId: '@',
                    atlId: '@',
                },
                controllerAs: 'vm',
                controller: 'UserManagementController',
            };
        });

    /** @ngInject */
    function UserManagementController ($log, $uibModal, commonService) {
        var vm = this;

        vm.updateUser = updateUser;
        vm.inviteUser = inviteUser;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.roles = [];
            if (!vm.acbId && !vm.atlId) { // not managing acb or atl, managing entire CHPL
                vm.roles.push('ROLE_ADMIN');
                vm.roles.push('ROLE_CMS_STAFF');
                vm.roles.push('ROLE_ONC_STAFF');
            }
            if (!vm.atlId) { // not managing ATL; either managing entire CHPL or single ACB
                vm.roles.push('ROLE_ACB_ADMIN');
                vm.roles.push('ROLE_ACB_STAFF');
            }
            if (!vm.acbId) { // not managing ACB; either managing entire CHPL or single ATL
                vm.roles.push('ROLE_ATL_ADMIN');
                vm.roles.push('ROLE_ATL_STAFF');
            }
        }

        function updateUser (user) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/user/edit.html',
                controller: 'EditUserController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    user: function () { return user; },
                    action: function () { return 'edit'; },
                    acbId: function () { return vm.acbId; },
                    atlId: function () { return vm.atlId; },
                },
            });
            vm.modalInstance.result.then(function () {
                vm.freshenUsers();
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug(result);
                }
            });
        }

        function inviteUser () {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/user/edit.html',
                controller: 'EditUserController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    user: function () { return {}; },
                    action: function () { return 'invite'; },
                    acbId: function () { return vm.acbId; },
                    atlId: function () { return vm.atlId; },
                },
            });
            vm.modalInstance.result.then(function (result) {
                $log.info(result);
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug(result);
                }
            });
        }

        vm.freshenUsers = function () {
            if (vm.acbId) {
                commonService.getUsersAtAcb(vm.acbId)
                    .then(function (response) {
                        vm.users = response.users;
                    }, function (error) {
                        $log.debug(error);
                    });
            } else if (vm.atlId) {
                commonService.getUsersAtAtl(vm.atlId)
                    .then(function (response) {
                        vm.users = response.users;
                    }, function (error) {
                        $log.debug(error);
                    });
            } else {
                commonService.getUsers()
                    .then(function (response) {
                        vm.users = response.users;
                    }, function (error) {
                        $log.debug(error);
                    });
            }
        };
        vm.freshenUsers();
    }
})();
