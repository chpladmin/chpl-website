(function () {
    'use strict';

    describe('the Edit SED Task Modal controller', function () {
        var $controller, $log, $uibModal, Mock, actualOptions, scope, vm;

        beforeEach(function () {
            module('chpl', 'chpl.admin', 'chpl.mock', 'chpl.templates');

            inject(function (_$controller_, _$log_, $rootScope, _$uibModal_, _Mock_) {
                $controller = _$controller_;
                $log = _$log_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                scope = $rootScope.$new();
                vm = $controller('EditSedTaskController', {
                    criteria: [],
                    participants: [],
                    task: {
                        testTaskId: 3,
                        testParticipants: [],
                    },
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

        describe('on load', function () {
            it('should generate a testTaskId if one doesn\'t exist', function () {
                vm = $controller('EditSedTaskController', {
                    criteria: [],
                    participants: [],
                    task: {},
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
                expect(vm.task.testTaskId).toEqual(jasmine.any(Number));
            });

            it('should generate an array of participants if not given one', function () {
                vm = $controller('EditSedTaskController', {
                    criteria: [],
                    participants: [],
                    task: {},
                    $uibModalInstance: Mock.modalInstance,
                    $scope: scope,
                });
                scope.$digest();
                expect(vm.task.testParticipants).toEqual([]);
            });
        });

        describe('when saving the task', function () {
            it('should return the modal with the task', function () {
                var aTask = {id: 1};
                vm.task = aTask;
                vm.participants = [1,2,3];
                vm.save();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    task: aTask,
                    participants: [1,2,3],
                });
            });
        });

        describe('when viewing Participants', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/components/listing_details/sed/participantsModal.html',
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
                vm.task.testParticipants = [1];
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
                expect(actualOptions.resolve.editMode()).toBe(true);
                expect(actualOptions.resolve.participants()).toEqual([1]);
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
    });
})();
