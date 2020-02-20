(function () {
    'use strict';
    angular.module('chpl.components')
        .controller('ListMultipleController', ListMultipleController)
        .directive('stListMultiple', stListMultiple);

    /** @ngInclude */
    function stListMultiple () {
        return {
            bindToController: {
                allowAnd: '@?',
                hasChanges: '=?',
                hidden: '@?',
                hiddenOptions: '@?',
                matchFull: '@?',
                nameSpace: '@?',
                separator: '@?',
                trackAnalytics: '@?',
                triggerShowRetired: '&?',
            },
            controller: 'ListMultipleController',
            controllerAs: 'vm',
            link: stListMultipleLink,
            restrict: 'E',
            require: ['^stTable', 'stListMultiple'],
            scope: {
                collection: '=',
                fixedItems: '=?',
                predicate: '@',
                predicateExpression: '=',
                registerAllowAll: '&?',
                registerClearFilter: '&',
                registerRestoreState: '&',
                registerShowRetired: '&?',
            },
            templateUrl: 'chpl.components/smart-table/stListMultiple.html',
        }
    }

    function stListMultipleLink (scope, element, attr, ctrls) {

        activate();

        function activate () {
            var table = ctrls[0];
            var ctrl = ctrls[1];
            if (scope.registerAllowAll) {
                var allowAll = scope.registerAllowAll({
                    allowAll: function () {
                        ctrl.allowAll();
                    },
                });
                scope.$on('$destroy', allowAll);
            }
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
            if (scope.registerShowRetired) {
                var showRetired = scope.registerShowRetired({
                    showRetired: function (state) {
                        ctrl.showRetired(state);
                    },
                });
                scope.$on('$destroy', showRetired);
            }

            setItems();
            setSelected();
            scope.$watch('fixedItems', function () {
                setItems();
                setSelected();
                ctrl.distinctItems = scope.distinctItems;
                ctrl.selected = scope.selected;
                ctrl.filterChanged();
            });
            ctrl.distinctItems = scope.distinctItems;
            ctrl.predicate = getPredicate();
            ctrl.selected = scope.selected;
            ctrl.tableCtrl = table;
            ctrl.activate();
        }

        function bindCollection (collection) {
            var predicate = getPredicate();
            var distinctItems = [];

            angular.forEach(collection, function (item) {
                var value = item[predicate];
                fillDistinctItems(value, distinctItems);
            });

            distinctItems.sort(function (obj, other) {
                if (obj.value > other.value) {
                    return 1;
                } else if (obj.value < other.value) {
                    return -1;
                }
                return 0;
            });
            scope.distinctItems = distinctItems;
        }

        function fillDistinctItems (values, distinctItems) {
            if (!angular.isObject(values)) {
                values = [values];
            }
            var value;
            for (var i = 0; i < values.length; i++) {
                value = values[i] + '';
                if (value && value.trim().length > 0 && !findItemWithValue(distinctItems, value)) {
                    distinctItems.push({
                        value: value,
                        selected: true,
                    });
                }
            }
        }

        function findItemWithValue (collection, value) {
            for (var i = 0; i < collection.length; i++) {
                if (collection[i].value === value) {
                    return true;
                }
            }
            return false;
        }

        function getPredicate () {
            var predicate = scope.predicate;
            if (!predicate && scope.predicateExpression) {
                predicate = scope.predicateExpression;
            }
            return predicate;
        }

        function setSelected () {
            scope.selected = [];
            angular.forEach(scope.distinctItems, function (item) {
                item.isSelected = item.selected;
                if (item.selected) {
                    scope.selected.push(item.value);
                }
            });
        }

        function setItems () {
            if (angular.isDefined(scope.fixedItems)) {
                scope.distinctItems = angular.copy(scope.fixedItems);
            } else if (angular.isDefined(scope.collection)) {
                bindCollection(scope.collection);
                scope.$watch('collection', function (newCollection) {
                    bindCollection(newCollection)
                });
            }
        }
    }

    /** @ngInclude */
    function ListMultipleController ($analytics, $localStorage) {
        var vm = this;

        vm.activate = activate;
        vm.allowAll = allowAll;
        vm.clearFilter = clearFilter;
        vm.filterChanged = filterChanged;
        vm.getId = getId;
        vm.isNotDefault = isNotDefault;
        vm.restoreState = restoreState;
        vm.selectAll = selectAll;
        vm.showRetired = showRetired;
        vm.storeState = storeState;
        vm.toggleSelection = toggleSelection;

        ////////////////////////////////////////////////////////////////////

        function activate () {
            if (vm.distinctItems && vm.distinctItems.length > 0 && vm.selected && vm.selected.length > 0) {
                vm.filterChanged();
            }
        }

        function allowAll () {
            var restoreAnalytics = false;
            if (vm.trackAnalytics) {
                vm.trackAnalaytics = false;
                restoreAnalytics = true;
            }
            angular.forEach(vm.distinctItems, function (item) {
                if (item.isSelected) {
                    item.isSelected = false;
                    vm.toggleSelection(item, true, true);
                }
            })
            if (restoreAnalytics) {
                vm.trackAnalaytics = true;
            }
            vm.matchAll = false;
            vm.filterChanged();
            vm.storeState();
        }

        function clearFilter () {
            angular.forEach(vm.distinctItems, function (item) {
                if (item.isSelected !== item.selected) {
                    item.isSelected = item.selected;
                    vm.toggleSelection(item, true, true);
                }
            })
            vm.matchAll = false;
            vm.filterChanged();
            vm.storeState();
        }

        function getId (value) {
            return 'filter-list-' + (value + '').replace(/\s/g, '_');
        }

        function filterChanged () {
            vm.hasChanges = getChanged();
            var query;
            var numberOfItems = vm.selected.length;
            query = { separator: vm.separator ? vm.separator : '' };
            if (vm.matchAll) {
                query.matchAll = {
                    all: numberOfItems === 0,
                    matchFull: vm.matchFull,
                    items: vm.selected,
                }
            } else {
                query.matchAny = {
                    all: (numberOfItems === 0 || (!vm.hiddenOptions && numberOfItems === vm.distinctItems.length)),
                    matchFull: vm.matchFull,
                    items: vm.selected,
                }
            }
            vm.tableCtrl.search(query, vm.predicate);
        }

        function isNotDefault (item) {
            return (angular.isUndefined(item.selected) && item.isSelected) || (item.selected !== item.isSelected);
        }

        function restoreState (state) {
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

        function selectAll () {
            angular.forEach(vm.distinctItems, function (item) {
                if (!item.isSelected) {
                    item.isSelected = true;
                    vm.selected.push(item.value);
                }
            })
            vm.matchAll = false;
            vm.filterChanged();
            vm.storeState();
        }

        function showRetired () {
            angular.forEach(vm.distinctItems, function (item) {
                if (!item.isSelected && item.retired) {
                    item.isSelected = true;
                    vm.selected.push(item.value);
                }
            })
            vm.matchAll = false;
            vm.filterChanged();
            vm.storeState();
        }

        function storeState () {
            if (vm.nameSpace) {
                $localStorage[vm.nameSpace] = angular.toJson(vm.tableCtrl.tableState());
            }
        }

        function toggleSelection (item, dontSearch, dontTriggerRetired) {
            var index = vm.selected.indexOf(item.value);
            if (index > -1) {
                vm.selected.splice(index, 1);
            } else {
                vm.selected.push(item.value);
                if (!dontTriggerRetired && item.retired) {
                    vm.triggerShowRetired();
                }
                if (vm.trackAnalytics) {
                    var event;
                    switch (vm.predicate) {
                    case 'criteriaMet': event = 'Certification Criteria Filter'; break;
                    case 'cqmsMet': event = 'CQM Filter'; break;
                    default: event = 'Other';
                    }
                    $analytics.eventTrack(event, { category: 'Search', label: item.value });
                }
            }
            if (!dontSearch) {
                vm.filterChanged();
                vm.storeState();
            }
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
            vm.storeState();
        }
    }
})();
