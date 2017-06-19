(function () {
    'use strict';

    describe('admin.InspectSurveillanceController.controller', function () {
        var vm, scope, $log, $q, $uibModal, commonService, utilService, Mock, actualOptions;

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getSurveillanceLookups = jasmine.createSpy('getSurveillanceLookups');
                    return $delegate;
                });
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.sortRequirements = jasmine.createSpy('sortRequirements');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _commonService_, _utilService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.getSurveillanceLookups.and.returnValue($q.when([]));
                utilService = _utilService_;
                utilService.sortRequirements.and.returnValue(1);
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
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

        describe('editing a Surveillance', function () {
            var surveillanceEditOptions;
            beforeEach(function () {
                surveillanceEditOptions = {
                    templateUrl: 'app/admin/components/surveillance/edit.html',
                    controller: 'EditSurveillanceController',
                    controllerAs: 'vm',
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

            it('should create a modal instance when a Surveillance is to be edited', function () {
                expect(vm.editModalInstance).toBeUndefined();
                vm.editSurveillance();
                expect(vm.editModalInstance).toBeDefined();
            });

            it('should resolve elements on edit', function () {
                vm.editSurveillance();
                expect($uibModal.open).toHaveBeenCalledWith(surveillanceEditOptions);
                expect(actualOptions.resolve.surveillance()).toEqual(Mock.surveillances[0]);
                expect(actualOptions.resolve.surveillanceTypes()).toEqual({surveillanceRequirements: {
                    criteriaOptions2014: {},
                    criteriaOptions2015: {},
                    criteriaOptions: {},
                }});
                expect(actualOptions.resolve.workType()).toEqual('confirm');
                scope.$digest();
            });

            it('should do stuff with the returned data', function () {
                var surveillance = {id: 1};
                vm.editSurveillance();
                vm.editModalInstance.close(surveillance);
                expect(vm.surveillance).toEqual(surveillance);
            });

            it('should log a non-cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editSurveillance();
                vm.editModalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });
    });
})();
