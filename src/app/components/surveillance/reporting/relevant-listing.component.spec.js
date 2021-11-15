import { calculateCompletion } from './relevant-listing.component';

(() => {
  describe('the Surveillance Report Relevent Listing component', () => {
    let $compile;
    let $log;
    let $q;
    let ctrl;
    let el;
    let networkService;
    let scope;

    const mock = {
      listing: {
        id: 7706, chplProductNumber: '14.02.02.2646.A001.01.00.1.160412', lastModifiedDate: 1528178797574, edition: '2014', certificationDate: 1460433600000,
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.components', 'chpl.services', ($provide) => {
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getSurveillanceLookups: jasmine.createSpy('getSurveillanceLookups'),
        }));
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        networkService = _networkService_;
        networkService.getSurveillanceLookups.and.returnValue($q.when({}));

        scope = $rootScope.$new();
        scope.listing = mock.listing;
        scope.isEditing = false;
        scope.onCancel = jasmine.createSpy('onCancel');
        scope.onSave = jasmine.createSpy('onSave');

        el = angular.element('<chpl-surveillance-report-relevant-listing listing="listing" is-editing="isEditing" on-cancel="onCancel()" on-save="onSave(listing)"></chpl-surveillance-report-relevant-listing>');

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

      describe('when determining completeness', () => {
        let surv;
        beforeEach(() => {
          surv = {
            surveillanceOutcome: null,
            surveillanceProcessType: null,
            k1Reviewed: null,
            groundsForInitiating: null,
            nonconformityCauses: null,
            nonconformityNature: null,
            stepsToSurveil: null,
            stepsToEngage: null,
            additionalCostsEvaluation: null,
            limitationsEvaluation: null,
            nondisclosureEvaluation: null,
            directionDeveloperResolution: null,
            completedCapVerification: null,
          };
        });

        it('should handle nulls', () => {
          expect(calculateCompletion(surv).completed).toBe(0);
        });

        it('should handle undefined', () => {
          surv.surveillanceOutcome = undefined;
          surv.surveillanceProcessType = undefined;
          surv.k1Reviewed = undefined;
          surv.groundsForInitiating = undefined;
          surv.nonconformityCauses = undefined;
          surv.nonconformityNature = undefined;
          surv.stepsToSurveil = undefined;
          surv.stepsToEngage = undefined;
          surv.additionalCostsEvaluation = undefined;
          surv.limitationsEvaluation = undefined;
          surv.nondisclosureEvaluation = undefined;
          surv.directionDeveloperResolution = undefined;
          surv.completedCapVerification = undefined;
          expect(calculateCompletion(surv).completed).toBe(0);
        });

        it('should handle empty strings', () => {
          surv.surveillanceOutcome = '';
          surv.surveillanceProcessType = '';
          surv.groundsForInitiating = '';
          surv.nonconformityCauses = '';
          surv.nonconformityNature = '';
          surv.stepsToSurveil = '';
          surv.stepsToEngage = '';
          surv.additionalCostsEvaluation = '';
          surv.limitationsEvaluation = '';
          surv.nondisclosureEvaluation = '';
          surv.directionDeveloperResolution = '';
          surv.completedCapVerification = '';
          expect(calculateCompletion(surv).completed).toBe(0);
        });

        it('should know when it\'s complete', () => {
          surv.surveillanceOutcome = 'Something';
          surv.surveillanceProcessType = 'Something';
          surv.k1Reviewed = true;
          surv.groundsForInitiating = 'Something';
          surv.nonconformityCauses = 'Something';
          surv.nonconformityNature = 'Something';
          surv.stepsToSurveil = 'Something';
          surv.stepsToEngage = 'Something';
          surv.additionalCostsEvaluation = 'Something';
          surv.limitationsEvaluation = 'Something';
          surv.nondisclosureEvaluation = 'Something';
          surv.directionDeveloperResolution = 'Something';
          surv.completedCapVerification = 'Something';
          expect(calculateCompletion(surv).completed).toBe(100);
        });

        it('should handle k1', () => {
          expect(calculateCompletion(surv).completed).toBe(0);
          surv.k1Reviewed = true;
          expect(calculateCompletion(surv).completed).toBe(8);
          surv.k1Reviewed = false;
          expect(calculateCompletion(surv).completed).toBe(0);
        });
      });
    });
  });
})();
