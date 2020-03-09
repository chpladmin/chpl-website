(() => {
    'use strict';

    describe('the Jobs - Background - Jobs component', () => {
        let $compile, $log, ctrl, el, mock, scope;

        mock = {
            jobs: [
                {id: 1, type: { name: 'a name'}, user: { fullName: 'Bob'}},
                {id: 2, type: { name: 'a name'}, user: { fullName: 'Bob'}},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.administration');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.jobs = mock.jobs;

                el = angular.element('<chpl-jobs-background-jobs jobs="jobs"></chpl-jobs-background-jobs>');

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
                    expect(ctrl.jobs.length).toBe(2);
                });
            });
        });
    });
})();
