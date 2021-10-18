(() => {
  describe('the Change Requests Management component', () => {
    let $compile;
    let $log;
    let ctrl;
    let el;
    let scope;

    beforeEach(() => {
      angular.mock.module('chpl.administration', ($provide) => {
        $provide.factory('chplChangeRequestsWrapperBridgeDirective', () => ({}));
      });

      inject((_$compile_, _$log_, $rootScope) => {
        $compile = _$compile_;
        $log = _$log_;

        scope = $rootScope.$new();

        el = angular.element('<chpl-change-requests-management></chpl-change-requests-management>');

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
      it('should exist', () => {
        expect(ctrl).toEqual(jasmine.any(Object));
      });

      describe('during initiation', () => {
        it('should have constructed stuff', () => {
          expect(ctrl.$log).toBeDefined();
        });
      });
    });
  });
})();
