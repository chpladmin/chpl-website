(() => {
    'use strict';

    describe('the G1/G2 edit component', () => {

        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            measures: [{id: 1}],
        };

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.measures = mock.measures;
                scope.onChange = jasmine.createSpy('onChange');
                el = angular.element('<chpl-g1g2-edit measures="measures" on-change="onChange(measures)"></chpl-g1g2-edit>');

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
                expect(ctrl.measures).toEqual(mock.measures);
            });

            it('should call the callback on update', () => {
                ctrl.update();
                expect(scope.onChange).toHaveBeenCalledWith(mock.measures);
            });

            describe('when sorting measures', () => {
                let a, b;

                beforeEach(() => {
                    a = {
                        g: '1',
                        domain: 'EP',
                        test: 'RT1',
                        name: 'A name',
                    };
                    b = {
                        g: '1',
                        domain: 'EP',
                        test: 'RT1',
                        name: 'A name',
                    };
                });

                it('should not sort identical ones', () => {
                    expect(ctrl.measureSort(a, b)).toBe(0);
                });

                it ('should sort by g1/g2', () => {
                    b.g = '2';
                    expect(ctrl.measureSort(a, b)).toBe(-1);
                    expect(ctrl.measureSort(b, a)).toBe(1);
                });

                it ('should sort by domain', () => {
                    b.domain = 'Medicaid';
                    expect(ctrl.measureSort(a, b)).toBe(-1);
                    expect(ctrl.measureSort(b, a)).toBe(1);
                });

                it ('should sort by test', () => {
                    b.test = 'RT7';
                    expect(ctrl.measureSort(a, b)).toBe(-1);
                    expect(ctrl.measureSort(b, a)).toBe(1);
                });

                it ('should sort by test, ignoring the RT part', () => {
                    b.test = 'RT10';
                    b.test = 'RT2';
                    expect(ctrl.measureSort(a, b)).toBe(-1);
                    expect(ctrl.measureSort(b, a)).toBe(1);
                });

                it ('should sort by name', () => {
                    b.name = 'B\'s name';
                    expect(ctrl.measureSort(a, b)).toBe(-1);
                    expect(ctrl.measureSort(b, a)).toBe(1);
                });
            });
        });
    });
})();
