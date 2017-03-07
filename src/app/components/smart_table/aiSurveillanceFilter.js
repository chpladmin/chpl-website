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
    function SurveillanceFilterController ($localStorage) {
        var vm = this;

        vm.activate = activate;
        vm.clearSurveillanceActivityFilter = clearSurveillanceActivityFilter;
        vm.filterChanged = filterChanged;
        vm.restoreState = restoreState;

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.query = {
                NC: {}
            };
        }

        function clearSurveillanceActivityFilter () {
            vm.query = {
                NC: {}
            };
            vm.filterChanged();
        }

        function filterChanged () {
            vm.hasChanges = false;
            var tableState = vm.tableCtrl.tableState();
            if (tableState.search.predicateObject.surveillance) {
                delete tableState.search.predicateObject.surveillance;
            }
            if (vm.query.surveillance || vm.query.NC.never || vm.query.NC.open || vm.query.NC.closed || vm.query.matchAll) {
                vm.hasChanges = true;
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
    }
})();
