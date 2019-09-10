(() => {
    'use strict';

    fdescribe('the User Management component', () => {
        var $compile, $log, $state, authService, ctrl, el, scope;

        beforeEach(() => {
            angular.mock.module('chpl.users', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, $rootScope, _$state_, _authService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $state = _$state_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);

                scope = $rootScope.$new();
                el = angular.element('<chpl-user-management></chpl-user-management>');

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

            describe('for callbacks', () => {
                describe('impersonation', () => {
                    it('should redirect to dashboard for ROLE_DEVELOPER', () => {
                        authService.hasAnyRole.and.callFake(roles => !roles || roles.indexOf('ROLE_DEVELOPER') >= 0)
                        spyOn($state, 'go');
                        ctrl.takeAction('impersonate');
                        expect($state.go).toHaveBeenCalledWith('dashboard');
                    });

                    it('should not redirect to dashboard for non ROLE_DEVELOPER', () => {
                        authService.hasAnyRole.and.callFake(roles => !roles || roles.indexOf('ROLE_DEVELOPER') === -1)
                        spyOn($state, 'go');
                        ctrl.takeAction('impersonate');
                        expect($state.go).not.toHaveBeenCalled();
                    });
                });
            });
        });
    });
})();
