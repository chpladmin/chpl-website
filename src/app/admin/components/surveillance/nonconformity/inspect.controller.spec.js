(function () {
    'use strict';

    describe('admin.NonconformityInspectController.controller', function () {
        var vm, scope, $log, Mock;

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin');

            inject(function ($controller, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('NonconformityInspectController', {
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                    nonconformities: [],
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
