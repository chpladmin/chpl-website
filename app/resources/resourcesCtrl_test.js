;(function () {
    'use strict';

    describe('app.resources', function () {

        var scope, ctrl, $log, authService;

        beforeEach(function () {
            var mockAuthService = {};
            module('app.resources', function($provide) {
                $provide.value('authService', mockAuthService);
            });

            inject(function($q) {
                mockAuthService.getApiKey = function () {
                    return $q.when('api key');
                };
            });
        });

        beforeEach(inject(function (_$log_, $rootScope, $controller) {
            $log = _$log_;
            scope = $rootScope.$new();
            ctrl = $controller('ResourcesController', {
                $scope: scope
            });
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should load have a swaggerUI at start', function () {
                expect(ctrl.swaggerUrl.length).toBeGreaterThan(0);
            });
        });
    });
})();
