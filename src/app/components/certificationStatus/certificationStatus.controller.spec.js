(function () {
    'use strict';

    describe('chpl.certificationStatus', function () {

        var vm, scope, $log, mock, utilService;
        mock = {};
        mock.modalInstance = {
            close: jasmine.createSpy('close'),
            dismiss: jasmine.createSpy('dismiss'),
        };

        beforeEach(function () {
            module('chpl', function ($provide) {
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.statusFont = jasmine.createSpy('statusFont');
                    return $delegate;
                });
            });
            inject(function ($controller, _$log_, $rootScope, _utilService_) {
                $log = _$log_;
                utilService = _utilService_;
                utilService.statusFont.and.returnValue('font');

                scope = $rootScope.$new();
                vm = $controller('CertificationStatusController', {
                    $scope: scope,
                    $uibModalInstance: mock.modalInstance,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should have a service for getting the status icon', function () {
            expect(vm.statusFont).toBeDefined();
        });

        describe('housekeeping', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });
    });
})();
