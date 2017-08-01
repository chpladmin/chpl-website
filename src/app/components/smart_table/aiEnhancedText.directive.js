(function () {
    'use strict';
    angular.module('chpl')
        .controller('EnhancedTextController', EnhancedTextController)
        .directive('aiEnhancedText', aiEnhancedText);

    function aiEnhancedText () {
        return {
            bindToController: {
                hasChanges: '=?',
                nameSpace: '@?',
            },
            controller: 'EnhancedTextController',
            controllerAs: 'vm',
            link: aiEnhancedTextLink,
            replace: true,
            restrict: 'A',
            require: ['^stTable', 'aiEnhancedText'],
            scope: {
                predicate: '@',
                registerClearFilter: '&',
                registerRestoreState: '&',
            },
        }
    }

    function aiEnhancedTextLink (scope, element, attr, ctrls) {
        var ctrl, predicate, table;

        activate();

        function activate () {
            predicate = scope.predicate;
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

            element.bind('input', ctrl.filterChanged);

            ctrl.tableCtrl = table;
            ctrl.predicate = predicate;
            ctrl.element = element;
            ctrl.attr = attr;
            ctrl.activate();
        }
    }

    /** @ngInclude */
    function EnhancedTextController ($localStorage, $timeout, stConfig) {
        var vm = this;

        vm.activate = activate;
        vm.clearFilter = clearFilter;
        vm.filterChanged = filterChanged;
        vm.restoreState = restoreState;
        vm.storeState = storeState;

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.throttle = vm.attr.stDelay || stConfig.search.delay;
        }

        function clearFilter () {
            vm.element[0].value = '';
            vm.hasChanges = false;
            vm.filterChanged();
        }

        function filterChanged () {
            var query = vm.element[0].value;
            vm.hasChanges = query.length > 0;

            if (vm.promise) {
                $timeout.cancel(vm.promise);
            }

            vm.promise = $timeout(function () {
                vm.tableCtrl.search(query, vm.predicate);
                if (vm.nameSpace) {
                    vm.storeState();
                }
                vm.promise = null;
            }, vm.throttle);
        }

        function restoreState (state) {
            var predicateSearch = state.search.predicateObject[vm.predicate];
            if (predicateSearch) {
                vm.element[0].value = predicateSearch;
                vm.hasChanges = predicateSearch.length > 0;
                vm.filterChanged();
            }
        }

        function storeState () {
            $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
        }
    }
})();
