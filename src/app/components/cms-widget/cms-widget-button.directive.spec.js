(function () {
  'use strict';

  describe('the CMS Widget Button directive', function () {
    var $compile, $log, $rootScope, el, mock;
    mock = {};

    beforeEach(function () {
      angular.mock.module('chpl.components');
      inject(function (_$compile_, _$log_, _$rootScope_, aiCmsWidgetDirective) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $log = _$log_;

        // replace ai-cms-widget controller with mock version
        var aiCmsWidgetDefinition = aiCmsWidgetDirective[0];
        aiCmsWidgetDefinition.link = angular.noop;
        mock.isInList = jasmine.createSpy('isInList');
        mock.toggleProduct = jasmine.createSpy('toggleProduct');
        aiCmsWidgetDefinition.controller = function () {
          this.isInList = mock.isInList;
          this.toggleProduct = mock.toggleProduct;
        };

        el = angular.element('<ai-cms-widget><ai-cms-widget-button product-id="3" product-name="test" chpl-product-number="prodNum"></ai-cms-widget-button></ai-cms-widget>');

        $compile(el)($rootScope.$new());
        $rootScope.$digest();
      });
    });

    afterEach(function () {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    it('should be compiled', function () {
      expect(el.html()).not.toEqual(null);
    });
  });
})();
