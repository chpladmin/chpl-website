(function () {
    'use strict';

    angular.module('chpl.common')
        .controller('AController', function () {
            var vm = this;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.actualLink = vm.href;
                if (vm.href.substring(0,4) !== 'http') {
                    vm.actualLink = 'http://' + vm.href;
                }
            }
        });

    angular.module('chpl.common')
        .directive('aiA', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/components/util/a.html',
                bindToController: {
                    href: '@',
                    text: '@'
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'AController'
            };
        });
})();
