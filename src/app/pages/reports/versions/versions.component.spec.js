import {getActivity, getMetadata} from './history.mock';

(() => {
    'use strict';

    describe('the Reports.Versions component', () => {
        var $compile, $log, $q, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.reports', $provide => {
                $provide.factory('chplFilterDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getActivityById = jasmine.createSpy('getActivityById');
                    $delegate.getActivityMetadata = jasmine.createSpy('getActivityMetadata');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getActivityById.and.callFake(id => $q.when(getActivity(id)));
                networkService.getActivityMetadata.and.returnValue($q.when(getMetadata('version')));

                scope = $rootScope.$new()
                el = angular.element('<chpl-reports-versions></chpl-reports-versions>');
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

            describe('when loading', () => {
                it('should get activity from the network', () => {
                    expect(networkService.getActivityMetadata).toHaveBeenCalledWith('versions', jasmine.any(Object));
                    expect(ctrl.results.length).toBe(4);
                });

                it('should set the friendly date on metadata', () => {
                    expect(ctrl.results[0].friendlyActivityDate).toBe('2019-05-14');
                    expect(ctrl.results[1].friendlyActivityDate).toBe('2019-05-14');
                    expect(ctrl.results[2].friendlyActivityDate).toBe('2019-05-14');
                    expect(ctrl.results[3].friendlyActivityDate).toBe('2019-05-14');
                });
            });

            describe('when parsing', () => {
                it('should call for details', () => {
                    ctrl.parse(ctrl.results[0]);
                    expect(networkService.getActivityById).toHaveBeenCalledWith(ctrl.results[0].id);
                });

                it('should handle Version creation', () => {
                    ctrl.parse(ctrl.results[0]);
                    scope.$digest();
                    expect(ctrl.results[0].action).toBe('"24-5" has been created');
                });

                it('should handle Version split', () => {
                    ctrl.parse(ctrl.results[1]);
                    scope.$digest();
                    expect(ctrl.results[1].action).toBe('Version 24 split to become 24 and 24-5');
                });
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
                });
            });
        });
    });
})();
