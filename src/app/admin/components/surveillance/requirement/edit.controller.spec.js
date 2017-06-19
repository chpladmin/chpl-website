(function () {
    'use strict';

    describe('admin.EditRequirementController.controller', function () {
        var vm, scope, $log, Mock;

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin');

            inject(function ($controller, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('EditRequirementController', {
                    $scope: scope,
                    $uibModalInstance: Mock.modalInstance,
                    disableValidation: false,
                    randomized: false,
                    requirement: {},
                    surveillanceId: 1,
                    surveillanceTypes: {},
                    workType: 'create',
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
                /* eslint-enable no-console,angular/log */
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
        });
    });
})();
