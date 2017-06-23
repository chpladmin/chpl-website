(function () {
    'use strict';

    describe('chpl.admin.SplitProductController.controller', function () {
        var $log, $q, Mock, commonService, scope, vm;

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.splitProduct = jasmine.createSpy('splitProduct');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                commonService = _commonService_;
                commonService.splitProduct.and.returnValue($q.when({
                    oldProduct: 'a product',
                    newProduct: 'new product',
                }));

                scope = $rootScope.$new();
                vm = $controller('SplitProductController', {
                    product: Mock.products[0],
                    versions: [1,2,3],
                    $uibModalInstance: Mock.modalInstance,
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

        describe('saving the product', function () {
            it('should call the common service', function () {
                var splitProduct = {oldProduct: vm.product, newProductCode: 'code', newProductName: 'name', oldVersions: [1,2], newVersions: [3]};
                vm.splitProduct.oldVersions = [1,2];
                vm.splitProduct.newProductCode = 'code';
                vm.splitProduct.newProductName = 'name';
                vm.splitProduct.newVersions = [3];
                vm.save();
                scope.$digest();
                expect(commonService.splitProduct).toHaveBeenCalledWith(splitProduct);
            });

            it('should close the modal', function () {
                vm.splitProduct.oldVersions = [1,2];
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    product: 'a product',
                    versions: [1,2],
                    newProduct: 'new product',
                });
            });

            it('should not dismiss the modal on error', function () {
                commonService.splitProduct.and.returnValue($q.when({status: 500, data: {error: 'an error'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal on error', function () {
                commonService.splitProduct.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalledWith('bad thing');
            });
        });

        describe('moving versions', function () {
            it('should have a way to move versions to the new product', function () {
                vm.versionsToMoveToNew = [vm.versions[0]];
                vm.moveToNew();
                expect(vm.splitProduct.oldVersions).toEqual([2,3]);
                expect(vm.splitProduct.newVersions).toEqual([1]);
            });

            it('should have a way to move versions back to the old product', function () {
                vm.versionsToMoveToNew = [vm.versions[0], vm.versions[1]];
                vm.moveToNew();
                expect(vm.splitProduct.oldVersions).toEqual([3]);
                expect(vm.splitProduct.newVersions).toEqual([1,2]);
                vm.versionsToMoveToOld = [vm.splitProduct.newVersions[0]];
                vm.moveToOld();
                expect(vm.splitProduct.oldVersions).toEqual([3,1]);
                expect(vm.splitProduct.newVersions).toEqual([2]);
            });
        });
    });
})();
