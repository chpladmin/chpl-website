(() => {
  describe('the Confirm Listings component', () => {
    let $compile;
    let $log;
    let $q;
    let $uibModal;
    let Mock;
    let actualOptions;
    let authService;
    let ctrl;
    let el;
    let networkService;
    let scope;

    const mock = {
      developers: [1, 2],
      resources: { id: 1 },
      pendingListings: {
        id: 4459,
        chplProductNumber: '15.07.07.1447.t123.v1.00.1.180707',
        developer: {
          developerId: 448, developerCode: null, name: 'Epic Systems Corporation', website: null, address: null, contact: null, lastModifiedDate: null, deleted: null, statusEvents: [], status: null,
        },
        product: {
          productId: null, name: 'New product', reportFileLocation: null, contact: null, owner: null, ownerHistory: [], lastModifiedDate: null,
        },
        version: {
          versionId: null, version: 'testV1', details: null, lastModifiedDate: null,
        },
        certificationDate: 1530936000000,
        errorCount: 1,
        warningCount: 76,
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.administration', ($provide) => {
        $provide.decorator('authService', ($delegate) => ({
          ...$delegate,
          hasAnyRole: jasmine.createSpy('hasAnyRole'),
        }));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getPendingListings: jasmine.createSpy('getPendingListings'),
          getPendingListingById: jasmine.createSpy('getPendingListingById'),
        }));
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _authService_, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        Mock = _Mock_;
        $uibModal = _$uibModal_;
        spyOn($uibModal, 'open').and.callFake((options) => {
          actualOptions = options;
          return Mock.fakeModal;
        });
        authService = _authService_;
        authService.hasAnyRole.and.returnValue(true);
        networkService = _networkService_;
        networkService.getPendingListings.and.returnValue($q.when([]));
        networkService.getPendingListingById.and.returnValue($q.when(mock.pendingListing));

        scope = $rootScope.$new();
        scope.developers = mock.developers;
        scope.resources = mock.resources;

        el = angular.element('<chpl-confirm-listings developers="developers" resources="resources"></chpl-confirm-listings>');

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

      describe('when loading', () => {
        it('shouldn\'t change anything that shouldn\'t change', () => {
          // save old state
          const { developers } = ctrl;
          const { resources } = ctrl;

          // make changes
          ctrl.$onChanges({});

          // assert
          expect(developers).toBe(ctrl.developers);
          expect(resources).toBe(ctrl.resources);
        });
      });

      describe('when inspecting a pending Listing', () => {
        let listingInspectOptions;
        beforeEach(() => {
          listingInspectOptions = {
            templateUrl: 'chpl.components/listing/inspect/inspect.html',
            controller: 'InspectController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            resolve: {
              beta: jasmine.any(Function),
              developers: jasmine.any(Function),
              inspectingCp: jasmine.any(Function),
              isAcbAdmin: jasmine.any(Function),
              isChplAdmin: jasmine.any(Function),
              resources: jasmine.any(Function),
            },
            size: 'lg',
          };
        });

        it('should create a modal instance when a Listing is to be edited', () => {
          expect(ctrl.modalInstance).toBeUndefined();
          ctrl.inspectListing({});
          expect(ctrl.modalInstance).toBeDefined();
        });

        it('should resolve elements on inspect', () => {
          ctrl.inspectListing(2);
          expect($uibModal.open).toHaveBeenCalledWith(listingInspectOptions);
          expect(actualOptions.resolve.developers()).toEqual(mock.developers);
          expect(actualOptions.resolve.resources()).toEqual(mock.resources);
          scope.$digest();
        });

        it('should add a new developer if one was created', () => {
          const result = {
            status: 'confirmed',
            developerCreated: true,
            listing: { developer: { id: 'new' } },
          };
          ctrl.inspectListing(1);
          ctrl.modalInstance.close(result);
          expect(ctrl.developers.length).toBe(3);
        });

        it('should report the user who did something on resolved', () => {
          const result = {
            status: 'resolved',
            objectId: 'id',
            contact: {
              fullName: 'fname',
            },
          };
          ctrl.inspectListing(1);
          ctrl.modalInstance.close(result);
          expect(ctrl.uploadedListingsMessages[0]).toEqual('Product with ID: "id" has already been resolved by "fname"');
        });
      });
    });
  });
})();
