(() => {
    'use strict';

    fdescribe('the Login Component', () => {
        var $compile, $log, $q, Idle, Keepalive, authService, ctrl, el, mock, networkService, scope;

        mock = {
            response: {
                roles: [],
                user: {
                    subjectName: 'subjectName',
                    fullName: 'fullName',
                    friendlyName: 'friendly',
                    email: 'email@email.email',
                    phoneNumber: 'phone',
                },
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.navigation', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.getUsername = jasmine.createSpy('getUsername');
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    $delegate.isImpersonating = jasmine.createSpy('isImpersonating');
                    $delegate.logout = jasmine.createSpy('logout');
                    $delegate.saveToken = jasmine.createSpy('saveToken');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.changePassword = jasmine.createSpy('changePassword');
                    $delegate.getUserByUsername = jasmine.createSpy('getUserByUsername');
                    $delegate.keepalive = jasmine.createSpy('keepalive');
                    $delegate.login = jasmine.createSpy('login');
                    $delegate.emailResetPassword = jasmine.createSpy('emailResetPassword');
                    $delegate.resetPassword = jasmine.createSpy('resetPassword');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _Idle_, _Keepalive_, _authService_, _networkService_) => {
                $compile = _$compile_;
                $q = _$q_;
                $log = _$log_;
                Idle = _Idle_;
                Keepalive = _Keepalive_;

                authService = _authService_;
                authService.getUsername.and.returnValue('admin');
                authService.hasAnyRole.and.returnValue(true);
                authService.isImpersonating.and.returnValue(false);
                authService.saveToken.and.returnValue({});

                networkService = _networkService_;
                networkService.changePassword.and.returnValue($q.when({passwordUpdated: true}));
                networkService.emailResetPassword.and.returnValue($q.when({}));
                networkService.getUserByUsername.and.returnValue($q.when(mock.response));
                networkService.keepalive.and.returnValue($q.when({}));
                networkService.login.and.returnValue($q.when({}));
                networkService.resetPassword.and.returnValue($q.when({}));

                scope = $rootScope.$new();

                el = angular.element('<chpl-login></chpl-login>');
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

        describe('directive', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should have isolate scope object with instanciate members', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });

            it('should have a way to log in', () => {
                expect(ctrl.login).toBeDefined();
            });

            it('should farm out hasAnyRole to the authservice', () => {
                ctrl.hasAnyRole();
                expect(authService.hasAnyRole).toHaveBeenCalled();
            });

            it('should be able to set activity', () => {
                expect(ctrl.activity).toBe(ctrl.activityEnum.NONE);
                ctrl.setActivity('fake');
                expect(ctrl.activity).toBe('fake');
            });

            it('should know when passwords aren\'t matched', () => {
                ctrl.newPassword = 'new';
                ctrl.confirmPassword = 'confirm';
                expect(ctrl.misMatchPasswords()).toBe(true);
                ctrl.confirmPassword = 'new';
                expect(ctrl.misMatchPasswords()).toBe(false);
            });

            describe('when loading', () => {
                it('should start Idle if logged in', () => {
                    spyOn(Idle, 'watch');
                    let initCount = Idle.watch.calls.count();
                    el = angular.element('<chpl-login></chpl-login>');
                    $compile(el)(scope);
                    scope.$digest();
                    expect(Idle.watch.calls.count()).toBe(initCount + 1);
                });

                it('should not start Idle if not logged in', () => {
                    authService.hasAnyRole.and.returnValue(false);
                    spyOn(Idle, 'watch');
                    let initCount = Idle.watch.calls.count();
                    el = angular.element('<chpl-login></chpl-login>');
                    $compile(el)(scope);
                    scope.$digest();
                    expect(Idle.watch.calls.count()).toBe(initCount);
                });
            });

            describe('on keepalive ping', () => {
                describe('when authenticated', () => {
                    it('should set activity', () => {
                        ctrl.activity = ctrl.activityEnum.RESET;
                        scope.$broadcast('Keepalive');
                        expect(ctrl.activity).toBe(ctrl.activityEnum.NONE);
                        ctrl.activity = ctrl.activityEnum.LOGIN;
                        scope.$broadcast('Keepalive');
                        expect(ctrl.activity).toBe(ctrl.activityEnum.NONE);
                        ctrl.activity = ctrl.activityEnum.CHANGE;
                        scope.$broadcast('Keepalive');
                        expect(ctrl.activity).toBe(ctrl.activityEnum.CHANGE);
                    });

                    it('should send a keepalive request to the network service', () => {
                        scope.$broadcast('Keepalive');
                        expect(networkService.keepalive).toHaveBeenCalled();
                    });

                    it('should send the response to the auth service for saving', () => {
                        networkService.keepalive.and.returnValue($q.when({token: 'token'}));
                        scope.$broadcast('Keepalive');
                        expect(networkService.keepalive).toHaveBeenCalled();
                        scope.$digest();
                        expect(authService.saveToken).toHaveBeenCalledWith('token');
                    });
                });

                describe('when un-authenticated', () => {
                    it('should set activity to LOGIN', () => {
                        authService.hasAnyRole.and.returnValue(false);
                        scope.$broadcast('Keepalive');
                        expect(ctrl.activity).toBe(ctrl.activityEnum.LOGIN);
                    });

                    it('should unwatch the Idle', () => {
                        authService.hasAnyRole.and.returnValue(false);
                        spyOn(Idle, 'unwatch');
                        scope.$broadcast('Keepalive');
                        expect(Idle.unwatch).toHaveBeenCalled();
                    });
                });
            });

            describe('when changing a password', () => {
                it('should have an error message if passwords don\'t match', () => {
                    ctrl.newPassword = 'new';
                    ctrl.confirmPassword = 'old';
                    ctrl.changePassword();
                    expect(ctrl.message).toBe('Passwords do not match. Please try again');
                });

                it('should call the network service', () => {
                    ctrl.password = 'old';
                    ctrl.newPassword = 'new';
                    ctrl.confirmPassword = 'new';
                    ctrl.changePassword();
                    expect(networkService.changePassword).toHaveBeenCalledWith({userName: '', oldPassword: 'old', newPassword: 'new'});
                });

                it('should report a message and clear the form on success', () => {
                    spyOn(ctrl, 'clear');
                    ctrl.password = 'old';
                    ctrl.newPassword = 'new';
                    ctrl.confirmPassword = 'new';
                    ctrl.changePassword();
                    scope.$digest();
                    expect(ctrl.clear).toHaveBeenCalled();
                    expect(ctrl.message).toBe('Password successfully changed');
                });

                describe('when dealing with password strength', () => {
                    beforeEach(() => {
                        ctrl.password = 'old';
                        ctrl.newPassword = 'new';
                        ctrl.confirmPassword = 'new';
                    });

                    it('should report failures', () => {
                        networkService.changePassword.and.returnValue($q.when({
                            passwordUpdated: false,
                            warning: 'a warning',
                        }));
                        ctrl.changePassword();
                        scope.$digest();
                        expect(ctrl.message).toBe('Your password was not changed. a warning');
                    });

                    it('should report a suggestion', () => {
                        networkService.changePassword.and.returnValue($q.when({
                            passwordUpdated: false,
                            suggestions: ['a suggestion'],
                        }));
                        ctrl.changePassword();
                        scope.$digest();
                        expect(ctrl.message).toBe('Your password was not changed. Suggestion: a suggestion');
                    });

                    it('should report suggestions', () => {
                        networkService.changePassword.and.returnValue($q.when({
                            passwordUpdated: false,
                            suggestions: ['a suggestion', 'another suggestion'],
                        }));
                        ctrl.changePassword();
                        scope.$digest();
                        expect(ctrl.message).toBe('Your password was not changed. Suggestions: a suggestion another suggestion');
                    });

                    it('should handle the absence of warning and suggestions', () => {
                        networkService.changePassword.and.returnValue($q.when({
                            passwordUpdated: false,
                        }));
                        ctrl.changePassword();
                        scope.$digest();
                        expect(ctrl.message).toBe('Your password was not changed. Please try again with a stronger password.');
                    });
                });

                it('should report a message on failure', () => {
                    networkService.changePassword.and.returnValue($q.reject({}));
                    ctrl.password = 'old';
                    ctrl.newPassword = 'new';
                    ctrl.confirmPassword = 'new';
                    ctrl.changePassword();
                    scope.$digest();
                    expect(ctrl.message).toBe('Error. Please check your credentials or contact the administrator');
                });
            });

            describe('when clearing', () => {
                it('should set activity state', () => {
                    ctrl.activity = undefined;
                    ctrl.clear();
                    expect(ctrl.activity).toBe(ctrl.activityEnum.NONE);
                });

                it('should set activity to LOGIN if not loged in', () => {
                    ctrl.activity = undefined;
                    authService.hasAnyRole.and.returnValue(false);
                    ctrl.clear();
                    expect(ctrl.activity).toBe(ctrl.activityEnum.LOGIN);
                });

                it('should set the form fields to blank', () => {
                    ctrl.userName = 'not blank';
                    ctrl.password = 'not blank';
                    ctrl.newPassword = 'not blank';
                    ctrl.confirmPassword = 'not blank';
                    ctrl.email = 'not blank';
                    ctrl.message = 'not blank';
                    ctrl.clear();
                    expect(ctrl.userName).toBe('');
                    expect(ctrl.password).toBe('');
                    expect(ctrl.newPassword).toBe('');
                    expect(ctrl.confirmPassword).toBe('');
                    expect(ctrl.email).toBe('');
                    expect(ctrl.message).toBe('');
                });

                it('should mark the form as pristine/untouched if it exists', () => {
                    ctrl.loginForm = undefined;
                    ctrl.clear();
                    ctrl.loginForm = {
                        $setPristine: jasmine.createSpy('$setPristine'),
                        $setUntouched: jasmine.createSpy('$setUntouched'),
                    };
                    ctrl.clear();
                    expect(ctrl.loginForm.$setPristine).toHaveBeenCalled();
                    expect(ctrl.loginForm.$setUntouched).toHaveBeenCalled();
                });
            });

            describe('when logging in', () => {
                it('should call networkService.login with correct parameters', () => {
                    ctrl.userName = 'test';
                    ctrl.password = 'password';
                    ctrl.login();
                    expect(networkService.login).toHaveBeenCalledWith({userName: 'test', password: 'password'});
                });

                it('should broadcast that someone has logged in', () => {
                    spyOn(ctrl, 'broadcastLogin');
                    ctrl.login();
                    scope.$digest();
                    expect(ctrl.broadcastLogin).toHaveBeenCalled();
                });

                it('should start Idle, Keepalive, and clear the form on success', () => {
                    spyOn(Idle, 'watch');
                    spyOn(Keepalive, 'ping');
                    spyOn(ctrl, 'clear');
                    ctrl.userName = 'test';
                    ctrl.password = 'password';
                    ctrl.login();
                    scope.$digest();
                    expect(Idle.watch).toHaveBeenCalled();
                    expect(Keepalive.ping).toHaveBeenCalled();
                    expect(ctrl.clear).toHaveBeenCalled();
                });

                describe('with bad data', () => {
                    it('should have an error message if login credentials are bad', () => {
                        networkService.login.and.returnValue($q.reject({data: {error: 'Invalid username / password'}}));
                        ctrl.login();
                        scope.$digest();
                        expect(ctrl.message).toBe('Invalid username / password');
                    });

                    it('should direct the user to change their password if credentials are expired', () => {
                        networkService.login.and.returnValue($q.reject({data: {error: 'The user is required to change their password on next log in.'}}));
                        ctrl.login();
                        scope.$digest();
                        expect(ctrl.activity).toBe(ctrl.activityEnum.EXPIRED);
                    });
                });
            });

            describe('when logging out', () => {
                it('should unwatch Idle, call the auth service, and clear', () => {
                    spyOn(Idle, 'unwatch');
                    spyOn(ctrl, 'clear');
                    ctrl.logout();
                    expect(Idle.unwatch).toHaveBeenCalled();
                    expect(authService.logout).toHaveBeenCalled();
                    expect(ctrl.clear).toHaveBeenCalled();
                });
            });

            describe('when emailing a password reset in', () => {
                it('should call networkService.emailResetPassword with correct parameters', () => {
                    ctrl.userName = 'test';
                    ctrl.email = 'email';
                    ctrl.sendReset();
                    expect(networkService.emailResetPassword).toHaveBeenCalledWith({userName: 'test', email: 'email'});
                });

                it('should start clear the form and report a message on success', () => {
                    spyOn(ctrl, 'clear');
                    ctrl.userName = 'test';
                    ctrl.email = 'email';
                    ctrl.sendReset();
                    scope.$digest();
                    expect(ctrl.clear).toHaveBeenCalled();
                    expect(ctrl.message).toBe('Password email sent; please check your email');
                });

                it('should have an error message if service reports an error', () => {
                    networkService.emailResetPassword.and.returnValue($q.reject({data: {error: 'Invalid username / password'}}));
                    ctrl.sendReset();
                    scope.$digest();
                    expect(ctrl.message).toBe('Invalid username/email combination. Please check your credentials or contact the administrator');
                });
            });

            describe('when resetting a password in', () => {
                it('should call the network service', () => {
                    const token = 'd24cefad-e2e3-4923-894a-5daab52cf0e4'
                    ctrl.userName = 'test';
                    ctrl.newPassword = 'new';
                    ctrl.confirmPassword = 'new';
                    ctrl.token = token;
                    ctrl.resetPassword();
                    expect(networkService.resetPassword).toHaveBeenCalledWith({token: token, userName: ctrl.userName, newPassword: ctrl.newPassword});
                });
            });
        });
    });
})();
