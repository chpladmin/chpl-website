;(function () {
    'use strict';

    describe('app.nav', function () {

        beforeEach(function () {
            module('app.nav');
        });

        describe('controller', function () {

            var authService, mockAuthService, ctrl, $log, scope;
            var API_Key = 'Fake api key here';

            beforeEach(function () {
                mockAuthService = {};
                module('app.nav', function($provide) {
                    $provide.value('authService', mockAuthService);
                });

                inject(function($q) {
                    mockAuthService.getApiKey = function () {
                        return API_Key;
                    };
                });
            });

            beforeEach(inject(function (_$log_, $rootScope, $controller, _authService_) {
                $log = _$log_;
                scope = $rootScope.$new();
                authService = _authService_;
                ctrl = $controller('ProductListingController', {
                    $scope: scope,
                    authService: authService
                });
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

            it('should have the API_Key available', function () {
                expect(ctrl.API_KEY).toBe(API_Key);
            });
        });
    });
})();
