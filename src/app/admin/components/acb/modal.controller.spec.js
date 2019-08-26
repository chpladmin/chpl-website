(function () {
    'use strict';

    describe('the ACB Edit Modal controller', function () {
        var $log, $q, Mock, ctrl, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.admin', 'chpl.mock', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.createACB = jasmine.createSpy('createACB');
                    $delegate.modifyACB = jasmine.createSpy('modifyACB');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                ctrl = $controller;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.createACB.and.returnValue($q.when({}));
                networkService.modifyACB.and.returnValue($q.when({}));
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = ctrl('ModalAcbController', {
                    acb: {},
                    action: 'modify',
                    isChplAdmin: true,
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
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

        it('should create an address object if creating an ACB', function () {
            expect(vm.acb.address).toBeUndefined();
            vm = ctrl('ModalAcbController', {
                acb: {},
                action: 'create',
                isChplAdmin: true,
                $uibModalInstance: Mock.modalInstance,
                $scope: scope,
            });
            scope.$digest();
            expect(vm.acb.address).toEqual({});
        });

        describe('when updating an ACB', function () {
            it('should close the modal with the response on a good response', function () {
                networkService.modifyACB.and.returnValue($q.when({status: 200}));
                vm.save();
                scope.$digest();
                expect(networkService.modifyACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                networkService.modifyACB.and.returnValue($q.when({status: undefined}));
                vm.save();
                scope.$digest();
                expect(networkService.modifyACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                networkService.modifyACB.and.returnValue($q.when({status: 400}));
                vm.save();
                scope.$digest();
                expect(networkService.modifyACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should have error messages on a rejected save', function () {
                networkService.modifyACB.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.save();
                scope.$digest();
                expect(networkService.modifyACB).toHaveBeenCalled();
                expect(vm.error).toBe('the error');
            });
        });

        describe('when creating an ACB', function () {
            it('should close the modal with the response on a good response', function () {
                networkService.createACB.and.returnValue($q.when({status: 200}));
                vm.create();
                scope.$digest();
                expect(networkService.createACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                networkService.createACB.and.returnValue($q.when({status: undefined}));
                vm.create();
                scope.$digest();
                expect(networkService.createACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                networkService.createACB.and.returnValue($q.when({status: 400}));
                vm.create();
                scope.$digest();
                expect(networkService.createACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                networkService.createACB.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.create();
                scope.$digest();
                expect(networkService.createACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });
    });
})();
