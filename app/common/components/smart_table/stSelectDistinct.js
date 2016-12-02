;(function () {
    'use strict';
    angular.module('app.common')

        .directive('stSelectDistinct', [function() {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    collection: '=',
                    predicate: '@',
                    predicateExpression: '='
                },
                template: '<select ng-model="selectedOption" ng-change="optionChanged(selectedOption)" ng-options="opt for opt in distinctItems"></select>',
                link: function(scope, element, attr, table) {
                    var getPredicate = function() {
                        var predicate = scope.predicate;
                        if (!predicate && scope.predicateExpression) {
                            predicate = scope.predicateExpression;
                        }
                        return predicate;
                    }

                    scope.$watch('collection', function(newValue) {
                        var predicate = getPredicate();

                        if (newValue) {
                            var temp = [];
                            scope.distinctItems = ['All'];

                            angular.forEach(scope.collection, function(item) {
                                var value = item[predicate];

                                if (value && value.trim().length > 0 && temp.indexOf(value) === -1) {
                                    temp.push(value);
                                }
                            });
                            temp.sort();

                            scope.distinctItems = scope.distinctItems.concat(temp);
                            scope.selectedOption = scope.distinctItems[0];
                            scope.optionChanged(scope.selectedOption);
                        }
                    }, true);

                    scope.optionChanged = function(selectedOption) {
                        var predicate = getPredicate();

                        var query = {};

                        query.distinct = selectedOption;

                        if (query.distinct === 'All') {
                            query.distinct = '';
                        }

                        table.search(query, predicate);
                    };
                }
            }
        }])
})();
