(() => {
    'use strict';

    fdescribe('the Dashboard component', () => {
        var $compile, $log, authService, ctrl, el, mock, scope;

        mock = {
            developer: {id: 1},
            users: [{id: 1}],
        }

        beforeEach(() => {
            angular.mock.module('chpl.dashboard', $provide => {
                $provide.factory('chplDeveloperDirective', () => ({}));
                $provide.factory('chplUsersDirective', () => ({}));
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
                scope.developer = mock.developer;
                scope.users = {users: mock.users};
                el = angular.element('<chpl-dashboard developer="developer" users="users"></chpl-dashboard>');

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

            describe('during initialization', () => {
                it('should copy its parameters', () => {
                    expect(ctrl.developer).not.toBe(mock.developer);
                    expect(ctrl.developer).toEqual(mock.developer);
                    expect(ctrl.users).not.toBe(mock.users);
                    expect(ctrl.users).toEqual(mock.users);
                });
            });
        });
    });
})();
