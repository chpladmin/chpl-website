(() => {
  describe('the Developer Merge component', () => {
    let $compile;
    let $log;
    let $q;
    let $state;
    let ctrl;
    let el;
    let networkService;
    let scope;
    let toaster;

    const mock = {
      developer: {},
      developers: [],
      goodResponse: {
        job: {
          jobDataMap: {
            user: {
              email: 'fake',
            },
          },
        },
        status: 200,
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.organizations', ($provide) => {
        $provide.factory('chplDeveloperBridgeDirective', () => ({}));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          mergeDevelopers: jasmine.createSpy('mergeDeveloper'),
        }));
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _$state_, _networkService_, _toaster_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        $state = _$state_;
        toaster = _toaster_;
        networkService = _networkService_;
        networkService.mergeDevelopers.and.returnValue($q.when(mock.goodResponse));

        scope = $rootScope.$new();
        scope.developer = mock.developer;
        scope.developers = { developers: mock.developers };

        el = angular.element('<chpl-developers-merge developer="developer" developers="developers"></chpl-developers-merge>');

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

    describe('template', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(ctrl).toBeDefined();
      });
    });

    describe('when a developer merge is saved', () => {
      let developer;
      beforeEach(() => {
        developer = { id: 'an id' };
        ctrl.developer = developer;
        ctrl.selectedDevelopers = [{ id: 1 }, { id: 2 }];
      });

      it('should navigate back to the developers page on a good response', () => {
        spyOn($state, 'go');
        ctrl.merge(developer);
        scope.$digest();
        expect($state.go).toHaveBeenCalledWith('organizations.developers', {}, { reload: true });
      });

      it('should pop a notice on success', () => {
        spyOn(toaster, 'pop');
        ctrl.merge(developer);
        scope.$digest();
        expect(toaster.pop).toHaveBeenCalledWith({
          type: 'success',
          title: 'Merge submitted',
          body: 'Your action has been submitted and you\'ll get an email at fake when it\'s done',
        });
      });

      it('should pass the the merging developer data to the network service', () => {
        ctrl.merge(developer);
        expect(networkService.mergeDevelopers).toHaveBeenCalledWith({
          developer,
          ids: [1, 2, 'an id'],
        });
      });
    });
  });
})();
