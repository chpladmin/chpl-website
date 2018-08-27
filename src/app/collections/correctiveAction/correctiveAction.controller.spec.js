(function () {
    'use strict';

    describe('the Products: Corrective Action controller', function () {

        var $log, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.collections', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, $rootScope, _networkService_) {
                $log = _$log_;
                networkService = _networkService_;

                scope = $rootScope.$new();
                vm = $controller('CorrectiveActionController', {
                    $scope: scope,
                    networkService: networkService,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });
    });
})();
