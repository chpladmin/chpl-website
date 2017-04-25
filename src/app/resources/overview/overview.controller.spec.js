(function () {
    'use strict';

    describe('chpl.overview', function () {
        var commonService, scope, vm, $log, $q;

        beforeEach(function () {
            module('chpl.overview', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getAcbs = jasmine.createSpy('getAcbs');
                    $delegate.getAtls = jasmine.createSpy('getAtls');
                    $delegate.getAnnouncements = jasmine.createSpy('getAnnouncements');

                    return $delegate;
                });
            });

            inject(function (_commonService_, _$log_, $controller, _$q_, $rootScope) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.getAcbs.and.returnValue($q.when({acbs: [{id:0, name:'test-acb'}]}));
                commonService.getAtls.and.returnValue($q.when({atls: [{id:0, name:'test-atl'}]}));
                commonService.getAnnouncements.and.returnValue($q.when({announcements: [{title:0, description:'test-atl'}]}));

                scope = $rootScope.$new();
                vm = $controller('OverviewController');
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should load acbs, atls, and announcements', function () {
                expect(vm.acbs.length).toBeGreaterThan(0);
                expect(vm.atls.length).toBeGreaterThan(0);
                expect(vm.announcements.length).toBeGreaterThan(0);
            });

            it('should call the common service to load acbs', function () {
                vm.loadAcbs();
                expect(commonService.getAcbs).toHaveBeenCalled();
            });

            it('should log an error if getAcbs fails', function () {
                var initLength = $log.error.logs.length
                commonService.getAcbs.and.returnValue($q.reject('expected error'));
                vm.loadAcbs();
                scope.$digest();
                expect($log.error.logs.length).toBe(initLength + 1);
            });

            it('should call the common service to load atls', function () {
                vm.loadAtls();
                expect(commonService.getAtls).toHaveBeenCalled();
            });

            it('should log an error if getAtls fails', function () {
                var initLength = $log.error.logs.length
                commonService.getAtls.and.returnValue($q.reject('expected error'));
                vm.loadAtls();
                scope.$digest();
                expect($log.error.logs.length).toBe(initLength + 1);
            });

            it('should call the common service to load announcements', function () {
                vm.loadAnnouncements();
                expect(commonService.getAnnouncements).toHaveBeenCalled();
            });

            it('should log an error if getAnnouncements fails', function () {
                var initLength = $log.error.logs.length
                commonService.getAnnouncements.and.returnValue($q.reject('expected error'));
                vm.loadAnnouncements();
                scope.$digest();
                expect($log.error.logs.length).toBe(initLength + 1);
            });
        });
    });
})();
