(() => {
    'use strict';

    fdescribe('the Jobs - Scheduled - Page component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            triggers: [
                {name: 'name1', retired: false},
                {name: 'name2', retired: true},
                {name: 'name3', retired: false},
            ],
            types: [
                {acb: {name: 'name1'}, year: 2019, id: 1},
                {acb: {name: 'name3'}, year: 2019, id: 2},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.administration', $provide => {
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
                scope.triggers = mock.triggers;
                scope.types = mock.types;

                el = angular.element('<chpl-jobs-scheduled-page triggers="{results: triggers}" types="{results: types}"></chpl-jobs-scheduled-page>');

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
                    expect(ctrl.types).toBeDefined();
                    expect(ctrl.types.length).toBe(2);
                });
            });
        });
    });
})();
