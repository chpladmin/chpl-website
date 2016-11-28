;(function () {
    'use strict';
    angular.module('app.common')
        .directive('stSelectMultiple', [function() {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    collection: '=',
                    filterChanged: '&',
                    predicate: '@',
                    predicateExpression: '='
                },
                templateUrl: 'common/components/smart_table/stSelectMultiple.html',
                transclude: true,
                link: function(scope, element, attr, table) {
                    scope.dropdownLabel = '';
                    scope.filterChanged = filterChanged;

                    initialize();

                    function initialize() {
                        console.log('initialize', scope.collection);
                        bindCollection();
                        scope.$watchCollection('collection', function (newCollection, oldCollection) {
                            bindCollection();
                        });
                    }

                    function getPredicate() {
                        var predicate = scope.predicate;
                        if (!predicate && scope.predicateExpression) {
                            predicate = scope.predicateExpression;
                        }
                        return predicate;
                    }

                    function getDropdownLabel() {
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

                    function getSelectedOptions() {
                        var selectedOptions = [];

                        angular.forEach(scope.distinctItems, function(item) {
                            if (item.selected) {
                                selectedOptions.push(item.value);
                            }
                        });

                        return selectedOptions;
                    }

                    function bindCollection() {
                        var predicate = getPredicate();
                        var distinctItems = [];
                        console.log('bindCollection', predicate, scope.collection);
                        angular.forEach(scope.collection, function(item) {
                            var value = item[predicate];
                            fillDistinctItems(value, distinctItems);
                        });

                        distinctItems.sort(function(obj, other) {
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

                    function filterChanged() {
                        console.log('filterChanged');
                        scope.dropdownLabel = getDropdownLabel();

                        var predicate = getPredicate();

                        var query = {
                            matchAny: {}
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

                    function fillDistinctItems(value, distinctItems) {
                        console.log('value',value);
                        if (value && typeof(value) === 'string' && value.trim().length > 0 && !findItemWithValue(distinctItems, value)) {
                            distinctItems.push({
                                value: value,
                                selected: true
                            });
                        }
                    }

                    function findItemWithValue(collection, value) {
                        angular.forEach(collection, function (item) {
                            if (item.value === value)
                                return true;
                            return false;
                        });
                        return false;
                    }
                }
            }
        }]);
})();
