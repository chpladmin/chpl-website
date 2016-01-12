;(function () {
    'use strict';

    describe('app.api', function () {

        var scope, ctrl, $log;

        beforeEach(function () {
            module('app.api');
        });

        beforeEach(inject(function (_$log_, $rootScope, $controller) {
            $log = _$log_;
            scope = $rootScope.$new();
            ctrl = $controller('ApiController', {
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
