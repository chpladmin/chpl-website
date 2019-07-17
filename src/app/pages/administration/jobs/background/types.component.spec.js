(() => {
    'use strict';

    fdescribe('the Jobs - Scheduled - Types component', () => {
        let $compile, $log, ctrl, el, mock, scope;

        mock = {
            types: [
                {name: 'name1', retired: false, job: {name: 'name'}},
                {name: 'name2', retired: true, job: {name: 'name'}},
                {name: 'name3', retired: false, job: {name: 'name'}},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.administration');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.types = mock.types;

                el = angular.element('<chpl-jobs-background-types types="types"></chpl-jobs-background-types>');

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
                    expect(ctrl.types).toBeDefined();
                    expect(ctrl.types.length).toBe(3);
                });
            });
        });
    });
})();
