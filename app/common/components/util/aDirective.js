;(function () {
    'use strict';

    angular.module('app.common')
        .controller('AController', ['$scope', '$log', function ($scope, $log) {
            var vm = this;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.actualLink = vm.href;
                if (vm.href.substring(0,4) !== 'http') {
                    vm.actualLink = 'http://' + vm.href;
                }
            }
        }]);

    angular.module('app.common')
        .directive('aiA', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/util/a.html',
                bindToController: {
                    href: '@',
                    text: '@'
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'AController'
            };
        }]);
})();
