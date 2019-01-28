(function () {
    'use strict';

    describe('the Login', function () {
        var $compile, $log, $q, Idle, Keepalive, authService, el, mock, networkService, scope, vm;

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

        beforeEach(function () {
            angular.mock.module('chpl', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getUsername = jasmine.createSpy('getUsername');
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    $delegate.logout = jasmine.createSpy('logout');
                    $delegate.saveToken = jasmine.createSpy('saveToken');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.changePassword = jasmine.createSpy('changePassword');
                    $delegate.getUserByUsername = jasmine.createSpy('getUserByUsername');
                    $delegate.keepalive = jasmine.createSpy('keepalive');
                    $delegate.login = jasmine.createSpy('login');
                    $delegate.emailResetPassword = jasmine.createSpy('emailResetPassword');
                    $delegate.resetPassword = jasmine.createSpy('resetPassword');
                    return $delegate;
                });
            });

            inject(function (_$compile_, _$log_, _$q_, $rootScope, _Idle_, _Keepalive_, _authService_, _networkService_) {
                $compile = _$compile_;
                $q = _$q_;
                $log = _$log_;
                Idle = _Idle_;
                Keepalive = _Keepalive_;

                authService = _authService_;
                authService.getUsername.and.returnValue('admin');
                authService.hasAnyRole.and.returnValue(true);
                authService.saveToken.and.returnValue({});

                networkService = _networkService_;
                networkService.changePassword.and.returnValue($q.when({passwordUpdated: true}));
                networkService.emailResetPassword.and.returnValue($q.when({}));
                networkService.getUserByUsername.and.returnValue($q.when(mock.response));
                networkService.keepalive.and.returnValue($q.when({}));
                networkService.login.and.returnValue($q.when({}));
                networkService.resetPassword.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                el = angular.element('<ai-login></ai-login>');
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should have isolate scope object with instanciate members', function () {
                expect(vm).toEqual(jasmine.any(Object));
            });

            it('should have a function to log in', function () {
                expect(vm.login).toBeDefined();
            });

            it('should farm out hasAnyRole to the authservice', function () {
                vm.hasAnyRole();
                expect(authService.hasAnyRole).toHaveBeenCalled();
            });

            it('should be able to set activity', function () {
                expect(vm.activity).toBe(vm.activityEnum.NONE);
                vm.setActivity('fake');
                expect(vm.activity).toBe('fake');
            });

            it('should know when passwords aren\'t matched', function () {
                vm.newPassword = 'new';
                vm.confirmPassword = 'confirm';
                expect(vm.misMatchPasswords()).toBe(true);
                vm.confirmPassword = 'new';
                expect(vm.misMatchPasswords()).toBe(false);
            });

            describe('when loading', function () {
                it('should start Idle if logged in', function () {
                    spyOn(Idle, 'watch');
                    let initCount = Idle.watch.calls.count();
                    el = angular.element('<ai-login></ai-login>');
                    $compile(el)(scope);
                    scope.$digest();
                    expect(Idle.watch.calls.count()).toBe(initCount + 1);
                });

                it('should not start Idle if not logged in', function () {
                    authService.hasAnyRole.and.returnValue(false);
                    spyOn(Idle, 'watch');
                    let initCount = Idle.watch.calls.count();
                    el = angular.element('<ai-login></ai-login>');
                    $compile(el)(scope);
                    scope.$digest();
                    expect(Idle.watch.calls.count()).toBe(initCount);
                });
            });

            describe('on keepalive ping', function () {
                describe('when authenticated', function () {
                    it('should set activity', function () {
                        vm.activity = vm.activityEnum.RESET;
                        scope.$broadcast('Keepalive');
                        expect(vm.activity).toBe(vm.activityEnum.NONE);
                        vm.activity = vm.activityEnum.LOGIN;
                        scope.$broadcast('Keepalive');
                        expect(vm.activity).toBe(vm.activityEnum.NONE);
                        vm.activity = vm.activityEnum.CHANGE;
                        scope.$broadcast('Keepalive');
                        expect(vm.activity).toBe(vm.activityEnum.CHANGE);
                    });

                    it('should send a keepalive request to the network service', function () {
                        scope.$broadcast('Keepalive');
                        expect(networkService.keepalive).toHaveBeenCalled();
                    });

                    it('should send the response to the auth service for saving', function () {
                        networkService.keepalive.and.returnValue($q.when({token: 'token'}));
                        scope.$broadcast('Keepalive');
                        expect(networkService.keepalive).toHaveBeenCalled();
                        scope.$digest();
                        expect(authService.saveToken).toHaveBeenCalledWith('token');
                    });
                });

                describe('when un-authenticated', function () {
                    it('should set activity to LOGIN', function () {
                        authService.hasAnyRole.and.returnValue(false);
                        scope.$broadcast('Keepalive');
                        expect(vm.activity).toBe(vm.activityEnum.LOGIN);
                    });

                    it('should unwatch the Idle', function () {
                        authService.hasAnyRole.and.returnValue(false);
                        spyOn(Idle, 'unwatch');
                        scope.$broadcast('Keepalive');
                        expect(Idle.unwatch).toHaveBeenCalled();
                    });
                });
            });

            describe('when changing a password', function () {
                it('should have an error message if passwords don\'t match', function () {
                    vm.newPassword = 'new';
                    vm.confirmPassword = 'old';
                    vm.changePassword();
                    expect(vm.message).toBe('Passwords do not match. Please try again');
                });

                it('should call the network service', function () {
                    vm.password = 'old';
                    vm.newPassword = 'new';
                    vm.confirmPassword = 'new';
                    vm.changePassword();
                    expect(networkService.changePassword).toHaveBeenCalledWith({userName: '', oldPassword: 'old', newPassword: 'new'});
                });

                it('should report a message and clear the form on success', function () {
                    spyOn(vm, 'clear');
                    vm.password = 'old';
                    vm.newPassword = 'new';
                    vm.confirmPassword = 'new';
                    vm.changePassword();
                    scope.$digest();
                    expect(vm.clear).toHaveBeenCalled();
                    expect(vm.message).toBe('Password successfully changed');
                });

                describe('when dealing with password strength', function () {
                    beforeEach(function () {
                        vm.password = 'old';
                        vm.newPassword = 'new';
                        vm.confirmPassword = 'new';
                    });

                    it('should report failures', function () {
                        networkService.changePassword.and.returnValue($q.when({
                            passwordUpdated: false,
                            warning: 'a warning',
                        }));
                        vm.changePassword();
                        scope.$digest();
                        expect(vm.message).toBe('Your password was not changed. a warning');
                    });

                    it('should report a suggestion', function () {
                        networkService.changePassword.and.returnValue($q.when({
                            passwordUpdated: false,
                            suggestions: ['a suggestion'],
                        }));
                        vm.changePassword();
                        scope.$digest();
                        expect(vm.message).toBe('Your password was not changed. Suggestion: a suggestion');
                    });

                    it('should report suggestions', function () {
                        networkService.changePassword.and.returnValue($q.when({
                            passwordUpdated: false,
                            suggestions: ['a suggestion', 'another suggestion'],
                        }));
                        vm.changePassword();
                        scope.$digest();
                        expect(vm.message).toBe('Your password was not changed. Suggestions: a suggestion another suggestion');
                    });

                    it('should handle the absence of warning and suggestions', function () {
                        networkService.changePassword.and.returnValue($q.when({
                            passwordUpdated: false,
                        }));
                        vm.changePassword();
                        scope.$digest();
                        expect(vm.message).toBe('Your password was not changed. Please try again with a stronger password.');
                    });
                });

                it('should report a message on failure', function () {
                    networkService.changePassword.and.returnValue($q.reject({}));
                    vm.password = 'old';
                    vm.newPassword = 'new';
                    vm.confirmPassword = 'new';
                    vm.changePassword();
                    scope.$digest();
                    expect(vm.message).toBe('Error. Please check your credentials or contact the administrator');
                });
            });

            describe('when clearing', function () {
                it('should set activity state', function () {
                    vm.activity = undefined;
                    vm.clear();
                    expect(vm.activity).toBe(vm.activityEnum.NONE);
                });

                it('should set activity to LOGIN if not loged in', function () {
                    vm.activity = undefined;
                    authService.hasAnyRole.and.returnValue(false);
                    vm.clear();
                    expect(vm.activity).toBe(vm.activityEnum.LOGIN);
                });

                it('should set the form fields to blank', function () {
                    vm.userName = 'not blank';
                    vm.password = 'not blank';
                    vm.newPassword = 'not blank';
                    vm.confirmPassword = 'not blank';
                    vm.email = 'not blank';
                    vm.message = 'not blank';
                    vm.clear();
                    expect(vm.userName).toBe('');
                    expect(vm.password).toBe('');
                    expect(vm.newPassword).toBe('');
                    expect(vm.confirmPassword).toBe('');
                    expect(vm.email).toBe('');
                    expect(vm.message).toBe('');
                });

                it('should mark the form as pristine/untouched if it exists', function () {
                    vm.loginForm = undefined;
                    vm.clear();
                    vm.loginForm = {
                        $setPristine: jasmine.createSpy('$setPristine'),
                        $setUntouched: jasmine.createSpy('$setUntouched'),
                    };
                    vm.clear();
                    expect(vm.loginForm.$setPristine).toHaveBeenCalled();
                    expect(vm.loginForm.$setUntouched).toHaveBeenCalled();
                });
            });

            describe('when logging in', function () {
                it('should call networkService.login with correct parameters', function () {
                    vm.userName = 'test';
                    vm.password = 'password';
                    vm.login();
                    expect(networkService.login).toHaveBeenCalledWith({userName: 'test', password: 'password'});
                });

                it('should broadcast that someone has logged in', function () {
                    spyOn(vm, 'broadcastLogin');
                    vm.login();
                    scope.$digest();
                    expect(vm.broadcastLogin).toHaveBeenCalled();
                });

                it('should start Idle, Keepalive, and clear the form on success', function () {
                    spyOn(Idle, 'watch');
                    spyOn(Keepalive, 'ping');
                    spyOn(vm, 'clear');
                    vm.userName = 'test';
                    vm.password = 'password';
                    vm.login();
                    scope.$digest();
                    expect(Idle.watch).toHaveBeenCalled();
                    expect(Keepalive.ping).toHaveBeenCalled();
                    expect(vm.clear).toHaveBeenCalled();
                });

                describe('with bad data', () => {
                    it('should have an error message if login credentials are bad', function () {
                        networkService.login.and.returnValue($q.reject({data: {error: 'Invalid username / password'}}));
                        vm.login();
                        scope.$digest();
                        expect(vm.message).toBe('Invalid username / password');
                    });

                    it('should direct the user to change their password if credentials are expired', () => {
                        networkService.login.and.returnValue($q.reject({data: {error: 'The user is required to change their password on next log in.'}}));
                        vm.login();
                        scope.$digest();
                        expect(vm.activity).toBe(vm.activityEnum.EXPIRED);
                    });
                });
            });

            describe('when logging out', function () {
                it('should unwatch Idle, call the auth service, and clear', function () {
                    spyOn(Idle, 'unwatch');
                    spyOn(vm, 'clear');
                    vm.logout();
                    expect(Idle.unwatch).toHaveBeenCalled();
                    expect(authService.logout).toHaveBeenCalled();
                    expect(vm.clear).toHaveBeenCalled();
                });
            });

            describe('when emailing a password reset in', function () {
                it('should call networkService.emailResetPassword with correct parameters', function () {
                    vm.userName = 'test';
                    vm.email = 'email';
                    vm.sendReset();
                    expect(networkService.emailResetPassword).toHaveBeenCalledWith({userName: 'test', email: 'email'});
                });

                it('should start clear the form and report a message on success', function () {
                    spyOn(vm, 'clear');
                    vm.userName = 'test';
                    vm.email = 'email';
                    vm.sendReset();
                    scope.$digest();
                    expect(vm.clear).toHaveBeenCalled();
                    expect(vm.message).toBe('Password email sent; please check your email');
                });

                it('should have an error message if service reports an error', function () {
                    networkService.emailResetPassword.and.returnValue($q.reject({data: {error: 'Invalid username / password'}}));
                    vm.sendReset();
                    scope.$digest();
                    expect(vm.message).toBe('Invalid username/email combination. Please check your credentials or contact the administrator');
                });
            });

            describe('when resetting a password in', function () {
                it('should call the network service', function () {
                    const token = 'd24cefad-e2e3-4923-894a-5daab52cf0e4'
                    vm.userName = 'test';
                    vm.newPassword = 'new';
                    vm.confirmPassword = 'new';
                    vm.token = token;
                    vm.resetPassword();
                    expect(networkService.resetPassword).toHaveBeenCalledWith({token: token, userName: vm.userName, newPassword: vm.newPassword});
                });
            });
        });
    });
})();
