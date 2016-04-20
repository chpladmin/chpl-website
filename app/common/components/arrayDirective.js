;(function () {
    'use strict';

    angular.module('app.common')
        .controller('ArrayController', ['$scope', '$log', function ($scope, $log) {
            var vm = this;

            vm.addItem = addItem;
            vm.removeItem = removeItem;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate() {
                if (!vm.items) {
                    vm.items = [];
                }
                vm.localId = $scope.$id;
            }

            function addItem() {
                var val = {};
                val[vm.key] = vm.newItem;

                if (vm.keySecond) {
                    val[vm.keySecond] = vm.newSecond;
                }
                vm.items.push(val);
                vm.newItem = '';
                vm.newSecond = '';
            }

            function removeItem(index) {
                vm.items.splice(index, 1);
            }
        }]);

    angular.module('app.common')
        .directive('aiArray', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/array.html',
                bindToController: {
                    itemType: '@',
                    items: '=',
                    key: '@',
                    keySecond: '@'
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'ArrayController'
            };
        }]);
})();
