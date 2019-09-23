(() => {
    'use strict';

    fdescribe('the Dashboard component', () => {
        var $compile, $log, $q, $rootScope, $state, authService, ctrl, el, mock, networkService, scope, toaster;

        mock = {
            developer: {developerId: 1},
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
                $provide.decorator('networkService', $delegate => {
                    $delegate.getDeveloper = jasmine.createSpy('getDeveloper');
                    $delegate.getUsersAtDeveloper = jasmine.createSpy('getUsersAtDeveloper');
                    $delegate.inviteUser = jasmine.createSpy('inviteUser');
                    $delegate.removeUserFromDeveloper = jasmine.createSpy('removeUserFromDeveloper');

                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, _$rootScope_, _$state_, _authService_, _networkService_, _toaster_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                $state = _$state_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.getDeveloper.and.returnValue($q.when(mock.developer));
                networkService.getUsersAtDeveloper.and.returnValue($q.when({users: mock.users}));
                networkService.inviteUser.and.returnValue($q.when({}));
                networkService.removeUserFromDeveloper.and.returnValue($q.when({}));
                toaster = _toaster_;

                scope = $rootScope.$new();
                scope.developer = mock.developer;
                scope.users = {users: mock.users};
                el = angular.element('<chpl-dashboard developer-id="22"></chpl-dashboard>');

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
                it('should have parameters', () => {
                    expect(ctrl.developerId).toBe(22)
                });

                it('should get data', () => {
                    expect(networkService.getDeveloper).toHaveBeenCalledWith(22);
                    expect(networkService.getDeveloper.calls.count()).toBe(1);
                    expect(networkService.getUsersAtDeveloper).toHaveBeenCalledWith(22);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(1);
                });
            });

            describe('on log in', () => {
                it('should refresh data', () => {
                    let initCount = {
                        developer: networkService.getDeveloper.calls.count(),
                        users: networkService.getUsersAtDeveloper.calls.count(),
                    }
                    $rootScope.$broadcast('loggedIn');
                    expect(networkService.getDeveloper.calls.count()).toBe(initCount.developer + 1);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount.users + 1);
                });
            });

            describe('when cleaning up', () => {
                it('should clean up hooks', () => {
                    let initCount = {
                        developer: networkService.getDeveloper.calls.count(),
                        users: networkService.getUsersAtDeveloper.calls.count(),
                    }
                    ctrl.$onDestroy()
                    $rootScope.$broadcast('loggedIn');
                    expect(networkService.getDeveloper.calls.count()).toBe(initCount.developer);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount.users);
                });
            });

            describe('with respect to callbacks', () => {
                it('should handle delete', () => {
                    let initCount = networkService.getUsersAtDeveloper.calls.count();
                    ctrl.takeAction('delete', 3);
                    scope.$digest();
                    expect(networkService.removeUserFromDeveloper).toHaveBeenCalledWith(3, 22);
                    expect(networkService.getUsersAtDeveloper).toHaveBeenCalledWith(22);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount + 1);
                });

                it('should handle invitation', () => {
                    ctrl.takeAction('invite', {role: 'ROLE_DEVELOPER', email: 'fake'});
                    spyOn(toaster, 'pop');
                    scope.$digest();
                    expect(networkService.inviteUser).toHaveBeenCalledWith({
                        role: 'ROLE_DEVELOPER',
                        emailAddress: 'fake',
                        permissionObjectId: 1,
                    });
                    expect(toaster.pop).toHaveBeenCalledWith({
                        type: 'success',
                        title: 'Email sent',
                        body: 'Email sent successfully to fake',
                    });
                });

                it('should handle refresh', () => {
                    let initCount = networkService.getUsersAtDeveloper.calls.count();
                    ctrl.takeAction('refresh');
                    scope.$digest();
                    expect(networkService.getUsersAtDeveloper).toHaveBeenCalledWith(22);
                    expect(networkService.getUsersAtDeveloper.calls.count()).toBe(initCount + 1);
                });

                it('should handle impersonate', () => {
                    spyOn($state, 'reload');
                    ctrl.takeAction('impersonate');
                    expect($state.reload).toHaveBeenCalled();
                });
            });
        });
    });
})();
