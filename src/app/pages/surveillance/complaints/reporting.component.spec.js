(() => {
  describe('the Complaints Reporting component', () => {
    let $compile; let $log; let $q; let ctrl; let el; let networkService; let
      scope;

    const complainantTypes = {
      data: [
        { id: 1, name: 'developer' },
        { id: 2, name: 'provider' },
      ],
    };

    const certBodies = [
      { id: 1, name: 'Drummond' },
      { id: 2, name: 'SLI' },
    ];

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
          authority: 'ROLE_ACB',
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
          receivedDate: 1562630400000,
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

    const editions = [
      { id: 3, name: '2015', description: null },
      { id: 2, name: '2014', description: null },
      { id: 1, name: '2011', description: null },
    ];

    const criteria = {
      criteria: [
        {
          id: 14, number: '170.315 (a)(14)', title: 'Implantable Device List', certificationEditionId: 3, certificationEdition: '2015', description: null,
        },
        {
          id: 39, number: '170.315 (d)(11)', title: 'Accounting of Disclosures', certificationEditionId: 3, certificationEdition: '2015', description: null,
        },
        {
          id: 104, number: '170.314 (e)(2)', title: 'Ambulatory setting only -clinical summary', certificationEditionId: 2, certificationEdition: '2014', description: null,
        },
        {
          id: 153, number: '170.304 (i)', title: 'Exchange clinical information and patient summary record', certificationEditionId: 1, certificationEdition: '2011', description: null,
        },
        {
          id: 96, number: '170.314 (d)(3)', title: 'Audit report(s)', certificationEditionId: 2, certificationEdition: '2014', description: null,
        },
      ],
    };

    beforeEach(() => {
      angular.mock.module('chpl.surveillance', ($provide) => {
        $provide.factory('chplSurveillanceComplaintsDirective', () => ({}));
        $provide.factory('chplSavedFilterDirective', () => ({}));
        $provide.factory('chplFiltersDirective', () => ({}));
        $provide.factory('chplFilterDirective', () => ({}));
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getComplainantTypes: jasmine.createSpy('getComplainantTypes'),
          getAcbs: jasmine.createSpy('getAcbs'),
          deleteComplaint: jasmine.createSpy('deleteComplaint'),
          updateComplaint: jasmine.createSpy('updateComplaint'),
          createComplaint: jasmine.createSpy('createComplaint'),
          getCollection: jasmine.createSpy('getCollection'),
          getEditions: jasmine.createSpy('getEditions'),
          getCriteria: jasmine.createSpy('getCriteria'),
          getListingBasic: jasmine.createSpy('getListingBasic'),
          getComplaints: jasmine.createSpy('getComplaints'),
        }));
      });
      inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        networkService = _networkService_;

        networkService.getComplainantTypes.and.returnValue($q.when(complainantTypes));
        networkService.getAcbs.and.returnValue($q.when(certBodies));
        networkService.getEditions.and.returnValue($q.when(editions));
        networkService.getCriteria.and.returnValue($q.when(criteria));
        networkService.deleteComplaint.and.returnValue($q.when({ status: 200 }));
        networkService.updateComplaint.and.returnValue($q.when(allComplaints[0]));
        networkService.createComplaint.and.returnValue($q.when(allComplaints[0]));
        networkService.getCollection.and.returnValue($q.when({ results: angular.copy(allCps) }));
        networkService.createComplaint.and.returnValue($q.when(allComplaints[0]));
        networkService.getListingBasic.and.returnValue($q.when(listingWithSurveillance));
        networkService.getComplaints.and.returnValue($q.when(allComplaints));

        scope = $rootScope.$new();

        el = angular.element('<chpl-complaints-reporting></chpl-complaints-reporting>');

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
