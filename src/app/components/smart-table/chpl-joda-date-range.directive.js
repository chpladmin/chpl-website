(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('ChplJodaDateRangeController', ChplJodaDateRangeController)
        .directive('chplJodaDateRange', chplJodaDateRange);

    function chplJodaDateRange () {
        return {
            bindToController: {
                hasChanges: '=?',
                nameSpace: '@?',
                trackAnalytics: '@?',
            },
            controller: 'ChplJodaDateRangeController',
            controllerAs: 'vm',
            link: chplDateRangeLink,
            restrict: 'E',
            require: ['^stTable', 'chplJodaDateRange'],
            scope: {
                predicate: '@',
                registerClearFilter: '&',
                registerRestoreState: '&',
            },
            templateUrl: 'chpl.components/smart-table/chpl-joda-date-range.html',
        }
    }

    function chplDateRangeLink (scope, element, attr, ctrls) {
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

            ctrl.tableCtrl = table;
            ctrl.predicate = predicate;
            ctrl.attr = attr;
            ctrl.activate();
        }
    }

    /** @ngInclude */
    function ChplJodaDateRangeController ($analytics, $filter, $localStorage, $log, DateUtil) {
        var vm = this;

        vm.$log = $log;
        vm.DateUtil = DateUtil;
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
                    before = vm.DateUtil.datePartsToZonedDateTime(vm.before.getFullYear(),
                        vm.before.getMonth() + 1,
                        vm.before.getDate(),
                        vm.DateUtil.jsJoda().LocalTime.MAX);
                } else {
                    before = vm.DateUtil.longToZonedDateTime(vm.before).with(vm.DateUtil.jsJoda().LocalTime.MAX);
                }
                query.before = new Date(vm.DateUtil.zonedDateTimeToLong(before));
                if (vm.trackAnalytics) {
                    //TODO
                    $analytics.eventTrack('Certification Date "To" Filter', { category: 'Search', label: $filter('date')(before, 'mediumDate', 'UTC')});
                }
            }
            if (vm.after) {
                var after;
                if (angular.isObject(vm.after)) {
                    after = vm.DateUtil.longToZonedDateTime(vm.after.getTime()).with(vm.DateUtil.jsJoda().LocalTime.MIN);
                } else {
                    after = vm.DateUtil.longToZonedDateTime(vm.after).with(vm.DateUtil.jsJoda().LocalTime.MIDNIGHT);
                }
                query.after = new Date(vm.DateUtil.zonedDateTimeToLong(after));
                if (vm.trackAnalytics) {
                    //TODO
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
                } else {
                    vm.after = undefined;
                }
                if (predicateSearch.before) {
                    vm.before = new Date(predicateSearch.before);
                } else {
                    vm.before = undefined;
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
