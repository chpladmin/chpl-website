(() => {
  describe('the surveillance nonconformity edit component', () => {
    let $compile;
    let $log;
    let authService;
    let ctrl;
    let el;
    let scope;

    beforeEach(() => {
      angular.mock.module('chpl.components', ($provide) => {
        $provide.decorator('authService', ($delegate) => ({
          ...$delegate,
          getApiKey: jasmine.createSpy('getApiKey'),
          getToken: jasmine.createSpy('getToken'),
        }));
      });

      inject((_$compile_, _$log_, $rootScope, _authService_) => {
        $compile = _$compile_;
        $log = _$log_;
        authService = _authService_;
        authService.getApiKey.and.returnValue('api-key');
        authService.getToken.and.returnValue('token');

        el = angular.element('<ai-surveillance-nonconformity-edit close="close($value)" dismiss="dismiss()" resolve="resolve"></ai-surveillance-nonconformity-edit>');

        scope = $rootScope.$new();
        scope.close = jasmine.createSpy('close');
        scope.dismiss = jasmine.createSpy('dismiss');
        scope.resolve = {
          disableValidation: false,
          nonconformity: {},
          randomized: false,
          randomizedSitesUsed: undefined,
          requirementId: 1,
          surveillanceId: 1,
          surveillanceTypes: {
            nonconformityTypes: { data: [] },
          },
          workType: 'create',
        };
        $compile(el)(scope);
        scope.$digest();
        ctrl = el.isolateScope().$ctrl;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.debug(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('template', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(ctrl).toBeDefined();
      });

      it('should be able close it\'s own modal', () => {
        expect(ctrl.cancel).toBeDefined();
        ctrl.cancel();
        expect(scope.dismiss).toHaveBeenCalled();
      });

      describe('when saving the nonconformity', () => {
        it('should close it\'s modal with the NC', () => {
          ctrl.nonconformity = { id: 'an NC' };
          ctrl.save();
          expect(scope.close).toHaveBeenCalled();
        });
      });
    });
  });
})();
