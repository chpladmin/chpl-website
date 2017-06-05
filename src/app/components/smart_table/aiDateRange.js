(function () {
    'use strict';
    angular.module('chpl')
        .controller('AiDateRangeController', AiDateRangeController)
        .directive('aiDateRange', aiDateRange);

    function aiDateRange () {
        return {
            bindToController: {
                hasChanges: '=?',
                nameSpace: '@?',
                trackAnalytics: '@?',
            },
            controller: 'AiDateRangeController',
            controllerAs: 'vm',
            link: aiDateRangeLink,
            restrict: 'E',
            require: ['^stTable', 'aiDateRange'],
            scope: {
                predicate: '@',
                registerClearFilter: '&',
                registerRestoreState: '&',
            },
            templateUrl: 'app/components/smart_table/aiDateRange.html',
        }
    }

    function aiDateRangeLink (scope, element, attr, ctrls) {
        var table, ctrl, predicate;

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

            ctrl.tableCtrl = table;
            ctrl.predicate = predicate;
            ctrl.attr = attr;
            ctrl.activate();
        }
    }

    /** @ngInclude */
    function AiDateRangeController ($analytics, $filter, $localStorage) {
        var vm = this;

        vm.activate = activate;
        vm.clearFilter = clearFilter;
        vm.filterChanged = filterChanged;
        vm.restoreState = restoreState;
        vm.storeState = storeState;

        ////////////////////////////////////////////////////////////////////

        function activate () {
            //vm.filterChanged();
        }

        function clearFilter () {
            vm.before = undefined;
            vm.after = undefined;
            vm.hasChanges = false;
            vm.filterChanged();
        }

        function filterChanged () {
            vm.hasChanges = vm.before || vm.after;
            var query = {};
            if (vm.before) {
                var before;
                if (angular.isObject(vm.before)) {
                    before = angular.copy(vm.before)
                } else {
                    before = new Date(vm.before);
                }
                query.before = before.setUTCDate(before.getUTCDate() + 1);
                if (vm.trackAnalytics) {
                    $analytics.eventTrack('Certification Date "To" Filter', { category: 'Search', label: $filter('date')(before, 'mediumDate', 'UTC')});
                }
            }

            if (vm.after) {
                var after;
                if (angular.isObject(vm.after)) {
                    after = angular.copy(vm.after)
                } else {
                    after = new Date(vm.after);
                }
                query.after = after.getTime();
                if (vm.trackAnalytics) {
                    $analytics.eventTrack('Certification Date "After" Filter', { category: 'Search', label: $filter('date')(after, 'mediumDate', 'UTC')});
                }
            }
            vm.tableCtrl.search(query, vm.predicate);
            vm.storeState();
        }

        function restoreState (state) {
            var predicateSearch = state.search.predicateObject[vm.predicate];
            if (predicateSearch) {
                if (predicateSearch.after) {
                    vm.after = new Date(predicateSearch.after);
                }
                if (predicateSearch.before) {
                    var before = new Date(predicateSearch.before);
                    before.setUTCDate(before.getUTCDate() - 1);
                    vm.before = before;
                }
                vm.filterChanged();
            }
        }

        function storeState () {
            if (vm.nameSpace) {
                $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
            }
        }
    }
})();
