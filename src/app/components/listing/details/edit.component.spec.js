(() => {
  describe('the Listing Details Edit component', () => {
    let $compile;
    let $log;
    let Mock;
    let ctrl;
    let el;
    let networkService;
    let scope;

    const mock = {};
    mock.listing = {
      certificationResults: [],
      certificationEdition: { name: '2015' },
      certificationEvents: [
        { eventDate: 1498622400000, certificationStatusId: 1, status: { name: 'Active' } },
      ],
      certifyingBody: [],
      cqmResults: [],
      chplProductNumber: 'CHP-123123',
      classificationType: [],
      ics: { inherits: false },
      practiceType: [],
      product: { id: 1 },
      qmsStandards: [
        { id: 1, qmsStandardName: 'name1' },
        { id: null, qmsStandardName: 'nullname' },
      ],
      targetedUsers: [],
    };
    mock.relatedListings = [{ id: 1, edition: '2015' }, { id: 2, edition: '2014' }];
    mock.resources = {
      accessibilityStandards: [],
      qmsStandards: [],
      targetedUsers: { data: [] },
      testStandards: { data: [] },
    };

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.components', ($provide) => {
        $provide.factory('aiSedDirective', () => ({}));
        $provide.factory('chplCertificationCriteriaDirective', () => ({}));
        $provide.factory('chplCriteriaBridgeDirective', () => ({}));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getRelatedListings: jasmine.createSpy('getRelatedListings'),
          getSurveillanceLookups: jasmine.createSpy('getSurveillanceLookups'),
        }));
      });

      inject((_$compile_, _$log_, $q, $rootScope, _Mock_, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        Mock = _Mock_;
        networkService = _networkService_;
        networkService.getRelatedListings.and.returnValue($q.when(mock.relatedListings));
        networkService.getSurveillanceLookups.and.returnValue($q.when({}));

        scope = $rootScope.$new();
        [, scope.listing] = Mock.fullListings;
        scope.listing.sed = { testTasks: [], ucdProcesses: [] };
        scope.resources = mock.resources;

        el = angular.element('<chpl-listing-details-edit listing="listing" resources="resources"></chpl-listing-details-edit>');

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
          el = angular.element('<chpl-listing-details-edit listing="listing" initial-panel="none" resources="resources"></chpl-listing-details-edit>');
          $compile(el)(scope);
          scope.$digest();
          ctrl = el.isolateScope().$ctrl;
          expect(ctrl.panelShown).toBeUndefined();
        });

        it('should be able to be open to surveillance', () => {
          el = angular.element('<chpl-listing-details-edit listing="listing" initial-panel="surveillance" resources="resources"></chpl-listing-details-edit>');
          $compile(el)(scope);
          scope.$digest();
          ctrl = el.isolateScope().$ctrl;
          expect(ctrl.panelShown).toBe('surveillance');
        });
      });

      describe('when dealing with ics family', () => {
        beforeEach(() => {
          scope.listing = mock.listing;

          el = angular.element('<chpl-listing-details-edit listing="listing" resources="resources"></chpl-listing-details-edit>');

          $compile(el)(scope);
          scope.$digest();
          ctrl = el.isolateScope().$ctrl;
        });

        it('should call the common service to get related listings', () => {
          expect(networkService.getRelatedListings).toHaveBeenCalled();
        });

        it('should load the related listings on load, without the 2014 ones', () => {
          expect(ctrl.relatedListings).toEqual([mock.relatedListings[0]]);
        });

        it('should build an icsParents object if the Listing doesn\'t come with one', () => {
          expect(ctrl.listing.ics.parents).toEqual([]);
        });

        it('should not load family if the listing is 2014', () => {
          const callCount = networkService.getRelatedListings.calls.count();
          const cp = angular.copy(mock.listing);
          cp.certificationEdition = { name: '2014' };
          scope.listing = cp;

          el = angular.element('<chpl-listing-details-edit listing="listing" resources="resources"></chpl-listing-details-edit>');

          $compile(el)(scope);
          scope.$digest();
          ctrl = el.isolateScope().$ctrl;
          expect(networkService.getRelatedListings.calls.count()).toBe(callCount);
        });

        it('should not load family if the product has no id', () => {
          const callCount = networkService.getRelatedListings.calls.count();
          const cp = angular.copy(mock.listing);
          cp.product = { id: undefined };
          scope.listing = cp;

          el = angular.element('<chpl-listing-details-edit listing="listing" resources="resources"></chpl-listing-details-edit>');

          $compile(el)(scope);
          scope.$digest();
          ctrl = el.isolateScope().$ctrl;
          expect(networkService.getRelatedListings.calls.count()).toBe(callCount);
        });

        it('should not load family if the product does not exist', () => {
          const callCount = networkService.getRelatedListings.calls.count();
          const cp = angular.copy(mock.listing);
          cp.product = undefined;
          scope.listing = cp;

          el = angular.element('<chpl-listing-details-edit listing="listing" resources="resources"></chpl-listing-details-edit>');

          $compile(el)(scope);
          scope.$digest();
          ctrl = el.isolateScope().$ctrl;
          expect(networkService.getRelatedListings.calls.count()).toBe(callCount);
        });

        describe('with respect to missing ICS source', () => {
          it('should not require ics source for 2014 listings', () => {
            ctrl.listing.certificationEdition.name = '2014';
            expect(ctrl.missingIcsSource()).toBe(false);
          });

          it('should not require ics source if the listing does not inherit', () => {
            expect(ctrl.missingIcsSource()).toBe(false);
          });

          it('should require ics source if the listing inherits without parents', () => {
            ctrl.listing.ics.inherits = true;
            expect(ctrl.missingIcsSource()).toBe(true);
          });

          it('should require ics source if the listing inherits without parents and without space for parents', () => {
            ctrl.listing.ics.inherits = true;
            ctrl.listing.ics.parents = [];
            expect(ctrl.missingIcsSource()).toBe(true);
          });

          it('should not require ics source if the listing inherits and has parents', () => {
            ctrl.listing.ics.inherits = true;
            ctrl.listing.ics.parents = [1, 2];
            expect(ctrl.missingIcsSource()).toBe(false);
          });
        });
      });
    });
  });
})();
