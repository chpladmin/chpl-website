(function () {
    'use strict';

    angular.module('chpl.components')
        .directive('aiCompareWidgetButton', aiCompareWidgetButton);

    /** @ngInject */
    function aiCompareWidgetButton () {
        return {
            require: '^aiCompareWidget',
            restrict: 'E',
            scope: {
                productId: '@',
                productName: '@',
            },
            templateUrl: 'chpl.components/compare-widget/compare-widget-button.html',
            link: function (scope, el, attrs, widgetController) {
                scope.toggleProduct = function (id, name) {
                    widgetController.toggleProduct(id, name);
                    scope.$emit('ShowCompareWidget');
                };
                scope.isInList = function (id) {
                    return widgetController.isInList(id);
                };
            },
        };
    }
})();
