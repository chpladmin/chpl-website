(() => {
    'use strict';

    fdescribe('the Jobs - Scheduled - Triggers component', () => {
        let $compile, $log, ctrl, el, mock, scope;

        mock = {
            triggers: [
                {name: 'name1', retired: false},
                {name: 'name2', retired: true},
                {name: 'name3', retired: false},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.administration');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.triggers = mock.triggers;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-jobs-scheduled-triggers triggers="triggers" take-action="takeAction(action, data)"></chpl-jobs-scheduled-triggers>');

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
                    expect(ctrl.mode).toBe('view');
                });

                it('should do things $onChanges', () => {
                    expect(ctrl.triggers).toBeDefined();
                    expect(ctrl.triggers.length).toBe(3);
                });
            });
        });
    });
})();
