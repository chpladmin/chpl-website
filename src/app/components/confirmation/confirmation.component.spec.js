(() => {
    'use strict';

    fdescribe('the Confirmation component', () => {
        var $compile, $log, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-confirmation take-action="takeAction(action)"></chpl-confirmation>');

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

            describe('when using callbacks', () => {
                it('should handle close', () => {
                    ctrl.close();
                    expect(scope.takeAction).toHaveBeenCalledWith('close');
                });
            });
        });
    });
})();
