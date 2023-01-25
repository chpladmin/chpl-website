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
        chplProductNumber: '@',
      },
      templateUrl: 'chpl.components/cms-widget/cms-widget-button.html',
      link: function (scope, el, attrs, widgetController) {
        scope.toggleProduct = function (id, name, number) {
          widgetController.toggleProduct(id, name, number);
          scope.$emit('ShowCmsWidget');
        };
        scope.isInList = function (id) {
          return widgetController.isInList(id);
        };
      },
    };
  }
})();
