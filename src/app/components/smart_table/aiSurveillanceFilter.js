(function () {
    'use strict';
    angular.module('chpl')
        .controller('SurveillanceFilterController', SurveillanceFilterController)
        .directive('aiSurveillanceFilter', aiSurveillanceFilter);

    /** @ngInclude */
    function aiSurveillanceFilter () {
        return {
            bindToController: {
                hasChanges: '=?',
                nameSpace: '@'
            },
            controller: 'SurveillanceFilterController',
            controllerAs: 'vm',
            link: aiSurveillanceFilterLink,
            restrict: 'E',
            require: ['^stTable', 'aiSurveillanceFilter'],
            scope: {
                registerClearFilter: '&',
                registerRestoreState: '&'
            },
            templateUrl: 'app/components/smart_table/aiSurveillanceFilter.html'
        }
    }

    function aiSurveillanceFilterLink (scope, element, attr, ctrls) {

        activate();

        ////////////////////////////////////////////////////////

        function activate () {
            var table = ctrls[0];
            var ctrl = ctrls[1];
            var clearFilter = scope.registerClearFilter({
                clearFilter: function () {
                    ctrl.clearSurveillanceActivityFilter();
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
            ctrl.activate();
        }
    }
    /** @ngInclude */
    function SurveillanceFilterController ($localStorage, $log) {
        var vm = this;

        vm.activate = activate;
        vm.clearSurveillanceActivityFilter = clearSurveillanceActivityFilter;
        vm.filterChanged = filterChanged;
        vm.restoreState = restoreState;

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.query = {
                surveillance: { }
            };
        }

        function clearSurveillanceActivityFilter () {
            vm.query = {
                surveillance: { }
            };
            vm.filterChanged();
        }

        function filterChanged () {
            vm.hasChanges = false;
            var tableState = vm.tableCtrl.tableState();
            $log.debug(tableState.search.predicateObject);
            if (tableState.search.predicateObject.surveillance) {
                delete tableState.search.predicateObject.surveillance;
            }

            if (vm.query.hasHadSurveillance) {
                vm.hasChanges = true;
                var query = { anySurveillance: { } };
                if (vm.query.hasHadSurveillance === 'never') {
                    $log.debug('never',vm.query);
                    query.anySurveillance.all = false;
                    query.anySurveillance.matchAll = true;
                    query.anySurveillance.hasOpenSurveillance = false;
                    query.anySurveillance.hasClosedSurveillance = false;
                    query.anySurveillance.hasOpenNonconformities = false;
                    query.anySurveillance.hasClosedNonconformities = false;
                } else if (vm.query.hasHadSurveillance === 'has-had') {
                    $log.debug('has-had',vm.query);
                    if (angular.isUndefined(vm.query.surveillance.openSurveillance) &&
                        angular.isUndefined(vm.query.surveillance.closedSurveillance) &&
                        angular.isUndefined(vm.query.surveillance.openNonconformities) &&
                        angular.isUndefined(vm.query.surveillance.closedNonconformities)) {
                        query.anySurveillance.all = false;
                        query.anySurveillance.matchAll = false;
                        query.anySurveillance.hasOpenSurveillance = true;
                        query.anySurveillance.hasClosedSurveillance = true;
                        query.anySurveillance.hasOpenNonconformities = false;
                        query.anySurveillance.hasClosedNonconformities = false;
                    } else {
                        query.anySurveillance.all =
                            !vm.query.surveillance.openSurveillance &&
                            !vm.query.surveillance.closedSurveillance &&
                            !vm.query.surveillance.openNonconformities &&
                            !vm.query.surveillance.closedNonconformities;
                        query.anySurveillance.matchAll = angular.copy(vm.query.surveillance.matchAll);
                        query.anySurveillance.hasOpenSurveillance = angular.isDefined(vm.query.surveillance.openSurveillance) ? vm.query.surveillance.openSurveillance : false;
                        query.anySurveillance.hasClosedSurveillance = angular.isDefined(vm.query.surveillance.closedSurveillance) ? vm.query.surveillance.closedSurveillance : false;
                        query.anySurveillance.hasOpenNonconformities = angular.isDefined(vm.query.surveillance.openNonconformities) ? vm.query.surveillance.openNonconformities : false;
                        query.anySurveillance.hasClosedNonconformities = angular.isDefined(vm.query.surveillance.closedNonconformities) ? vm.query.surveillance.closedNonconformities : false;
                    }
                }
                vm.tableCtrl.search(query, 'surveillance');
            } else {
                delete tableState.search.predicateObject.surveillance;
                vm.tableCtrl.search();
            }
            $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
        }

        function restoreState (state) {
            $log.debug('restoreState _surveillance_', state);
            var query = state.search.predicateObject.surveillance;
            if (query) {
                $log.debug('restore surveillance', query);
                vm.query.surveillance.openSurveillance = query.anySurveillance.hasOpenSurveillance;
                vm.query.surveillance.closedSurveillance = query.anySurveillance.hasClosedSurveillance;
                vm.query.surveillance.openNonconformities = query.anySurveillance.hasOpenNonconformities;
                vm.query.surveillance.closedNonconformities = query.anySurveillance.hasClosedNonconformities;
                vm.query.surveillance.matchAll = query.anySurveillance.matchAll;
                if (!query.anySurveillance.all &&
                    query.anySurveillance.matchAll &&
                    !query.anySurveillance.hasOpenSurveillance &&
                    !query.anySurveillance.hasClosedSurveillance &&
                    !query.anySurveillance.hasOpenNonconformities &&
                    !query.anySurveillance.hasClosedNonconformities) {
                    vm.query.hasHadSurveillance = 'never';
                } else {
                    vm.query.hasHadSurveillance = 'has-had';
                }
                vm.filterChanged();
            }
        }
    }
})();
