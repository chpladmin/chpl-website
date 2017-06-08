(function () {
    'use strict';

    angular.module('chpl.cms-widget')
        .directive('aiCmsWidgetDisplay', aiCmsWidgetDisplay);

    /** @ngInject */
    function aiCmsWidgetDisplay () {
        return {
            require: '^aiCmsWidget',
            restrict: 'E',
            scope: {
                widget: '=',
            },
            templateUrl: 'app/components/cms_widget/cms_widget_display.html',
            link: function (scope, el, attrs, widgetController) {
                scope.clearProducts = function () {
                    widgetController.clearProducts();
                };
                scope.create = function () {
                    widgetController.create();
                };
                scope.generatePdf = function () {
                    widgetController.generatePdf();
                };
                scope.removeProduct = function (id) {
                    widgetController.removeProduct(id);
                };
                scope.toggleProduct = function (id) {
                    widgetController.toggleProduct(id);
                };
            },
        };
    }
})();
