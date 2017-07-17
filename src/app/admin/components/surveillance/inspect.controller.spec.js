(function () {
    'use strict';

    describe('the Surveillance Inspection controller', function () {
        var $log, $q, $uibModal, Mock, actualOptions, commonService, scope, utilService, vm;

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.confirmPendingSurveillance = jasmine.createSpy('confirmPendingSurveillance');
                    $delegate.rejectPendingSurveillance = jasmine.createSpy('rejectPendingSurveillance');
                    $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
                    return $delegate;
                });
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.sortRequirements = jasmine.createSpy('sortRequirements');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _commonService_, _utilService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.confirmPendingSurveillance.and.returnValue($q.when([]));
                commonService.rejectPendingSurveillance.and.returnValue($q.when([]));
                commonService.getSurveillanceLookups.and.returnValue($q.when([]));
                utilService = _utilService_;
                utilService.sortRequirements.and.returnValue(1);
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                scope = $rootScope.$new();
                vm = $controller('SurveillanceInspectController', {
                    surveillance: Mock.surveillances[0],
                    $uibModalInstance: Mock.modalInstance,
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

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have a way to close it\'s own modal', function () {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        describe('when editing a Surveillance', function () {
            var surveillanceEditOptions;
            beforeEach(function () {
                surveillanceEditOptions = {
                    templateUrl: 'app/admin/components/surveillance/edit.html',
                    controller: 'EditSurveillanceController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        surveillance: jasmine.any(Function),
                        surveillanceTypes: jasmine.any(Function),
                        workType: jasmine.any(Function),
                    },
                };
                vm.surveillanceTypes = {
                    surveillanceRequirements: {
                        criteriaOptions2014: {},
                        criteriaOptions2015: {},
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.editModalInstance).toBeUndefined();
                vm.editSurveillance();
                expect(vm.editModalInstance).toBeDefined();
            });

            it('should resolve elements on that modal', function () {
                vm.editSurveillance();
                expect($uibModal.open).toHaveBeenCalledWith(surveillanceEditOptions);
                expect(actualOptions.resolve.surveillance()).toEqual(Mock.surveillances[0]);
                expect(actualOptions.resolve.surveillanceTypes()).toEqual({surveillanceRequirements: {
                    criteriaOptions2014: {},
                    criteriaOptions2015: {},
                    criteriaOptions: {},
                }});
                expect(actualOptions.resolve.workType()).toEqual('confirm');
                scope.$digest();
            });

            it('should do stuff with the returned data', function () {
                var surveillance = {id: 1};
                vm.editSurveillance();
                vm.editModalInstance.close(surveillance);
                expect(vm.surveillance).toEqual(surveillance);
            });

            it('should log a non-cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editSurveillance();
                vm.editModalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });

        describe('when confirming or rejecting', function () {
            it('should close the modal if confirmation is successful', function () {
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'confirmed'});
            });

            it('should close the modal if rejection is successful', function () {
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'rejected'});
            });

            it('should not dismiss the modal if confirmation fails', function () {
                commonService.confirmPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal if rejection fails', function () {
                commonService.rejectPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should have error messages if confirmation fails', function () {
                commonService.confirmPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.confirm();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should have error messages if rejection fails', function () {
                commonService.rejectPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.reject();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should dismiss the modal with the contact if the pending surveillance was already resolved on confirm', function () {
                var contact = {name: 'person'};
                commonService.confirmPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    contact: contact,
                    objectId: 1,
                    status: 'resolved',
                });
            });

            it('should dismiss the modal with the contact if the pending surveillance was already resolved on reject', function () {
                var contact = {name: 'person'};
                commonService.rejectPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    contact: contact,
                    objectId: 1,
                    status: 'resolved',
                });
            });
        });
    });
})();
