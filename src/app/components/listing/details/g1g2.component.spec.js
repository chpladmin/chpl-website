(() => {
    'use strict';

    describe('the G1/G2 listing details component', () => {

        var $compile, $log, Mock, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.components');

            inject((_$compile_, _$log_, $rootScope, _Mock_) => {
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                scope.listing = Mock.fullListings[1];
                el = angular.element('<ai-g1g2 listing="listing"></ai-g1g2>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should have isolate scope object with instanciate members', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
                expect(ctrl.listing).toEqual(Mock.fullListings[1]);
            });

            describe('when generating measure information', () => {
                it('should have an array of measures with their criteria', () => {
                    expect(ctrl.measures.length).toBeGreaterThan(0);
                });

                it('should change the structure of the measure to match the desired output', () => {
                    let name = 'Medication/Clinical Information Reconciliation: Eligible Professional';
                    let description = 'Required Test 9: Stage 2 Objective 7';
                    expect(ctrl.measures.find(m => m.name === name && m.description === description)).toEqual({
                        name: name,
                        description: description,
                        g: 'G2',
                        criteria: ['170.315 (b)(2)'],
                        removed: false,
                        $$hashKey: jasmine.any(String),
                    });
                });

                it('should combine matching measures on criteria value', () => {
                    let name = 'Electronic Prescribing: Eligible Professional';
                    let description = 'Required Test 1: Stage 2 Objective 4';
                    expect(ctrl.measures.find(m => m.name === name && m.description === description)).toEqual({
                        name: name,
                        description: description,
                        g: 'G2',
                        criteria: ['170.315 (a)(10)', '170.315 (b)(3)'],
                        removed: false,
                        $$hashKey: jasmine.any(String),
                    });
                });

                it('should sort criteria in a measure\'s list', () => {
                    let name = 'Patient Electronic Access: Eligible Professional';
                    let description = 'Required Test 2: Stage 2 Objective 8 Measure 1';
                    expect(ctrl.measures.find(m => m.name === name && m.description === description).criteria).toEqual(['170.315 (e)(1)', '170.315 (g)(8)', '170.315 (g)(9)']);
                });
            });

            describe('with g1 measures', () => {
                beforeEach(() => {
                    scope.listing = Mock.fullListings[2];
                    $compile(el)(scope);
                    scope.$digest();
                });

                it('should have an array of measures with their criteria', () => {
                    expect(ctrl.measures.length).toBeGreaterThan(0);
                });

                it('should change the structure of the measure to match the desired output', () => {
                    let name = 'Patient-Generated Health Data: Eligible Hospital/Critical Access Hospital';
                    let description = 'Required Test 6: Stage 3 Objective 6 Measure 3';
                    expect(ctrl.measures.find(m => m.name === name && m.description === description)).toEqual({
                        name: name,
                        description: description,
                        g: 'G1',
                        criteria: ['170.315 (e)(3)'],
                        removed: false,
                        $$hashKey: jasmine.any(String),
                    });
                });

                it('should combine matching measures on criteria value', () => {
                    let name = 'Patient Electronic Access: Eligible Professional';
                    let description = 'Required Test 2: Stage 2 Objective 8 Measure 1';
                    expect(ctrl.measures.find(m => m.name === name && m.description === description)).toEqual({
                        name: name,
                        description: description,
                        g: 'G1',
                        criteria: ['170.315 (e)(1)'],
                        removed: false,
                        $$hashKey: jasmine.any(String),
                    });
                });

                it('should sort criteria in a measure\'s list', () => {
                    let name = 'View, Download, or Transmit (VDT): Eligible Hospital/Critical Access Hospital';
                    let description = 'Required Test 4: Stage 3 Objective 6 Measure 1';
                    expect(ctrl.measures.find(m => m.name === name && m.description === description).criteria).toEqual(['170.315 (e)(1)', '170.315 (e)(1)']);
                });
            });
        });
    });
})();
