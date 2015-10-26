;(function () {
    'use strict';

    describe('app.registration', function () {

        beforeEach(function () {
            module('app.registration');
        });

        it('should map /registration/confirm-user/:hash route to /registration/confirm-user.html', function () {
            inject(function($route) {
                expect($route.routes['/registration/confirm-user/:hash'].templateUrl).toEqual('registration/confirm-user.html');
            });
        });

        describe('controller', function () {

            var commonService, mockCommonService, scope, ctrl, $log, $location;
            var confirmUser;

            beforeEach(function () {
                mockCommonService = {};
                module('app.registration', function($provide) {
                    $provide.value('commonService', mockCommonService);
                });

                inject(function($q) {
                    mockCommonService.confirmUser = function () {
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    };
                });
            });

            beforeEach(inject(function (_$log_, $rootScope, $controller, _commonService_, _$location_) {
                $log = _$log_;
                scope = $rootScope.$new();
                commonService = _commonService_;
                $location = _$location_;
                ctrl = $controller('ConfirmController', {
                    $scope: scope,
                    $routeParams: {hash: 'fakehash'},
                    commonService: commonService,
                    $location: $location
                });
                confirmUser = {hash: 'fakehash'};
                scope.$digest();
            }));

            afterEach(function () {
                if ($log.debug.logs.length > 0) {
                    console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
                }
            });

            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should have a "confirm user" function', function () {
                expect(ctrl.confirmUser).toBeDefined();
            });

            it('should have the hash as the string to confirm with', function () {
                expect(ctrl.userDetails).toBe('fakehash');
            });
        });
    });
})();
