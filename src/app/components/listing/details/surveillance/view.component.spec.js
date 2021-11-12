(() => {
  describe('the surveillance component', () => {
    let $log;
    let $q;
    let $uibModal;
    let Mock;
    let actualOptions;
    let ctrl;
    let el;
    let networkService;
    let scope;

    beforeEach(() => {
      angular.mock.module('chpl.components', 'chpl.mock', ($provide) => {
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getListing: jasmine.createSpy('getListing'),
          getSurveillanceLookups: jasmine.createSpy('getSurveillanceLookups'),
        }));
      });

      inject(($compile, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _networkService_) => {
        $q = _$q_;
        $log = _$log_;
        networkService = _networkService_;
        networkService.getListing.and.returnValue($q.when({}));
        networkService.getSurveillanceLookups.and.returnValue($q.when({}));
        Mock = _Mock_;
        $uibModal = _$uibModal_;
        spyOn($uibModal, 'open').and.callFake((options) => {
          actualOptions = options;
          return Mock.fakeModal;
        });

        el = angular.element('<ai-surveillance certified-product="listing"></ai-surveillance>');

        scope = $rootScope.$new();
        [, scope.listing] = Mock.fullListings;
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

    it('should be compiled', () => {
      expect(el.html()).not.toEqual(null);
    });

    it('should have isolate scope object with instanciate members', () => {
      expect(ctrl).toEqual(jasmine.any(Object));
    });

    it('should be able to determine if Non-confirmity Type is removed', () => {
      ctrl.surveillanceTypes = Mock.surveillanceData;
      let removed = ctrl.isNonconformityTypeRemoved('170.523 (k)(1)');
      expect(removed).toBeFalse();
      removed = ctrl.isNonconformityTypeRemoved('170.523 (k)(2)');
      expect(removed).toBeTrue();
    });

    it('should be able to determine if Requirement is removed', () => {
      ctrl.surveillanceTypes = Mock.surveillanceData;
      let removed = ctrl.isRequirementRemoved('170.523 (k)(1)');
      expect(removed).toBeFalse();
      removed = ctrl.isRequirementRemoved('170.523 (k)(2)');
      expect(removed).toBeTrue();
    });

    describe('surveillance titles', () => {
      it('should come up with correct titles when there were no NCs', () => {
        const surv = {
          endDay: '2016-03-30',
          requirements: [{ nonconformities: [] }],
        };
        expect(ctrl.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: No Non-Conformities Were Found');
      });

      it('should come up with correct titles when there was 1 open NC', () => {
        const surv = {
          endDay: '2016-03-30',
          requirements: [{ nonconformities: [{ status: { name: 'Open' } }] }],
        };
        expect(ctrl.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 1 Open Non-Conformity Was Found');
      });

      it('should come up with correct titles when there were multiple open NCs', () => {
        const surv = {
          endDay: '2016-03-30',
          requirements: [{ nonconformities: [{ status: { name: 'Open' } }] }, { nonconformities: [{ status: { name: 'Open' } }] }],
        };
        expect(ctrl.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 2 Open Non-Conformities Were Found');
      });

      it('should come up with correct titles when there was 1 closed NC', () => {
        const surv = {
          endDay: '2016-03-30',
          requirements: [{ nonconformities: [{ status: { name: 'Closed' } }] }],
        };
        expect(ctrl.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 1 Closed Non-Conformity Was Found');
      });

      it('should come up with correct titles when there were multiple closed NCs', () => {
        const surv = {
          endDay: '2016-03-30',
          requirements: [{ nonconformities: [{ status: { name: 'Closed' } }] }, { nonconformities: [{ status: { name: 'Closed' } }] }],
        };
        expect(ctrl.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 2 Closed Non-Conformities Were Found');
      });

      it('should come up with correct titles when there were open and closed NCs', () => {
        const surv = {
          endDay: '2016-03-30',
          requirements: [{ nonconformities: [{ status: { name: 'Open' } }] }, { nonconformities: [{ status: { name: 'Closed' } }] }],
        };
        expect(ctrl.getTitle(surv)).toEqual('Closed Surveillance, Ended Mar 30, 2016: 1 Open and 1 Closed Non-Conformities Were Found');
      });
    });

    describe('editing a Surveillance', () => {
      let surveillanceEditOptions;
      beforeEach(() => {
        surveillanceEditOptions = {
          component: 'aiSurveillanceEdit',
          animation: false,
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          resolve: {
            surveillance: jasmine.any(Function),
            surveillanceTypes: jasmine.any(Function),
            workType: jasmine.any(Function),
          },
        };
        ctrl.surveillanceTypes = {
          surveillanceRequirements: {
            criteriaOptions2014: {},
            criteriaOptions2015: {},
          },
        };
        ctrl.certifiedProduct = {
          id: 1,
          certificationEdition: {
            name: '2015',
          },
        };
      });

      it('should create a modal instance when a Surveillance is to be edited', () => {
        expect(ctrl.uibModalInstance).toBeUndefined();
        ctrl.editSurveillance(Mock.surveillances[0]);
        expect(ctrl.uibModalInstance).toBeDefined();
      });

      it('should resolve elements on edit', () => {
        ctrl.editSurveillance(Mock.surveillances[0]);
        expect($uibModal.open).toHaveBeenCalledWith(surveillanceEditOptions);
        expect(actualOptions.resolve.surveillance()).toEqual(Mock.surveillances[0]);
        expect(actualOptions.resolve.surveillanceTypes()).toEqual({
          surveillanceRequirements: {
            criteriaOptions2014: {},
            criteriaOptions2015: {},
            criteriaOptions: {},
          },
        });
        expect(actualOptions.resolve.workType()).toEqual('edit');
      });

      it('should do stuff with the returned data', () => {
        ctrl.editSurveillance(Mock.surveillances[0]);
        ctrl.uibModalInstance.close({});
        expect(networkService.getListing).toHaveBeenCalled();
      });

      it('should log a non-cancelled modal', () => {
        const logCount = $log.info.logs.length;
        ctrl.editSurveillance(Mock.surveillances[0]);
        ctrl.uibModalInstance.dismiss('not cancelled');
        expect($log.info.logs.length).toBe(logCount + 1);
      });
    });

    describe('initiating a Surveillance', () => {
      let surveillanceInitiateOptions;
      beforeEach(() => {
        surveillanceInitiateOptions = {
          component: 'aiSurveillanceEdit',
          animation: false,
          backdrop: 'static',
          keyboard: false,
          size: 'lg',
          resolve: {
            surveillance: jasmine.any(Function),
            surveillanceTypes: jasmine.any(Function),
            workType: jasmine.any(Function),
          },
        };
        ctrl.surveillanceTypes = {
          surveillanceRequirements: {
            criteriaOptions2014: {},
            criteriaOptions2015: {},
          },
        };
        ctrl.certifiedProduct = {
          id: 1,
          certificationEdition: {
            name: '2015',
          },
        };
      });

      it('should create a modal instance when a Surveillance is to be initiated', () => {
        expect(ctrl.uibModalInstance).toBeUndefined();
        ctrl.initiateSurveillance();
        expect(ctrl.uibModalInstance).toBeDefined();
      });

      it('should resolve elements on initiate', () => {
        ctrl.initiateSurveillance();
        expect($uibModal.open).toHaveBeenCalledWith(surveillanceInitiateOptions);
        expect(actualOptions.resolve.surveillance()).toEqual({ certifiedProduct: ctrl.certifiedProduct });
        expect(actualOptions.resolve.surveillanceTypes()).toEqual({
          surveillanceRequirements: {
            criteriaOptions2014: {},
            criteriaOptions2015: {},
            criteriaOptions: {},
          },
        });
        expect(actualOptions.resolve.workType()).toEqual('initiate');
      });

      it('should do stuff with the returned data', () => {
        ctrl.initiateSurveillance();
        ctrl.uibModalInstance.close({});
        expect(networkService.getListing).toHaveBeenCalled();
      });

      it('should log a non-cancelled modal', () => {
        const logCount = $log.info.logs.length;
        ctrl.initiateSurveillance();
        ctrl.uibModalInstance.dismiss('not cancelled');
        expect($log.info.logs.length).toBe(logCount + 1);
      });
    });
  });
})();
