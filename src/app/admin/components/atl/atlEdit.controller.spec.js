(function () {
    'use strict';

    describe('the ATL Edit Modal controller', function () {
        var $log, $q, Mock, commonService, ctrl, scope, vm;

        beforeEach(function () {
            module('chpl', 'chpl.mock', 'chpl.templates', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.createATL = jasmine.createSpy('createATL');
                    $delegate.deleteATL = jasmine.createSpy('deleteATL');
                    $delegate.modifyATL = jasmine.createSpy('modifyATL');
                    $delegate.undeleteATL = jasmine.createSpy('undeleteATL');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _commonService_) {
                ctrl = $controller;
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.createATL.and.returnValue($q.when({}));
                commonService.deleteATL.and.returnValue($q.when({}));
                commonService.modifyATL.and.returnValue($q.when({}));
                commonService.undeleteATL.and.returnValue($q.when({}));
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
                commonService.modifyATL.and.returnValue($q.when({status: 200}));
                vm.save();
                scope.$digest();
                expect(commonService.modifyATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                commonService.modifyATL.and.returnValue($q.when({status: undefined}));
                vm.save();
                scope.$digest();
                expect(commonService.modifyATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                commonService.modifyATL.and.returnValue($q.when({status: 400}));
                vm.save();
                scope.$digest();
                expect(commonService.modifyATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                commonService.modifyATL.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.save();
                scope.$digest();
                expect(commonService.modifyATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });

        describe('when creating an ATL', function () {
            it('should close the modal with the response on a good response', function () {
                commonService.createATL.and.returnValue($q.when({status: 200}));
                vm.create();
                scope.$digest();
                expect(commonService.createATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                commonService.createATL.and.returnValue($q.when({status: undefined}));
                vm.create();
                scope.$digest();
                expect(commonService.createATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                commonService.createATL.and.returnValue($q.when({status: 400}));
                vm.create();
                scope.$digest();
                expect(commonService.createATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                commonService.createATL.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.create();
                scope.$digest();
                expect(commonService.createATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });

        describe('when deleting an ATL', function () {
            it('should close the modal with the response on a good response', function () {
                commonService.deleteATL.and.returnValue($q.when({status: 200}));
                vm.deleteAtl();
                scope.$digest();
                expect(commonService.deleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith('deleted');

                commonService.deleteATL.and.returnValue($q.when({status: undefined}));
                vm.deleteAtl();
                scope.$digest();
                expect(commonService.deleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith('deleted');
            });

            it('should dismiss the modal with an error on a bad response', function () {
                commonService.deleteATL.and.returnValue($q.when({status: 400}));
                vm.deleteAtl();
                scope.$digest();
                expect(commonService.deleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                commonService.deleteATL.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.deleteAtl();
                scope.$digest();
                expect(commonService.deleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });

        describe('when undeleting an ATL', function () {
            it('should close the modal with the response on a good response', function () {
                commonService.undeleteATL.and.returnValue($q.when({status: 200}));
                vm.undeleteAtl();
                scope.$digest();
                expect(commonService.undeleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                commonService.undeleteATL.and.returnValue($q.when({status: undefined}));
                vm.undeleteAtl();
                scope.$digest();
                expect(commonService.undeleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                commonService.undeleteATL.and.returnValue($q.when({status: 400}));
                vm.undeleteAtl();
                scope.$digest();
                expect(commonService.undeleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                commonService.undeleteATL.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.undeleteAtl();
                scope.$digest();
                expect(commonService.undeleteATL).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });
    });
})();
