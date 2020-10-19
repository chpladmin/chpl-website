(() => {
    'use strict';

    fdescribe('the G1/G2 edit component', () => {

        var $compile, $log, Mock, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.components', 'chpl.mock');

            inject((_$compile_, _$log_, $rootScope, _Mock_) => {
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                scope.measures = Mock.certifiedProductMipsMeasures;
                scope.onChange = jasmine.createSpy('onChange');
                scope.resources = {
                    mipsMeasures: Mock.mipsMeasures,
                    mipsTypes: Mock.mipsTypes,
                };
                el = angular.element('<chpl-g1g2-edit measures="measures" on-change="onChange(measures)" resources="resources"></chpl-g1g2-edit>');

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

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should have isolate scope object with instanciate members', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            it('should call the callback on update', () => {
                ctrl.update();
                expect(scope.onChange).toHaveBeenCalled();
            });

            it('should generate a list of available tests', () => {
                expect(ctrl.allTests).toEqual(['RT1', 'RT10', 'RT3']);
            });

            it('should generate a list of available MIPS types', () => {
                expect(ctrl.allTypes).toEqual(['G1', 'G2']);
            });

            describe('when sorting', () => {
                let a, b;

                describe('measure results', () => {
                    beforeEach(() => {
                        a = angular.copy(Mock.certifiedProductMipsMeasures[0]);
                        b = angular.copy(Mock.certifiedProductMipsMeasures[0]);
                    });

                    it('should not sort identical ones', () => {
                        expect(ctrl.measureSort(a, b)).toBe(0);
                    });

                    it('should sort by g1/g2', () => {
                        b.mipsType.name = 'G2';
                        expect(ctrl.measureSort(a, b)).toBe(-1);
                        expect(ctrl.measureSort(b, a)).toBe(1);
                    });

                    it('should sort by domain', () => {
                        b.mipsMeasure.mipsDomain.domain = 'Medicaid';
                        expect(ctrl.measureSort(a, b)).toBe(-1);
                        expect(ctrl.measureSort(b, a)).toBe(1);
                    });

                    it('should sort by test', () => {
                        b.mipsMeasure.requiredTestAbbr = 'RT2';
                        expect(ctrl.measureSort(a, b)).toBe(-1);
                        expect(ctrl.measureSort(b, a)).toBe(1);
                    });

                    it('should sort by test, ignoring the RT part', () => {
                        a.mipsMeasure.requiredTestAbbr = 'RT2';
                        b.mipsMeasure.requiredTestAbbr = 'RT10';
                        expect(ctrl.measureSort(a, b)).toBe(-1);
                        expect(ctrl.measureSort(b, a)).toBe(1);
                    });

                    it('should sort by name', () => {
                        b.mipsMeasure.name = 'Never done sorting';
                        expect(ctrl.measureSort(a, b)).toBe(-1);
                        expect(ctrl.measureSort(b, a)).toBe(1);
                    });
                });

                describe('available measures', () => {
                    beforeEach(() => {
                        a = angular.copy(Mock.mipsMeasures[0]);
                        b = angular.copy(Mock.mipsMeasures[0]);
                    });

                    it('should not sort identical ones', () => {
                        expect(ctrl.measureSort(a, b)).toBe(0);
                    });

                    it('should sort by domain', () => {
                        b.mipsDomain.domain = 'Medicaid';
                        expect(ctrl.measureSort(a, b)).toBe(-1);
                        expect(ctrl.measureSort(b, a)).toBe(1);
                    });

                    it('should sort by test', () => {
                        b.requiredTestAbbr = 'RT2';
                        expect(ctrl.measureSort(a, b)).toBe(-1);
                        expect(ctrl.measureSort(b, a)).toBe(1);
                    });

                    it('should sort by test, ignoring the RT part', () => {
                        a.requiredTestAbbr = 'RT2';
                        b.requiredTestAbbr = 'RT10';
                        expect(ctrl.measureSort(a, b)).toBe(-1);
                        expect(ctrl.measureSort(b, a)).toBe(1);
                    });

                    it('should sort by name', () => {
                        b.name = 'Never done sorting';
                        expect(ctrl.measureSort(a, b)).toBe(-1);
                        expect(ctrl.measureSort(b, a)).toBe(1);
                    });
                });
            });

            describe('when filtering available measures', () => {
                it('should filter out ones that don\'t have the required test', () => {
                    ctrl.newItem['mipsMeasures'] = {selectedTestAbbr: 'RT1'};
                    expect(ctrl.filteredMeasures().length).toBe(1);
                });
            });
        });
    });
})();
