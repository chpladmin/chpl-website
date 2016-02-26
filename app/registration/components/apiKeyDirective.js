;(function () {
    'use strict';

    angular.module('app.registration')
        .controller('ApiKeyController', ['$log', '$modal', 'commonService', function ($log, $modal, commonService) {
            var vm = this;

            vm.loadUsers = loadUsers;
            vm.register = register;
            vm.revoke = revoke;
            vm.viewTos = viewTos;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.hasKey = false;
                vm.key = '';
                if (vm.admin) {
                    vm.loadUsers();
                }
            }

            function loadUsers () {
                commonService.getApiUsers()
                    .then (function (result) {
                        vm.users = result;
                    }, function (error) {
                        $log.debug('error in app.registration.apiKey.controller.loadUsers', error);
                    });
            }

            function register () {
                if (vm.user.name && vm.user.email) {
                    commonService.registerApi(vm.user)
                        .then(function (result) {
                            vm.key = result.keyRegistered;
                            vm.hasKey = true;
                        },function (error) {
                            $log.debug('error in app.registration.apiKey.controller.register', error);
                        });
                }
            }

            function revoke (user) {
                if (user.name && user.email) {
                    commonService.revokeApi(user)
                        .then(function (result) {
                            vm.loadUsers();
                        }, function (error) {
                            $log.debug('error in app.registration.apiKey.controller.revoke', error);
                        });
                }
            }

            function viewTos () {
                vm.modalInstance = $modal.open({
                    templateUrl: 'registration/components/apiKeyTos.html',
                    controller: 'ApiKeyTosController',
                    controllerAs: 'vm',
                    animation: false,
                    size: 'lg'
                });
                vm.modalInstance.result.then(function (result) {
                    // nothing needed
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }

        }])
        .directive('aiApiKey', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'registration/components/apiKey.html',
                scope: {},
                bindToController: {
                    admin: '='
                },
                controllerAs: 'vm',
                controller: 'ApiKeyController'
            };
        }]);
})();
