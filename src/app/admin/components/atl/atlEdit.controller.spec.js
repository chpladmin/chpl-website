(function () {
    'use strict';

    describe('the ATL Edit Modal controller', function () {
        var $log, $q, Mock, ctrl, networkService, scope, vm;

        beforeEach(function () {
            module('chpl', 'chpl.mock', 'chpl.templates', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.createATL = jasmine.createSpy('createATL');
                    $delegate.deleteATL = jasmine.createSpy('deleteATL');
                    $delegate.modifyATL = jasmine.createSpy('modifyATL');
                    $delegate.undeleteATL = jasmine.createSpy('undeleteATL');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                ctrl = $controller;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.createATL.and.returnValue($q.when({}));
                networkService.deleteATL.and.returnValue($q.when({}));
                networkService.modifyATL.and.returnValue($q.when({}));
                networkService.undeleteATL.and.returnValue($q.when({}));
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = ctrl('EditAtlController', {
                    atl: {},
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

        it('should create an address object if creating an ATL', function () {
            expect(vm.atl.address).toBeUndefined();
            vm = ctrl('EditAtlController', {
                atl: {},
                action: 'create',
                isChplAdmin: true,
                $uibModalInstance: Mock.modalInstance,
                $scope: scope,
            });
            scope.$digest();
            expect(vm.atl.address).toEqual({});
        });

        describe('when updating an ATL', function () {
            it('should close the modal with the response on a good response', function () {
                networkService.modifyATL.and.returnValue($q.when({status: 200}));
                vm.save();
                scope.$digest();
                expect(networkService.modifyATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                networkService.modifyATL.and.returnValue($q.when({status: undefined}));
                vm.save();
                scope.$digest();
                expect(networkService.modifyATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                networkService.modifyATL.and.returnValue($q.when({status: 400}));
                vm.save();
                scope.$digest();
                expect(networkService.modifyATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                networkService.modifyATL.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.save();
                scope.$digest();
                expect(networkService.modifyATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });

        describe('when creating an ATL', function () {
            it('should close the modal with the response on a good response', function () {
                networkService.createATL.and.returnValue($q.when({status: 200}));
                vm.create();
                scope.$digest();
                expect(networkService.createATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                networkService.createATL.and.returnValue($q.when({status: undefined}));
                vm.create();
                scope.$digest();
                expect(networkService.createATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                networkService.createATL.and.returnValue($q.when({status: 400}));
                vm.create();
                scope.$digest();
                expect(networkService.createATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                networkService.createATL.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.create();
                scope.$digest();
                expect(networkService.createATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });

        describe('when deleting an ATL', function () {
            it('should close the modal with the response on a good response', function () {
                networkService.deleteATL.and.returnValue($q.when({status: 200}));
                vm.deleteAtl();
                scope.$digest();
                expect(networkService.deleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith('deleted');

                networkService.deleteATL.and.returnValue($q.when({status: undefined}));
                vm.deleteAtl();
                scope.$digest();
                expect(networkService.deleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith('deleted');
            });

            it('should dismiss the modal with an error on a bad response', function () {
                networkService.deleteATL.and.returnValue($q.when({status: 400}));
                vm.deleteAtl();
                scope.$digest();
                expect(networkService.deleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                networkService.deleteATL.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.deleteAtl();
                scope.$digest();
                expect(networkService.deleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });

        describe('when undeleting an ATL', function () {
            it('should close the modal with the response on a good response', function () {
                networkService.undeleteATL.and.returnValue($q.when({status: 200}));
                vm.undeleteAtl();
                scope.$digest();
                expect(networkService.undeleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                networkService.undeleteATL.and.returnValue($q.when({status: undefined}));
                vm.undeleteAtl();
                scope.$digest();
                expect(networkService.undeleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                networkService.undeleteATL.and.returnValue($q.when({status: 400}));
                vm.undeleteAtl();
                scope.$digest();
                expect(networkService.undeleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                networkService.undeleteATL.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.undeleteAtl();
                scope.$digest();
                expect(networkService.undeleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });
    });
})();
