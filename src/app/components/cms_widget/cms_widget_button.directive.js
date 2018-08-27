(function () {
    'use strict';

    angular.module('chpl.components')
        .directive('aiCmsWidgetButton', aiCmsWidgetButton);

    /** @ngInject */
    function aiCmsWidgetButton () {
        return {
            require: '^aiCmsWidget',
            restrict: 'E',
            scope: {
                productId: '@',
                productName: '@',
            },
            templateUrl: 'chpl.components/cms_widget/cms_widget_button.html',
            link: function (scope, el, attrs, widgetController) {
                scope.toggleProduct = function (id) {
                    scope.$emit('ShowWidget');
                    widgetController.toggleProduct(id);
                };
                scope.isInList = function (id) {
                    return widgetController.isInList(id);
                };
            },
        };
    }
})();
