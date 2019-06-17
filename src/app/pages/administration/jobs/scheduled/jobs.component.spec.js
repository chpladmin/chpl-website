(() => {
    'use strict';

    fdescribe('the Jobs - Scheduled - Jobs component', () => {
        let $compile, $log, ctrl, el, mock, scope;

        mock = {
            jobs: [
                {description: 'Send email to API key holders where a warning email has been sent, after x days of inactivity, and delete the key', group: 'systemJobs', name: 'apiKeyDeleteJob', frequency: null, jobDataMap: {}},
                {description: 'Sends an error report for all Listings breaking ICS rules', group: 'chplJobs', name: 'ONC Inherited Certification Status Errors Report', frequency: 'DAILY', jobDataMap: {authorities: 'ROLE_ADMIN;ROLE_ONC', frequency: 'DAILY'}},
                {description: 'Sends an error report for all Listings breaking Surveillance rules within the last day, by specific ACB', group: 'chplJobs', name: 'ONC-ACB Overnight Broken Surveillance Rules Report', frequency: 'DAILY', jobDataMap: {acbSpecific: true, type: 'Overnight', authorities: 'ROLE_ADMIN;ROLE_ONC;ROLE_ACB', frequency: 'DAILY'}},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.administration');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.jobs = mock.jobs;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-jobs-scheduled-jobs jobs="jobs" take-action="takeAction(action, data)"></chpl-jobs-scheduled-jobs>');

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

            describe('during initiation', () => {
                it('should have constructed stuff', () => {
                    expect(ctrl.$log).toBeDefined();
                });

                it('should do things $onChanges', () => {
                    expect(ctrl.jobs).toBeDefined();
                    expect(ctrl.jobs.length).toBe(3);
                });

                it('should know what columns to display when all should be', () => {
                    expect(ctrl.showJob).toBe(true);
                    expect(ctrl.hideAcb).toBe(false);
                });

                it('should know what columns to display when system shouldn\'t', () => {
                    scope.jobs = mock.jobs.slice(1);
                    el = angular.element('<chpl-jobs-scheduled-jobs jobs="jobs" take-action="takeAction(action, data)"></chpl-jobs-scheduled-jobs>');

                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                    expect(ctrl.showJob).toBe(false);
                    expect(ctrl.hideAcb).toBe(false);
                });

                it('should know what columns to display when acb shouldn\'t', () => {
                    scope.jobs = mock.jobs.slice(2);
                    el = angular.element('<chpl-jobs-scheduled-jobs jobs="jobs" take-action="takeAction(action, data)"></chpl-jobs-scheduled-jobs>');

                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                    expect(ctrl.showJob).toBe(false);
                    expect(ctrl.hideAcb).toBe(true);
                });
            });

            describe('with callbacks', () => {
                it('should call back when creating a one time trigger', () => {
                    ctrl.scheduleOneTimeJob(mock.jobs[0]);
                    expect(scope.takeAction).toHaveBeenCalledWith('scheduleOneTime', mock.jobs[0]);
                });

                it('should call back when creating a recurring trigger', () => {
                    ctrl.scheduleRecurringJob(mock.jobs[1]);
                    expect(scope.takeAction).toHaveBeenCalledWith('scheduleRecurring', mock.jobs[1]);
                });

                it('should call back when editing a job', () => {
                    ctrl.editJob(mock.jobs[1]);
                    expect(scope.takeAction).toHaveBeenCalledWith('edit', mock.jobs[1]);
                });
            });
        });
    });
})();
