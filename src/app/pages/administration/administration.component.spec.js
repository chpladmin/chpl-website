(() => {
  'use strict';

  describe('the Administration component', () => {
    var $compile, $log, authService, ctrl, el, scope;

    beforeEach(() => {
      angular.mock.module('chpl.administration', $provide => {
        $provide.decorator('authService', $delegate => {
          $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');

          return $delegate;
        });
      });

      inject((_$compile_, _$log_, $rootScope, _authService_) => {
        $compile = _$compile_;
        $log = _$log_;
        authService = _authService_;
        authService.hasAnyRole.and.returnValue(true);

        scope = $rootScope.$new();
        el = angular.element('<chpl-administration></chpl-administration>');

        $compile(el)(scope);
        scope.$digest();
        ctrl = el.isolateScope().$ctrl;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('view', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(ctrl).toEqual(jasmine.any(Object));
      });
    });
  });
})();
