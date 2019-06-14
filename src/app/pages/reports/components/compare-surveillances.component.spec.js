(() => {
    'use strict';

    describe('the Compare Surveillances component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {};
        mock.newSurv = {
            id: 1,
        };
        mock.oldSurv = {
            id: 2,
        };

        beforeEach(() => {
            angular.mock.module('chpl.reports');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.close = jasmine.createSpy('close');
                scope.dismiss = jasmine.createSpy('dismiss');
                scope.resolve = {
                    oldSurveillance: mock.oldSurv,
                    newSurveillance: mock.newSurv,
                }

                el = angular.element('<chpl-compare-surveillances close="close($value)" dismiss="dismiss()" resolve="resolve"></chpl-compare-surveillances>');

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

        describe('template', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });

            it('should have a way to close the modal', () => {
                expect(ctrl.cancel).toBeDefined();
                ctrl.cancel();
                expect(scope.dismiss).toHaveBeenCalled();
            });

            it('should load new and old Surveillances', () => {
                expect(ctrl.oldSurveillance).toEqual(mock.oldSurv);
                expect(ctrl.newSurveillance).toEqual(mock.newSurv);
            });
        });
    });
})();
