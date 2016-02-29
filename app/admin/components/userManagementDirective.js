;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('UserManagementController', ['commonService', '$log', '$modal', '$scope', function (commonService, $log, $modal, $scope) {
            var vm = this;

            vm.updateUser = updateUser;
            vm.inviteUser = inviteUser;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.roles = [];
                if (!vm.acbId && !vm.atlId) { // not managing acb or atl, managing entire CHPL
                    vm.roles.push('ROLE_ADMIN');
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
                vm.modalInstance = $modal.open({
                    templateUrl: 'admin/components/userEdit.html',
                    controller: 'EditUserController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        user: function () { return user; },
                        action: function () { return 'edit'; },
                        acbId: function () { return vm.acbId; },
                        atlId: function () { return vm.atlId; }
                    }
                });
                vm.modalInstance.result.then(function (result) {
                    vm.freshenUsers();
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }

            function inviteUser () {
                vm.modalInstance = $modal.open({
                    templateUrl: 'admin/components/userEdit.html',
                    controller: 'EditUserController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        user: function () { return {}; },
                        action: function () { return 'invite'; },
                        acbId: function () { return vm.acbId; },
                        atlId: function () { return vm.atlId; }
                    }
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
        }])
        .directive('aiUserManagement', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/userManagement.html',
                scope: {},
                bindToController: {
                    acbId: '@',
                    atlId: '@'
                },
                controllerAs: 'vm',
                controller: 'UserManagementController'
            };
        });
})();
