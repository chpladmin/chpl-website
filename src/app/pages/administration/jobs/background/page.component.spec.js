(() => {
    'use strict';

    describe('the Jobs - Background - Page component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            jobs: [
                {acb: {name: 'name1'}, year: 2019, id: 1},
                {acb: {name: 'name3'}, year: 2019, id: 2},
            ],
            types: [
                {name: 'name1', retired: false},
                {name: 'name2', retired: true},
                {name: 'name3', retired: false},
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.administration', $provide => {
                $provide.factory('chplJobsBackgroundJobsDirective', () => ({}));
                $provide.factory('chplJobsBackgroundTypesDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getJobs = jasmine.createSpy('getJobs');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getJobs.and.returnValue($q.when({ results: []}));

                scope = $rootScope.$new();
                scope.types = mock.types;

                el = angular.element('<chpl-jobs-background-page types="types"></chpl-jobs-background-page>');

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
                });

                it('should do things $onChanges', () => {
                    expect(ctrl.types).toBeDefined();
                    expect(ctrl.types.length).toBe(3);
                });
            });
        });
    });
})();
