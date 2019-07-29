(() => {
    'use strict';

    fdescribe('the Reports.Users component', () => {

        var $compile, $log, $q, Mock, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.reports', $provide => {
                $provide.factory('chplFilterDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getActivityMetadata = jasmine.createSpy('getActivityMetadata');
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _Mock_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;

                networkService.getActivityMetadata.and.returnValue($q.when(Mock.productReportsMetadata));
                networkService.getActivityById.and.returnValue($q.when(Mock.listingActivity));

                scope = $rootScope.$new()
                el = angular.element('<chpl-reports-users></chpl-reports-users>');
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
                        ctrl.activityRange.range = 1;
                        expect(ctrl.validDates()).toBe(false);
                    });

                    it('should not allow dates where start is after end', () => {
                        ctrl.activityRange.startDate = new Date('3/15/2017');
                        expect(ctrl.validDates()).toBe(false);
                    });

                    it('should correctly validate dates crossing DST', () => {
                        ctrl.activityRange = {
                            range: 60,
                            startDate: new Date('9/17/2017'),
                            endDate: new Date('11/16/2017'),
                        };
                        expect(ctrl.validDates()).toBe(false);
                    });

                    it('should correctly validate dates crossing DST', () => {
                        ctrl.activityRange = {
                            range: 60,
                            startDate: new Date('9/06/2017'),
                            endDate: new Date('11/04/2017'),
                        };
                        expect(ctrl.validDates()).toBe(true);
                    });

                    it('should correctly validate dates crossing DST', () => {
                        ctrl.activityRange = {
                            range: 60,
                            startDate: new Date('9/06/2017'),
                            endDate: new Date('11/05/2017'),
                        };
                        expect(ctrl.validDates()).toBe(false);
                    });
                });

                describe('when determining the type of change', () => {
                    it('should correctly identify if a role has changed', () => {
                        let detail = {description: 'This is a role change'};
                        expect(ctrl.isActivityRoleChange(detail)).toBe(true);
                    });
                    it('should correctly identify if a role has NOT changed', () => {
                        let detail = {description: 'This should not be caught'};
                        expect(ctrl.isActivityRoleChange(detail)).toBe(false);
                    });
                    it('should correctly identify if a new user was created', () => {
                        let detail = {
                            newData: true,
                            originalData: null,
                        };
                        expect(ctrl.isActivityNewUser(detail)).toBe(true);
                    });
                    it('should correctly identify if a new user was NOT created', () => {
                        let detail = {
                            newData: true,
                            originalData: true,
                        };
                        expect(ctrl.isActivityNewUser(detail)).toBe(false);
                    });
                    it('should correctly identify if a user was deleted', () => {
                        let detail = {
                            newData: null,
                            originalData: true,
                        };
                        expect(ctrl.isActivityDeletedUser(detail)).toBe(true);
                    });
                    it('should correctly identify if a user was NOT deleted', () => {
                        let detail = {
                            newData: true,
                            originalData: true,
                        };
                        expect(ctrl.isActivityNewUser(detail)).toBe(false);
                    });
                    it('should correctly identify if an activity is confirm user', () => {
                        let detail = {
                            newData: {signatureDate: '1/1/2019'},
                            originalData: {signatureDate: null},
                        };
                        expect(ctrl.isActivtyConfirmUser(detail)).toBe(true);
                    });
                    it('should correctly identify if an activity is NOT confirm user', () => {
                        let detail = {
                            newData: {signatureDate: null},
                            originalData: {signatureDate: null},
                        };
                        expect(ctrl.isActivtyConfirmUser(detail)).toBe(false);
                    });
                });
            });

            describe('when filter is selected', () => {
                xit('should populate model with filter values', () => {
                    let filter = {
                        'startDate': '2019-01-01T05:00:00.000Z',
                        'endDate': '2019-01-30T05:00:00.000Z',
                        'dataFilter': 'medco',
                        'tableState': {
                            'sort': {
                                'predicate': 'date',
                                'reverse': true,
                            },
                            'search': {
                                'predicateObject': {},
                            },
                            'pagination': {
                                'start': 0,
                                'totalItemCount': 60,
                            },
                        },
                    };
                    ctrl.onApplyFilter(angular.toJson(filter));
                    expect(ctrl.filterText).toBe('medco');
                    expect(ctrl.activityRange.startDate).toEqual(new Date(Date.parse(filter.startDate)));
                    expect(ctrl.activityRange.endDate).toEqual(new Date(Date.parse(filter.endDate)));
                });
            });
            describe('when save filter is clicked', () => {
                xit('should create a filter object for saving', () => {
                    ctrl.activityRange.startDate = new Date(Date.parse('2019-01-01T05:00:00.000Z'));
                    ctrl.activityRange.endDate = new Date(Date.parse('2019-01-30T05:00:00.000Z'));
                    ctrl.filterText = 'medco';

                    let filter = ctrl.createFilterDataObject();

                    expect(filter.startDate).toBe(ctrl.activityRange.startDate);
                    expect(filter.endDate).toBe(ctrl.activityRange.endDate);
                    expect(filter.dataFilter).toBe(ctrl.filterText);
                })
            });
        });
    });
})();
