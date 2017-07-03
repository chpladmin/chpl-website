(function () {
    'use strict';

    angular.module('chpl.compare-widget')
        .directive('aiCompareWidgetDisplay', aiCompareWidgetDisplay);

    /** @ngInject */
    function aiCompareWidgetDisplay ($location) {
        return {
            require: '^aiCompareWidget',
            restrict: 'E',
            scope: {
                widget: '=',
            },
            templateUrl: 'app/components/compare_widget/compare_widget_display.html',
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
