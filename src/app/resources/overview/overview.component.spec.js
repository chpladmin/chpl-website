(function () {
    'use strict';

    fdescribe('the CHPL Overview component', function () {
        var $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            acbs: [{id: 0, name: 'test-acb', retired: false}, {id: 1, name: 'retired-acb', retired: true}],
            atls: [{id: 0, name: 'test-atl', retired: false}, {id: 1, name: 'retired-atl', retired: true}],
            announcements: [{title: 0, description: 'test-atl'}],
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

            inject(function ($compile, _$log_, _$q_, $rootScope, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getAcbs.and.returnValue($q.when({ acbs: mock.acbs }));
                networkService.getAtls.and.returnValue($q.when({ atls: mock.atls }));
                networkService.getAnnouncements.and.returnValue($q.when({announcements: mock.announcements}));

                el = angular.element('<ai-overview></ai-overview>');
                scope = $rootScope.$new();
                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should load acbs, atls, and announcements', function () {
                expect(ctrl.acbs.length).toBeGreaterThan(0);
                expect(ctrl.atls.length).toBeGreaterThan(0);
                expect(ctrl.announcements.length).toBeGreaterThan(0);
            });

            it('should call the common service to load acbs', function () {
                ctrl.loadAcbs();
                expect(networkService.getAcbs).toHaveBeenCalled();
            });

            it('should filter out retired acbs', () => {
                expect(ctrl.acbs.length).toBe(mock.acbs.length - 1);
            });

            it('should filter out retired atls', () => {
                expect(ctrl.atls.length).toBe(mock.atls.length - 1);
            });

            it('should log an error if getAcbs fails', function () {
                var initLength = $log.error.logs.length
                networkService.getAcbs.and.returnValue($q.reject('expected error'));
                ctrl.loadAcbs();
                scope.$digest();
                expect($log.error.logs.length).toBe(initLength + 1);
            });

            it('should call the common service to load atls', function () {
                ctrl.loadAtls();
                expect(networkService.getAtls).toHaveBeenCalled();
            });

            it('should log an error if getAtls fails', function () {
                var initLength = $log.error.logs.length
                networkService.getAtls.and.returnValue($q.reject('expected error'));
                ctrl.loadAtls();
                scope.$digest();
                expect($log.error.logs.length).toBe(initLength + 1);
            });

            it('should call the common service to load announcements', function () {
                ctrl.loadAnnouncements();
                expect(networkService.getAnnouncements).toHaveBeenCalled();
            });

            it('should log an error if getAnnouncements fails', function () {
                var initLength = $log.error.logs.length
                networkService.getAnnouncements.and.returnValue($q.reject('expected error'));
                ctrl.loadAnnouncements();
                scope.$digest();
                expect($log.error.logs.length).toBe(initLength + 1);
            });
        });
    });
})();
