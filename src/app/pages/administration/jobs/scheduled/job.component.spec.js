(() => {
    'use strict';

    fdescribe('the Job Edit component', () => {
        let $compile, $log, ctrl, el, mock, scope;

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

        beforeEach(() => {
            angular.mock.module('chpl.administration');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.job = mock.job;
                scope.onSave = jasmine.createSpy('onSave');
                scope.onCancel = jasmine.createSpy('onCancel');

                el = angular.element('<chpl-jobs-scheduled-job job="job" on-save="onSave(job)" on-cancel="onCancel()"></chpl-jobs-scheduled-job>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            it('should call the save callback', () => {
                ctrl.save();
                expect(scope.onSave).toHaveBeenCalledWith(mock.job);
            });

            it('should call the cancel callback', () => {
                ctrl.cancel();
                expect(scope.onCancel).toHaveBeenCalled();
            });
        });

        describe('when handling job data', () => {
            it('should add to elements', () => {
                ctrl.newItem['email-Subscribers'] = 'newEmail'
                ctrl.addNewItem('email-Subscribers');
                expect(ctrl.job.jobDataMap.email).toBe('alarned@ainq.com☺newEmail');
            });

            it('should add elements even if null', () => {
                ctrl.newItem['email-Subscribers'] = 'newEmail'
                ctrl.job.jobDataMap.email = null;
                ctrl.addNewItem('email-Subscribers');
                expect(ctrl.job.jobDataMap.email).toBe('newEmail');
            });

            it('should remove from elements', () => {
                ctrl.removeItem('email-Subscribers', 'alarned@ainq.com');
                expect(ctrl.job.jobDataMap.email).toBe('');
            });
        });
    });
})();
