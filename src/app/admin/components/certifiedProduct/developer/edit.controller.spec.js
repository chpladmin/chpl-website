(function () {
    'use strict';

    describe('chpl.admin.EditDeveloperController.controller', function () {
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

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _authService_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.isChplAdmin.and.returnValue(true);
                commonService = _commonService_;
                commonService.updateDeveloper.and.returnValue($q.when({}));
                Mock = _Mock_;
                mock.firstDev = angular.copy(Mock.developers[0]);
                for (var i = 0; i < mock.firstDev.statusEvents.length; i++) {
                    mock.firstDev.statusEvents[i].statusDateObject = new Date(mock.firstDev.statusEvents[i].statusDate);
                }

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
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });

        describe('developer status history', function () {
            it('should add statusEventObjects for each statusDate in history', function () {
                expect(vm.developer.statusEvents).toEqual(mock.firstDev.statusEvents);
            });

            it('should remove previous statuses', function () {
                var initLength = vm.developer.statusEvents.length;
                vm.removePreviousStatus(0);
                expect(vm.developer.statusEvents.length).toBe(initLength - 1);
            });

            it('should add an empty status', function () {
                var initLength = vm.developer.statusEvents.length;
                vm.addPreviousStatus();
                expect(vm.developer.statusEvents.length).toBe(initLength + 1);
                expect(vm.developer.statusEvents[vm.developer.statusEvents.length - 1].statusDateObject).toBeDefined();
            });
        });
    });
})();
