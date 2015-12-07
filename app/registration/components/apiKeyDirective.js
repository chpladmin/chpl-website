;(function () {
    'use strict';

    angular.module('app.registration')
        .controller('ApiKeyController', ['$log', '$scope', '$modal', 'commonService', function ($log, $scope, $modal, commonService) {
            var vm = this;

            vm.activate = activate;
            vm.loadUsers = loadUsers;
            vm.register = register;
            vm.revoke = revoke;

            vm.activate();

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
                        vm.users = result.users;
                    }, function (error) {
                        $log.debug(error);
                    });
                vm.users = [{userName: 'test', email: 'test@test.com', key: 'alsdkjfa;lsja'}];
            }

            function register () {
                vm.key = "Donec pretium posuere tellus.";
                vm.hasKey = true;
                commonService.registerApi(vm.user)
                    .then(function (result) {
                        vm.key = result;
                        vm.hasKey = true;
                    },function (result) {
                        $log.debug(result);
                    });
            }

            function revoke (user) {
                commonService.revokeApi(user)
                    .then(function (result) {
                        vm.loadUsers();
                    }, function (error) {
                        $log.debug(error);
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
