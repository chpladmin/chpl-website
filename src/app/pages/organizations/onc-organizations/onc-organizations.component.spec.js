(() => {
  describe('the ONC-Organizations component', () => {
    let $compile;
    let $log;
    let $q;
    let authService;
    let ctrl;
    let el;
    let networkService;
    let scope;

    const mock = {
      orgs: [
        { name: 'an org' },
        { name: 'another org' },
      ],
    };

    beforeEach(() => {
      angular.mock.module('chpl.organizations', ($provide) => {
        $provide.factory('chplUsersBridgeDirective', () => ({}));
        $provide.decorator('authService', ($delegate) => ({
          ...$delegate,
          hasAnyRole: jasmine.createSpy('hasAnyRole'),
        }));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getOrg: jasmine.createSpy('getOrg'),
          getOrgs: jasmine.createSpy('getOrgs'),
        }));
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _authService_, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        authService = _authService_;
        authService.hasAnyRole.and.returnValue(true);
        networkService = _networkService_;
        networkService.getOrg.and.returnValue($q.when(mock.orgs[0]));
        networkService.getOrgs.and.returnValue($q.when({ orgs: mock.orgs }));

        scope = $rootScope.$new();
        scope.orgs = { orgs: mock.orgs };
        scope.editableOrgs = [];

        el = angular.element('<chpl-onc-organizations all-orgs="orgs" key="\'orgs\'" editable-orgs="editableOrgs"></chpl-onc-organizations>');

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
    });
  });
})();
