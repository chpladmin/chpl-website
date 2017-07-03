(function () {
    'use strict';

    describe('admin.EditNonconformityController.controller', function () {
        var $log, Mock, mock, scope, vm;

        mock = {};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss'),
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin');

            inject(function ($controller, _$log_, $rootScope, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('EditNonconformityController', {
                    surveillance: Mock.surveillances[0],
                    surveillanceTypes: {},
                    disableValidation: false,
                    nonconformity: {},
                    randomized: false,
                    requirementId: 1,
                    surveillanceId: 1,
                    workType: 'create',
                    $uibModalInstance: mock.modalInstance,
                    $scope: scope,
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
                expect(mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });
    });
})();
