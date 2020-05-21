(() => {
    'use strict';

    describe('the Registration Create Account component', () => {
        var $compile, $location, $log, $q, authService, ctrl, el, mock, networkService, scope;

        mock = {
            authorizeUser: {
                hash: 'hash',
                userName: 'subjectName',
                password: 'password',
            },
            validUser: {
                hash: 'hash',
                user: {
                    subjectName: 'subjectName',
                    password: 'password',
                    passwordverify: 'password',
                    fullName: 'fullName',
                    email: 'email@email.email',
                    phoneNumber: 'phone',
                },
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.registration', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.getUsername = jasmine.createSpy('getUsername');
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.authorizeUser = jasmine.createSpy('authorizeUser');
                    $delegate.createInvitedUser = jasmine.createSpy('createInvitedUser');
                    return $delegate;
                });
            });

            inject((_$compile_, _$location_, _$log_, _$q_, $rootScope, _authService_, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                $location = _$location_;
                authService = _authService_;
                authService.getUsername.and.returnValue('username');
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.authorizeUser.and.returnValue($q.when({}));
                networkService.createInvitedUser.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                scope.hash = 'fakehash';

                el = angular.element('<chpl-registration-create-user hash="hash"></chpl-registration-create-user>');

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

            it('should have a "create user" function', () => {
                expect(ctrl.createUser).toBeDefined();
            });

            it('should have the hash as part of the userDetails object', () => {
                expect(ctrl.userDetails.hash).toBe('fakehash');
            });

            it('should not call createUser if the details aren\'t complete', () => {
                ctrl.createUser();
                expect(networkService.createInvitedUser).not.toHaveBeenCalled();
            });

            it('should call createUser if the details are complete', () => {
                ctrl.userDetails = angular.copy(mock.validUser);
                ctrl.createUser();
                expect(networkService.createInvitedUser).toHaveBeenCalled();
            });

            it('should require password and verify password to be equal', () => {
                ctrl.userDetails = angular.copy(mock.validUser);
                expect(ctrl.validateUser()).toBe(true);
                ctrl.userDetails.user.password = 'test';
                ctrl.userDetails.user.passwordverify = 'test2';
                expect(ctrl.validateUser()).not.toBe(true);
            });

            it('should call "authorizeUser" if the user tries to log in', () => {
                ctrl.authorizeUser();
                expect(networkService.authorizeUser).toHaveBeenCalledWith({hash: 'fakehash'}, 'username');
            });

            it('should redirect to /administration after authorizeUser is finished', () => {
                spyOn($location, 'path');
                ctrl.authorizeDetails = mock.authorizeUser;
                ctrl.authorizeUser();
                scope.$digest();
                expect($location.path).toHaveBeenCalledWith('/administration');
            });

            it('should know what values are disallowed in passwords', () => {
                expect(ctrl.extras).toEqual(['chpl']);
                ctrl.userDetails = angular.copy(mock.validUser);
                ctrl.userDetails.user.friendlyName = 'friendly';
                ctrl.setExtras();
                expect(ctrl.extras).toEqual(['chpl', 'subjectName', 'fullName', 'friendly', 'email@email.email', 'phone']);
            });

            it('should be in CREATE-ACCOUNT mode', () => {
                ctrl.changeDisplayMode('CREATE-ACCOUNT');
                expect(ctrl.isCreateAccountMode()).toBe(true);
            });

            it('should be in CREATE-ACCOUNT-SUCCESS mode', () => {
                ctrl.changeDisplayMode('CREATE-ACCOUNT-SUCCESS');
                expect(ctrl.isCreateAccountSuccessMode()).toBe(true);
            });

            it('should be in SIGN-IN mode', () => {
                ctrl.changeDisplayMode('SIGN-IN');
                expect(ctrl.isSignInMode()).toBe(true);
            });
        });
    });
})();
