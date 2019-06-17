(() => {
    'use strict';

    fdescribe('the Surveillance Report Quarter component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            report: {id: 1},
        };

        beforeEach(() => {
            angular.mock.module('chpl.services', 'chpl.components', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);

                scope = $rootScope.$new();
                scope.report = mock.report;
                scope.isEditing = false;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onSave = jasmine.createSpy('onSave');

                el = angular.element('<chpl-surveillance-report-quarter report="report" is-editing="isEditing" on-cancel="onCancel()" on-save="onSave(report)"></chpl-surveillance-report-quarter>');

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
