(() => {
  describe('the Listing Details View component', () => {
    let $compile;
    let $log;
    let Mock;
    let ctrl;
    let el;
    let networkService;
    let scope;

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.components', ($provide) => {
        $provide.factory('aiSedDirective', () => ({}));
        $provide.factory('chplCertificationCriteriaDirective', () => ({}));
        $provide.factory('chplCriteriaBridgeDirective', () => ({}));
        $provide.decorator('networkService', ($delegate) => ({ ...$delegate, getSurveillanceLookups: jasmine.createSpy('getSurveillanceLookups') }));
      });

      inject((_$compile_, _$log_, $q, $rootScope, _Mock_, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        Mock = _Mock_;
        networkService = _networkService_;
        networkService.getSurveillanceLookups.and.returnValue($q.when({}));

        scope = $rootScope.$new();
        [, scope.listing] = Mock.fullListings;
        scope.listing.sed = { testTasks: [], ucdProcesses: [] };

        el = angular.element('<chpl-listing-details-view listing="listing"></chpl-listing-details-view>');

        $compile(el)(scope);
        scope.$digest();
        ctrl = el.isolateScope().$ctrl;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('view', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should have isolate scope object with instanciate members', () => {
        expect(ctrl).toEqual(jasmine.any(Object));
      });

      describe('initial state', () => {
        it('should be open to criteria by default', () => {
          expect(ctrl.panelShown).toBe('cert');
        });

        it('should be able to be open to nothing', () => {
          el = angular.element('<chpl-listing-details-view listing="listing" initial-panel="none"></chpl-listing-details-view>');
          $compile(el)(scope);
          scope.$digest();
          ctrl = el.isolateScope().$ctrl;
          expect(ctrl.panelShown).toBeUndefined();
        });
      });
    });
  });
})();
