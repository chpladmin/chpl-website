(function () {
    'use strict';
    angular.module('chpl')
        .controller('ListMultipleController', ListMultipleController)
        .directive('stListMultiple', stListMultiple);

    /** @ngInclude */
    function stListMultiple ($log) {
        return {
            bindToController: {
                collection: '=',
                fixedItems: '=?',
                hasChanges: '=?',
                predicate: '@',
                predicateExpression: '='
            },
            controller: 'ListMultipleController',
            controllerAs: 'vm',
            link: function (scope, element, attr, ctrl) {
                ctrl[1].tableCtrl = ctrl[0];
                ctrl[1].activate();
            },
            restrict: 'E',
            require: ['^stTable', 'stListMultiple'],
            scope: {},
            templateUrl: 'app/components/smart_table/stListMultiple.html'
        }
    }

    /** @ngInclude */
    function ListMultipleController ($log, $scope) {
        var vm = this;

        vm.activate = activate;
        vm.filterChanged = filterChanged;
        vm.isNotDefault = isNotDefault;
        vm.toggleSelection = toggleSelection;

        ////////////////////////////////////////////////////////////////////

        function activate () {
            $log.debug('activate', angular.fromJson(angular.toJson(vm)), vm);
            vm.dropdownLabel = '';
            setItems();
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

            vm.distinctItems = distinctItems;
            setSelection();
        }

        function fillDistinctItems (values, distinctItems) {
            if (!angular.isObject(values)) {
                values = [values];
            }
            var value;
            for (var i = 0; i < values.length; i++) {
                value = values[i];
                if (value && value.trim().length > 0 && !findItemWithValue(distinctItems, value)) {
                    distinctItems.push({
                        value: value,
                        selected: true
                    });
                }
            }
        }

        function filterChanged () {
            vm.dropdownLabel = getDropdownLabel();
            vm.hasChanges = getChanged();

            var predicate = getPredicate();
            var items = getSelectedOptions();
            var query, numberOfItems = items.length;

            if (vm.matchAll) {
                query = {
                    matchAll: {
                        items: items,
                        all: numberOfItems === 0
                    }
                };
            } else {
                query = {
                    matchAny: {
                        items: items,
                        all: (numberOfItems === 0 || numberOfItems === vm.distinctItems.length)
                    }
                };
            }
            vm.tableCtrl.search(query, predicate);
        }

        function findItemWithValue (collection, value) {
            for (var i = 0; i < collection.length; i++) {
                if (collection[i].value === value)
                    return true;
            }
            return false;
        }

        function getChanged () {
            var ret = false;
            angular.forEach(vm.distinctItems, function (item) {
                ret = ret || isNotDefault(item);
            })
            return ret;
        }

        function getDropdownLabel () {
            var allCount = vm.distinctItems.length;

            var selected = getSelectedOptions();

            if (allCount === selected.length || selected.length === 0) {
                return 'All';
            }

            if (selected.length === 1) {
                return selected[0];
            }

            return selected.length + ' items';
        }

        function getPredicate () {
            var predicate = vm.predicate;
            if (!predicate && vm.predicateExpression) {
                predicate = vm.predicateExpression;
            }
            return predicate;
        }

        function getSelectedOptions () {
            /*                        var selectedOptions = [];

                                      angular.forEach(vm.distinctItems, function (item) {
                                      if (item.selected) {
                                      selectedOptions.push(item.value);
                                      }
                                      });
                                      return selectedOptions;
            */
            return vm.selected;
        }

        function isNotDefault (checkedItem) {
            var ret = !checkedItem.selected;
            angular.forEach(vm.fixedItems, function (item) {
                if (item.value === checkedItem.value) {
                    ret = (item.selected !== checkedItem.selected);
                }
            })
            return ret;
        }

        function setItems () {
            $log.debug('setItems', vm, vm.fixedItems, vm.collection);
            if (angular.isUndefined(vm.fixedItems)) {
                bindCollection(vm.collection);
                $scope.$watch('collection', function (newCollection) {
                    bindCollection(newCollection)
                });
            } else {
                vm.distinctItems = angular.copy(vm.fixedItems);
                setSelection();
            }
        }

        function setSelection () {
            vm.selected = [];
            angular.forEach(vm.distinctItems, function (item) {
                if (item.selected) {
                    vm.selected.push(item.value);
                }
            });

            filterChanged();
        }

        function toggleSelection (value) {
            var index = vm.selected.indexOf(value);
            if(index > -1) {
                vm.selected.splice(index, 1);
            } else {
                vm.selected.push(value);
            }
            filterChanged();
        }
    }
})();
