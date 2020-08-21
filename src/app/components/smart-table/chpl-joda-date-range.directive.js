import '../../../../node_modules/@js-joda/timezone';
//import { Locale } from '../../../../node_modules/@js-joda/locale_en-us';
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
            templateUrl: 'chpl.components/smart-table/chpl-date-range.html',
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
            vm.hasChanges = vm.before || vm.after;
            var query = {};
            if (vm.before) {
                var before;
                if (angular.isObject(vm.before)) {
                    vm.$log.info('Got here');
                    query.before = angular.copy(vm.before)
                } else {
                    query.before = _convertToZonedDateTimeUsingEasternTime(vm.before);
                }
                vm.$log.info('Before');
                vm.$log.info(query.before);
                vm.$log.info(new Date());
                query.before = new Date(query.before.toInstant().toEpochMilli());
                if (vm.trackAnalytics) {
                    $analytics.eventTrack('Certification Date "To" Filter', { category: 'Search', label: $filter('date')(before, 'mediumDate', 'UTC')});
                }
            }

            if (vm.after) {
                var after;
                if (angular.isObject(vm.after)) {
                    after = angular.copy(vm.after)
                } else {
                    after = _convertToZonedDateTimeUsingEasternTime(vm.after);
                }
                query.after = new Date(after.toInstant().toEpochMilli());
                if (vm.trackAnalytics) {
                    $analytics.eventTrack('Certification Date "After" Filter', { category: 'Search', label: $filter('date')(after, 'mediumDate', 'UTC')});
                }
            }
            vm.$log.info('Query');
            vm.$log.info(query);
            vm.tableCtrl.search(query, vm.predicate);
            vm.storeState();
        }

        function restoreState (state) {
            var predicateSearch = state.search.predicateObject[vm.predicate];
            if (predicateSearch) {
                if (predicateSearch.after) {
                    //vm.after = new Date(predicateSearch.after);
                    //console.log(predicateSearch.after);
                    vm.after = new Date(predicateSearch.after);
                } else {
                    vm.after = undefined;
                }
                if (predicateSearch.before) {
                    //var before = new Date(predicateSearch.before);
                    //before.setUTCDate(before.getUTCDate() - 1);
                    //console.log(predicateSearch.before);
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

        function _convertToZonedDateTimeUsingEasternTime (dateLong) {
            return jsJoda.ZonedDateTime.ofInstant(jsJoda.Instant.ofEpochMilli(dateLong), jsJoda.ZoneId.of('America/New_York'));
        }
    }
})();
