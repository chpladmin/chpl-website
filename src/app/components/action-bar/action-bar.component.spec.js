(() => {
    'use strict';

    describe('the Action Bar component', () => {
        var $compile, $log, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.components');

            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-action-bar take-action="takeAction(action)"></chpl-action-bar>');

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
                it('should handle cancel', () => {
                    ctrl.cancel();
                    expect(scope.takeAction).toHaveBeenCalledWith('cancel');
                });

                it('should handle save', () => {
                    ctrl.save();
                    expect(scope.takeAction).toHaveBeenCalledWith('save');
                });

                it('should handle mouseover', () => {
                    ctrl.mouseover();
                    expect(scope.takeAction).toHaveBeenCalledWith('mouseover');
                });
            });
        });
    });
})();
