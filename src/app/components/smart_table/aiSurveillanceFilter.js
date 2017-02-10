(function () {
    'use strict';
    angular.module('chpl')
        .controller('SurveillanceFilterController', SurveillanceFilterController)
        .directive('aiSurveillanceFilter', aiSurveillanceFilter);

    /** @ngInclude */
    function aiSurveillanceFilter ($log) {
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
                collection: '=',
                fixedItems: '=?',
                predicate: '@',
                predicateExpression: '=',
                registerClearFilter: '&',
                registerRestoreState: '&'
            },
            templateUrl: 'app/components/smart_table/aiSurveillanceFilter.html'
        }
    }

    function aiSurveillanceFilterLink (scope, element, attr, ctrls) {
        scope.clearSurveillanceActivityFilter = clearSurveillanceActivityFilter;
        scope.filterChanged = filterChanged;
        var table, tableState;

        activate();

        ////////////////////////////////////////////////////////

        function activate () {
            table = ctrls[0];
            tableState = table.tableState();
            clearSurveillanceActivityFilter();
        }

        function clearSurveillanceActivityFilter () {
            scope.query = {
                surveillance: { }
            };
            filterChanged();
        }

        function filterChanged () {
            scope.hasChanges = false;
            if (tableState.search.predicateObject.surveillance) {
                delete tableState.search.predicateObject.surveillance;
            }

            if (scope.query.hasHadSurveillance) {
                scope.hasChanges = true;
                var query = { anySurveillance: { } };
                if (scope.query.hasHadSurveillance === 'never') {
                    query.anySurveillance.all = false;
                    query.anySurveillance.matchAll = true;
                    query.anySurveillance.hasOpenSurveillance = false;
                    query.anySurveillance.hasClosedSurveillance = false;
                    query.anySurveillance.hasOpenNonconformities = false;
                    query.anySurveillance.hasClosedNonconformities = false;
                } else if (scope.query.hasHadSurveillance === 'has-had') {
                    if (angular.isUndefined(scope.query.surveillance.openSurveillance) &&
                        angular.isUndefined(scope.query.surveillance.closedSurveillance) &&
                        angular.isUndefined(scope.query.surveillance.openNonconformities) &&
                        angular.isUndefined(scope.query.surveillance.closedNonconformities)) {
                        query.anySurveillance.all = false;
                        query.anySurveillance.matchAll = false;
                        query.anySurveillance.hasOpenSurveillance = true;
                        query.anySurveillance.hasClosedSurveillance = true;
                        query.anySurveillance.hasOpenNonconformities = false;
                        query.anySurveillance.hasClosedNonconformities = false;
                    } else {
                        query.anySurveillance.all =
                            !scope.query.surveillance.openSurveillance &&
                            !scope.query.surveillance.closedSurveillance &&
                            !scope.query.surveillance.openNonconformities &&
                            !scope.query.surveillance.closedNonconformities;
                        query.anySurveillance.matchAll = angular.copy(scope.query.surveillance.matchAll);
                        query.anySurveillance.hasOpenSurveillance = angular.isDefined(scope.query.surveillance.openSurveillance) ? scope.query.surveillance.openSurveillance : false;
                        query.anySurveillance.hasClosedSurveillance = angular.isDefined(scope.query.surveillance.closedSurveillance) ? scope.query.surveillance.closedSurveillance : false;
                        query.anySurveillance.hasOpenNonconformities = angular.isDefined(scope.query.surveillance.openNonconformities) ? scope.query.surveillance.openNonconformities : false;
                        query.anySurveillance.hasClosedNonconformities = angular.isDefined(scope.query.surveillance.closedNonconformities) ? scope.query.surveillance.closedNonconformities : false;
                    }
                }
                table.search(query, 'surveillance');
            } else {
                delete tableState.search.predicateObject.surveillance;
                table.search();
            }
        }
    }
    /** @ngInclude */
    function SurveillanceFilterController ($localStorage, $log) {
        var vm = this;

        vm.activate = activate;
        vm.clearFilter = clearFilter;
        vm.filterChanged = filterChanged;
        vm.isNotDefault = isNotDefault;
        vm.restoreState = restoreState;
        vm.toggleSelection = toggleSelection;

        ////////////////////////////////////////////////////////////////////

        function activate () {
            if (vm.distinctItems && vm.distinctItems.length > 0 && vm.selected && vm.selected.length > 0) {
                $log.debug('ctrl.activate ' + vm.predicate, vm, vm.distinctItems, vm.selected);
                vm.filterChanged();
            }
        }

        function clearFilter () {
            angular.forEach(vm.distinctItems, function (item) {
                if (item.isSelected !== item.selected) {
                    item.isSelected = item.selected;
                    vm.toggleSelection(item.value);
                }
            })
            vm.matchAll = false;
            $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
            vm.filterChanged();
        }

        function filterChanged () {
            vm.hasChanges = getChanged();
            var query, numberOfItems = vm.selected.length;

            if (vm.matchAll) {
                query = {
                    matchAll: {
                        items: vm.selected,
                        all: numberOfItems === 0
                    }
                };
            } else {
                query = {
                    matchAny: {
                        items: vm.selected,
                        all: (numberOfItems === 0 || numberOfItems === vm.distinctItems.length)
                    }
                };
            }
            vm.tableCtrl.search(query, vm.predicate);
        }

        function isNotDefault (item) {
            return (angular.isUndefined(item.selected) && item.isSelected) || (item.selected !== item.isSelected);
        }

        function restoreState (state) {
            $log.debug('restoreState ' + vm.predicate, state);
            var predicateSearch = state.search.predicateObject[vm.predicate];
            if (predicateSearch) {
                if (predicateSearch.matchAny) {
                    vm.matchAll = false;
                    vm.selected = predicateSearch.matchAny.items;
                } else if (predicateSearch.matchAll) {
                    vm.matchAll = true;
                    vm.selected = predicateSearch.matchAll.items;
                }
                setToTableState();
            }
        }

        function toggleSelection (value) {
            var index = vm.selected.indexOf(value);
            if(index > -1) {
                vm.selected.splice(index, 1);
            } else {
                vm.selected.push(value);
            }
            $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
            vm.filterChanged();
        }

        ////////////////////////////////////////////////////////////////////

        function getChanged () {
            var ret = vm.matchAll;
            angular.forEach(vm.distinctItems, function (item) {
                ret = ret || isNotDefault(item);
            })
            return ret;
        }

        function setToTableState () {
            angular.forEach(vm.distinctItems, function (item) {
                if (vm.selected.indexOf(item.value) > -1) {
                    item.isSelected = true;
                } else {
                    item.isSelected = false;
                }
            })
            vm.filterChanged();
        }
    }
})();
