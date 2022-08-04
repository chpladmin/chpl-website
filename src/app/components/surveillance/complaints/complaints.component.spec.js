(() => {
  describe('the Complaints component', () => {
    let $compile;
    let $log;
    let $q;
    let ctrl;
    let el;
    let networkService;
    let scope;

    const allCps = [
      { id: 296, chplProductNumber: 'CHP-022218', acb: 'UL LLC' },
      { id: 4708, chplProductNumber: 'CHP-022844', acb: 'Drummond Group' },
      { id: 470, chplProductNumber: 'CHP-026059', acb: 'UL LLC' },
    ];

    const listingWithSurveillance = {
      id: 8828,
      chplProductNumber: '14.05.07.2002.EMA2.07.03.1.170831',
      surveillance: [
        {
          id: 599,
          surveillanceIdToReplace: null,
          friendlyId: 'SURV01',
          startDate: 1500004800000,
          endDate: 1517806800000,
          type: { id: 1, name: 'Reactive' },
          randomizedSitesUsed: null,
          requirements: [
            {
              id: 889,
              type: { id: 1, name: 'Certified Capability' },
              requirement: '170.314 (b)(7)',
              result: {
                id: 2,
                name: 'No Non-Conformity',
              },
              nonconformities: [],
            },
          ],
          errorMessages: [],
          warningMessages: [],
          lastModifiedDate: 1517959724664,
        },
      ],
    };

    const allComplaints = {
      results: [
        {
          id: 52,
          certificationBody: {
            id: 3,
            acbCode: '04',
            name: 'Drummond Group',
            website: 'http://www.drummondgroup.com',
            address: {
              addressId: 2,
              line1: '13359 North Hwy. 183',
              line2: 'Suite B 406-238',
              city: 'Austin',
              state: 'Texas',
              zipcode: '78750',
              country: 'USA',
            },
            retired: false,
            retirementDate: null,
          },
          complainantType: {
            id: 4,
            name: 'Government Entity',
            description: null,
          },
          complainantTypeOther: null,
          oncComplaintId: null,
          acbComplaintId: '456654',
          receivedDate: '2020-03-01',
          summary: 'test',
          actions: null,
          complainantContacted: false,
          developerContacted: false,
          oncAtlContacted: false,
          flagForOncReview: false,
          closedDate: null,
          listings: [],
          criteria: [],
          surveillances: [],
        },
      ],
    };

    beforeEach(() => {
      angular.mock.module('chpl.components', ($provide) => {
        $provide.factory('chplComplaintsWrapperBridgeDirective', () => ({}));
        $provide.factory('chplSavedFilterDirective', () => ({}));
        $provide.factory('chplFiltersDirective', () => ({}));
        $provide.factory('chplFilterDirective', () => ({}));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getCollection: jasmine.createSpy('getCollection'),
          getListingBasic: jasmine.createSpy('getListingBasic'),
          getComplaints: jasmine.createSpy('getComplaints'),
        }));
      });
      inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        networkService = _networkService_;

        networkService.getCollection.and.returnValue($q.when({ results: angular.copy(allCps) }));
        networkService.getListingBasic.and.returnValue($q.when(listingWithSurveillance));
        networkService.getComplaints.and.returnValue($q.when(allComplaints));

        scope = $rootScope.$new();

        el = angular.element('<chpl-surveillance-complaints complaint-list-type="ALL"></chpl-surveillance-complaints>');

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

      describe('on init', () => {
        it('should have fetched all listings', () => {
          expect(networkService.getCollection).toHaveBeenCalled();
          expect(ctrl.listings.length).toBe(3);
        });
      });

      it('should be able to fetch all relevant complaints', () => {
        ctrl.complaints = [];
        ctrl.refreshComplaints();
        expect(networkService.getComplaints).toHaveBeenCalled();
        scope.$digest();
        expect(ctrl.complaints.length).toBe(1);
      });
    });
  });
})();
