(() => {
  describe('the Listing Edit component', () => {
    let $compile;
    let $log;
    let authService;
    let ctrl;
    let el;
    let scope;
    let utilService;

    const mock = {};
    mock.listing = {
      accessibilityStandards: [],
      certificationEdition: { name: '2015' },
      certificationEvents: [
        { eventDate: 1498622400000, certificationStatusId: 1, status: { name: 'Active' } },
      ],
      certifyingBody: [],
      chplProductNumber: 'CHP-123123',
      classificationType: [],
      ics: { inherits: false, parents: [] },
      practiceType: [],
      product: { productId: 1 },
      qmsStandards: [
        { id: 1, qmsStandardName: 'name1' },
        { id: null, qmsStandardName: 'nullname' },
      ],
      targetedUsers: [],
      testingLabs: [],
    };
    mock.resources = {
      accessibilityStandards: {
        data: [
          { id: 1, name: 'name1' },
        ],
      },
      bodies: [{ id: 1, name: 'name1' }, { id: 2, name: 'name2' }],
      classifications: [{ id: 1, name: 'name1' }],
      practices: [{ id: 1, name: 'name1' }],
      qmsStandards: {
        data: [
          { id: 1, name: 'name1' },
          { id: 2, name: 'name2' },
        ],
      },
      testStandards: {
        data: [
          { id: 1, name: 'name1', year: 2014 },
          { id: 2, name: 'name2', year: 2015 },
        ],
      },
      statuses: [{ id: 1, name: 'name1' }],
      testingLabs: [{ id: 1, name: 'name1' }],
    };

    beforeEach(() => {
      angular.mock.module('chpl.components', ($provide) => {
        $provide.decorator('authService', ($delegate) => ({
          ...$delegate,
          hasAnyRole: jasmine.createSpy('hasAnyRole'),
        }));
        $provide.decorator('utilService', ($delegate) => ({
          ...$delegate,
          certificationStatusWhenEditing: jasmine.createSpy('certificationStatusWhenEditing'),
          extendSelect: jasmine.createSpy('extendSelect'),
        }));
      });

      inject((_$compile_, _$controller_, _$log_, $rootScope, _authService_, _utilService_) => {
        $compile = _$compile_;
        $log = _$log_;
        authService = _authService_;
        authService.hasAnyRole.and.returnValue(true);
        utilService = _utilService_;
        utilService.certificationStatusWhenEditing.and.returnValue('Active');
        utilService.extendSelect.and.returnValue([]);

        scope = $rootScope.$new();
        scope.listing = angular.copy(mock.listing);
        scope.onChange = jasmine.createSpy('onChange');
        scope.resources = angular.copy(mock.resources);
        scope.workType = 'edit';

        el = angular.element('<chpl-listing-edit listing="listing" on-change="onChange(listing, messages, reason)" resources="resources" work-type="workType"></chpl-listing-edit>');

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

    it('should exist', () => {
      expect(ctrl).toBeDefined();
    });

    it('should not create parents if they exist', () => {
      const cp = angular.copy(mock.listing);
      cp.ics.parents = [{ name: 'a parent' }];
      scope.listing = cp;

      el = angular.element('<chpl-listing-edit listing="listing" on-change="onChange(listing, messages, reason)" resources="resources" work-type="workType"></chpl-listing-edit>');

      $compile(el)(scope);
      scope.$digest();
      ctrl = el.isolateScope().$ctrl;
      expect(ctrl.listing.ics.parents).toEqual([{ name: 'a parent' }]);
    });

    it('should break the parts of the product number apart if it\'s the new style', () => {
      const cp = angular.copy(mock.listing);
      cp.chplProductNumber = '15.07.07.2713.CQ01.02.00.1.170331';
      scope.listing = cp;

      el = angular.element('<chpl-listing-edit listing="listing" on-change="onChange(listing, messages, reason)" resources="resources" work-type="workType"></chpl-listing-edit>');

      $compile(el)(scope);
      scope.$digest();
      ctrl = el.isolateScope().$ctrl;

      expect(ctrl.idFields).toEqual({
        prefix: '15.07.07.2713',
        prod: 'CQ01',
        ver: '02',
        ics: '00',
        suffix: '1.170331',
      });
    });

    xit('should attach the model for the select boxes', () => {
      ctrl.listing.practiceType = { id: 1 };
      ctrl.listing.classificationType = { id: 1 };
      ctrl.listing.certifyingBody = { id: 2 };
      ctrl.listing.certificationStatus = { id: 1 };
      ctrl.attachModel();
      expect(ctrl.listing.practiceType).toEqual(mock.resources.practices[0]);
      expect(ctrl.listing.classificationType).toEqual(mock.resources.classifications[0]);
      expect(ctrl.listing.certifyingBody).toEqual(mock.resources.bodies[1]);
      expect(ctrl.listing.testingLab).not.toEqual(mock.resources.testingLabs[0]);
      ctrl.listing.testingLab = { id: 1 };
      ctrl.attachModel();
      expect(ctrl.listing.testingLab).toEqual(mock.resources.testingLabs[0]);
    });

    describe('when saving a Listing', () => {
      it('should combine values to make the chpl product number if required', () => {
        ctrl.listing.chplProductNumber = '15.04.04.2879.Your.09.2.1.170530';
        ctrl.idFields = {
          prefix: '14.03.03.2879',
          prod: 'prod',
          ver: 'vr',
          ics: '02',
          suffix: '0.140303',
        };
        ctrl.update();
        expect(ctrl.listing.chplProductNumber).toBe('14.03.03.2879.prod.vr.02.0.140303');
      });

      it('should add date longs from the date objects', () => {
        const aDate = new Date('1/1/2009');
        const dateValue = aDate.getTime();
        ctrl.listing.certificationEvents = [
          {
            status: { name: 'Active' },
            statusDateObject: aDate,
          },
        ];
        ctrl.update();
        expect(ctrl.listing.certificationEvents[0].eventDate).toBe(dateValue);
      });

      describe('that is pending', () => {
        xit('should close it\'s modal with the current Listing', () => {
          ctrl.workType = 'confirm';
          ctrl.save();
        });
      });
    });

    describe('when handling certification status history', () => {
      it('should add statusEventObjects for each statusDate in history', () => {
        const aDate = new Date(1498622400000);
        expect(ctrl.listing.certificationEvents[0].statusDateObject).toEqual(aDate);
      });

      it('should know when the "earliest" status is not "Active"', () => {
        ctrl.listing.currentStatus = { status: { name: 'something' } };
        ctrl.listing.certificationEvents = [
          { statusDateObject: new Date('1/1/2018'), status: { name: 'Withdrawn by Developer' } },
          { statusDateObject: new Date('2/2/2018'), status: { name: 'Active' } },
        ];
        expect(ctrl.improperFirstStatus()).toBe(true);
        ctrl.listing.certificationEvents[1].statusDateObject = new Date('1/1/2017');
        expect(ctrl.improperFirstStatus()).toBe(false);
      });

      it('should leverage the util service to get the status', () => {
        const count = utilService.certificationStatusWhenEditing.calls.count();
        const status = ctrl.certificationStatusWhenEditing(mock.listing);
        expect(status).toBe('Active');
        expect(utilService.certificationStatusWhenEditing.calls.count()).toBe(count + 1);
      });
    });

    describe('when validating the form', () => {
      it('should know when two status events were on the same day', () => {
        ctrl.listing.certificationEvents = [
          {
            status: { name: 'Active' },
            statusDateObject: new Date('1/1/2009'),
          }, {
            status: { name: 'Suspended by ONC' },
            statusDateObject: new Date('1/1/2009'),
          },
        ];
        expect(ctrl.hasDateMatches()).toBe(true);
        ctrl.listing.certificationEvents[0].statusDateObject = new Date('2/2/2002');
        expect(ctrl.hasDateMatches()).toBe(false);
      });

      it('should know when two status events are the same and consecutive', () => {
        ctrl.listing.certificationEvents = [
          {
            status: { name: 'Active' },
            statusDateObject: new Date('1/1/2009'),
          }, {
            status: { name: 'Active' },
            statusDateObject: new Date('2/2/2009'),
          },
        ];
        expect(ctrl.hasStatusMatches()).toBe(true);
        ctrl.listing.certificationEvents[0].status.name = 'Suspended by ONC';
        expect(ctrl.hasStatusMatches()).toBe(false);
      });

      describe('with respect to ics code calculations', () => {
        it('should expect the code to be 00 if no parents', () => {
          ctrl.listing.ics.parents = [];
          expect(ctrl.requiredIcsCode()).toBe('00');
        });

        it('should expect the code to be 1 if one parent and parent has ICS 00', () => {
          ctrl.listing.ics.parents = [{ chplProductNumber: '15.07.07.2713.CQ01.02.00.1.170331' }];
          expect(ctrl.requiredIcsCode()).toBe('01');
        });

        it('should expect the code to be 1 if two parents and parents have ICS 00', () => {
          ctrl.listing.ics.parents = [
            { chplProductNumber: '15.07.07.2713.CQ01.02.00.1.170331' },
            { chplProductNumber: '15.07.07.2713.CQ01.02.00.1.170331' },
          ];
          expect(ctrl.requiredIcsCode()).toBe('01');
        });

        it('should expect the code to be 2 if two parents and parents have ICS 01', () => {
          ctrl.listing.ics.parents = [
            { chplProductNumber: '15.07.07.2713.CQ01.02.01.1.170331' },
            { chplProductNumber: '15.07.07.2713.CQ01.02.01.1.170331' },
          ];
          expect(ctrl.requiredIcsCode()).toBe('02');
        });

        it('should expect the code to be 3 if two parents and parents have ICS 01,02', () => {
          ctrl.listing.ics.parents = [
            { chplProductNumber: '15.07.07.2713.CQ01.02.01.1.170331' },
            { chplProductNumber: '15.07.07.2713.CQ01.02.02.1.170331' },
          ];
          expect(ctrl.requiredIcsCode()).toBe('03');
        });

        it('should expect the code to be 10 if two parents and parents have ICS 03,09', () => {
          ctrl.listing.ics.parents = [
            { chplProductNumber: '15.07.07.2713.CQ01.02.09.1.170331' },
            { chplProductNumber: '15.07.07.2713.CQ01.02.03.1.170331' },
          ];
          expect(ctrl.requiredIcsCode()).toBe('10');
        });

        it('should expect the code to be 18 if two parents and parents have ICS 17,11', () => {
          ctrl.listing.ics.parents = [
            { chplProductNumber: '15.07.07.2713.CQ01.02.17.1.170331' },
            { chplProductNumber: '15.07.07.2713.CQ01.02.11.1.170331' },
          ];
          expect(ctrl.requiredIcsCode()).toBe('18');
        });
      });
    });
  });
})();
