(function () {
    'use strict';

    fdescribe('the Scheduled Jobs directive', function () {
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
            templateUrl: 'app/admin/components/schedules/schedule.html',
            controller: 'ScheduleController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'md',
            resolve: {
                acbs: jasmine.any(Function),
                recipient: jasmine.any(Function),
                reportTypes: jasmine.any(Function),
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

            it('should have a list of acbs', function () {
                expect(vm.acbs).toEqual(mock.acbs);
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

        xdescribe('creating a new recipient', function () {
            it('should create a modal instance', function () {
                expect(vm.createRecipientInstance).toBeUndefined();
                vm.createRecipient();
                expect(vm.createRecipientInstance).toBeDefined();
            });

            it('should resolve the acbs and report types on create', function () {
                vm.createRecipient();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.acbs()).toEqual(mock.acbs);
                expect(actualOptions.resolve.recipient()).toEqual({});
                expect(actualOptions.resolve.reportTypes()).toEqual(Mock.subscriptionReportTypes);
            });

            it('should add the created recipient to the active list on close', function () {
                var newRecipient = {email: 'fake@sample.com', subscriptions: []};
                vm.createRecipient();
                vm.createRecipientInstance.close({recipient: newRecipient});
                expect(vm.recipients[vm.recipients.length - 1]).toEqual(newRecipient);
            });

            it('should log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.createRecipient();
                vm.createRecipientInstance.dismiss('Cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should report messages if they were sent back', function () {
                vm.createRecipient();
                vm.createRecipientInstance.dismiss('message');
                expect(vm.createMessage).toBe('message');
            });
        });

        xdescribe('editing a recipient', function () {
            it('should edit a modal instance', function () {
                expect(vm.editRecipientInstance).toBeUndefined();
                vm.editRecipient(Mock.recipients[0]);
                expect(vm.editRecipientInstance).toBeDefined();
            });

            it('should resolve the acbs and report types on edit', function () {
                vm.editRecipient(Mock.recipients[0]);
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.acbs()).toEqual(mock.acbs);
                expect(actualOptions.resolve.recipient()).toEqual(Mock.recipients[0]);
                expect(actualOptions.resolve.reportTypes()).toEqual(Mock.subscriptionReportTypes);
            });

            it('should log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editRecipient(Mock.recipients[0]);
                vm.editRecipientInstance.dismiss('Cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should report messages if they were sent back', function () {
                vm.editRecipient(Mock.recipients[0]);
                vm.editRecipientInstance.dismiss('message');
                expect(vm.editMessage).toBe('message');
            });

            it('should remove the recipient if it was deleted', function () {
                var recipientLength = Mock.recipients.length;
                vm.editRecipient(Mock.recipients[1]);
                vm.editRecipientInstance.close({status: 'deleted'});
                expect(Mock.recipients.length).toBe(recipientLength - 1);
            });

            it('should refresh the recipients if it was updated', function () {
                var serviceCallCount = networkService.getSubscriptionRecipients.calls.count();
                vm.editRecipient(Mock.recipients[0]);
                vm.editRecipientInstance.close({status: 'updated'});
                expect(networkService.getSubscriptionRecipients.calls.count()).toBe(serviceCallCount + 1);
            });

            it('should log a message if the modal is closed in an unknown state', function () {
                var logCount = $log.info.logs.length;
                vm.editRecipient(Mock.recipients[0]);
                vm.editRecipientInstance.close({});
                expect($log.info.logs.length).toBe(logCount + 1);
            });
        });
    });
})();
