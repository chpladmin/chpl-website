(function () {
  'use strict';

  describe('chpl.aiCmsWidget', function () {
    var $compile, $log, $rootScope, el, vm;

    beforeEach(function () {
      angular.mock.module('chpl.components', 'chpl.services');
      inject(function (_$compile_, $localStorage, _$log_, _$rootScope_) {
        $compile = _$compile_;
        $rootScope = _$rootScope_;
        $log = _$log_;

        delete $localStorage.cmsWidget;

        el = angular.element('<ai-cms-widget></ai-cms-widget>');

        $compile(el)($rootScope.$new());
        $rootScope.$digest();
        vm = el.isolateScope().vm;
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
      expect(el.html()).not.toBeNull();
    });

    it('should have isolate scope object with instanciate members', function () {
      expect(vm).toEqual(jasmine.any(Object));
    });
  });
})();
