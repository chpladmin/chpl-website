(function () {
    'use strict';

    describe('admin.EditNonconformityController.controller', function () {
        var vm, scope, $log, $q, commonService, mock;

        mock = {};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss')
        };

        beforeEach(function () {
            module('chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.updateCP = jasmine.createSpy('updateCP');
                    return $delegate;
                });
            });

            inject(function ($controller, $rootScope, _$log_, _$q_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.updateCP.and.returnValue($q.when(mock));

                scope = $rootScope.$new();
                vm = $controller('EditNonconformityController', {
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
    });
})();
