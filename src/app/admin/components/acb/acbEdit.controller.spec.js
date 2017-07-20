(function () {
    'use strict';

    describe('the ACB Edit Modal controller', function () {
        var $log, $q, Mock, commonService, ctrl, scope, vm;

        beforeEach(function () {
            module('chpl', 'chpl.mock', 'chpl.templates', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.createACB = jasmine.createSpy('createACB');
                    $delegate.deleteACB = jasmine.createSpy('deleteACB');
                    $delegate.modifyACB = jasmine.createSpy('modifyACB');
                    $delegate.undeleteACB = jasmine.createSpy('undeleteACB');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _commonService_) {
                ctrl = $controller;
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.createACB.and.returnValue($q.when({}));
                commonService.deleteACB.and.returnValue($q.when({}));
                commonService.modifyACB.and.returnValue($q.when({}));
                commonService.undeleteACB.and.returnValue($q.when({}));
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = ctrl('EditAcbController', {
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
            vm = ctrl('EditAcbController', {
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
                commonService.modifyACB.and.returnValue($q.when({status: 200}));
                vm.save();
                scope.$digest();
                expect(commonService.modifyACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                commonService.modifyACB.and.returnValue($q.when({status: undefined}));
                vm.save();
                scope.$digest();
                expect(commonService.modifyACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                commonService.modifyACB.and.returnValue($q.when({status: 400}));
                vm.save();
                scope.$digest();
                expect(commonService.modifyACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                commonService.modifyACB.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.save();
                scope.$digest();
                expect(commonService.modifyACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });

        describe('when creating an ACB', function () {
            it('should close the modal with the response on a good response', function () {
                commonService.createACB.and.returnValue($q.when({status: 200}));
                vm.create();
                scope.$digest();
                expect(commonService.createACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                commonService.createACB.and.returnValue($q.when({status: undefined}));
                vm.create();
                scope.$digest();
                expect(commonService.createACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                commonService.createACB.and.returnValue($q.when({status: 400}));
                vm.create();
                scope.$digest();
                expect(commonService.createACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                commonService.createACB.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.create();
                scope.$digest();
                expect(commonService.createACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });

        describe('when deleting an ACB', function () {
            it('should close the modal with the response on a good response', function () {
                commonService.deleteACB.and.returnValue($q.when({status: 200}));
                vm.deleteAcb();
                scope.$digest();
                expect(commonService.deleteACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith('deleted');

                commonService.deleteACB.and.returnValue($q.when({status: undefined}));
                vm.deleteAcb();
                scope.$digest();
                expect(commonService.deleteACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith('deleted');
            });

            it('should dismiss the modal with an error on a bad response', function () {
                commonService.deleteACB.and.returnValue($q.when({status: 400}));
                vm.deleteAcb();
                scope.$digest();
                expect(commonService.deleteACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                commonService.deleteACB.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.deleteAcb();
                scope.$digest();
                expect(commonService.deleteACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });

        describe('when undeleting an ACB', function () {
            it('should close the modal with the response on a good response', function () {
                commonService.undeleteACB.and.returnValue($q.when({status: 200}));
                vm.undeleteAcb();
                scope.$digest();
                expect(commonService.undeleteACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 200});

                commonService.undeleteACB.and.returnValue($q.when({status: undefined}));
                vm.undeleteAcb();
                scope.$digest();
                expect(commonService.undeleteACB).toHaveBeenCalled();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: undefined});
            });

            it('should dismiss the modal with an error on a bad response', function () {
                commonService.undeleteACB.and.returnValue($q.when({status: 400}));
                vm.undeleteAcb();
                scope.$digest();
                expect(commonService.undeleteACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('An error occurred');
            });

            it('should dismiss the modal with error messages on a rejected save', function () {
                commonService.undeleteACB.and.returnValue($q.reject({data: { error: 'the error'}}));
                vm.undeleteAcb();
                scope.$digest();
                expect(commonService.undeleteACB).toHaveBeenCalled();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('the error');
            });
        });
    });
})();
