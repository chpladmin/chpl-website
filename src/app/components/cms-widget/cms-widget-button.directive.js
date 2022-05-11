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
        listingId: '@',
        productName: '@',
        chplProductNumber: '@',
      },
      templateUrl: 'chpl.components/cms-widget/cms-widget-button.html',
      link: function (scope, el, attrs, widgetController) {
        scope.toggleProduct = function (id, number) {
          scope.$emit('ShowWidget');
          widgetController.toggleProduct(id, number);
        };
        scope.isInList = function (id) {
          return widgetController.isInList(id);
        };
      },
    };
  }
})();
