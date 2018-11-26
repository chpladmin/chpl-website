(function () {
    'use strict';

    describe('the G1/G2 listing details component', function () {

        var $log, Mock, ctrl, el, scope;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl');

            inject(function ($compile, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                el = angular.element('<ai-g1g2 listing="listing"></ai-g1g2>');

                scope = $rootScope.$new();
                scope.listing = Mock.fullListings[1];
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(ctrl).toEqual(jasmine.any(Object));
                expect(ctrl.listing).toEqual(Mock.fullListings[1]);
            });

            describe('when generating measure information', () => {
                it('should have an array of measures with their criteria', function () {
                    expect(ctrl.measures.length).toBeGreaterThan(0);
                });

                it('should change the structure of the measure to match the desired output', function () {
                    expect(ctrl.measures[0]).toEqual({
                        name: 'Medication/Clinical Information Reconciliation: Eligible Provider Individual',
                        description: 'Required Test 9: Stage 2 Objective 7 and Stage 3 Objective 7 Measure 3',
                        g: 'G2',
                        criteria: ['170.315 (b)(2)'],
                        $$hashKey: jasmine.any(String),
                    });
                });

                it('should combine matching measures on criteria value', function () {
                    expect(ctrl.measures[4]).toEqual({
                        name: 'Electronic Prescribing: Eligible Clinician Group',
                        description: 'Required Test 1: Stage 2 Objective 4 and Stage 3 Objective 2, ACI Transition Objective 2 Measure 1 and ACI Objective 2 Measure 1',
                        g: 'G2',
                        criteria: ['170.315 (a)(10)', '170.315 (b)(3)'],
                        $$hashKey: jasmine.any(String),
                    });
                });

                it('should sort citeria in a measure\'s list', () => {
                    expect(ctrl.measures[9].criteria).toEqual(['170.315 (e)(1)', '170.315 (g)(8)', '170.315 (g)(9)']);
                });
            });
        });
    });
})();
