(() => {
  describe('the CHPL Listing component', () => {
    let $compile;
    let $log;
    let authService;
    let ctrl;
    let el;
    let featureFlags;
    let scope;

    const mock = {};
    mock.activity = {};
    mock.listing = {
      certificationEdition: {
        name: '2015',
      },
      chplProductNumberHistory: [],
      developer: {
        developerId: 'id',
      },
    };
    mock.productId = 123123;
    mock.products = [{ developer: 'Developer', product: 'Product' }];

    beforeEach(() => {
      angular.mock.module('chpl.listing', ($provide) => {
        $provide.factory('chplListingHistoryBridgeDirective', () => ({}));
        $provide.decorator('authService', ($delegate) => ({
          ...$delegate,
          hasAnyRole: jasmine.createSpy('hasAnyRole'),
        }));
        $provide.decorator('featureFlags', ($delegate) => ({
          ...$delegate,
          isOn: jasmine.createSpy('isOn'),
        }));
      });
      inject((_$compile_, _$log_, $rootScope, _authService_, _featureFlags_) => {
        $compile = _$compile_;
        $log = _$log_;
        authService = _authService_;
        authService.hasAnyRole.and.returnValue(false);
        featureFlags = _featureFlags_;
        featureFlags.isOn.and.returnValue(false);

        scope = $rootScope.$new();
        scope.listing = mock.listing;

        el = angular.element('<chpl-listing listing="listing"></chpl-listing>');

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

    describe('controller', () => {
      it('should exist', () => {
        expect(ctrl).toBeDefined();
      });

      describe('with respect to editing', () => {
        beforeEach(() => {
          ctrl.listing = {
            certificationEdition: {
              name: '2015',
            },
          };
          ctrl.$state.current.name = 'listing';
        });

        it('should not allow anonymous users to edit', () => {
          expect(ctrl.canEdit()).toBe(false);
        });

        it('should allow ADMIN to edit', () => {
          authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_ADMIN') >= 0);
          expect(ctrl.canEdit()).toBe(true);
        });

        it('should allow ONC to edit', () => {
          authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_ONC') >= 0);
          expect(ctrl.canEdit()).toBe(true);
        });

        it('should allow ACB to edit', () => {
          authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_ACB') >= 0);
          expect(ctrl.canEdit()).toBe(true);
        });

        it('should not allow ATL to edit', () => {
          authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_ATL') >= 0);
          expect(ctrl.canEdit()).toBe(false);
        });

        it('should not allow CMS to edit', () => {
          authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_CMS_STAFF') >= 0);
          expect(ctrl.canEdit()).toBe(false);
        });

        it('should not allow DEVELOPER to edit', () => {
          authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_DEVELOPER') >= 0);
          expect(ctrl.canEdit()).toBe(false);
        });

        describe('2014 listings', () => {
          beforeEach(() => {
            ctrl.listing = {
              certificationEdition: {
                name: '2014',
              },
            };
          });

          it('should allow ADMIN to edit', () => {
            authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_ADMIN') >= 0);
            expect(ctrl.canEdit()).toBe(true);
          });

          it('should allow ONC to edit', () => {
            authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_ONC') >= 0);
            expect(ctrl.canEdit()).toBe(true);
          });

          it('should not allow ACB to edit 2014 Edition', () => {
            authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_ACB') >= 0);
            expect(ctrl.canEdit()).toBe(false);
          });

          it('should allow ACB to edit non-2014 Edition', () => {
            ctrl.listing.certificationEdition.name = '2015';
            authService.hasAnyRole.and.callFake((roles) => roles.indexOf('ROLE_ACB') >= 0);
            expect(ctrl.canEdit()).toBe(true);
          });
        });
      });
    });
  });
})();
