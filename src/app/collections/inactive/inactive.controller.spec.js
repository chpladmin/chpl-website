(function () {
    'use strict';

    describe('chpl.collections.inactive.controller', function () {

        var $log, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.collections');

            inject(function ($controller, _$log_, $rootScope) {
                $log = _$log_;

                scope = $rootScope.$new();
                vm = $controller('InactiveCertificatesController', {
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

        it('should exist', function () {
            expect(vm).toBeDefined();
        });
    });
})();
