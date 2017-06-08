(function () {
    'use strict';

    describe('chpl.admin.reports.directive', function () {

        var el, $log, $q, commonService, authService, vm, Mock;

        beforeEach(function () {
            module('chpl.mock', 'chpl.templates', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAcbAdmin = jasmine.createSpy('isAcbAdmin');
                    $delegate.isAcbStaff = jasmine.createSpy('isAcbStaff');
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    $delegate.isOncStaff = jasmine.createSpy('isOncStaff');
                    return $delegate;
                });

                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getCertifiedProductActivity = jasmine.createSpy('getCertifiedProductActivity');
                    $delegate.getDeveloperActivity = jasmine.createSpy('getDeveloperActivity');
                    $delegate.getProductActivity = jasmine.createSpy('getProductActivity');
                    $delegate.getVersionActivity = jasmine.createSpy('getVersionActivity');
                    $delegate.getAcbActivity = jasmine.createSpy('getAcbActivity');
                    $delegate.getAtlActivity = jasmine.createSpy('getAtlActivity');
                    $delegate.getAnnouncementActivity = jasmine.createSpy('getAnnouncementActivity');
                    $delegate.getUserActivity = jasmine.createSpy('getUserActivity');
                    $delegate.getUserActivities = jasmine.createSpy('getUserActivities');
                    $delegate.getApiUserActivity = jasmine.createSpy('getApiUserActivity');
                    $delegate.getApiActivity = jasmine.createSpy('getApiActivity');
                    $delegate.getApiUsers = jasmine.createSpy('getApiUsers');
                    $delegate.getSingleCertifiedProductActivity = jasmine.createSpy('getSingleCertifiedProductActivity');
                    return $delegate;
                });
            });

            inject(function ($compile, $controller, _$log_, _$q_, $rootScope, _Mock_, _authService_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                authService = _authService_;
                authService.isAcbAdmin.and.returnValue($q.when(true));
                authService.isAcbStaff.and.returnValue($q.when(true));
                authService.isChplAdmin.and.returnValue($q.when(true));
                authService.isOncStaff.and.returnValue($q.when(true));
                commonService = _commonService_;
                commonService.getCertifiedProductActivity.and.returnValue($q.when(Mock.listingActivity));
                commonService.getDeveloperActivity.and.returnValue($q.when([]));
                commonService.getProductActivity.and.returnValue($q.when([]));
                commonService.getVersionActivity.and.returnValue($q.when([]));
                commonService.getAcbActivity.and.returnValue($q.when([]));
                commonService.getAtlActivity.and.returnValue($q.when([]));
                commonService.getAnnouncementActivity.and.returnValue($q.when([]));
                commonService.getUserActivity.and.returnValue($q.when([]));
                commonService.getUserActivities.and.returnValue($q.when([]));
                commonService.getApiUserActivity.and.returnValue($q.when([]));
                commonService.getApiActivity.and.returnValue($q.when([]));
                commonService.getApiUsers.and.returnValue($q.when([]));
                commonService.getSingleCertifiedProductActivity.and.returnValue($q.when([]));
                el = angular.element('<ai-reports></ai-reports');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {
            it('should have loaded activity', function () {
                expect(vm.searchedCertifiedProducts).toBeDefined();
            });

            it('should know if the logged in user is ACB and/or CHPL admin', function () {
                expect(vm.isAcbAdmin).toBeTruthy();
                expect(vm.isChplAdmin).toBeTruthy();
            });
        });

        describe('date ranges', function () {
            beforeEach(function () {
                vm.activityRange = {
                    range: 60,
                    key: {
                        startDate: new Date('1/15/2017'),
                        endDate: new Date('2/15/2017'),
                    },
                };
            });

            it('should have a function to determine if a date range is okay', function () {
                expect(vm.validDates).toBeDefined()
            });

            it('should allow dates with less than the range separation', function () {
                expect(vm.validDates('key')).toBe(true);
            });

            it('should not allow dates separated by more than the range', function () {
                vm.activityRange.range = 1;
                expect(vm.validDates('key')).toBe(false);
            });

            it('should not allow dates where start is after end', function () {
                vm.activityRange.key.startDate = new Date('3/15/2017');
                expect(vm.validDates('key')).toBe(false);
            });
        });
    });
})();
