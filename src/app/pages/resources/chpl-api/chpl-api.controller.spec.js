(function () {
    'use strict';

    describe('the CHPL API component', function () {

        var $log, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.chpl_api', 'chpl.constants');

            inject(function ($controller, _$log_, $rootScope) {
                $log = _$log_;

                scope = $rootScope.$new();
                vm = $controller('ChplApiController', {
                    $scope: scope,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should load have a swaggerUI at start', function () {
                expect(vm.swaggerUrl.length).toBeGreaterThan(0);
            });
        });
    });
})();
