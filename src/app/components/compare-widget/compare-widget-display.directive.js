(function () {
    'use strict';

    angular.module('chpl.components')
        .directive('aiCompareWidgetDisplay', aiCompareWidgetDisplay);

    /** @ngInject */
    function aiCompareWidgetDisplay ($location) {
        return {
            require: '^aiCompareWidget',
            restrict: 'E',
            scope: {
                widget: '=',
            },
            templateUrl: 'chpl.components/compare-widget/compare-widget-display.html',
            link: function (scope, el, attrs, widgetController) {
                scope.clearProducts = function () {
                    widgetController.clearProducts();
                };
                scope.compare = function () {
                    widgetController.saveProducts();
                    $location.url('/compare/' + widgetController.queryUrl());
                    scope.$emit('HideCompareWidget');
                };
                scope.toggleProduct = function (id) {
                    widgetController.toggleProduct(id);
                };
            },
        };
    }
})();
