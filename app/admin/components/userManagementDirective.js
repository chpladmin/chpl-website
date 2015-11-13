;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('UserManagementController', ['commonService', '$log', '$modal', '$scope', function (commonService, $log, $modal, $scope) {
            var vm = this;
            vm.acbId = $scope.acbId;
            vm.roles = ['ROLE_ACB_ADMIN','ROLE_ACB_STAFF'];
            if (!vm.acbId) {
                vm.roles.push('ROLE_ADMIN');
            }

            vm.updateUser = updateUser;
            vm.inviteUser = inviteUser;

            ////////////////////////////////////////////////////////////////////

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
                        acbId: function () { return vm.acbId; }
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
                        acbId: function () { return vm.acbId; }
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
                scope: {
                    acbId: '@acbId'
                },
                controllerAs: 'vm',
                controller: 'UserManagementController'
            };
        });
})();
