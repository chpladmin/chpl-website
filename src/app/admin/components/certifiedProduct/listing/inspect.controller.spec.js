(function () {
    'use strict';

    describe('the Listing Inspection controller', function () {
        var $log, $q, Mock, mock, networkService, scope, vm;

        mock = {};
        mock.inspectingCp = {
            developer: { developerId: 1},
        };
        mock.resources = {
            bodies: [],
            classifications: [],
            practices: [],
            qmsStandards: [],
            accessibilityStandards: [],
            targetedUsers: [],
            statuses: [],
            testingLabs: [],
        }

        beforeEach(function () {
            module('chpl.admin', 'chpl.mock', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.confirmPendingCp = jasmine.createSpy('confirmPendingCp');
                    $delegate.getDeveloper = jasmine.createSpy('getDeveloper');
                    $delegate.rejectPendingCp = jasmine.createSpy('rejectPendingCp');

                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.confirmPendingCp.and.returnValue($q.when({}));
                networkService.getDeveloper.and.returnValue($q.when(Mock.developers[0]));
                networkService.rejectPendingCp.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('InspectController', {
                    $scope: scope,
                    $uibModalInstance: Mock.modalInstance,
                    developers: Mock.developers,
                    inspectingCp: mock.inspectingCp,
                    isAcbAdmin: true,
                    isChplAdmin: true,
                    resources: mock.resources,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
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

        describe('when confirming or rejecting', function () {
            it('should close the modal if confirmation is successful', function () {
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    status: 'confirmed',
                    developerCreated: false,
                    developer: undefined,
                });
            });

            it('should close the modal if rejection is successful', function () {
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'rejected'});
            });

            it('should not dismiss the modal if confirmation fails', function () {
                networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal if rejection fails', function () {
                networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should have error messages if confirmation fails', function () {
                networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.confirm();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should have error messages if rejection fails', function () {
                networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.reject();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should dismiss the modal with the contact if the pending listing was already resolved on confirmation', function () {
                var contact = {name: 'person'};
                networkService.confirmPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    contact: contact,
                    objectId: 1,
                    status: 'resolved',
                });
            });

            it('should dismiss the modal with the contact if the pending listing was already resolved on rejection', function () {
                var contact = {name: 'person'};
                networkService.rejectPendingCp.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    contact: contact,
                    objectId: 1,
                    status: 'resolved',
                });
            });
        });
    })
})();
