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
                initialState: '=?',
                nameSpace: '@'
            },
            controller: 'SurveillanceFilterController',
            controllerAs: 'vm',
            link: aiSurveillanceFilterLink,
            restrict: 'E',
            require: ['^stTable', 'aiSurveillanceFilter'],
            scope: {
                registerAllowAll: '&',
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
            var allowAll = scope.registerAllowAll({
                allowAll: function () {
                    ctrl.allowAll();
                }
            });
            scope.$on('$destroy', allowAll);
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
    function SurveillanceFilterController ($log, $localStorage) {
        var vm = this;

        vm.activate = activate;
        vm.allowAll = allowAll;
        vm.clearSurveillanceActivityFilter = clearSurveillanceActivityFilter;
        vm.filterChanged = filterChanged;
        vm.restoreState = restoreState;

        ////////////////////////////////////////////////////////////////////

        function activate () {
            reset();
        }

        function allowAll () {
            vm.query = {
                NC: {}
            }
            vm.filterChanged();
        }

        function clearSurveillanceActivityFilter () {
            reset();
            vm.filterChanged();
        }

        function filterChanged () {
            vm.hasChanges = false;
            var tableState = vm.tableCtrl.tableState();
            if (tableState.search.predicateObject.surveillance) {
                delete tableState.search.predicateObject.surveillance;
            }
            if (vm.initialState) {
                vm.hasChanges = vm.hasChanges || (vm.query.surveillance !== vm.initialState.surveillance);
                vm.hasChanges = vm.hasChanges || (vm.query.NC.never !== vm.initialState.NC.never);
                vm.hasChanges = vm.hasChanges || (vm.query.NC.open !== vm.initialState.NC.open);
                vm.hasChanges = vm.hasChanges || (vm.query.NC.closed !== vm.initialState.NC.closed);
                vm.hasChanges = vm.hasChanges || (vm.query.matchAll !== vm.initialState.matchAll);
            } else if (vm.query.surveillance || vm.query.NC.never || vm.query.NC.open || vm.query.NC.closed || vm.query.matchAll) {
                vm.hasChanges = true;
            }
            if (vm.initialState || vm.hasChanges) {
                vm.tableCtrl.search(vm.query, 'surveillance');
            } else {
                delete tableState.search.predicateObject.surveillance;
                vm.tableCtrl.search();
            }
            $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
        }

        function restoreState (state) {
            vm.query = state.search.predicateObject.surveillance;
            if (vm.query) {
                vm.filterChanged();
            }
        }

        ////////////////////////////////////////////////////////////////////

        function reset () {
            if (vm.initialState) {
                vm.query = angular.copy(vm.initialState);
            } else {
                vm.query = {
                    NC: {}
                }
            }
        }
    }
})();
