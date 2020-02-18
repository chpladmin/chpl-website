(() => {
    'use strict';

    describe('the Jobs - Scheduled - Page component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            jobs: [
                {acb: {name: 'name1'}, year: 2019, id: 1},
                {acb: {name: 'name3'}, year: 2019, id: 2},
            ],
            triggers: [
                {name: 'name1', retired: false},
                {name: 'name2', retired: true},
                {name: 'name3', retired: false},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.administration', $provide => {
                $provide.factory('chplJobsScheduledTriggersDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getScheduleJobs = jasmine.createSpy('getScheduleJobs');
                    $delegate.getScheduleTriggers = jasmine.createSpy('getScheduleTriggers');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getScheduleJobs.and.returnValue($q.when([]));
                networkService.getScheduleTriggers.and.returnValue($q.when([]));

                scope = $rootScope.$new();
                scope.jobs = mock.jobs;
                scope.triggers = mock.triggers;

                el = angular.element('<chpl-jobs-scheduled-page triggers="{results: triggers}" jobs="{results: jobs}"></chpl-jobs-scheduled-page>');

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
                    expect(ctrl.networkService).toBeDefined();
                    expect(ctrl.mode).toBe('view');
                });

                it('should do things $onChanges', () => {
                    expect(ctrl.triggers).toBeDefined();
                    expect(ctrl.triggers.length).toBe(3);
                    expect(ctrl.jobs).toBeDefined();
                    expect(ctrl.jobs.length).toBe(2);
                });
            });

            describe('on actions', () => {
                it('should cancel', () => {
                    ctrl.activeJob = 'fake';
                    ctrl.activeTrigger = 'another fake'
                    ctrl.mode = 'something';
                    ctrl.cancel();
                    expect(ctrl.activeJob).toBeUndefined();
                    expect(ctrl.activeTrigger).toBeUndefined();
                    expect(ctrl.mode).toBe('view');
                });

                describe('for jobs', () => {
                    it('should set an editable job', () => {
                        ctrl.takeJobAction('edit', mock.jobs[0]);
                        expect(ctrl.activeJob).toBe(mock.jobs[0]);
                        expect(ctrl.mode).toBe('editJob');
                    });

                    it('should handle a one time trigger', () => {
                        ctrl.takeJobAction('scheduleOneTime', mock.jobs[1]);
                        expect(ctrl.activeTrigger).toEqual({job: mock.jobs[1]});
                        expect(ctrl.mode).toBe('editTrigger');
                        expect(ctrl.isRecurring).toBe(false);
                    });

                    it('should handle a recurring trigger', () => {
                        ctrl.takeJobAction('scheduleRecurring', mock.jobs[1]);
                        expect(ctrl.activeTrigger).toEqual({job: mock.jobs[1]});
                        expect(ctrl.mode).toBe('editTrigger');
                        expect(ctrl.isRecurring).toBe(true);
                    });
                });

                describe('for triggers', () => {
                    it('should set an editable trigger', () => {
                        ctrl.takeTriggerAction('edit', mock.triggers[0]);
                        expect(ctrl.activeTrigger).toBe(mock.triggers[0]);
                        expect(ctrl.mode).toBe('editTrigger');
                    });
                });
            });
        });
    });
})();
