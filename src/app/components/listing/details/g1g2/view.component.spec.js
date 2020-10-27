(() => {
    'use strict';

    describe('the G1/G2 view component', () => {

        var $compile, $log, Mock, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.components', 'chpl.mock');

            inject((_$compile_, _$log_, $rootScope, _Mock_) => {
                $compile = _$compile_;
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                scope.measures = Mock.listingMeasures;
                el = angular.element('<chpl-g1g2-view measures="measures"></chpl-g1g2-view>');

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
            });

            describe('on changes', () => {
                it('should build a display value for associated criteria', () => {
                    expect(ctrl.measures[1].displayCriteria).toBe('a5; b5');
                });

                it('should not update anything if there are no changes', () => {
                    let measures = [1, 2];
                    ctrl.measures = measures;
                    ctrl.$onChanges({});
                    expect(ctrl.measures).toBe(measures);
                });
            });

            describe('when sorting measures', () => {
                let a, b;

                beforeEach(() => {
                    a = angular.copy(Mock.listingMeasures[0]);
                    b = angular.copy(Mock.listingMeasures[0]);
                });

                it('should not sort identical ones', () => {
                    expect(ctrl.measureSort(a, b)).toBe(0);
                });

                it('should sort removed last', () => {
                    b.measure.removed = true;
                    expect(ctrl.measureSort(a, b)).toBe(-1);
                    expect(ctrl.measureSort(b, a)).toBe(1);
                });

                it('should sort by g1/g2', () => {
                    b.measurementType.name = 'G2';
                    expect(ctrl.measureSort(a, b)).toBe(-1);
                    expect(ctrl.measureSort(b, a)).toBe(1);
                });

                it('should sort by measure name', () => {
                    b.measure.name = 'Very last measure';
                    expect(ctrl.measureSort(a, b)).toBe(-1);
                    expect(ctrl.measureSort(b, a)).toBe(1);
                });

                it('should sort by required test', () => {
                    b.measure.requiredTest = 'Required Test 9: Last test';
                    expect(ctrl.measureSort(a, b)).toBe(-1);
                    expect(ctrl.measureSort(b, a)).toBe(1);
                });
            });
        });
    });
})();
