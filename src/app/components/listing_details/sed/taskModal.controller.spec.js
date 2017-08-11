(function () {
    'use strict';

    describe('the SED View Task Modal controller', function () {
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
                vm = $controller('ViewSedTaskController', {
                    editMode: false,
                    task: {},
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
                        editMode: jasmine.any(Function),
                        participants: jasmine.any(Function),
                    },
                };
                vm.editMode = 'on';
                vm.task.testParticipants = [];
            });

            it('should create a modal instance', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.viewParticipants();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements', function () {
                vm.viewParticipants();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.editMode()).toBe('on');
                expect(actualOptions.resolve.participants()).toEqual([]);
            });
        });

        describe('when editing the Task', function () {
            var modalOptions;
            beforeEach(function () {
                modalOptions = {
                    templateUrl: 'app/admin/components/sed/taskModal.html',
                    controller: 'EditSedTaskController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
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
                vm.editTask();
                expect($uibModal.open).toHaveBeenCalledWith(modalOptions);
                expect(actualOptions.resolve.participants()).toEqual([1,2]);
                expect(actualOptions.resolve.task()).toEqual({});
            });

            it('should replace the task and participantswith the response', function () {
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
        });
    });
})();
