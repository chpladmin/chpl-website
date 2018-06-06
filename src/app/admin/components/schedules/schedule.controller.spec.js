(function () {
    'use strict';

    describe('the Schedule Add/Edit', function () {
        var $log, $q, Mock, mock, networkService, scope, vm;

        mock = {};
        mock.newScheduleTrigger = {
            scheduleType: 'CACHE_STATUS_AGE_NOTIFICATION',
            cronSchedule: '0 13 * * * ?',
            email: 'alarned@ainq.com',
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.createScheduleTrigger = jasmine.createSpy('createScheduleTrigger');
                    $delegate.deleteScheduleTrigger = jasmine.createSpy('deleteScheduleTrigger');
                    $delegate.updateScheduleTrigger = jasmine.createSpy('updateScheduleTrigger');

                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.createScheduleTrigger.and.returnValue($q.when(mock.newScheduleTrigger));
                networkService.deleteScheduleTrigger.and.returnValue($q.when({status: 200}));
                networkService.updateScheduleTrigger.and.returnValue($q.when(mock.newScheduleTrigger));

                scope = $rootScope.$new();
                vm = $controller('ScheduleController', {
                    trigger: {},
                    $uibModalInstance: Mock.modalInstance,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
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

        describe('creating a trigger', function () {
            beforeEach(function () {
                vm.trigger = angular.copy(mock.newScheduleTrigger);
            });

            it('should call the common service', function () {
                vm.save();
                scope.$digest();
                expect(networkService.createScheduleTrigger).toHaveBeenCalledWith(vm.trigger);
            });

            it('should close the modal', function () {
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({
                    trigger: mock.newScheduleTrigger,
                    status: 'created',
                });
            });

            it('should not dismiss the modal on error', function () {
                networkService.createScheduleTrigger.and.returnValue($q.when({status: 500, data: {error: 'an error'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal on error', function () {
                networkService.createScheduleTrigger.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalledWith('bad thing');
            });
        });

        describe('updating a trigger', function () {
            beforeEach(function () {
                vm.trigger = angular.copy(mock.newScheduleTrigger);
                vm.trigger.name = 1;
            });

            it('should call the common service', function () {
                vm.save();
                scope.$digest();
                expect(networkService.updateScheduleTrigger).toHaveBeenCalledWith(vm.trigger);
            });

            it('should close the modal', function () {
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({trigger: mock.newScheduleTrigger, status: 'updated'});
            });

            it('should not dismiss the modal on error', function () {
                networkService.updateScheduleTrigger.and.returnValue($q.when({status: 500, data: {error: 'an error'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal on error', function () {
                networkService.updateScheduleTrigger.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalledWith('bad thing');
            });
        });

        describe('deleting a trigger', function () {
            beforeEach(function () {
                vm.trigger = angular.copy(mock.newScheduleTrigger);
                vm.trigger.name = 1;
            });

            it('should call the common service', function () {
                vm.deleteTrigger();
                scope.$digest();
                expect(networkService.deleteScheduleTrigger).toHaveBeenCalledWith(vm.trigger);
            });

            it('should close the modal', function () {
                vm.deleteTrigger();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'deleted'});
            });

            it('should not dismiss the modal on error', function () {
                networkService.deleteScheduleTrigger.and.returnValue($q.when({status: 500, data: {error: 'an error'}}));
                vm.deleteTrigger();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal on error', function () {
                networkService.deleteScheduleTrigger.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.deleteTrigger();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalledWith('bad thing');
            });
        });
    });
})();
