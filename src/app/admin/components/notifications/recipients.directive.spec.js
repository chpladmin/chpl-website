(function () {
    'use strict';

    describe('chpl.admin.notifications.directive', function () {
        var el, scope, $log, $q, commonService, vm, Mock, mock, $uibModal, actualOptions;

        mock = {
            acbs: [{id: 1, name: 'fake'}],
        };
        mock.fakeModalOptions = {
            templateUrl: 'app/admin/components/notifications/recipient.html',
            controller: 'RecipientController',
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
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getNotificationReportTypes = jasmine.createSpy('getNotificationReportTypes');
                    $delegate.getNotificationRecipients = jasmine.createSpy('getNotificationRecipients');

                    return $delegate;
                });
            });

            inject(function ($compile, $controller, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                commonService = _commonService_;
                commonService.getNotificationReportTypes.and.returnValue($q.when(Mock.notificationReportTypes));
                commonService.getNotificationRecipients.and.returnValue($q.when({results: Mock.recipients}));

                el = angular.element('<ai-notification-recipients acbs="acbs"></ai-notification-recipients>');

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

        describe('loading', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });

            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should have a list of acbs', function () {
                expect(vm.acbs).toEqual(mock.acbs);
            });

            describe('service interactions', function () {
                it('should have the notification recipients', function () {
                    expect(vm.recipients).toBeDefined();
                    expect(vm.recipients).toEqual(Mock.recipients);
                    expect(commonService.getNotificationRecipients).toHaveBeenCalled();
                });

                it('should have a warning message if loading emails fails', function () {
                    var initCount = $log.warn.logs.length;
                    commonService.getNotificationRecipients.and.returnValue($q.reject('an error'));
                    vm.loadRecipients();
                    scope.$digest();
                    expect($log.warn.logs.length).toBe(initCount + 1);
                });

                it('should have the notification report types', function () {
                    expect(vm.notificationReportTypes).toBeDefined();
                    expect(vm.notificationReportTypes).toEqual(Mock.notificationReportTypes);
                    expect(commonService.getNotificationReportTypes).toHaveBeenCalled();
                });

                it('should have a warning message if loading report types fails', function () {
                    var initCount = $log.warn.logs.length;
                    commonService.getNotificationReportTypes.and.returnValue($q.reject('an error'));
                    vm.loadNotificationReportTypes();
                    scope.$digest();
                    expect($log.warn.logs.length).toBe(initCount + 1);
                });
            });

            describe('creating a new recipient', function () {
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
                    expect(actualOptions.resolve.reportTypes()).toEqual(Mock.notificationReportTypes);
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

            describe('editing a recipient', function () {
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
                    expect(actualOptions.resolve.reportTypes()).toEqual(Mock.notificationReportTypes);
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
            });
        });
    });
})();
