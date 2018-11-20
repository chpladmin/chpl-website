(function () {
    'use strict';

    describe('chpl.overview', function () {
        var $log, $q, mock, networkService, scope, vm;

        mock = {
            acbs: [{id: 0, name: 'test-acb'}, {id: 1, name: 'retired-acb', retired: true}],
            atls: [{id: 0, name: 'test-atl'}, {id: 1, name: 'retired-atl', retired: true}],
        };

        beforeEach(function () {
            angular.mock.module('chpl.overview', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getAcbs = jasmine.createSpy('getAcbs');
                    $delegate.getAtls = jasmine.createSpy('getAtls');
                    $delegate.getAnnouncements = jasmine.createSpy('getAnnouncements');

                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getAcbs.and.returnValue($q.when({ acbs: mock.acbs }));
                networkService.getAtls.and.returnValue($q.when({ atls: mock.atls }));
                networkService.getAnnouncements.and.returnValue($q.when({announcements: [{title: 0, description: 'test-atl'}]}));

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
                expect(networkService.getAcbs).toHaveBeenCalled();
            });

            it('should filter out retired acbs', () => {
                expect(vm.acbs.length).toBe(mock.acbs.length - 1);
            });

            it('should filter out retired atls', () => {
                expect(vm.atls.length).toBe(mock.atls.length - 1);
            });

            it('should log an error if getAcbs fails', function () {
                var initLength = $log.error.logs.length
                networkService.getAcbs.and.returnValue($q.reject('expected error'));
                vm.loadAcbs();
                scope.$digest();
                expect($log.error.logs.length).toBe(initLength + 1);
            });

            it('should call the common service to load atls', function () {
                vm.loadAtls();
                expect(networkService.getAtls).toHaveBeenCalled();
            });

            it('should log an error if getAtls fails', function () {
                var initLength = $log.error.logs.length
                networkService.getAtls.and.returnValue($q.reject('expected error'));
                vm.loadAtls();
                scope.$digest();
                expect($log.error.logs.length).toBe(initLength + 1);
            });

            it('should call the common service to load announcements', function () {
                vm.loadAnnouncements();
                expect(networkService.getAnnouncements).toHaveBeenCalled();
            });

            it('should log an error if getAnnouncements fails', function () {
                var initLength = $log.error.logs.length
                networkService.getAnnouncements.and.returnValue($q.reject('expected error'));
                vm.loadAnnouncements();
                scope.$digest();
                expect($log.error.logs.length).toBe(initLength + 1);
            });
        });
    });
})();
