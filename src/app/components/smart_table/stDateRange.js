(function () {
    'use strict';
    angular.module('chpl')

        .directive('stDateRange', function () {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    before: '=',
                    after: '='
                },
                templateUrl: 'app/components/smart_table/stDateRange.html',
                link: function (scope, element, attr, table) {
                    var inputs = element.find('input');
                    var inputBefore = angular.element(inputs[1]);
                    var inputAfter = angular.element(inputs[0]);
                    var predicateName = attr.predicate;

                    [inputBefore, inputAfter].forEach(function (input) {

                        input.bind('blur', function () {
                            var query = {};
                            if (scope.before) {
                                query.before = (scope.before.setUTCDate(scope.before.getUTCDate() + 1));
                            }

                            if (scope.after) {
                                query.after = scope.after.getTime();
                            }

                            scope.$apply(function () {
                                table.search(query, predicateName);
                            })
                        });
                    });
                }
            }
        })
})();
