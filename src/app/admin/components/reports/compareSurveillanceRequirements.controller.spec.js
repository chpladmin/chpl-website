(function () {
    'use strict';

    describe('the Compare Surveillance Requirements controller', function () {
        var $log, Mock, mock, scope, vm;

        mock = {};
        mock.newSurv = {
            id: 1,
        };
        mock.oldSurv = {
            id: 2,
        };

        beforeEach(function () {
            angular.mock.module('chpl.admin', 'chpl.mock');

            inject(function ($controller, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('CompareSurveillanceRequirementsController', {
                    newSurveillance: mock.newSurv,
                    oldSurveillance: mock.oldSurv,
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have a way to close it\'s own modal', function () {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        it('should load new and old Surveillances', function () {
            expect(vm.oldSurveillance).toEqual(mock.oldSurv);
            expect(vm.newSurveillance).toEqual(mock.newSurv);
        });
    });
})();
