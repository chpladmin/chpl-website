(function () {
    'use strict';

    describe('admin.EditAdditionalSoftwareController.controller', function () {
        var $log, Mock, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin');

            inject(function ($controller, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('EditAdditionalSoftwareController', {
                    software: 'software',
                    $uibModalInstance: Mock.modalInstance,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('housekeeping', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });

            it('should have a way to close the modal', function () {
                expect(vm.save).toBeDefined();
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });
        });
    });
})();
