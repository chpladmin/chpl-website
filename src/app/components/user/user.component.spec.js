(() => {
    'use strict';

    fdescribe('the User component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            user: {
                userId: 43,
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
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
                scope.user = mock.user;
                scope.onCancel = jasmine.createSpy('onCancel');
                scope.onSave = jasmine.createSpy('onSave');
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-user user="user" on-cancel="onCancel()" on-save="onSave(user)" take-action="takeAction(action, userId)"></chpl-user>');

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

            describe('on change/init', () => {
                it('should make copies of inputs', () => {
                    expect(ctrl.user).not.toBe(mock.user);
                    expect(ctrl.user).toEqual(mock.user);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    let user = ctrl.user;
                    ctrl.$onChanges({});
                    expect(user).toBe(ctrl.user);
                });
            });

            describe('when using callbacks', () => {
                it('should send back data on edit', () => {
                    ctrl.edit();
                    expect(scope.takeAction).toHaveBeenCalledWith('edit', 43);
                });
            });

            describe('when handling edits', () => {
                it('should handle save when not splitting', () => {
                    ctrl.save();
                    expect(scope.onSave).toHaveBeenCalled();
                });

                it('should handle cancel', () => {
                    ctrl.cancel();
                    expect(scope.onCancel).toHaveBeenCalled();
                });
            });
        });
    });
})();
