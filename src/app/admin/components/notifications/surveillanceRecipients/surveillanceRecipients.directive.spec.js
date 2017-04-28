(function () {
    'use strict';

    describe('chpl.admin.notifications.surveillance.directive', function () {
        var el, scope, $log, $q, commonService, vm, Mock, mock;

        mock = {
            acbs: [{id: 1, name: 'fake'}]
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.templates', 'chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getNotificationReportTypes = jasmine.createSpy('getNotificationReportTypes');
                    $delegate.getSurveillanceRecipients = jasmine.createSpy('getSurveillanceRecipients');

                    return $delegate;
                });
            });

            inject(function ($controller, _commonService_, $compile, $rootScope, _$log_, _$q_, _Mock_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                commonService = _commonService_;
                commonService.getNotificationReportTypes.and.returnValue($q.when(Mock.notificationReportTypes));
                commonService.getSurveillanceRecipients.and.returnValue($q.when(Mock.surveillanceRecipients));

                el = angular.element('<ai-surveillance-recipients acbs="acbs"></ai-surveillance-recipients>');

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
                it('should have the surveillance notification recipients', function () {
                    expect(vm.surveillanceRecipients).toBeDefined();
                    expect(vm.surveillanceRecipients).toEqual(Mock.surveillanceRecipients);
                    expect(commonService.getSurveillanceRecipients).toHaveBeenCalled();
                });

                it('should have a warning message if loading emails fails', function () {
                    var initCount = $log.warn.logs.length;
                    commonService.getSurveillanceRecipients.and.returnValue($q.reject('an error'));
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
        });
    });
})();
