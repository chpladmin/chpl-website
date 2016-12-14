(function () {
    'use strict';

    describe('chpl.overview.controller', function () {
        var commonService, scope, vm, $log, $q, ctrl;
        beforeEach(function () {
            module('chpl.overview', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getAcbs = jasmine.createSpy('getAcbs');
                    $delegate.getAtls = jasmine.createSpy('getAtls');
                    $delegate.getAnnouncements = jasmine.createSpy('getAnnouncements');
                });
            });

            inject(function(_commonService_, _$log_, $controller, $q, $rootScope) {
                commonService = _commonService_;
                $log = _$log_;
                commonService.getAcbs.and.returnValue($q.when({acbs: [{id:0, name:'test-acb'}]}));
                commonService.getAtls.and.returnValue($q.when({atls: [{id:0, name:'test-atl'}]}));
                commonService.getAnnouncements.and.returnValue($q.when({announcements: [{title:0, description:'test-atl'}]}));

                ctrl = $controller;
                scope = $rootScope.$new();
                vm = ctrl('OverviewController');
                scope.$digest();
            });

            afterEach(function () {
                if ($log.debug.logs.length > 0) {
//                    console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
                }
            });

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
                commonService.getAcbs.and.returnValue($q.reject('expected error'));
                vm.loadAcbs();
                scope.$digest();
                expect($log.debug.logs.length).toBeGreaterThan(0);
            });

            it('should call the common service to load atls', function () {
                vm.loadAtls();
                expect(commonService.getAtls).toHaveBeenCalled();
            });

            it('should log an error if getAtls fails', function () {
                commonService.getAtls.and.returnValue($q.reject('expected error'));
                vm.loadAtls();
                scope.$digest();
                expect($log.debug.logs.length).toBeGreaterThan(0);
            });

            it('should call the common service to load announcements', function () {
                vm.loadAnnouncements();
                expect(commonService.getAnnouncements).toHaveBeenCalled();
            });

            it('should log an error if getAnnouncements fails', function () {
                commonService.getAnnouncements.and.returnValue($q.reject('expected error'));
                vm.loadAnnouncements();
                scope.$digest();
                expect($log.debug.logs.length).toBeGreaterThan(0);
            });
        });
    });
})();
