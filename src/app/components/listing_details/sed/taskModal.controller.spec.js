(function () {
    'use strict';

    describe('the SED View Task Modal controller', function () {
        var $log, $uibModal, Mock, actualOptions, mock, scope, vm;
        mock = {
            task: {
                testParticipants: [
                    { occupation: 'Nurse', productExperienceMonths: 10 },
                    { occupation: 'Nurse', productExperienceMonths: 10 },
                    { occupation: 'Pharmacist', productExperienceMonths: 10 },
                    { occupation: 'Pharmacist', productExperienceMonths: 10 },
                    { occupation: 'Doc', productExperienceMonths: 10 },
                    { occupation: 'Doc', productExperienceMonths: 20 },
                    { occupation: 'PA', productExperienceMonths: 20 },
                    { occupation: 'PA', productExperienceMonths: 20 },
                    { occupation: 'RN', productExperienceMonths: 20 },
                    { occupation: 'RN', productExperienceMonths: 20 },
                ],
            },
        }

        beforeEach(function () {
            angular.mock.module('chpl', 'chpl.mock');

            inject(function ($controller, _$log_, $rootScope, _$uibModal_, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                scope = $rootScope.$new();
                vm = $controller('ViewSedTaskController', {
                    criteria: [],
                    editMode: false,
                    task: angular.copy(mock.task),
                    participants: [],
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

        describe('when parsing Participants', function () {
            it('should know what the mean product experience is', function () {
                expect(vm.meanProductExperience).toBe(15);
            });

            it('should have a list of occupations', function () {
                expect(vm.occupations.length).toBe(5);
                expect(vm.occupations[0].name).toBe('Nurse');
                expect(vm.occupations[0].count).toBe(2);
            });
        });

        describe('when viewing Participants', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'chpl.components/listing_details/sed/participantsModal.html',
                    controller: 'ViewSedParticipantsController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        allParticipants: jasmine.any(Function),
                        editMode: jasmine.any(Function),
                        participants: jasmine.any(Function),
                    },
                };
                vm.editMode = 'on';
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.viewParticipants();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.participants = [1,2];
                vm.viewParticipants();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.allParticipants()).toEqual([1,2]);
                expect(actualOptions.resolve.editMode()).toBe('on');
                expect(actualOptions.resolve.participants()).toEqual(mock.task.testParticipants);
            });

            it('should replace the task participant list with an edited one on close', function () {
                var newParticipants = [1,2,3];
                vm.viewParticipants();
                vm.modalInstance.close({
                    participants: newParticipants,
                });
                expect(vm.task.testParticipants).toEqual(newParticipants);
            });

            it('should replace the "all participants" list with an edited one on close', function () {
                var newParticipants = [1,2,3];
                vm.participants = [1,2];
                vm.viewParticipants();
                vm.modalInstance.close({
                    allParticipants: newParticipants,
                });
                expect(vm.participants).toEqual(newParticipants);
            });
        });

        describe('when editing the Task', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'chpl.admin/components/sed/editTask.html',
                    controller: 'EditSedTaskController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        criteria: jasmine.any(Function),
                        participants: jasmine.any(Function),
                        task: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.editTask();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.participants = [1,2];
                vm.criteria = [3,4];
                vm.editTask();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.criteria()).toEqual([3,4]);
                expect(actualOptions.resolve.participants()).toEqual([1,2]);
                expect(actualOptions.resolve.task()).toEqual(mock.task);
            });

            it('should replace the task and participants with the response', function () {
                vm.editTask();
                vm.modalInstance.close({task: 'new', participants: [2,3]});
                expect(vm.task).toEqual('new');
                expect(vm.participants).toEqual([2,3]);
            });

            it('should log a non-cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editTask();
                vm.modalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should not log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editTask();
                vm.modalInstance.dismiss('cancelled');
                expect($log.info.logs.length).toBe(logCount);
            });

            it('should have a way to save the changed task', function () {
                expect(vm.save).toBeDefined();
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });
        });

        describe('when deleting the Task', function () {
            it('should close it\'s modal', function () {
                vm.deleteTask();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should pass back a message and the participants', function () {
                vm.participants = [1,2]
                vm.deleteTask();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    deleted: true,
                    participants: [1,2],
                });
            });
        });
    });
})();
