(() => {
    'use strict';

    describe('the Reporting component', () => {
        let $compile, $log, $q, $state, ctrl, el, mock, networkService, scope;

        mock = {
            acbs: [
                {name: 'name1', retired: false},
                {name: 'name2', retired: true},
                {name: 'name3', retired: false},
            ],
            annual: [
                {acb: {name: 'name1'}, year: 2019, id: 1},
                {acb: {name: 'name3'}, year: 2019, id: 2},
            ],
            availableQuarters: [],
            quarters: [
                {acb: {name: 'name1'}, quarter: 'Q1', year: 2019, id: 1, relevantListings: []},
                {acb: {name: 'name3'}, quarter: 'Q1', year: 2019, id: 2, relevantListings: []},
                {acb: {name: 'name1'}, quarter: 'Q4', year: 2019, id: 3, relevantListings: []},
            ],
            listings: [
                { 'id': 3056, 'chplProductNumber': 'CHP-024046', 'lastModifiedDate': '1532467621312', 'edition': '2014', 'certificationDate': 1410408000000, 'reason': 'This is my Reason', 'excluded': true },
                { 'id': 3136, 'chplProductNumber': 'CHP-024900', 'lastModifiedDate': '1532466539550', 'edition': '2014', 'certificationDate': 1418878800000, 'reason': null, 'excluded': false },
                { 'id': 3264, 'chplProductNumber': 'CHP-024205', 'lastModifiedDate': '1533944258873', 'edition': '2014', 'certificationDate': 1411617600000, 'reason': 'Whatever', 'excluded': true },
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.surveillance', $provide => {
                $provide.factory('chplSurveillanceReportQuarterDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.createAnnualSurveillanceReport = jasmine.createSpy('createAnnualSurveillanceReport');
                    $delegate.createQuarterlySurveillanceReport = jasmine.createSpy('createQuarterlySurveillanceReport');
                    $delegate.deleteAnnualSurveillanceReport = jasmine.createSpy('deleteAnnualSurveillanceReport');
                    $delegate.deleteQuarterlySurveillanceReport = jasmine.createSpy('deleteQuarterlySurveillanceReport');
                    $delegate.getAnnualSurveillanceReports = jasmine.createSpy('getAnnualSurveillanceReports');
                    $delegate.getQuarterlySurveillanceReports = jasmine.createSpy('getQuarterlySurveillanceReports');
                    $delegate.getRelevantListings = jasmine.createSpy('getRelevantListings');
                    $delegate.updateAnnualSurveillanceReport = jasmine.createSpy('updateAnnualSurveillanceReport');
                    $delegate.updateQuarterlySurveillanceReport = jasmine.createSpy('updateQuarterlySurveillanceReport');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _$state_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $state = _$state_;
                $state.go = jasmine.createSpy('go');
                networkService = _networkService_;
                networkService.createAnnualSurveillanceReport.and.returnValue($q.when({}));
                networkService.createQuarterlySurveillanceReport.and.returnValue($q.when({}));
                networkService.deleteAnnualSurveillanceReport.and.returnValue($q.when([]));
                networkService.deleteQuarterlySurveillanceReport.and.returnValue($q.when([]));
                networkService.getAnnualSurveillanceReports.and.returnValue($q.when([]));
                networkService.getQuarterlySurveillanceReports.and.returnValue($q.when([]));
                networkService.getRelevantListings.and.returnValue($q.when(mock.listings));
                networkService.updateAnnualSurveillanceReport.and.returnValue($q.when({}));
                networkService.updateQuarterlySurveillanceReport.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.acbs = mock.acbs;
                scope.annual = mock.annual;
                scope.availableQuarters = mock.availableQuarters;
                scope.quarters = mock.quarters;

                el = angular.element('<chpl-surveillance-reporting acbs="{acbs: acbs}" annual="annual" available-quarters="availableQuarters" quarters="quarters"></chpl-surveillance-reporting>');

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
                });

                it('should do things $onInit', () => {
                    expect(ctrl.availableYears).toBeDefined();
                    expect(ctrl.availableYears[0]).toBe(2019);
                });

                it('should do things $onChanges', () => {
                    expect(ctrl.acbs).toBeDefined();
                    expect(ctrl.acbs.length).toBe(2);
                    expect(ctrl.availableQuarters).toBeDefined();
                    expect(ctrl.quarters).toBeDefined();
                    expect(ctrl.annual).toBeDefined();
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

            describe('for quarters', () => {
                it('should find quarterly reports', () => {
                    expect(ctrl.findQuarterReport({name: 'name1'}, 2019, 'Q1')).toEqual(mock.quarters[0]);
                    expect(ctrl.findQuarterReport({name: 'name1'}, 2019, 'Q2')).toBeUndefined();
                    expect(ctrl.findQuarterReport({name: 'name1'}, 2020, 'Q1')).toBeUndefined();
                    expect(ctrl.findQuarterReport({name: 'name7'}, 2019, 'Q1')).toBeUndefined();
                });

                it('should close the report', () => {
                    ctrl.actOnQuarter({name: 'name1'}, 2019, 'Q1');
                    ctrl.actOnQuarter({name: 'name1'}, 2019, 'Q1');
                    expect(ctrl.activeQuarterReport).toBeUndefined
                });

                describe('when handling callbacks', () => {
                    let beforeReport;
                    beforeEach(() => {
                        beforeReport = {id: 1};
                    });

                    it('should handle delete', () => {
                        spyOn(ctrl, 'cancel');
                        ctrl.takeQuarterAction(beforeReport, 'delete');
                        scope.$digest();
                        expect(networkService.deleteQuarterlySurveillanceReport).toHaveBeenCalledWith(beforeReport.id);
                        expect(networkService.getQuarterlySurveillanceReports).toHaveBeenCalled();
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
                        ctrl.saveQuarter(report);
                        scope.$digest();
                        expect(networkService.updateQuarterlySurveillanceReport).toHaveBeenCalledWith(report);
                    });

                    it('should handle initiate', () => {
                        networkService.createQuarterlySurveillanceReport.and.returnValue($q.when(report));
                        ctrl.createQuarter(report);
                        scope.$digest();
                        expect(networkService.createQuarterlySurveillanceReport).toHaveBeenCalledWith(report);
                    });
                });

                describe('on cancel', () => {
                    it('should refresh the state', () => {
                        ctrl.cancel();
                        expect($state.go).toHaveBeenCalledWith('surveillance.reporting', {}, {reload: true});
                    });
                });
            });

            describe('for the year', () => {
                it('should find annual reports', () => {
                    expect(ctrl.findAnnualReport({name: 'name1'}, 2019)).toEqual(mock.annual[0]);
                    expect(ctrl.findAnnualReport({name: 'name1'}, 2020)).toBeUndefined();
                    expect(ctrl.findAnnualReport({name: 'name7'}, 2019)).toBeUndefined();
                });

                describe('when handling callbacks', () => {
                    let beforeReport;
                    beforeEach(() => {
                        beforeReport = {id: 1};
                        ctrl.activeAnnualReport = beforeReport;
                    });

                    it('should handle delete', () => {
                        spyOn(ctrl, 'cancel');
                        ctrl.takeAnnualAction(beforeReport, 'delete');
                        scope.$digest();
                        expect(networkService.deleteAnnualSurveillanceReport).toHaveBeenCalledWith(beforeReport.id);
                        expect(networkService.getAnnualSurveillanceReports).toHaveBeenCalled();
                        expect(ctrl.cancel).toHaveBeenCalled();
                    });
                });

                describe('on save', () => {
                    let report;
                    beforeEach(() => {
                        report = {id: 1};
                    });

                    it('should handle edit', () => {
                        networkService.updateAnnualSurveillanceReport.and.returnValue($q.when(report));
                        spyOn(ctrl, 'cancel');
                        ctrl.saveAnnual(report);
                        scope.$digest();
                        expect(networkService.updateAnnualSurveillanceReport).toHaveBeenCalledWith(report);
                        expect(ctrl.cancel).toHaveBeenCalled();
                    });

                    it('should handle initiate', () => {
                        networkService.createAnnualSurveillanceReport.and.returnValue($q.when(report));
                        ctrl.createAnnual(report);
                        scope.$digest();
                        expect(networkService.createAnnualSurveillanceReport).toHaveBeenCalledWith(report);
                        expect($state.go).toHaveBeenCalledWith('.annual', {reportId: report.id});
                    });
                });

                describe('on cancel', () => {
                    it('should refresh the state', () => {
                        ctrl.cancel()
                        expect($state.go).toHaveBeenCalledWith('surveillance.reporting', {}, {reload: true});
                    });
                });
            });

            describe('validation', () => {
                it('should know when annual can be initiated', () => {
                    expect(ctrl.canInitiateAnnual({name: 'name1'}, 2019)).toBe(true);
                    expect(ctrl.canInitiateAnnual({name: 'name1'}, 2020)).toBe(false);
                });
            });
        });
    });
})();
