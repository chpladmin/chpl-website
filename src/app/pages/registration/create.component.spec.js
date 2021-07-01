(() => {
  describe('the Registration Create Account component', () => {
    let $compile;
    let $log;
    let ctrl;
    let el;
    let scope;

    beforeEach(() => {
      angular.mock.module('chpl.registration', ($provide) => {
        $provide.factory('chplRegisterUserBridgeDirective', () => ({}));
      });

      inject((_$compile_, _$log_, $rootScope) => {
        $compile = _$compile_;
        $log = _$log_;

        scope = $rootScope.$new();
        scope.hash = 'fakehash';

        el = angular.element('<chpl-registration-create-user hash="hash"></chpl-registration-create-user>');

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

      it('should have the hash value in scope', () => {
        expect(ctrl.hash).toBe(scope.hash);
      });
    });
  });
})();
