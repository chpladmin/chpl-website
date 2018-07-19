(function () {
    'use strict';

    describe('the Scheduled Jobs directive', function () {
        var $log, $q, $uibModal, Mock, actualOptions, el, mock, networkService, scope, vm;

        mock = {
            acbs: [{id: 1, name: 'fake'}],
            results: [{
                name: 'cacheStatusAgeTrigger-alarned@ainq.com',
                group: 'group1',
                jobName: 'cacheStatusAgeJob',
                jobGroup: 'cacheStatusAgeJob',
                scheduleType: 'CACHE_STATUS_AGE_NOTIFICATION',
                cronSchedule: '0 13 * * * ?',
                email: 'alarned@ainq.com',
            }],
        };
        mock.fakeModalOptions = {
            templateUrl: 'chpl.admin/components/schedules/schedule.html',
            controller: 'ScheduleController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'md',
            resolve: {
                trigger: jasmine.any(Function),
            },
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.templates', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getScheduleTriggers = jasmine.createSpy('getScheduleTriggers');

                    return $delegate;
                });
            });

            inject(function ($compile, $controller, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                networkService = _networkService_;
                networkService.getScheduleTriggers.and.returnValue($q.when({results: mock.results}));

                el = angular.element('<ai-scheduled-jobs acbs="acbs"></ai-scheduled-jobs>');

                scope = $rootScope.$new();
                scope.acbs = mock.acbs;
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('when loading', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });

            it('should exist', function () {
                expect(vm).toBeDefined();
            });
        });

        describe('wrt service interactions', function () {
            it('should have the scheduled triggers', function () {
                expect(vm.scheduledTriggers).toBeDefined();
                expect(networkService.getScheduleTriggers).toHaveBeenCalled();
            });
        });

        describe('wrt the Cache Status Age application', function () {
            it('should generate details', function () {
                expect(vm.scheduledTriggers[0].details).toEqual([
                    'Schedule: 0 13 * * * ?',
                    'Type: Cache Status Age Notification',
                ]);
            });
        });

        describe('editing a trigger', function () {
            it('should create a modal instance', function () {
                expect(vm.editTriggerInstance).toBeUndefined();
                vm.editTrigger(vm.scheduledTriggers[0]);
                expect(vm.editTriggerInstance).toBeDefined();
            });

            it('should resolve the trigger on edit', function () {
                vm.editTrigger(vm.scheduledTriggers[0]);
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.trigger()).toEqual(vm.scheduledTriggers[0]);
            });

            it('should remove the trigger if it was deleted', function () {
                var triggerLength = vm.scheduledTriggers.length;
                vm.editTrigger(vm.scheduledTriggers[0]);
                vm.editTriggerInstance.close({status: 'deleted'});
                expect(vm.scheduledTriggers.length).toBe(triggerLength - 1);
            });

            it('should refresh the triggers if it was updated', function () {
                var serviceCallCount = networkService.getScheduleTriggers.calls.count();
                vm.editTrigger(vm.scheduledTriggers[0]);
                vm.editTriggerInstance.close({status: 'updated'});
                expect(networkService.getScheduleTriggers.calls.count()).toBe(serviceCallCount + 1);
            });
        });

        describe('create a trigger', function () {
            it('should create a modal instance', function () {
                expect(vm.editTriggerInstance).toBeUndefined();
                vm.createTrigger();
                expect(vm.editTriggerInstance).toBeDefined();
            });

            it('should resolve the trigger on create', function () {
                vm.createTrigger();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.trigger()).toEqual({
                    scheduleType: 'CACHE_STATUS_AGE_NOTIFICATION',
                });
            });

            it('should refresh the triggers if it was updated', function () {
                var serviceCallCount = networkService.getScheduleTriggers.calls.count();
                vm.createTrigger();
                vm.editTriggerInstance.close({status: 'created'});
                expect(networkService.getScheduleTriggers.calls.count()).toBe(serviceCallCount + 1);
            });
        })
    });
})();
