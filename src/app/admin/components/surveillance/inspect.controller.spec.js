(() => {
    'use strict';

    fdescribe('the Surveillance Inspection controller', () => {
        var $log, $q, $uibModal, Mock, actualOptions, networkService, scope, utilService, vm;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.admin', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.confirmPendingSurveillance = jasmine.createSpy('confirmPendingSurveillance');
                    $delegate.rejectPendingSurveillance = jasmine.createSpy('rejectPendingSurveillance');
                    $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
                    return $delegate;
                });
                $provide.decorator('utilService', $delegate => {
                    $delegate.sortRequirements = jasmine.createSpy('sortRequirements');
                    return $delegate;
                });
            });

            inject(($controller, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _networkService_, _utilService_) => {
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.confirmPendingSurveillance.and.returnValue($q.when([]));
                networkService.rejectPendingSurveillance.and.returnValue($q.when([]));
                networkService.getSurveillanceLookups.and.returnValue($q.when([]));
                utilService = _utilService_;
                utilService.sortRequirements.and.returnValue(1);
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(options => {
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

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', () => {
            expect(vm).toBeDefined();
        });

        it('should have a way to close it\'s own modal', () => {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        describe('when editing a Surveillance', () => {
            var surveillanceEditOptions;
            beforeEach(() => {
                surveillanceEditOptions = {
                    component: 'aiSurveillanceEdit',
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

            it('should create a modal instance', () => {
                expect(vm.editModalInstance).toBeUndefined();
                vm.editSurveillance();
                expect(vm.editModalInstance).toBeDefined();
            });

            it('should resolve elements on that modal', () => {
                vm.editSurveillance();
                expect($uibModal.open).toHaveBeenCalledWith(surveillanceEditOptions);
                expect(actualOptions.resolve.surveillance()).toEqual(Mock.surveillances[0]);
                expect(actualOptions.resolve.surveillanceTypes()).toEqual({surveillanceRequirements: {
                    criteriaOptions2014: {},
                    criteriaOptions2015: {},
                    criteriaOptions: {},
                }});
                expect(actualOptions.resolve.workType()).toEqual('confirm');
            });

            it('should do stuff with the returned data', () => {
                var surveillance = {id: 1};
                vm.editSurveillance();
                vm.editModalInstance.close(surveillance);
                expect(vm.surveillance).toEqual(surveillance);
            });

            it('should log a non-cancelled modal', () => {
                var logCount = $log.info.logs.length;
                vm.editSurveillance();
                vm.editModalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should not log a cancelled modal', () => {
                var logCount = $log.info.logs.length;
                vm.editSurveillance();
                vm.editModalInstance.dismiss('cancelled');
                expect($log.info.logs.length).toBe(logCount);
            });

            it('should pass in only the appropriate edition of requirements', () => {
                vm.surveillanceTypes = {
                    surveillanceRequirements: {
                        criteriaOptions2014: [2014],
                        criteriaOptions2015: [2015],
                    },
                };
                vm.surveillance.certifiedProduct.edition = '2011';
                vm.editSurveillance();
                expect(vm.surveillanceTypes.surveillanceRequirements.criteriaOptions).toEqual();
                vm.surveillance.certifiedProduct.edition = '2015';
                vm.editSurveillance();
                expect(vm.surveillanceTypes.surveillanceRequirements.criteriaOptions).toEqual([2015]);
                vm.surveillance.certifiedProduct.edition = '2014';
                vm.editSurveillance();
                expect(vm.surveillanceTypes.surveillanceRequirements.criteriaOptions).toEqual([2014]);
            });

        });

        describe('when confirming or rejecting', () => {
            it('should close the modal if confirmation is successful', () => {
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'confirmed'});
            });

            it('should close the modal if rejection is successful', () => {
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'rejected'});
            });

            it('should not dismiss the modal if confirmation fails', () => {
                networkService.confirmPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal if rejection fails', () => {
                networkService.rejectPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: []}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should have error messages if confirmation fails', () => {
                networkService.confirmPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.confirm();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should have error messages if rejection fails', () => {
                networkService.rejectPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: [1,2]}}));
                vm.reject();
                scope.$digest();
                expect(vm.errorMessages).toEqual([1,2]);
            });

            it('should have error messages as statusText if confirmation fails', () => {
                networkService.confirmPendingSurveillance.and.returnValue($q.reject({statusText: 'an error', data: {}}));
                vm.confirm();
                scope.$digest();
                expect(vm.errorMessages).toEqual(['an error']);
            });

            it('should dismiss the modal with the contact if the pending surveillance was already resolved on confirm', () => {
                var contact = {name: 'person'};
                networkService.confirmPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
                vm.confirm();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    contact: contact,
                    objectId: 1,
                    status: 'resolved',
                });
            });

            it('should dismiss the modal with the contact if the pending surveillance was already resolved on reject', () => {
                var contact = {name: 'person'};
                networkService.rejectPendingSurveillance.and.returnValue($q.reject({data: {errorMessages: [1,2], contact: contact, objectId: 1}}));
                vm.reject();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    contact: contact,
                    objectId: 1,
                    status: 'resolved',
                });
            });
        });

        describe('when inspecting nonconformities', () => {
            var modalOptions;
            beforeEach(() => {
                modalOptions = {
                    component: 'aiSurveillanceNonconformityInspect',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        nonconformities: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', () => {
                expect(vm.modalInstance).toBeUndefined();
                vm.inspectNonconformities();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements on that modal', () => {
                var noncons = [1,2,3];
                vm.inspectNonconformities(noncons);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.nonconformities()).toEqual(noncons);
            });
        });
    });
})();
