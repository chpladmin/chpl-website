(() => {
  'use strict';

  describe('the surveillance nonconformity component', () => {
    var $log, ctrl, el, scope;

    beforeEach(() => {
      angular.mock.module('chpl.components');

      inject(function ($compile, _$log_, $rootScope) {
        $log = _$log_;

        el = angular.element('<ai-surveillance-nonconformity-inspect close="close()" resolve="resolve"></ai-surveillance-nonconformity-inspect>');

        scope = $rootScope.$new();
        scope.close = jasmine.createSpy('close');
        scope.resolve = {
          nonconformities: [1, 2],
          nonconformityTypes: { data: [] },
        };
        $compile(el)(scope);
        scope.$digest();
        ctrl = el.isolateScope().$ctrl;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.debug('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    it('should exist', () => {
      expect(ctrl).toBeDefined();
    });

    it('should have nonconformities', () => {
      expect(ctrl.nonconformities.length).toBe(2);
    });

    it('should have a way to close the modal', () => {
      expect(ctrl.cancel).toBeDefined();
      ctrl.cancel();
      expect(scope.close).toHaveBeenCalled();
    });
  });
})();
