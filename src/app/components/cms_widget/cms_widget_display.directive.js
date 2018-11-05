(function () {
    'use strict';

    angular.module('chpl.components')
        .directive('aiCmsWidgetDisplay', aiCmsWidgetDisplay);

    /** @ngInject */
    function aiCmsWidgetDisplay () {
        return {
            require: '^aiCmsWidget',
            restrict: 'E',
            scope: {
                widget: '=',
            },
            templateUrl: 'chpl.components/cms_widget/cms_widget_display.html',
            link: function (scope, el, attrs, widgetController) {
                scope.clearProducts = function () {
                    widgetController.clearProducts();
                };
                scope.compare = widgetController.compare;
                scope.create = function () {
                    widgetController.create();
                };
                scope.generatePdf = function () {
                    widgetController.generatePdf();
                };
                scope.removeProduct = function (id) {
                    widgetController.removeProduct(id);
                };
            },
        };
    }
})();
