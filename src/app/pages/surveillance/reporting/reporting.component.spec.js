(() => {
    'use strict';

    fdescribe('the Reporting component', () => {
        let $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            acbs: [],
            reports: [],
        };

        beforeEach(() => {
            angular.mock.module('chpl.surveillance', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getSurveillanceReporting = jasmine.createSpy('getSurveillanceReporting');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getSurveillanceReporting.and.returnValue($q.when([]));

                scope = $rootScope.$new();
                scope.acbs = mock.acbs;
                scope.reports = mock.reports;

                el = angular.element('<chpl-surveillance-reporting acbs="acbs" reports="reports"></chpl-surveillance-reporting>');

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
        });
    });
})();
