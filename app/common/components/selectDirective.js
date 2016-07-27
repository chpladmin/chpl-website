;(function () {
    'use strict';

    angular.module('app.common')
        .controller('SelectController', ['$scope', '$log', function ($scope, $log) {
            var vm = this;

            vm.onNewChange = onNewChange;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate() {
                vm.localId = $scope.$id;
            }

            function onNewChange() {
                vm.model = {name: vm.newItem};
                var addingNew = true;
                for (var i = 0; i < vm.options.length; i++) {
                    if (angular.isUndefined(vm.options[i].id)) {
                        vm.options[i] = vm.model;
                        addingNew = false;
                    }
                }
                if (addingNew) {
                    vm.options.push(vm.model);
                }
            }
        }]);

    angular.module('app.common')
        .directive('aiSelect', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/select.html',
                bindToController: {
                    options: '=',
                    model: '=',
                    expandable: '=',
                    required: '=',
                    label: '@',
                    name: '@'
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'SelectController'
            };
        }]);
})();
