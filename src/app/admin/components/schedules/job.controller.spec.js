(function () {
    'use strict';

    describe('the Job Edit', function () {
        var $log, $q, Mock, mock, networkService, scope, vm;

        mock = {
            job: {
                description: 'Send warnings to subscribers when an ONC-ACB has changed status of a listing to a state that might warrant a Developer Ban.',
                group: 'chplJobs',
                name: 'Trigger Developer Ban Notification',
                frequency: null,
                jobDataMap: {
                    editableJobFields: 'email-Subscribers',
                    authorities: 'ROLE_ADMIN',
                    email: 'alarned@ainq.com',
                },
            },
        };

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.updateJob = jasmine.createSpy('updateJob');

                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                networkService = _networkService_;
                networkService.updateJob.and.returnValue($q.when(mock.job));

                scope = $rootScope.$new();
                vm = $controller('JobController', {
                    job: mock.job,
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

        describe('when updating a job', function () {
            beforeEach(function () {
                vm.job = angular.copy(mock.job);
            });

            it('should call the common service', function () {
                vm.save();
                scope.$digest();
                expect(networkService.updateJob).toHaveBeenCalledWith(vm.job);
            });

            it('should close the modal', function () {
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalledWith({job: mock.job, status: 'updated'});
            });

            it('should not dismiss the modal on error', function () {
                networkService.updateJob.and.returnValue($q.when({status: 500, data: {error: 'an error'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalled();
            });

            it('should not dismiss the modal on error', function () {
                networkService.updateJob.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.dismiss).not.toHaveBeenCalledWith('bad thing');
            });
        });

        describe('when handling job data', function () {
            it('should add to elements', function () {
                vm.newItem['email-Subscribers'] = 'newEmail'
                vm.addNewItem('email-Subscribers');
                expect(vm.job.jobDataMap.email).toBe('alarned@ainq.com☺newEmail');
            });

            it('should add elements even if null', function () {
                vm.newItem['email-Subscribers'] = 'newEmail'
                vm.job.jobDataMap.email = null;
                vm.addNewItem('email-Subscribers');
                expect(vm.job.jobDataMap.email).toBe('newEmail');
            });

            it('should remove from elements', function () {
                vm.removeItem('email-Subscribers', 'alarned@ainq.com');
                expect(vm.job.jobDataMap.email).toBe('');
            });
        });
    });
})();
