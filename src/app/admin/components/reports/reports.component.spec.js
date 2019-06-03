(function () {
    'use strict';

    fdescribe('the Admin Reports component', function () {

        var $compile, $log, $q, ctrl, el, networkService, scope;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getUserActivity = jasmine.createSpy('getUserActivity');
                    $delegate.getUserActivities = jasmine.createSpy('getUserActivities');
                    return $delegate;
                });
            });

            inject(function (_$compile_, $controller, _$log_, _$q_, $rootScope, _networkService_) {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;

                networkService = _networkService_;
                networkService.getUserActivity.and.returnValue($q.when([]));
                networkService.getUserActivities.and.returnValue($q.when([]));

                scope = $rootScope.$new()

                el = angular.element('<ai-reports></ai-reports');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            describe('helper functions', function () {
                describe('for refreshing', function () {
                    beforeEach(function () {
                        spyOn(ctrl, 'refreshUser');
                    });

                    it('should refresh the dev data specifically', function () {
                        ctrl.workType = 'dev';
                        ctrl.refreshActivity();
                        expect(ctrl.refreshUser).not.toHaveBeenCalled();
                    });

                    it('should refresh the users data specifically', function () {
                        ctrl.workType = 'users';
                        ctrl.refreshActivity();
                        expect(ctrl.refreshUser).toHaveBeenCalled();
                    });
                });

                describe('for date ranges', function () {
                    beforeEach(function () {
                        ctrl.activityRange = {
                            range: 60,
                            key: {
                                startDate: new Date('1/15/2017'),
                                endDate: new Date('2/15/2017'),
                            },
                        };
                    });

                    it('should have a function to determine if a date range is okay', function () {
                        expect(ctrl.validDates).toBeDefined()
                    });

                    it('should allow dates with less than the range separation', function () {
                        expect(ctrl.validDates('key')).toBe(true);
                    });

                    it('should not allow dates separated by more than the range', function () {
                        ctrl.activityRange.range = 1;
                        expect(ctrl.validDates('key')).toBe(false);
                    });

                    it('should not allow dates where start is after end', function () {
                        ctrl.activityRange.key.startDate = new Date('3/15/2017');
                        expect(ctrl.validDates('key')).toBe(false);
                    });

                    it('should correctly validate dates crossing DST', function () {
                        ctrl.activityRange = {
                            range: 60,
                            badDst: {
                                startDate: new Date('9/17/2017'),
                                endDate: new Date('11/16/2017'),
                            },
                            notDst: {
                                startDate: new Date('9/06/2017'),
                                endDate: new Date('11/04/2017'),
                            },
                            badNotDst: {
                                startDate: new Date('9/06/2017'),
                                endDate: new Date('11/05/2017'),
                            },
                        };
                        expect(ctrl.validDates('badDst')).toBe(false);
                        expect(ctrl.validDates('notDst')).toBe(true);
                        expect(ctrl.validDates('badNotDst')).toBe(false);
                    });
                });
            });
        });
    });
})();
