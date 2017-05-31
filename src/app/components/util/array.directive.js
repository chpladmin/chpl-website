(function () {
    'use strict';

    angular.module('chpl')
        .controller('ArrayController', ArrayController);

    /** @ngInject */
    function ArrayController ($scope) {
        var vm = this;

        vm.addItem = addItem;
        vm.removeItem = removeItem;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            if (!vm.items) {
                vm.items = [];
            }
            vm.localId = $scope.$id;
        }

        function addItem () {
            var val = {};
            val[vm.key] = vm.newItem;

            if (vm.keySecond) {
                val[vm.keySecond] = vm.newSecond;
            }
            if (vm.keyThird) {
                val[vm.keyThird] = vm.newThird
            }
            vm.items.push(val);
            vm.newItem = '';
            vm.newSecond = '';
            vm.newThird = '';
        }

        function removeItem (index) {
            vm.items.splice(index, 1);
        }
    }

    angular.module('chpl')
        .directive('aiArray', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'app/components/util/array.html',
                bindToController: {
                    itemType: '@',
                    items: '=',
                    key: '@',
                    keySecond: '@',
                    keyThird: '@'
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'ArrayController'
            };
        });
})();
