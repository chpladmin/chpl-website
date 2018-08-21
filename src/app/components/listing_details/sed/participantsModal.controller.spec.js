(function () {
    'use strict';

    describe('the SED View Participants Modal controller', function () {
        var $log, $uibModal, Mock, actualOptions, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl', 'chpl.mock'/*, 'chpl.templates'*/);

            inject(function ($controller, _$log_, $rootScope, _$uibModal_, _Mock_) {
                $log = _$log_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                scope = $rootScope.$new();
                vm = $controller('ViewSedParticipantsController', {
                    allParticipants: [],
                    editMode: false,
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

        describe('when dealing with participants assigned to a task', function () {
            beforeEach(function () {
                vm.participants = [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                ];
                vm.allParticipants = [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                    {id: 4},
                ];
            });

            it('should toggle participants', function () {
                var initLength = vm.participants.length;
                vm.toggleParticipant(vm.allParticipants[1]);
                expect(vm.participants.length).toBe(initLength - 1);
                expect(vm.participants[1]).toEqual(vm.allParticipants[2]);
                vm.toggleParticipant(vm.allParticipants[3]);
                expect(vm.participants.length).toBe(initLength);
                expect(vm.participants[initLength - 1]).toEqual(vm.allParticipants[3]);
            });

            it('should know when a participant is assigned', function () {
                expect(vm.isAssigned(vm.allParticipants[1])).toBe(true);
                expect(vm.isAssigned(vm.allParticipants[3])).toBe(false);
            });
        });

        describe('when editing a Participant', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'chpl.admin/components/sed/editParticipant.html',
                    controller: 'EditSedParticipantController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        participant: jasmine.any(Function),
                    },
                };
                vm.participants = [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                ];
                vm.allParticipants = [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                    {id: 4},
                ];
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.editParticipant();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.editParticipant({id: 1});
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.participant()).toEqual({id: 1});
            });

            it('should replace the participant with the response', function () {
                vm.editParticipant(vm.participants[1]);
                vm.modalInstance.close({participant: {id: 2, name: 'fake'}});
                expect(vm.participants[1]).toEqual({id: 2, name: 'fake'});
            });

            it('should update the "all participants" array', function () {
                vm.editParticipant(vm.participants[1]);
                vm.modalInstance.close({participant: {id: 2, name: 'fake'}});
                expect(vm.allParticipants[1]).toEqual({id: 2, name: 'fake'});
            });

            it('should have a way to save the changed participants', function () {
                expect(vm.save).toBeDefined();
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    allParticipants: vm.allParticipants,
                    participants: vm.participants,
                });
            });
        });

        describe('when adding a Participant', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'chpl.admin/components/sed/editParticipant.html',
                    controller: 'EditSedParticipantController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        participant: jasmine.any(Function),
                    },
                };
                vm.participants = [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                ];
                vm.allParticipants = [
                    {id: 1},
                    {id: 2},
                    {id: 3},
                    {id: 4},
                ];
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.addParticipant();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.addParticipant();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.participant()).toEqual({});
            });

            it('should add the new participant to the task array', function () {
                vm.addParticipant();
                vm.modalInstance.close({participant: {name: 'fake'}});
                expect(vm.participants[3]).toEqual({name: 'fake'});
            });

            it('should add the new participant to the "all" array', function () {
                vm.addParticipant();
                vm.modalInstance.close({participant: {name: 'fake'}});
                expect(vm.allParticipants[4]).toEqual({name: 'fake'});
            });
        });
    });
})();
