;(function () {
    'use strict';

    describe('app.overview', function () {

        beforeEach(function () {
            module('app.overview');
        });

        it('should map /overview route to /overview/overview.html', function () {
            inject(function($route) {
                expect($route.routes['/overview'].templateUrl).toEqual('overview/overview.html');
            });
        });

        describe('controller', function () {

            var commonService, mockCommonService, scope, ctrl, $log, $location, $q;

            beforeEach(function () {
                mockCommonService = {};
                module('app.overview', function($provide) {
                    $provide.value('commonService', mockCommonService);
                });

                inject(function($q) {
                    mockCommonService.getAcbs = function () {
                        return $q.when({acbs: [{id:0, name:'test-acb'}]});
                    };
                    mockCommonService.getAtls = function () {
                        return $q.when({atls: [{id:0, name:'test-atl'}]});
                    };
                    mockCommonService.getAnnouncements = function () {
                        return $q.when({announcements: [{title:0, description:'test-atl'}]});
                    };
                });
            });

            beforeEach(inject(function (_$log_, $rootScope, $controller, _commonService_, _$location_, _$q_) {
                $log = _$log_;
                scope = $rootScope.$new();
                commonService = _commonService_;
                $q = _$q_
                ctrl = $controller('OverviewController', {
                    $scope: scope,
                    commonService: commonService
                });
                scope.$digest();
            }));

            afterEach(function () {
                if ($log.debug.logs.length > 0) {
//                    console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
                }
            });

            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should load acbs, atls, and announcements', function () {
                expect(ctrl.acbs.length).toBeGreaterThan(0);
                expect(ctrl.atls.length).toBeGreaterThan(0);
                expect(ctrl.announcements.length).toBeGreaterThan(0);
            });

            it('should call the common service to load acbs', function () {
                spyOn(commonService, 'getAcbs').and.callThrough();
                ctrl.loadAcbs();
                expect(commonService.getAcbs).toHaveBeenCalled();
            });

            it('should log an error if getAcbs fails', function () {
                var deferred = $q.defer();
                spyOn(commonService, 'getAcbs').and.returnValue(deferred.promise);
                ctrl.loadAcbs();
                deferred.reject('expected error');
                scope.$digest();
                expect($log.debug.logs.length).toBeGreaterThan(0);
            });

            it('should call the common service to load atls', function () {
                spyOn(commonService, 'getAtls').and.callThrough();
                ctrl.loadAtls();
                expect(commonService.getAtls).toHaveBeenCalled();
            });

            it('should log an error if getAtls fails', function () {
                var deferred = $q.defer();
                spyOn(commonService, 'getAtls').and.returnValue(deferred.promise);
                ctrl.loadAtls();
                deferred.reject('expected error');
                scope.$digest();
                expect($log.debug.logs.length).toBeGreaterThan(0);
            });

            it('should call the common service to load announcements', function () {
                spyOn(commonService, 'getAnnouncements').and.callThrough();
                ctrl.loadAnnouncements();
                expect(commonService.getAnnouncements).toHaveBeenCalled();
            });

            it('should log an error if getAnnouncements fails', function () {
                var deferred = $q.defer();
                spyOn(commonService, 'getAnnouncements').and.returnValue(deferred.promise);
                ctrl.loadAnnouncements();
                deferred.reject('expected error');
                scope.$digest();
                expect($log.debug.logs.length).toBeGreaterThan(0);
            });

        });
    });
})();
