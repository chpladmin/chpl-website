(() => {
    'use strict';

    describe('the User component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            user: {
                userId: 43,
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.canImpersonate = jasmine.createSpy('canImpersonate');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                authService = _authService_;
                authService.canImpersonate.and.returnValue(true);

                scope = $rootScope.$new();
                scope.user = mock.user;
                scope.isEditing = true;
                scope.takeAction = jasmine.createSpy('takeAction');

                el = angular.element('<chpl-user user="user" is-editing="isEditing" take-action="takeAction(action, data)"></chpl-user>');

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
                    expect(scope.takeAction).toHaveBeenCalledWith('edit', mock.user);
                });

                it('should handle save', () => {
                    ctrl.save();
                    expect(scope.takeAction).toHaveBeenCalledWith('save', mock.user);
                });

                it('should handle cancel', () => {
                    ctrl.cancel();
                    expect(scope.takeAction).toHaveBeenCalledWith('cancel', undefined);
                });

                it('should handle delete', () => {
                    ctrl.delete();
                    expect(scope.takeAction).toHaveBeenCalledWith('delete', 43);
                });

                it('should handle impersonate', () => {
                    ctrl.impersonate();
                    expect(scope.takeAction).toHaveBeenCalledWith('impersonate', mock.user);
                });
            });
        });
    });
})();
