import '../../../../node_modules/@js-joda/timezone';
import * as jsJoda from '../../../../node_modules/@js-joda/core';

(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('ChplDateRangeController', ChplDateRangeController)
        .directive('chplJodaDateRange', chplJodaDateRange);

    function chplJodaDateRange () {
        return {
            bindToController: {
                hasChanges: '=?',
                nameSpace: '@?',
                trackAnalytics: '@?',
            },
            controller: 'ChplDateRangeController',
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
    function ChplDateRangeController ($analytics, $filter, $localStorage, $log) {
        var vm = this;

        vm.$log = $log;
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
            vm.$log.info('Filter changed.');
            vm.hasChanges = vm.before || vm.after;
            var query = {};
            if (vm.before) {
                var before;
                if (angular.isObject(vm.before)) {
                    //before = longToZonedDateTime(vm.before.getTime()).with(jsJoda.LocalTime.MAX);
                    before = datePartsToZonedDateTime(vm.before.getFullYear(),
                        vm.before.getMonth() + 1,
                        vm.before.getDate(),
                        jsJoda.LocalTime.MAX);
                } else {
                    before = longToZonedDateTime(vm.before).with(jsJoda.LocalTime.MAX);
                }
                query.before = new Date(zonedDateTimeToLong(before));
                if (vm.trackAnalytics) {
                    //TODO
                    $analytics.eventTrack('Certification Date "To" Filter', { category: 'Search', label: $filter('date')(before, 'mediumDate', 'UTC')});
                }
            }
            if (vm.after) {
                var after;
                if (angular.isObject(vm.after)) {
                    after = longToZonedDateTime(vm.after.getTime()).with(jsJoda.LocalTime.MIN);
                    //after = datePartsToZonedDateTime(vm.after.getFullYear(),
                    //    vm.after.getMonth() + 1,
                    //    vm.after.getDate(),
                    //    jsJoda.LocalTime.MIDNIGHT);
                } else {
                    after = longToZonedDateTime(vm.after).with(jsJoda.LocalTime.MIDNIGHT);
                }
                query.after = new Date(zonedDateTimeToLong(after));
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

        function longToZonedDateTime (dateLong, zone) {
            zone = zone || 'America/New_York'
            return jsJoda.ZonedDateTime.ofInstant(jsJoda.Instant.ofEpochMilli(dateLong), jsJoda.ZoneId.of(zone));
        }

        function zonedDateTimeToLong (date) {
            return date.toInstant().toEpochMilli();
        }

        function datePartsToZonedDateTime (year, month, day, localTime, zone) {
            zone = zone || 'America/New_York';
            localTime = localTime || jsJoda.LocalTime.MIDNIGHT;
            return jsJoda.ZonedDateTime.of3(jsJoda.LocalDate.of(year, month, day), localTime, jsJoda.ZoneId.of(zone));
        }
    }
})();
