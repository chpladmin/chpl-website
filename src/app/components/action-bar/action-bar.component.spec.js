(() => {
  'use strict';

  describe('the Action Bar component', () => {
    var $compile, $log, $rootScope, ctrl, el, mock, scope;

    mock = {
      errorMessages: [{id: 1}, {id: 2}],
    };

    beforeEach(() => {
      angular.mock.module('chpl.components');

      inject((_$compile_, _$log_, _$rootScope_) => {
        $compile = _$compile_;
        $log = _$log_;
        $rootScope = _$rootScope_;

        scope = $rootScope.$new();
        scope.errorMessages = mock.errorMessages;
        scope.takeAction = jasmine.createSpy('takeAction');

        el = angular.element('<chpl-action-bar error-messages="errorMessages" take-action="takeAction(action)"></chpl-action-bar>');

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

      describe('on load', () => {
        it('should make copies of data', () => {
          expect(ctrl.errorMessages).toEqual(mock.errorMessages);
          expect(ctrl.errorMessages).not.toBe(mock.errorMessages);
        });

        it('shouldn\'t make copies if there isnt\'t data', () => {
          scope = $rootScope.$new();
          el = angular.element('<chpl-action-bar></chpl-action-bar>');

          $compile(el)(scope);
          scope.$digest();
          ctrl = el.isolateScope().$ctrl;
          expect(ctrl.errorMessages).toBeUndefined();
        });
      });

      describe('when using callbacks', () => {
        it('should handle acting', () => {
          ctrl.act('cancel');
          expect(scope.takeAction).toHaveBeenCalledWith('cancel');
        });
      });
    });
  });
})();
