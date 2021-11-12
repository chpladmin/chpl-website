(() => {
  describe('the Developer View component', () => {
    let $compile;
    let $log;
    let $q;
    let $rootScope;
    let $state;
    let authService;
    let ctrl;
    let el;
    let networkService;
    let scope;
    let toaster;

    const mock = {
      acbs: [
        { name: 'an acb' },
      ],
      developer: {
        developerId: 636,
        developerCode: '1635',
        name: 'Hyland Software,  Inc.',
        website: 'https://www.onbase.com/',
        address: {
          addressId: 177, line1: '28500 Clemens Road', line2: null, city: 'Westlake', state: 'OH', zipcode: '44145', country: 'USA',
        },
        contact: {
          contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor',
        },
        lastModifiedDate: null,
        deleted: null,
        transparencyAttestations: [],
        products: [{
          name: 'a product',
        }],
        statusEvents: [{
          id: null, developerId: 636, status: { id: 1, status: 'Active' }, statusDate: 1459484375763, reason: null,
        }],
        status: { id: 1, status: 'Active' },
      },
      stateParams: {
        developerId: 22,
      },
      users: [{ id: 1 }],
    };

    beforeEach(() => {
      angular.mock.module('chpl.organizations', ($provide) => {
        $provide.factory('$stateParams', () => mock.stateParams);
        $provide.factory('chplProductsDirective', () => ({}));
        $provide.factory('chplChangeRequestsWrapperBridgeDirective', () => ({}));
        $provide.factory('chplUsersBridgeDirective', () => ({}));
        $provide.decorator('authService', ($delegate) => ({
          ...$delegate,
          canManageDeveloper: jasmine.createSpy('canManageDeveloper'),
          hasAnyRole: jasmine.createSpy('hasAnyRole'),
        }));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getAcbs: jasmine.createSpy('getAcbs'),
          getDeveloper: jasmine.createSpy('getDeveloper'),
          getDirectReviews: jasmine.createSpy('getDirectReviews'),
          getSearchOptions: jasmine.createSpy('getSearchOptions'),
          getUsersAtDeveloper: jasmine.createSpy('getUsersAtDeveloper'),
          inviteUser: jasmine.createSpy('inviteUser'),
          removeUserFromDeveloper: jasmine.createSpy('removeUserFromDeveloper'),
          submitChangeRequest: jasmine.createSpy('submitChangeRequest'),
        }));
      });
      inject((_$compile_, _$log_, _$q_, _$rootScope_, _$state_, _authService_, _networkService_, _toaster_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        $rootScope = _$rootScope_;
        $state = _$state_;
        authService = _authService_;
        authService.canManageDeveloper.and.returnValue(true);
        authService.hasAnyRole.and.returnValue(true);
        networkService = _networkService_;
        networkService.getAcbs.and.returnValue($q.when({ acbs: mock.acbs }));
        networkService.getDeveloper.and.returnValue($q.when(mock.developer));
        networkService.getDirectReviews.and.returnValue($q.when([]));
        networkService.getUsersAtDeveloper.and.returnValue($q.when({ users: mock.users }));
        networkService.getSearchOptions.and.returnValue($q.when([]));
        networkService.inviteUser.and.returnValue($q.when({}));
        networkService.removeUserFromDeveloper.and.returnValue($q.when({}));
        networkService.submitChangeRequest.and.returnValue($q.when({}));
        toaster = _toaster_;

        scope = $rootScope.$new();
        scope.acbs = { acbs: mock.acbs };
        scope.developer = mock.developer;

        el = angular.element('<chpl-developer-view allowed-acbs="acbs" developer="developer"></chpl-developer-view>');

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

      describe('during initialization', () => {
        it('should get data', () => {
          expect(networkService.getDirectReviews.calls.count()).toBe(1);
          expect(networkService.getDirectReviews).toHaveBeenCalledWith(636);
          expect(networkService.getSearchOptions.calls.count()).toBe(1);
          expect(networkService.getUsersAtDeveloper).toHaveBeenCalledWith(22);
          expect(networkService.getUsersAtDeveloper.calls.count()).toBe(1);
        });

        describe('of direct reviews', () => {
          it('should set status on success', () => {
            networkService.getDirectReviews.and.returnValue($q.when([1, 2]));
            ctrl.drStatus = 'unknown';
            ctrl.$onInit();
            scope.$digest();
            expect(ctrl.drStatus).toBe('success');
            expect(ctrl.directReviews).toEqual([1, 2]);
          });

          it('should set status on success', () => {
            const response = $q.defer();
            networkService.getDirectReviews.and.returnValue(response.promise);
            ctrl.drStatus = 'unknown';
            ctrl.directReviews = undefined;
            response.reject();
            ctrl.$onInit();
            scope.$digest();
            expect(ctrl.drStatus).toBe('error');
            expect(ctrl.directReviews).toBeUndefined();
          });
        });
      });

      describe('on log in', () => {
        it('should refresh data', () => {
          const initCount = {
            getSearchOptions: networkService.getSearchOptions.calls.count(),
            getUsersAtDeveloper: networkService.getUsersAtDeveloper.calls.count(),
          };
          $rootScope.$broadcast('loggedIn');
          expect(networkService.getSearchOptions.calls.count()).toBe(initCount.getSearchOptions);
          expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount.getUsersAtDeveloper + 1);
        });
      });

      describe('when cleaning up', () => {
        it('should clean up hooks', () => {
          const initCount = {
            getSearchOptions: networkService.getSearchOptions.calls.count(),
            getUsersAtDeveloper: networkService.getUsersAtDeveloper.calls.count(),
          };
          ctrl.$onDestroy();
          $rootScope.$broadcast('loggedIn');
          expect(networkService.getSearchOptions.calls.count()).toBe(initCount.getSearchOptions);
          expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount.getUsersAtDeveloper);
        });
      });

      describe('with respect to user action callbacks', () => {
        it('should handle delete', () => {
          const initCount = networkService.getUsersAtDeveloper.calls.count();
          ctrl.takeUserAction('delete', 3);
          scope.$digest();
          expect(networkService.removeUserFromDeveloper).toHaveBeenCalledWith(3, 22);
          expect(networkService.getUsersAtDeveloper).toHaveBeenCalledWith(22);
          expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount + 1);
        });

        xit('should handle invitation', () => {
          ctrl.takeUserAction('invite', { role: 'ROLE_DEVELOPER', email: 'fake' });
          spyOn(toaster, 'pop');
          scope.$digest();
          expect(networkService.inviteUser).toHaveBeenCalledWith({
            role: 'ROLE_DEVELOPER',
            emailAddress: 'fake',
            permissionObjectId: 22,
          });
          expect(toaster.pop).toHaveBeenCalledWith({
            type: 'success',
            title: 'Email sent',
            body: 'Email sent successfully to fake',
          });
        });

        it('should handle refresh', () => {
          const initCount = networkService.getUsersAtDeveloper.calls.count();
          ctrl.takeUserAction('refresh');
          scope.$digest();
          expect(networkService.getUsersAtDeveloper).toHaveBeenCalledWith(22);
          expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount + 1);
        });

        it('should handle impersonate', () => {
          spyOn($state, 'reload');
          ctrl.takeUserAction('impersonate');
          expect($state.reload).toHaveBeenCalled();
        });

        it('should handle edit', () => {
          ctrl.takeUserAction('edit');
          expect(ctrl.action).toBe('focusUsers');
        });

        it('should handle cancel', () => {
          ctrl.takeUserAction('cancel');
          expect(ctrl.action).toBeUndefined();
        });
      });
    });
  });
})();
