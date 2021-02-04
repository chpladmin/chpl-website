(() => {
  'use strict';

  describe('the Filter Multiple component', () => {
    var $compile, $log, ctrl, el, mock, scope;

    mock = {
      items: [1, 2],
    };

    beforeEach(() => {
      angular.mock.module('chpl.components');

      inject((_$compile_, _$log_, $rootScope) => {
        $compile = _$compile_;
        $log = _$log_;

        scope = $rootScope.$new();
        scope.items = mock.items;

        el = angular.element('<chpl-filter-multiple items="items"></chpl-filter-multiple>');

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

      describe('on init', () => {
        it('should have items', () => {
          expect(ctrl.items.length).toBe(2);
        });
      });
    });
  });
})();
