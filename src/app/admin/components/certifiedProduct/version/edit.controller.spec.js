(function () {
    'use strict';

    describe('chpl.admin.EditVersionController.controller', function () {
        var $log, $q, Mock, mock, networkService, scope, vm;

        mock = {
            version: {versionId: 1, version: 'a version'},
        }

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.updateVersion = jasmine.createSpy('updateVersion');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.updateVersion.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('EditVersionController', {
                    activeVersion: mock.version,
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

        describe('saving the version', function () {
            it('should call the common service', function () {
                var updateVersion = {
                    version: angular.copy(vm.version),
                    versionIds: [1],
                };
                vm.save();
                scope.$digest();
                expect(networkService.updateVersion).toHaveBeenCalledWith(updateVersion);
            });

            it('should close the modal', function () {
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                networkService.updateVersion.and.returnValue($q.when({status: 500}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });

            it('should dismiss the modal on error', function () {
                networkService.updateVersion.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalledWith('bad thing');
            });
        });
    });
})();
