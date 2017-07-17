(function () {
    'use strict';

    describe('chpl.admin.subscriptions.recipient.controller', function () {
        var $log, $q, Mock, commonService, mock, scope, vm;

        mock = {};
        mock.acbs = [
            { id: 1, isDeleted: false},
            { id: 2, isDeleted: true },
            { id: 3, isDeleted: false },
        ];
        mock.newRecipient = {
            email: 'sample@sample.com',
            subscriptions: [
                { id: 1, notificationType: {id: 1}, acb: {id: 3}},
                { id: 2, notificationType: {id: 3}},
            ],
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.createRecipient = jasmine.createSpy('createRecipient');
                    $delegate.deleteRecipient = jasmine.createSpy('deleteRecipient');
                    $delegate.updateRecipient = jasmine.createSpy('updateRecipient');

                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                commonService = _commonService_;
                commonService.createRecipient.and.returnValue($q.when(mock.newRecipient));
                commonService.deleteRecipient.and.returnValue($q.when({status: 200}));
                commonService.updateRecipient.and.returnValue($q.when(mock.newRecipient));

                scope = $rootScope.$new();
                vm = $controller('RecipientController', {
                    acbs: mock.acbs,
                    recipient: {},
                    reportTypes: Mock.subscriptionReportTypes,
                    $uibModalInstance: Mock.modalInstance,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
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

            it('should not have deleted ACBs', function () {
                expect(vm.acbs.length).toBeLessThan(mock.acbs.length);
            });

            it('should have a nearly empty array of subscriptions at load', function () {
                expect(vm.recipient.subscriptions).toEqual([{}]);
            });
        });

        describe('creating a recipient', function () {
            beforeEach(function () {
                vm.recipient = angular.copy(mock.newRecipient);
            });

            it('should call the common service', function () {
                vm.save();
                scope.$digest();
                expect(commonService.createRecipient).toHaveBeenCalledWith(vm.recipient);
            });

            it('should close the modal', function () {
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({recipient: mock.newRecipient});
            });

            it('should not dismiss the modal on error', function () {
                commonService.createRecipient.and.returnValue($q.when({status: 500, data: {error: 'an error'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal on error', function () {
                commonService.createRecipient.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalledWith('bad thing');
            });
        });

        describe('updating a recipient', function () {
            beforeEach(function () {
                vm.recipient = angular.copy(mock.newRecipient);
                vm.recipient.id = 1;
            });

            it('should call the common service', function () {
                vm.save();
                scope.$digest();
                expect(commonService.updateRecipient).toHaveBeenCalledWith(vm.recipient);
            });

            it('should close the modal', function () {
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({recipient: mock.newRecipient, status: 'updated'});
            });

            it('should not dismiss the modal on error', function () {
                commonService.updateRecipient.and.returnValue($q.when({status: 500, data: {error: 'an error'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal on error', function () {
                commonService.updateRecipient.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalledWith('bad thing');
            });

            it('should connect recipient subscriptions with reports', function () {
                vm.attachReports();
                expect(vm.recipient.subscriptions).toEqual([
                    { id: 1, notificationType: { id: 1, name: 'ONC-ACB Daily Surveillance Broken Rules', description: 'A daily email of surveillance rules that have been broken within the last day for listings certified by a specific ONC-ACB.', requiresAcb: true }, acb: { id: 3, isDeleted: false } },
                    { id: 2, notificationType: { id: 3, name: 'ONC Daily Surveillance Broken Rules', description: 'A daily email of surveillance rules that have been broken within the last day for any listing.', requiresAcb: false }},
                ]);
            });
        });

        describe('deleting a recipient', function () {
            beforeEach(function () {
                vm.recipient = angular.copy(mock.newRecipient);
                vm.recipient.id = 1;
            });

            it('should call the common service', function () {
                vm.deleteRecipient();
                scope.$digest();
                expect(commonService.deleteRecipient).toHaveBeenCalledWith(vm.recipient);
            });

            it('should close the modal', function () {
                vm.deleteRecipient();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({status: 'deleted'});
            });

            it('should not dismiss the modal on error', function () {
                commonService.deleteRecipient.and.returnValue($q.when({status: 500, data: {error: 'an error'}}));
                vm.deleteRecipient();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal on error', function () {
                commonService.deleteRecipient.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.deleteRecipient();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalledWith('bad thing');
            });
        });

        describe('subscriptions', function () {
            beforeEach(function () {
                vm.recipient = angular.copy(mock.newRecipient);
            });

            it('should allow a subscription to be added', function () {
                var initLength = vm.recipient.subscriptions.length;
                vm.addSubscription();
                expect(vm.recipient.subscriptions.length).toBe(initLength + 1);
            });

            it('should allow a subscription to be removed', function () {
                var initLength = vm.recipient.subscriptions.length;
                vm.removeSubscription(0);
                expect(vm.recipient.subscriptions.length).toBe(initLength - 1);
            });
        });
    });
})();
