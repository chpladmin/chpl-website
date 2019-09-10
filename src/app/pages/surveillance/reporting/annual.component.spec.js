(() => {
    'use strict';

    fdescribe('the Surveillance Report Annual component', () => {
        var $compile, $log, $q, authService, ctrl, el, mock, networkService, scope, toaster;

        mock = {
            report: {id: 1},
            response: {
                user: {
                    fullName: 'A Name',
                    email: 'email',
                },
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.services', 'chpl.surveillance', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.generateAnnualSurveillanceReport = jasmine.createSpy('generateAnnualSurveillanceReport');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _authService_, _networkService_, _toaster_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                toaster = _toaster_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.generateAnnualSurveillanceReport.and.returnValue($q.when(mock.response));

                scope = $rootScope.$new();
                scope.report = mock.report;
                scope.isEditing = false;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onSave = jasmine.createSpy('onSave');

                el = angular.element('<chpl-surveillance-report-annual report="report" is-editing="isEditing" on-cancel="onCancel()" on-save="onSave(report)"></chpl-surveillance-report-annual>');

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

            describe('when generating the report', () => {
                it('should call the network service', () => {
                    ctrl.generateReport();
                    expect(networkService.generateAnnualSurveillanceReport).toHaveBeenCalledWith(mock.report.id);
                });

                it('should pop toast on success', () => {
                    spyOn(toaster, 'pop');
                    ctrl.generateReport();
                    scope.$digest();
                    expect(toaster.pop).toHaveBeenCalledWith({
                        type: 'success',
                        title: 'Report is being generated',
                        body: `Annual Surveillance report is being generated, and will be emailed to ${mock.response.user.fullName} at ${mock.response.user.email} when ready.`,
                    });
                });

                it('should pop toast on failure', () => {
                    let response = {data: {error: 'An error message'}};
                    spyOn(toaster, 'pop');
                    networkService.generateAnnualSurveillanceReport.and.returnValue($q.reject(response));
                    ctrl.generateReport();
                    scope.$digest();
                    expect(toaster.pop).toHaveBeenCalledWith({
                        type: 'error',
                        title: 'Report could not be generated',
                        body: response.data.error,
                    });
                });
            });
        });
    });
})();
