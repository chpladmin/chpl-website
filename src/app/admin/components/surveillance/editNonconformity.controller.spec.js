(function () {
    'use strict';

    describe('admin.EditNonconformityController.controller', function () {
        var vm, scope, $log, mock, Mock;

        mock = {};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss')
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.updateCP = jasmine.createSpy('updateCP');
                    return $delegate;
                });
            });

            inject(function ($controller, $rootScope, _$log_, _$q_, _commonService_, _Mock_) {
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
                    $scope: scope
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
                expect(mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });
        
        describe('business rules', function () {
            beforeEach(function () {
                vm.surveillance = angular.copy(Mock.surveillances[0]);
            });

            it('When creating a nonconformity, it should not require a Corrective Action Plan Must Complete Date when there is no entry for Corrective Action Plan Approval Date', function () {
                expect(vm.isCapMustCompleteRequired()).toBe(false);
            });
            
            it('When creating a nonconformity, it should require a Corrective Action Plan Must Complete Date when there is an entry for Corrective Action Plan Approval Date', function () {
                vm.nonconformity.capApprovalDateObject = '03/22/2017';
                expect(vm.isCapMustCompleteRequired()).toBe(true);
            });
            
            it('When editing a nonconformity, it should not require a Corrective Action Plan Must Complete Date when there is no entry for Corrective Action Plan Approval Date', function () {
                vm.workType = 'edit';
                expect(vm.isCapMustCompleteRequired()).toBe(false);
            });
            
            it('When editing a nonconformity, it should require a Corrective Action Plan Must Complete Date when there is an entry for Corrective Action Plan Approval Date', function () {
                vm.workType = 'edit';
                vm.nonconformity.capApprovalDateObject = '03/22/2017';
                expect(vm.isCapMustCompleteRequired()).toBe(true);
            });
            
            it('When adding a nonconformity, it should not require a Corrective Action Plan Must Complete Date when there is no entry for Corrective Action Plan Approval Date', function () {
                vm.workType = 'add';
                expect(vm.isCapMustCompleteRequired()).toBe(false);
            });
            
            it('When adding a nonconformity, it should require a Corrective Action Plan Must Complete Date when there is an entry for Corrective Action Plan Approval Date', function () {
                vm.workType = 'add';
                vm.nonconformity.capApprovalDateObject = '03/22/2017';
                expect(vm.isCapMustCompleteRequired()).toBe(true);
            });
        });
    });
})();
