(function () {
    'use strict';

    describe('admin.EditSurveillanceController.controller', function () {
        var vm, scope, $log, $q, commonService, utilService, mock, Mock;

        mock = {};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss'),
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.updateCP = jasmine.createSpy('updateCP');
                    return $delegate;
                });
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.sortRequirements = jasmine.createSpy('sortRequirements');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _commonService_, _utilService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.updateCP.and.returnValue($q.when(mock));
                utilService = _utilService_;
                utilService.sortRequirements.and.returnValue(1);
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('EditSurveillanceController', {
                    surveillance: Mock.surveillances[0],
                    surveillanceTypes: Mock.surveillanceData,
                    workType: 'edit',
                    $uibModalInstance: mock.modalInstance,
                    $scope: scope,
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

            it('should not require an end date when there are open NCs', function () {
                expect(vm.missingEndDate()).toBe(false);
            });

            it('should require an end date when all NCs are closed and there\'s no surveillance end date', function () {
                vm.surveillance.requirements[0].nonconformities[0].status = {id:2, name: 'Closed'};
                expect(vm.missingEndDate()).toBe(true);
            });

            it('should require an end date when there are no NCs and there\'s no surveillance end date', function () {
                vm.surveillance.requirements[0].nonconformities = [];
                expect(vm.missingEndDate()).toBe(true);
            });

            it('should not require an end date when all NCs are closed and the surveillance has an end date', function () {
                vm.surveillance.requirements[0].nonconformities[0].status = {id:2, name: 'Closed'};
                vm.surveillance.endDateObject = '1472702800000';
                expect(vm.missingEndDate()).toBe(false);
            });
        });
    });
})();
