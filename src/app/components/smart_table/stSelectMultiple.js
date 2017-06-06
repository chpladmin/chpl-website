(function () {
    'use strict';
    angular.module('chpl')

        .directive('stSelectMultiple', function () {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    collection: '=',
                    predicate: '@',
                    predicateExpression: '=',
                },
                templateUrl: 'app/components/smart_table/stSelectMultiple.html',
                link: function (scope, element, attr, table) {
                    scope.dropdownLabel = '';
                    scope.filterChanged = filterChanged;

                    initialize();

                    function initialize () {
                        bindCollection(scope.collection);
                        scope.$watch('collection', function (newCollection) {
                            bindCollection(newCollection);
                        });
                    }

                    function getPredicate () {
                        var predicate = scope.predicate;
                        if (!predicate && scope.predicateExpression) {
                            predicate = scope.predicateExpression;
                        }
                        return predicate;
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

                    function getSelectedOptions () {
                        var selectedOptions = [];

                        angular.forEach(scope.distinctItems, function (item) {
                            if (item.selected) {
                                selectedOptions.push(item.value);
                            }
                        });

                        return selectedOptions;
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

                    function filterChanged () {
                        scope.dropdownLabel = getDropdownLabel();

                        var predicate = getPredicate();

                        var query = {
                            matchAny: {},
                        };

                        query.matchAny.items = getSelectedOptions();
                        var numberOfItems = query.matchAny.items.length;
                        if (numberOfItems === 0 || numberOfItems === scope.distinctItems.length) {
                            query.matchAny.all = true;
                        } else {
                            query.matchAny.all = false;
                        }

                        table.search(query, predicate);
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
                },
            }
        })
})();
