(function () {
    'use strict';
    angular.module('chpl')
        .controller('SelectDistinctController', SelectDistinctController)
        .directive('stSelectDistinct', stSelectDistinct);

    function stSelectDistinct () {
        return {
            bindToController: {
                hasChanges: '=?',
                nameSpace: '@'
            },
            controller: 'SelectDistinctController',
            controllerAs: 'vm',
            link: stSelectDistinctLink,
            replace: true,
            restrict: 'E',
            require: ['^stTable', 'stSelectDistinct'],
            scope: {
                collection: '=',
                predicate: '@',
                predicateExpression: '=',
                registerClearFilter: '&',
                registerRestoreState: '&'
            },
            templateUrl: 'app/components/smart_table/stSelectDistinct.html'
        }
    }

    function stSelectDistinctLink (scope, element, attr, ctrls) {
        var table, ctrl, predicate;

        activate();

        function activate () {
            predicate = scope.predicate;
            if (!predicate && scope.predicateExpression) {
                predicate = scope.predicateExpression;
            }
            table = ctrls[0];
            ctrl = ctrls[1];
            var clearFilter = scope.registerClearFilter({
                clearFilter: function () {
                    ctrl.clearFilter();
                }
            });
            scope.$on('$destroy', clearFilter);
            var restoreState = scope.registerRestoreState({
                restoreState: function (state) {
                    ctrl.restoreState(state);
                }
            });
            scope.$on('$destroy', restoreState);

            ctrl.tableCtrl = table;
            ctrl.predicate = predicate;
            ctrl.element = element;
            ctrl.activate();
        }

        scope.$watch('collection', function (newValue) {

            if (newValue) {
                var temp = [];
                ctrl.distinctItems = ['All'];

                angular.forEach(scope.collection, function (item) {
                    var value = item[predicate];

                    if (value && value.trim().length > 0 && temp.indexOf(value) === -1) {
                        temp.push(value);
                    }
                });
                temp.sort();

                ctrl.distinctItems = ctrl.distinctItems.concat(temp);
                ctrl.selectedOption = ctrl.distinctItems[0];
            }
        }, true);
    }

    /** @ngInclude */
    function SelectDistinctController ($localStorage) {
        var vm = this;

        vm.activate = activate;
        vm.clearFilter = clearFilter;
        vm.filterChanged = filterChanged;
        vm.restoreState = restoreState;

        ////////////////////////////////////////////////////////////////////

        function activate () {
        }

        function clearFilter () {
            vm.selectedOption = 'All';
            vm.filterChanged();
        }

        function filterChanged () {
            var query = {};
            query.distinct = vm.selectedOption;

            if (query.distinct === 'All') {
                query.distinct = '';
                vm.hasChanges = false;
            } else {
                vm.hasChanges = true;
            }

            vm.tableCtrl.search(query, vm.predicate);
            $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
        }

        function restoreState (state) {
            vm.element[0].selectedIndex = 0;
            var predicateSearch = state.search.predicateObject[vm.predicate];
            if (predicateSearch) {
                for (var i = 0; i < vm.distinctItems.length; i++) {
                    if (vm.distinctItems[i] === predicateSearch) {
                        vm.element[0].selectedIndex = i;
                    }
                }
                if (predicateSearch.distinct && predicateSearch.distinct.length > 0) {
                    vm.selectedOption = predicateSearch.distinct;
                } else {
                    vm.selectedOption = 'All';
                }
                vm.filterChanged();
            }
        }
    }
})();
