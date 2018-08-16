(function () {
    'use strict';

    describe('the Surveillance Requirement Edit controller', function () {
        var $log, $uibModal, Mock, actualOptions, scope, vm;

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin');

            inject(function ($controller, _$log_, $rootScope, _$uibModal_, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                scope = $rootScope.$new();
                vm = $controller('EditRequirementController', {
                    $scope: scope,
                    $uibModalInstance: Mock.modalInstance,
                    disableValidation: false,
                    randomized: false,
                    requirement: {},
                    surveillanceId: 1,
                    surveillanceTypes: {},
                    workType: 'create',
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

        describe('when adding a Nonconformity', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'chpl.admin/components/surveillance/nonconformity/edit.html',
                    controller: 'EditNonconformityController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        disableValidation: jasmine.any(Function),
                        nonconformity: jasmine.any(Function),
                        randomized: jasmine.any(Function),
                        requirementId: jasmine.any(Function),
                        surveillanceId: jasmine.any(Function),
                        surveillanceTypes: jasmine.any(Function),
                        workType: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.addNonconformity();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.addNonconformity();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.disableValidation()).toBe(false);
                expect(actualOptions.resolve.nonconformity()).toEqual({});
                expect(actualOptions.resolve.randomized()).toEqual(vm.randomized);
                expect(actualOptions.resolve.requirementId()).toEqual(vm.requirement.id);
                expect(actualOptions.resolve.surveillanceId()).toEqual(vm.surveillanceId);
                expect(actualOptions.resolve.surveillanceTypes()).toEqual(vm.data);
                expect(actualOptions.resolve.workType()).toBe('add');
            });

            it('should push the result to the list of nonconformities', function () {
                vm.addNonconformity();
                vm.requirement.nonconformities = [];
                vm.modalInstance.close({});
                expect(vm.requirement.nonconformities).toEqual([{}]);
            });

            it('should create an array of nonconformities if it doesn\'t exist', function () {
                vm.addNonconformity();
                vm.modalInstance.close({});
                expect(vm.requirement.nonconformities).toEqual([{}]);
            });

            it('should log a dismissed modal', function () {
                var logCount = $log.info.logs.length;
                vm.addNonconformity();
                vm.modalInstance.dismiss('dismissed');
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });

        describe('when editing a Nonconformity', function () {
            var modalOptions, noncon;
            beforeEach(function () {
                noncon = {id: 1, name: '1'};
                modalOptions = {
                    templateUrl: 'chpl.admin/components/surveillance/nonconformity/edit.html',
                    controller: 'EditNonconformityController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        disableValidation: jasmine.any(Function),
                        nonconformity: jasmine.any(Function),
                        randomized: jasmine.any(Function),
                        requirementId: jasmine.any(Function),
                        surveillanceId: jasmine.any(Function),
                        surveillanceTypes: jasmine.any(Function),
                        workType: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.editNonconformity(noncon);
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.editNonconformity(noncon);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.disableValidation()).toBe(false);
                expect(actualOptions.resolve.nonconformity()).toEqual(noncon);
                expect(actualOptions.resolve.randomized()).toEqual(vm.randomized);
                expect(actualOptions.resolve.requirementId()).toEqual(vm.requirement.id);
                expect(actualOptions.resolve.surveillanceId()).toEqual(vm.surveillanceId);
                expect(actualOptions.resolve.surveillanceTypes()).toEqual(vm.data);
                expect(actualOptions.resolve.workType()).toBe('create');
            });

            it('should generate a guiId if one doesn\'t exist', function () {
                var empty = {};
                expect(empty.guiId).toBeUndefined();
                vm.editNonconformity(empty);
                expect(empty.guiId).toBeDefined();
            });

            it('should replace the result in the list of nonconformities if it was already there', function () {
                vm.editNonconformity(noncon);
                vm.requirement.nonconformities = [noncon];
                vm.modalInstance.close({id: 1, name: '2', guiId: 1});
                expect(vm.requirement.nonconformities).toEqual([{id: 1, name: '2', guiId: 1}]);
            });

            it('should add the result to the list of nonconformities if it was not there', function () {
                vm.editNonconformity(noncon);
                vm.requirement.nonconformities = [noncon];
                vm.modalInstance.close({id: 2});
                expect(vm.requirement.nonconformities).toEqual([{id: 1, name: '1', guiId: 1}, {id: 2}]);
            });

            it('should log a dismissed modal', function () {
                var logCount = $log.info.logs.length;
                vm.editNonconformity(noncon);
                vm.modalInstance.dismiss('dismissed');
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });

        describe('when deleting nonconformities', function () {
            it('should delete them', function () {
                vm.requirement.nonconformities = [{id: 1}, {id: 2}];
                vm.deleteNonconformity(vm.requirement.nonconformities[1]);
                expect(vm.requirement.nonconformities).toEqual([vm.requirement.nonconformities[0]]);
            });
        });

        describe('when determining if a noncon requires requirements', function () {
            it('should be if the result is NC & nonconformites are undefined', function () {
                vm.requirement.result = {name: 'Non-Conformity'};
                expect(vm.isNonconformityRequired()).toBe(true);
            });

            it('should be if the result is NC & nonconformity length is 0', function () {
                vm.requirement.result = {name: 'Non-Conformity'};
                vm.requirement.nonconformities = [];
                expect(vm.isNonconformityRequired()).toBe(true);
            });

            it('should not be if the result is NC & nonconformity length is 0', function () {
                vm.requirement.result = {name: 'Non-Conformity'};
                vm.requirement.nonconformities = [{}];
                expect(vm.isNonconformityRequired()).toBe(false);
            });
            it('should not be if the result is not NC', function () {
                vm.requirement.result = {name: 'No Non-Conformity'};
                expect(vm.isNonconformityRequired()).toBe(false);
            });
        });

        describe('when saving the requirement', function () {
            it('should close the modal with the active requirement', function () {
                var activeReq = {
                    id: 'something',
                    result: { name: 'someting'},
                };
                vm.requirement = activeReq;
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith(activeReq);
            });

            it('should remove any requirements if there was no NC found', function () {
                var activeReq = {
                    id: 'something',
                    result: { name: 'No Non-Conformity'},
                    nonconformities: [1, 2, 3],
                };
                vm.requirement = activeReq;
                vm.save();
                expect(activeReq.nonconformities).toEqual([]);
            });
        });
    });
})();
