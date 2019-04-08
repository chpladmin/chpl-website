(function () {
    'use strict';
    angular.module('chpl.components')
        .controller('SelectDistinctController', SelectDistinctController)
        .directive('stSelectDistinct', stSelectDistinct);

    function stSelectDistinct () {
        return {
            bindToController: {
                hasChanges: '=?',
                nameSpace: '@?',
            },
            controller: 'SelectDistinctController',
            controllerAs: 'vm',
            link: stSelectDistinctLink,
            replace: true,
            restrict: 'E',
            require: ['^stTable', 'stSelectDistinct'],
            scope: {
                collection: '=',
                fixedItems: '=?',
                predicate: '@',
                registerClearFilter: '&',
                registerRestoreState: '&',
            },
            templateUrl: 'chpl.components/smart-table/stSelectDistinct.html',
        }
    }

    function stSelectDistinctLink (scope, element, attr, ctrls) {
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

            setItems();
            scope.$watch('fixedItems', function () {
                setItems();
            });
            ctrl.element = element;
            ctrl.predicate = scope.predicate;
            ctrl.tableCtrl = table;
            ctrl.activate();
        }

        function bindCollection (collection) {
            var predicate = scope.predicate;
            var distinctItems = ['All'];
            var temp = [];

            angular.forEach(collection, function (item) {
                var value = item[predicate];
                if (value && value.trim().length > 0 && temp.indexOf(value) === -1) {
                    temp.push(value);
                }
            });
            temp.sort();
            ctrl.distinctItems = distinctItems.concat(temp);
            ctrl.selectedOption = ctrl.distinctItems[0];
        }

        function setItems () {
            if (angular.isDefined(scope.fixedItems)) {
                ctrl.distinctItems = ['All'].concat(angular.copy(scope.fixedItems));
            } else if (angular.isDefined(scope.collection)) {
                bindCollection(scope.collection);
                scope.$watch('collection', function (newCollection) {
                    bindCollection(newCollection)
                });
            }
        }
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
            if (vm.nameSpace) {
                $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
            }
        }

        function restoreState (state) {
            vm.element[0].selectedIndex = 0;
            var predicateSearch = state.search.predicateObject[vm.predicate];
            if (predicateSearch) {// && vm.distinctItems) {
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
