(function () {
    'use strict';

    describe('admin.inspectCertifiedProduct.controller', function () {
        var vm, scope, $log, $q, commonService, mock, Mock;

        mock = {};
        mock.inspectingCp = {
            developer: { developerId: 1}
        };
        mock.resources = {
            bodies: [],
            classifications: [],
            practices: [],
            qmsStandards: [],
            accessibilityStandards: [],
            targetedUsers: [],
            statuses: [],
            testingLabs: []
        }

        beforeEach(function () {
            module('chpl.admin', 'chpl.mock', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getDeveloper = jasmine.createSpy('getDeveloper');
                    $delegate.rejectPendingCp = jasmine.createSpy('rejectPendingCp');

                    return $delegate;
                });
            });

            inject(function ($controller, $rootScope, _$log_, _$q_, _commonService_, _Mock_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                commonService = _commonService_;
                commonService.getDeveloper.and.returnValue($q.when(Mock.developers[0]));
                commonService.rejectPendingCp.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('InspectController', {
                    $scope: scope,
                    $uibModalInstance: Mock.modalInstance,
                    developers: Mock.developers,
                    inspectingCp: mock.inspectingCp,
                    isAcbAdmin: true,
                    isAcbStaff: true,
                    isChplAdmin: true,
                    resources: mock.resources
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
        });

        describe('rejecting a pending Listing', function () {
            it('should close the modal if rejection is successful', function () {
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should not dismiss the modal if rejection fails', function () {
                commonService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should have error messages if rejection fails', function () {
                commonService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.reject();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });
        });
    })
})();
