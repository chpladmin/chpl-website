(() => {
    'use strict';

    fdescribe('the Reports.ApiKeyUsage component', () => {

        var $compile, $log, $q, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.reports', $provide => {
                $provide.factory('chplFilterDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getActivityMetadata = jasmine.createSpy('getActivityMetadata');
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    $delegate.getApiActivity = jasmine.createSpy('getApiActivity');
                    $delegate.getApiUsers = jasmine.createSpy('getApiUsers');
                    return $delegate;
                });
            });

            inject((_$compile_, $controller, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;

                networkService = _networkService_;
                networkService.getActivityMetadata.and.returnValue($q.when([]));
                networkService.getActivityById.and.returnValue($q.when({}));
                networkService.getApiActivity.and.returnValue($q.when([]));
                networkService.getApiUsers.and.returnValue($q.when([]));

                scope = $rootScope.$new()
                el = angular.element('<chpl-reports-api-key-usage></chpl-reports-api-key-usage>');
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
            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });
            describe('helper functions', () => {
                describe('for date ranges', () => {
                    beforeEach(() => {
                        ctrl.activityRange = {
                            range: 60,
                            startDate: new Date('1/15/2017'),
                            endDate: new Date('2/15/2017'),
                        };
                    });

                    it('should have a function to determine if a date range is okay', () => {
                        expect(ctrl.validDates).toBeDefined()
                    });

                    it('should allow dates with less than the range separation', () => {
                        expect(ctrl.validDates()).toBe(true);
                    });

                    it('should not allow dates separated by more than the range', () => {
                        ctrl.apiKeyReport.range = 1;
                        expect(ctrl.validDates()).toBe(false);
                    });

                    it('should not allow dates where start is after end', () => {
                        ctrl.apiKeyReport.startDate = new Date('3/15/2017');
                        expect(ctrl.validDates()).toBe(false);
                    });

                    it('should correctly validate dates crossing DST', () => {
                        ctrl.apiKeyReport = {
                            range: 60,
                            startDate: new Date('9/17/2017'),
                            endDate: new Date('11/16/2017'),
                        };
                        expect(ctrl.validDates()).toBe(false);
                    });

                    it('should correctly validate dates crossing DST', () => {
                        ctrl.apiKeyReport = {
                            range: 60,
                            startDate: new Date('9/06/2017'),
                            endDate: new Date('11/04/2017'),
                        };
                        expect(ctrl.validDates()).toBe(true);
                    });

                    it('should correctly validate dates crossing DST', () => {
                        ctrl.apiKeyReport = {
                            range: 60,
                            startDate: new Date('9/06/2017'),
                            endDate: new Date('11/05/2017'),
                        };
                        expect(ctrl.validDates()).toBe(false);
                    });
                });
            });
        });

    });
})();
