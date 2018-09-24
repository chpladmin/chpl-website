(function () {
    'use strict';

    describe('cms directive', function () {
        var $log, $q, authService, el, networkService, vm;

        var mock = {};
        mock.muuAccurateAsOfDate = new Date('2017-01-13');
        mock.newMuuAccurateDate = new Date('2017-02-25');

        beforeEach(function () {
            angular.mock.module('chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getCmsDownload = jasmine.createSpy('getCmsDownload');
                    $delegate.getMeaningfulUseUsersAccurateAsOfDate = jasmine.createSpy('getMeaningfulUseUsersAccurateAsOfDate');
                    $delegate.setMeaningfulUseUsersAccurateAsOfDate = jasmine.createSpy('setMeaningfulUseUsersAccurateAsOfDate');
                    return $delegate;
                });
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAcbAdmin = jasmine.createSpy('isAcbAdmin');
                    $delegate.isOncStaff = jasmine.createSpy('isOncStaff');
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    return $delegate;
                });
            });

            inject(function ($compile, _$log_, _$q_, $rootScope, _authService_, _networkService_) {
                $q = _$q_;
                $log = _$log_;
                networkService = _networkService_;
                networkService.getCmsDownload.and.returnValue($q.when({}));
                networkService.getMeaningfulUseUsersAccurateAsOfDate.and.returnValue($q.when({accurateAsOfDate: mock.muuAccurateAsOfDate}));
                networkService.setMeaningfulUseUsersAccurateAsOfDate.and.returnValue($q.when({accurateAsOfDate: mock.newMuuAccurateDate}));
                authService = _authService_;
                authService.isAcbAdmin.and.returnValue(true);
                authService.isOncStaff.and.returnValue(true);
                authService.isChplAdmin.and.returnValue(true);
                authService.getToken.and.returnValue('token');
                authService.getApiKey.and.returnValue('api-key');

                el = angular.element('<ai-cms-management></ai-cms-management>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
        });

        it('should know what the muu_accurate_as_of_date is', function () {
            expect(vm.muuAccurateAsOf).toEqual(mock.muuAccurateAsOfDate);
        });

        it('should be able to set muu_accurate_as_of', function () {
            vm.muuAccurateAsOfDateObject = mock.newMuuAccurateDate;
            vm.setMeaningfulUseUsersAccurateAsOfDate();
            el.isolateScope().$digest();
            expect(networkService.setMeaningfulUseUsersAccurateAsOfDate).toHaveBeenCalledWith({accurateAsOfDate: mock.newMuuAccurateDate.getTime()});
            expect(vm.muuAccurateAsOf).toEqual(mock.newMuuAccurateDate);
        });
    });
})();
