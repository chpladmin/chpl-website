;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('LoginController', ['$scope', 'commonService', 'authService', '$log', function ($scope, commonService, authService, $log) {
            var vm = this;

            vm.login = login;

            /////////////////////////////////////////////////////////

            function login () {
                commonService.login({userName: vm.userName, password: vm.password})
                    .then(function () {});
            };
        }]);

    angular.module('app.admin')
        .directive('aiLogin', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/login.html',
                scope: {
                },
                bindToController: {
                    formClass: '@',
                    pClass: '@'
                },
                controllerAs: 'vm',
                controller: 'LoginController'
            };
        });
})();
