(() => {
  describe('the CHPL Listing edit page', () => {
    let $compile;
    let $log;
    let $q;
    let ctrl;
    let el;
    let networkService;
    let scope;

    const mock = {
      listing: {
        certificationEdition: {},
      },
      resources: {
        testStandards: {
          data: [],
        },
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.listing', ($provide) => {
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          updateCP: jasmine.createSpy('updateCP'),
        }));
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        networkService = _networkService_;
        networkService.updateCP.and.returnValue($q.when({}));

        scope = $rootScope.$new();
        scope.listing = mock.listing;
        scope.resources = mock.resources;

        el = angular.element('<chpl-listing-edit-page listing="listing" resources="resources"></chpl-listing-edit-page/>');

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

      xdescribe('when handling a save', () => {
        let listing;
        beforeEach(() => {
          listing = {
            id: 'fake',
          };
        });

        it('should set a "saving" flag', () => {
          ctrl.save(listing, 'reason');
          expect(ctrl.isSaving).toBe(true);
        });

        it('should report errors and turn off the saving flag', () => {
          networkService.updateCP.and.returnValue($q.when({ status: 400, error: 'an error' }));
          ctrl.save(listing, 'reason');
          scope.$digest();
          expect(ctrl.saveErrors.errors).toEqual(['an error']);
          expect(ctrl.isSaving).toBe(false);
        });

        it('should report errors on server data.error', () => {
          networkService.updateCP.and.returnValue($q.reject({ data: { error: 'an error' } }));
          ctrl.save(listing, 'reason');
          scope.$digest();
          expect(ctrl.saveErrors.errors).toEqual(['an error']);
          expect(ctrl.isSaving).toBe(false);
        });

        it('should report errors on server data.errorMessages', () => {
          networkService.updateCP.and.returnValue($q.reject({ data: { errorMessages: ['an error2'] } }));
          ctrl.save(listing, 'reason');
          scope.$digest();
          expect(ctrl.saveErrors.errors).toEqual(['an error2']);
          expect(ctrl.isSaving).toBe(false);
        });

        it('should report errors on server data.warningMessages', () => {
          networkService.updateCP.and.returnValue($q.reject({ data: { warningMessages: ['an error3'] } }));
          ctrl.save(listing, 'reason');
          scope.$digest();
          expect(ctrl.saveErrors.warnings).toEqual(['an error3']);
          expect(ctrl.isSaving).toBe(false);
        });

        it('should report no errors if none were returned', () => {
          networkService.updateCP.and.returnValue($q.reject({}));
          ctrl.save(listing, 'reason');
          scope.$digest();
          expect(ctrl.saveErrors.errors).toEqual([]);
          expect(ctrl.isSaving).toBe(false);
        });
      });
    });
  });
})();
