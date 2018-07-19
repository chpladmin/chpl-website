(function () {
    'use strict';

    describe('the Login', function () {
        var $compile, $log, $q, Idle, Keepalive, authService, el, networkService, scope, vm;

        beforeEach(function () {
            module('chpl.templates', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAuthed = jasmine.createSpy('isAuthed');
                    $delegate.logout = jasmine.createSpy('logout');
                    $delegate.saveToken = jasmine.createSpy('saveToken');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.changePassword = jasmine.createSpy('changePassword');
                    $delegate.keepalive = jasmine.createSpy('keepalive');
                    $delegate.login = jasmine.createSpy('login');
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
                authService.isAuthed.and.returnValue(true);
                authService.saveToken.and.returnValue({});
                networkService = _networkService_;
                networkService.changePassword.and.returnValue($q.when({}));
                networkService.keepalive.and.returnValue($q.when({}));
                networkService.login.and.returnValue($q.when({}));
                networkService.resetPassword.and.returnValue($q.when({}));

                el = angular.element('<ai-login></ai-login>');

                scope = $rootScope.$new()
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
                expect(vm.pwPattern).toBe('(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\\W).{8,}');
            });

            it('should have a function to log in', function () {
                expect(vm.login).toBeDefined();
            });

            it('should farm out isAuthed to the authservice', function () {
                vm.isAuthed();
                expect(authService.isAuthed).toHaveBeenCalled();
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

            xdescribe('when loading', function () {
                it('should clear system on load', function () {
                    spyOn(vm, 'clear');
                    vm.
                    expect(vm.clear).toHaveBeenCalled();
                });

                it('should start Idle if logged in', function () {
                    spyOn(Idle, 'watch');
                    vm.
                    expect(Idle.watch).toHaveBeenCalled();
                });

                it('should not start Idle if not logged in', function () {
                    authService.isAuthed.and.returnValue(false);
                    spyOn(Idle, 'watch');
                    vm.
                    expect(Idle.watch).not.toHaveBeenCalled();
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
                        authService.isAuthed.and.returnValue(false);
                        scope.$broadcast('Keepalive');
                        expect(vm.activity).toBe(vm.activityEnum.LOGIN);
                    });

                    it('should unwatch the Idle', function () {
                        authService.isAuthed.and.returnValue(false);
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
                    expect(networkService.changePassword).toHaveBeenCalledWith({oldPassword: 'old', newPassword: 'new'});
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
                    authService.isAuthed.and.returnValue(false);
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

                it('should have an error message if login credentials are bad', function () {
                    networkService.login.and.returnValue($q.reject({data: {error: 'Invalid username / password'}}));
                    vm.login();
                    scope.$digest();
                    expect(vm.message).toBe('Invalid username / password');
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

            describe('when resetting a password in', function () {
                it('should call networkService.resetPassword with correct parameters', function () {
                    vm.userName = 'test';
                    vm.email = 'email';
                    vm.sendReset();
                    expect(networkService.resetPassword).toHaveBeenCalledWith({userName: 'test', email: 'email'});
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
                    networkService.resetPassword.and.returnValue($q.reject({data: {error: 'Invalid username / password'}}));
                    vm.sendReset();
                    scope.$digest();
                    expect(vm.message).toBe('Invalid username/email combination. Please check your credentials or contact the administrator');
                });
            });
        });
    });
})();
