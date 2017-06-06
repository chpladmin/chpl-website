(function () {
    'use strict';

    describe('chpl.registration', function () {

        beforeEach(function () {
            module('chpl.registration');
        });

        describe('controller', function () {

            var commonService, mockCommonService, scope, ctrl, $log, $location;

            beforeEach(function () {
                mockCommonService = {};
                module('chpl.registration', function ($provide) {
                    $provide.value('commonService', mockCommonService);
                });

                inject(function ($q) {
                    mockCommonService.confirmUser = function () {
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    };
                });
            });

            beforeEach(inject(function ($controller, _$location_, _$log_, $rootScope, _commonService_) {
                $log = _$log_;
                scope = $rootScope.$new();
                commonService = _commonService_;
                $location = _$location_;
                ctrl = $controller('ConfirmController', {
                    $scope: scope,
                    $routeParams: {hash: 'fakehash'},
                    commonService: commonService,
                    $location: $location,
                });
                scope.$digest();
            }));

            afterEach(function () {
                if ($log.debug.logs.length > 0) {
                    //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
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
