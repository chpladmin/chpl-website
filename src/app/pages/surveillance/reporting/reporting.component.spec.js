(() => {
    'use strict';

    fdescribe('the Reporting component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            acbs: [
                {name: 'name1', retired: false},
                {name: 'name2', retired: true},
                {name: 'name3', retired: false},
            ],
            availableQuarters: [],
            reports: [
                {acb: {name: 'name1'}, quarter: 'Q1', year: 2019},
                {acb: {name: 'name3'}, quarter: 'Q1', year: 2019},
                {acb: {name: 'name1'}, quarter: 'Q4', year: 2019},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.surveillance', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getSurveillanceReporting = jasmine.createSpy('getSurveillanceReporting');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getSurveillanceReporting.and.returnValue($q.when([]));

                scope = $rootScope.$new();
                scope.acbs = mock.acbs;
                scope.availableQuarters = mock.availableQuarters;
                scope.reports = mock.reports;

                el = angular.element('<chpl-surveillance-reporting acbs="{acbs: acbs}" available-quarters="availableQuarters" reports="reports"></chpl-surveillance-reporting>');

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
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            describe('during initiation', () => {
                it('should have constructed stuff', () => {
                    expect(ctrl.$log).toBeDefined();
                    expect(ctrl.hasAnyRole).toBeDefined();
                    expect(ctrl.networkService).toBeDefined();
                    expect(ctrl.mode).toBe('view');
                });

                it('should do things $onInit', () => {
                    expect(ctrl.availableYears).toBeDefined();
                    expect(ctrl.availableYears[0]).toBe(2019);
                });

                it('should do things $onChanges', () => {
                    expect(ctrl.acbs).toBeDefined();
                    expect(ctrl.acbs.length).toBe(2);
                    expect(ctrl.availableQuarters).toBeDefined();
                    expect(ctrl.reports).toBeDefined();
                });

                it('should set visibility if only one acb', () => {
                    expect(ctrl.display).toBeUndefined();
                    let acbs = [
                        {name: 'name1', retired: false},
                    ];
                    ctrl.$onChanges({acbs: {currentValue: {acbs: acbs}}});
                    expect(ctrl.display).toEqual({name1: true});
                });
            });

            it('should find reports', () => {
                expect(ctrl.findReport({name: 'name1'}, 2019, 'Q1')).toEqual(mock.reports[0]);
                expect(ctrl.findReport({name: 'name1'}, 2019, 'Q2')).toBeUndefined();
                expect(ctrl.findReport({name: 'name1'}, 2020, 'Q1')).toBeUndefined();
                expect(ctrl.findReport({name: 'name7'}, 2019, 'Q1')).toBeUndefined();
            });
        });
    });
})();
