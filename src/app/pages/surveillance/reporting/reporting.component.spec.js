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
                {acb: {name: 'name1'}, quarter: 'Q1', year: 2019, id: 1},
                {acb: {name: 'name3'}, quarter: 'Q1', year: 2019, id: 2},
                {acb: {name: 'name1'}, quarter: 'Q4', year: 2019, id: 3},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.surveillance', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.createQuarterlySurveillanceReport = jasmine.createSpy('createQuarterlySurveillanceReport');
                    $delegate.deleteQuarterlySurveillanceReport = jasmine.createSpy('deleteQuarterlySurveillanceReport');
                    $delegate.getSurveillanceReporting = jasmine.createSpy('getSurveillanceReporting');
                    $delegate.updateQuarterlySurveillanceReport = jasmine.createSpy('updateQuarterlySurveillanceReport');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.createQuarterlySurveillanceReport.and.returnValue($q.when({}));
                networkService.deleteQuarterlySurveillanceReport.and.returnValue($q.when([]));
                networkService.getSurveillanceReporting.and.returnValue($q.when([]));
                networkService.updateQuarterlySurveillanceReport.and.returnValue($q.when({}));

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

            it('should allow viewing of a report', () => {
                ctrl.actOnReport({name: 'name1'}, 2019, 'Q1');
                expect(ctrl.activeReport).toEqual(mock.reports[0]);
            });

            it('should close the report', () => {
                ctrl.actOnReport({name: 'name1'}, 2019, 'Q1');
                ctrl.actOnReport({name: 'name1'}, 2019, 'Q1');
                expect(ctrl.activeReport).toBeUndefined
            });

            it('should initiate a report', () => {
                ctrl.actOnReport({name: 'name1'}, 2019, 'Q5');
                expect(ctrl.activeReport).toEqual({
                    acb: {name: 'name1'},
                    year: 2019,
                    quarter: 'Q5',
                });
                expect(ctrl.mode).toBe('initiate');
            });

            describe('when handling callbacks', () => {
                let beforeReport;
                beforeEach(() => {
                    beforeReport = {id: 1};
                    ctrl.activeReport = beforeReport;
                });

                it('should handle edit', () => {
                    let report = {id: 'fake'};
                    ctrl.takeAction(report, 'edit');
                    expect(ctrl.activeReport).toBe(report);
                    expect(ctrl.mode).toBe('edit');
                });

                it('should handle delete', () => {
                    ctrl.activeReport = beforeReport;
                    ctrl.mode = 'edit';
                    spyOn(ctrl, 'cancel');
                    ctrl.takeAction(beforeReport, 'delete');
                    scope.$digest();
                    expect(networkService.deleteQuarterlySurveillanceReport).toHaveBeenCalledWith(beforeReport.id);
                    expect(networkService.getSurveillanceReporting).toHaveBeenCalled();
                    expect(ctrl.activeReport).toBeUndefined();
                    expect(ctrl.cancel).toHaveBeenCalled();
                });
            });

            describe('on save', () => {
                let report;
                beforeEach(() => {
                    report = {id: 1};
                });

                it('should handle edit', () => {
                    networkService.updateQuarterlySurveillanceReport.and.returnValue($q.when(report));
                    ctrl.activeReport = {};
                    ctrl.mode = 'edit';
                    spyOn(ctrl, 'cancel');
                    ctrl.save(report);
                    expect(ctrl.mode).toBe('view');
                    scope.$digest();
                    expect(networkService.updateQuarterlySurveillanceReport).toHaveBeenCalledWith(report);
                    expect(ctrl.activeReport).toBe(report);
                    expect(ctrl.cancel).toHaveBeenCalled();
                });

                it('should handle initiate', () => {
                    networkService.createQuarterlySurveillanceReport.and.returnValue($q.when(report));
                    ctrl.activeReport = {};
                    ctrl.mode = 'initiate';
                    spyOn(ctrl, 'cancel');
                    ctrl.save(report);
                    expect(ctrl.mode).toBe('view');
                    scope.$digest();
                    expect(networkService.createQuarterlySurveillanceReport).toHaveBeenCalledWith(report);
                    expect(ctrl.activeReport).toBe(report);
                    expect(ctrl.cancel).toHaveBeenCalled();
                });
            });

            describe('on cancel', () => {
                it('should set the mode to view', () => {
                    ctrl.mode = 'fake';
                    ctrl.cancel();
                    expect(ctrl.mode).toBe('view');
                });

                it('should clear the initiating object', () => {
                    ctrl.mode = 'initiate';
                    ctrl.activeReport = 'fake';
                    ctrl.cancel();
                    expect(ctrl.activeReport).toBeUndefined();
                });
            });
        });
    });
})();
