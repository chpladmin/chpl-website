(function () {
    'use strict';

    describe('the SED Task Modal controller', function () {
        var $log, $uibModal, Mock, actualOptions, scope, vm;

        beforeEach(function () {
            module('chpl', 'chpl.mock', 'chpl.templates');

            inject(function ($controller, _$log_, $rootScope, _$uibModal_, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                scope = $rootScope.$new();
                vm = $controller('EditSedTaskController', {
                    task: {task: {}},
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

        describe('with respect to changes', function () {
            it('should not mark itself as changed if cancelled', function () {
                vm.task.changed = true;
                vm.cancel();
                expect(vm.task.changed).toBeUndefined();
            });

            it('should be able to mark itself as changed when the task has an id', function () {
                vm.task.id = 1;
                expect(vm.task.changed).toBeUndefined();
                vm.changed();
                expect(vm.task.changed).toBe(true);
            });

            it('should not mark itself as changed if the task has no idea', function () {
                expect(vm.task.changed).toBeUndefined();
                vm.changed();
                expect(vm.task.changed).toBeUndefined();
            });
        });

        describe('when saving the task', function () {
            it('should return the modal with the task', function () {
                var aTask = {id: 1};
                vm.task = aTask;
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith(aTask);
            });
        });

        describe('when adding a Participant', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listingDetails/sed/participantModal.html',
                    controller: 'EditSedParticipantController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        participant: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance', function () {
                expect(vm.editModalInstance).toBeUndefined();
                vm.addParticipant();
                expect(vm.editModalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.addParticipant();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.participant()).toEqual({ participant: {}});
            });

            it('should push the result to the list of participants', function () {
                vm.addParticipant();
                vm.task.testParticipants = [];
                vm.editModalInstance.close({});
                expect(vm.task.testParticipants).toEqual([{}]);
            });

            it('should create an array of participants if it doesn\'t exist', function () {
                vm.addParticipant();
                vm.editModalInstance.close({});
                expect(vm.task.testParticipants).toEqual([{}]);
            });

            it('should create an array of participants if it doesn\'t exist', function () {
                vm.addParticipant();
                vm.task.testParticipants = null;
                vm.editModalInstance.close({});
                expect(vm.task.testParticipants).toEqual([{}]);
            });

            it('should log a non-cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.addParticipant();
                vm.editModalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should not log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.addParticipant();
                vm.editModalInstance.dismiss('cancelled');
                expect($log.info.logs.length).toBe(logCount);
            });
        });

        describe('when editing a Participant', function () {
            var modalOptions, participant;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listingDetails/sed/participantModal.html',
                    controller: 'EditSedParticipantController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        participant: jasmine.any(Function),
                    },
                };
                participant = {};
                vm.task.testParticipants = [{}];
            });

            it('should create a modal instance', function () {
                expect(vm.editModalInstance).toBeUndefined();
                vm.editParticipant(participant, 0);
                expect(vm.editModalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.editParticipant(participant, 0);
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.participant()).toEqual({ participant: participant});
            });

            it('should replace the participant with the response', function () {
                vm.editParticipant(participant, 0);
                vm.editModalInstance.close({name: 'new'});
                expect(vm.task.testParticipants).toEqual([{name: 'new'}]);
            });

            it('should log a non-cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editParticipant(participant, 0);
                vm.editModalInstance.dismiss('not cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should not log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editParticipant(participant, 0);
                vm.editModalInstance.dismiss('cancelled');
                expect($log.info.logs.length).toBe(logCount);
            });
        });

        describe('when removing a participant', function () {
            it('should remove the indicated one', function () {
                vm.task.testParticipants = [0, 1, 2];
                vm.removeParticipant(1);
                expect(vm.task.testParticipants).toEqual([0, 2]);
            });
        });
    });
})();
