(() => {
    'use strict';

    describe('the Surveillance Report Relevent Surveillance component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            surveillance: {id: 7706, chplProductNumber: '14.02.02.2646.A001.01.00.1.160412', lastModifiedDate: 1528178797574, edition: '2014', certificationDate: 1460433600000},
        };

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.surveillance = mock.surveillance;
                scope.isEditing = false;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onSave = jasmine.createSpy('onSave');

                el = angular.element('<chpl-surveillance-report-relevant-surveillance surveillance="surveillance" is-editing="isEditing" on-cancel="onCancel()" on-save="onSave(listing)"></chpl-surveillance-report-relevant-surveillance>');

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
