(() => {
    'use strict';

    fdescribe('the Trigger Edit component', () => {
        let $compile, $log, ctrl, el, mock, scope;

        mock = {
            trigger: {job: {description: 'Sends an error report for all Listings breaking Surveillance rules within the last day, by specific ACB', group: 'chplJobs', name: 'ONC-ACB Overnight Broken Surveillance Rules Report', frequency: 'DAILY', jobDataMap: {acbSpecific: true, type: 'Overnight', authorities: 'ROLE_ADMIN;ROLE_ONC;ROLE_ACB', frequency: 'DAILY'}}},
            acbs: [{id: 3}],
        };

        beforeEach(() => {
            angular.mock.module('chpl.administration');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.trigger = mock.trigger;
                scope.acbs = mock.acbs;
                scope.recurring = false;
                scope.onSave = jasmine.createSpy('onSave');
                scope.onCancel = jasmine.createSpy('onCancel');

                el = angular.element('<chpl-jobs-scheduled-trigger trigger="trigger" acbs="acbs" recurring="recurring" on-save="onSave(trigger)" on-cancel="onCancel()"></chpl-jobs-scheduled-trigger>');

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

            it('should do things $onChanges', () => {
                expect(ctrl.trigger).toBeDefined();
                expect(ctrl.acbs).toBeDefined();
                expect(ctrl.acbs.length).toBe(1);
                expect(ctrl.recurring).toBeDefined();
            });

            it('should call the save callback', () => {
                ctrl.selectedDateTime = new Date('2019-06-17');
                ctrl.save();
                expect(scope.onSave).toHaveBeenCalledWith({
                    job: mock.trigger.job,
                    runDateMillis: 1560729600000,
                });
            });

            it('should call the cancel callback', () => {
                ctrl.cancel();
                expect(scope.onCancel).toHaveBeenCalled();
            });
        });
    });
})();
