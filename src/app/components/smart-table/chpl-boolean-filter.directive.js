(function () {
    'use strict';
    angular.module('chpl.components')
        .controller('BooleanFilterController', BooleanFilterController)
        .directive('chplBooleanFilter', chplBooleanFilter);

    function chplBooleanFilter () {
        return {
            bindToController: {
                hasChanges: '=?',
            },
            controller: 'BooleanFilterController',
            controllerAs: 'vm',
            link: chplBooleanFilterLink,
            replace: true,
            restrict: 'E',
            require: ['^stTable', 'chplBooleanFilter'],
            scope: {
                collection: '=',
                predicate: '@',
                registerClearFilter: '&',
                registerRestoreState: '&',
            },
            templateUrl: 'chpl.components/smart-table/chpl-boolean-filter.html',
        }
    }

    function chplBooleanFilterLink (scope, element, attr, ctrls) {
        var ctrl, predicate, table;

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
                },
            });
            scope.$on('$destroy', clearFilter);
            var restoreState = scope.registerRestoreState({
                restoreState: function (state) {
                    ctrl.restoreState(state);
                },
            });
            scope.$on('$destroy', restoreState);

            ctrl.booleanItems = ['Any', 'True', 'False'];
            ctrl.element = element;
            ctrl.predicate = scope.predicate;
            ctrl.tableCtrl = table;
            ctrl.activate();
        }
    }

    /** @ngInclude */
    function BooleanFilterController ($localStorage) {
        var vm = this;

        vm.activate = activate;
        vm.clearFilter = clearFilter;
        vm.filterChanged = filterChanged;
        vm.restoreState = restoreState;

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.selectedOption = 'Any';
        }

        function clearFilter () {
            vm.selectedOption = 'Any';
            vm.filterChanged();
        }

        function filterChanged () {
            var query = {};
            query.boolean = vm.selectedOption;

            if (query.boolean === 'Any') {
                vm.hasChanges = false;
            } else {
                vm.hasChanges = true;
            }

            vm.tableCtrl.search(query, vm.predicate);
            if (vm.nameSpace) {
                $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
            }
        }

        function restoreState (state) {
            vm.element[0].selectedIndex = 0;
            var predicateSearch = state.search.predicateObject[vm.predicate];
            if (predicateSearch) {
                for (var i = 0; i < vm.booleanItems.length; i++) {
                    if (vm.booleanItems[i] === predicateSearch) {
                        vm.element[0].selectedIndex = i;
                    }
                }
                if (predicateSearch.boolean && predicateSearch.boolean.length > 0) {
                    vm.selectedOption = predicateSearch.boolean;
                } else {
                    vm.selectedOption = 'Any';
                }
                vm.filterChanged();
            }
        }
    }
})();
