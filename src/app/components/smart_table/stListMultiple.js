(function () {
    'use strict';
    angular.module('chpl')

        .directive('stListMultiple', function () {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    collection: '=',
                    fixedItems: '=?',
                    hasChanges: '=?',
                    predicate: '@',
                    predicateExpression: '='
                },
                templateUrl: 'app/components/smart_table/stListMultiple.html',
                link: function (scope, element, attr, table) {
                    scope.dropdownLabel = '';
                    scope.filterChanged = filterChanged;
                    scope.isNotDefault = isNotDefault;

                    initialize();

                    function initialize () {
                        setItems();
                        scope.$on('clearAllFilters', setItems());
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
                        filterChanged();
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
                        scope.dropdownLabel = getDropdownLabel();
                        scope.hasChanges = getChanged();

                        var predicate = getPredicate();
                        var items = getSelectedOptions();
                        var query, numberOfItems = items.length;

                        if (scope.matchAll) {
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
                                    all: (numberOfItems === 0 || numberOfItems === scope.distinctItems.length)
                                }
                            };
                        }
                        table.search(query, predicate);
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
                        angular.forEach(scope.distinctItems, function (item) {
                            ret = ret || isNotDefault(item);
                        })
                        return ret;
                    }

                    function getDropdownLabel () {
                        var allCount = scope.distinctItems.length;

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
                        var predicate = scope.predicate;
                        if (!predicate && scope.predicateExpression) {
                            predicate = scope.predicateExpression;
                        }
                        return predicate;
                    }

                    function getSelectedOptions () {
                        var selectedOptions = [];

                        angular.forEach(scope.distinctItems, function (item) {
                            if (item.selected) {
                                selectedOptions.push(item.value);
                            }
                        });

                        return selectedOptions;
                    }

                    function isNotDefault (checkedItem) {
                        var ret = !checkedItem.selected;
                        angular.forEach(scope.fixedItems, function (item) {
                            if (item.value === checkedItem.value) {
                                ret = (item.selected !== checkedItem.selected);
                            }
                        })
                        return ret;
                    }

                    function setItems () {
                        if (angular.isUndefined(scope.fixedItems)) {
                            bindCollection(scope.collection);
                            scope.$watch('collection', function (newCollection) {
                                bindCollection(newCollection)
                            });
                        } else {
                            console.log('setItems',scope.fixedItems);
                            scope.distinctItems = angular.copy(scope.fixedItems);
                            filterChanged();
                        }
                    }
                }
            }
        })
})();
