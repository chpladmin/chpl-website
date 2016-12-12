(function () {
    'use strict';
    angular.module('chpl.common')

        .directive('stDateRangePopup', function () {
            return {
                restrict: 'E',
                require: '^stTable',
                scope: {
                    before: '=',
                    after: '='
                },
                templateUrl: 'app/components/smart_table/stDateRangePopup.html',
                link: function (scope, element, attr, table) {
                    var inputs = element.find('input');
                    var inputBefore = angular.element(inputs[0]);
                    var inputAfter = angular.element(inputs[1]);
                    var predicateName = attr.predicate;

                    [inputBefore, inputAfter].forEach(function (input) {

                        input.bind('blur', function () {
                            var query = {};
                            if (!scope.isBeforeOpen && !scope.isAfterOpen) {

                                if (scope.before) {
                                    query.before = scope.before.getTime();
                                }

                                if (scope.after) {
                                    query.after = scope.after;
                                }

                                scope.$apply(function () {
                                    table.search(query, predicateName);
                                })
                            }
                        });
                    });

                    function open(before) {
                        return function ($event) {
                            $event.preventDefault();
                            $event.stopPropagation();

                            if (before) {
                                scope.$parent.isBeforeOpen = true;
                            } else {
                                scope.$parent.isAfterOpen = true;
                            }
                        }
                    }

                    scope.openBefore = open(true);
                    scope.openAfter = open();
                    scope.datepickerOptions = { closeOnDateSelection: false };
                }
            }
        })
})();
