(function () {
    'use strict';

    describe('admin.EditDeveloperController.controller', function () {
        var vm, scope, $log, $q, authService, commonService, mock, Mock;

        mock = {};
        mock.acbs = ['Drummond','ICSA','Infogard'];

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    return $delegate;
                });
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.updateDeveloper = jasmine.createSpy('updateDeveloper');
                    return $delegate;
                });
            });

            inject(function ($controller, $rootScope, _$log_, _$q_, _authService_, _commonService_, _Mock_) {
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.isChplAdmin.and.returnValue(true);
                commonService = _commonService_;
                commonService.updateDeveloper.and.returnValue($q.when({}));
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('EditDeveloperController', {
                    activeAcbs: mock.acbs,
                    activeDeveloper: Mock.developers[0],
                    $uibModalInstance: Mock.modalInstance
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
                expect(vm.developer.statusHistory).toEqual([]);
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });

        describe('developer status history', function () {
            it('should push statuses to the history if one is changed', function () {
                var newStatus = {status: 'new'};
                vm.changeCurrentStatus(newStatus.status);
                expect(vm.developer.statusHistory[0].status).toEqual(newStatus);
                expect(typeof(vm.developer.statusHistory[0].changeDate)).toBe('object');
            });

            it('should remove previous statuses', function () {
                var newStatus = {status: 'new'};
                vm.changeCurrentStatus(newStatus.status);
                vm.changeCurrentStatus(newStatus.status);
                expect(vm.developer.statusHistory.length).toBe(2);
                vm.removePreviousStatus(0);
                expect(vm.developer.statusHistory.length).toBe(1);
            });

            it('should add an empty status', function () {
                expect(vm.developer.statusHistory.length).toBe(0);
                vm.addPreviousStatus();
                expect(vm.developer.statusHistory.length).toBe(1);
                expect(vm.developer.statusHistory[0]).toEqual({});
            });
        });
    });
})();
