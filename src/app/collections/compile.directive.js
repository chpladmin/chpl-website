(function () {
    'use strict';

    angular.module('chpl.collections')
            .directive('aiCompile', aiCompile);

    /** @ngInject */
    function aiCompile ($compile) {
        return function (scope, element, attrs) {
            scope.$watch(
                function (scope) {
                    return scope.$eval(attrs.aiCompile);
                },
                function (value) {
                    element.html(value);
                    $compile(element.contents())(scope);
                });
        }
    }
})();
