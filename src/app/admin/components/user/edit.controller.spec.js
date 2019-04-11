(() => {
    'use strict';

    describe('the User Editing Controller', () => {
        var $controller, $log, $q, Mock, authService, mock, networkService, scope, vm;

        mock = {};
        mock.user = {subjectName: 'username', userId: 'userId', role: 'ROLE_ADMIN'};

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.admin', $provide => {
                $provide.decorator('authService', $delegate => {
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.deleteUser = jasmine.createSpy('deleteUser');
                    $delegate.inviteUser = jasmine.createSpy('inviteUser');
                    $delegate.removeUserFromAcb = jasmine.createSpy('removeUserFromAcb');
                    $delegate.removeUserFromAtl = jasmine.createSpy('removeUserFromAtl');
                    $delegate.updateUser = jasmine.createSpy('updateUser');
                    return $delegate;
                });
            });

            inject((_$controller_, _$log_, _$q_, $rootScope, _Mock_, _authService_, _networkService_) => {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                authService = _authService_;
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.deleteUser.and.returnValue($q.when({}));
                networkService.inviteUser.and.returnValue($q.when({}));
                networkService.removeUserFromAcb.and.returnValue($q.when({}));
                networkService.removeUserFromAtl.and.returnValue($q.when({}));
                networkService.updateUser.and.returnValue($q.when({}));
                Mock = _Mock_;

                scope = $rootScope.$new();
                vm = $controller('EditUserController', {
                    action: 'edit',
                    acbId: null,
                    atlId: null,
                    user: mock.user,
                    $uibModalInstance: Mock.modalInstance,
                });
                scope.$digest();
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', () => {
            expect(vm).toBeDefined();
        });

        it('should have a way to close the modal', () => {
            expect(vm.cancel).toBeDefined();
            vm.cancel();
            expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
        });

        describe('with respect to ROLE invitation', () => {
            it('should only show ACB if managing an ACB', () => {
                vm.acbId = 'an id';
                vm.atlId = null;
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1); // user is ROLE_ACB
                vm.loadRoles();
                expect(vm.roles).toEqual(['ROLE_ACB']);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1); // user is ROLE_ONC
                vm.loadRoles();
                expect(vm.roles).toEqual(['ROLE_ACB']);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') > -1); // user is ROLE_ADMIN
                vm.loadRoles();
                expect(vm.roles).toEqual(['ROLE_ACB']);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ATL') > -1); // user is ROLE_ATL
                vm.loadRoles();
                expect(vm.roles).toEqual([]);
            });

            it('should only show ATL if managing an ATL', () => {
                vm.acbId = null;
                vm.atlId = 'an id';
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1); // user is ROLE_ACB
                vm.loadRoles();
                expect(vm.roles).toEqual([]);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1); // user is ROLE_ONC
                vm.loadRoles();
                expect(vm.roles).toEqual(['ROLE_ATL']);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') > -1); // user is ROLE_ADMIN
                vm.loadRoles();
                expect(vm.roles).toEqual(['ROLE_ATL']);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ATL') > -1); // user is ROLE_ATL
                vm.loadRoles();
                expect(vm.roles).toEqual(['ROLE_ATL']);
            });

            it('should show appropritate roles when not managing ACB/ATL', () => {
                vm.acbId = null;
                vm.acbId = null;
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ADMIN') > -1); // user is ROLE_ADMIN
                vm.loadRoles();
                expect(vm.roles).toEqual(['ROLE_ADMIN','ROLE_ONC','ROLE_CMS_STAFF']);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ONC') > -1); // user is ROLE_ONC
                vm.loadRoles();
                expect(vm.roles).toEqual(['ROLE_ONC','ROLE_CMS_STAFF']);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_CMS_STAFF') > -1); // user is ROLE_CMS_STAFF
                vm.loadRoles();
                expect(vm.roles).toEqual(['ROLE_CMS_STAFF']);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ACB') > -1); // user is ROLE_ACB
                vm.loadRoles();
                expect(vm.roles).toEqual([]);
                authService.hasAnyRole.and.callFake(roles => roles.indexOf('ROLE_ATL') > -1); // user is ROLE_ATL
                vm.loadRoles();
                expect(vm.roles).toEqual([]);
            });
        });

        it('should know what roles to display', () => {
            vm.loadRoles();
            vm.atlId = 3;
            vm.loadRoles();
            expect(vm.roles).toEqual(['ROLE_ATL']);
        });

        describe('when inviting users,', () => {
            beforeEach(() => {
                vm.userInvitation = {
                    role: 'a role',
                    emailAddress: 'fake@sample.com',
                }
            });

            it('should call the common service', () => {
                vm.invite();
                scope.$digest();
                expect(networkService.inviteUser).toHaveBeenCalled();
            });

            it('should not call the common service if missing roles', () => {
                vm.userInvitation.role = '';
                vm.invite();
                scope.$digest();
                expect(networkService.inviteUser).not.toHaveBeenCalled();
            });

            it('should not call the common service if missing email', () => {
                delete vm.userInvitation.emailAddress;
                vm.invite();
                scope.$digest();
                expect(networkService.inviteUser).not.toHaveBeenCalled();
            });

            it('should not call the common service if missing email', () => {
                vm.userInvitation.emailAddress = '';
                vm.invite();
                scope.$digest();
                expect(networkService.inviteUser).not.toHaveBeenCalled();
            });

            it('should add the acbId if it exists', () => {
                vm.acbId = 1;
                vm.invite();
                scope.$digest();
                expect(vm.userInvitation.acbId).toBe(1);
            });

            it('should add the atlId if it exists', () => {
                vm.atlId = 1;
                vm.invite();
                scope.$digest();
                expect(vm.userInvitation.testingLabId).toBe(1);
            });

            it('should close the modal', () => {
                vm.invite();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should close the modal', () => {
                networkService.inviteUser.and.returnValue($q.when({status: 200}));
                vm.invite();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should display an error message on error', () => {
                networkService.inviteUser.and.returnValue($q.when({status: 500}));
                vm.invite();
                scope.$digest();
                expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
            });

            it('should display an error message on error', () => {
                networkService.inviteUser.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.invite();
                scope.$digest();
                expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
            });

            describe('with multiple available roles,', () => {
                beforeEach(() => {
                    vm = $controller('EditUserController', {
                        action: 'invite',
                        acbId: null,
                        atlId: null,
                        user: {},
                        $uibModalInstance: Mock.modalInstance,
                    });
                    scope.$digest();
                });

                it('should not default to having roles', () => {
                    expect(vm.userInvitation.role).toEqual('');
                });
            });

            describe('with a single available role,', () => {
                beforeEach(() => {
                    vm = $controller('EditUserController', {
                        action: 'invite',
                        acbId: 1,
                        atlId: null,
                        user: {},
                        $uibModalInstance: Mock.modalInstance,
                    });
                    scope.$digest();
                });

                it('should default to the single role', () => {
                    expect(vm.userInvitation.role).toEqual('ROLE_ACB');
                });
            });
        });

        describe('when saving users,', () => {
            it('should call the common service', () => {
                vm.save();
                scope.$digest();
                expect(networkService.updateUser).toHaveBeenCalled();
            });

            it('should close the modal', () => {
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should close the modal', () => {
                networkService.updateUser.and.returnValue($q.when({status: 200}));
                vm.save();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should display an error message on error', () => {
                networkService.updateUser.and.returnValue($q.when({status: 500}));
                vm.save();
                scope.$digest();
                expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
            });

            it('should display an error message on error', () => {
                networkService.updateUser.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.save();
                scope.$digest();
                expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
            });
        });

        describe('when deleting users,', () => {
            describe('as non-ACB/non-ATL,', () => {
                it('should call the common service', () => {
                    vm.deleteUser();
                    scope.$digest();
                    expect(networkService.deleteUser).toHaveBeenCalledWith('userId');
                });

                it('should close the modal', () => {
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should close the modal', () => {
                    networkService.deleteUser.and.returnValue($q.when({status: 200}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should display an error message on error', () => {
                    networkService.deleteUser.and.returnValue($q.when({status: 500}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
                });

                it('should display an error message on error', () => {
                    networkService.deleteUser.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
                });
            });

            describe('as ACB,', () => {
                beforeEach(() => {
                    vm.acbId = 1;
                });

                it('should call the common service', () => {
                    vm.deleteUser();
                    scope.$digest();
                    expect(networkService.removeUserFromAcb).toHaveBeenCalledWith('userId', 1);
                });

                it('should close the modal', () => {
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should close the modal', () => {
                    networkService.removeUserFromAcb.and.returnValue($q.when({status: 200}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should display an error message on error', () => {
                    networkService.removeUserFromAcb.and.returnValue($q.when({status: 500}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
                });

                it('should display an error message on error', () => {
                    networkService.removeUserFromAcb.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
                });
            });

            describe('as ATL,', () => {
                beforeEach(() => {
                    vm.atlId = 1;
                });

                it('should call the common service', () => {
                    vm.deleteUser();
                    scope.$digest();
                    expect(networkService.removeUserFromAtl).toHaveBeenCalledWith('userId', 1);
                });

                it('should close the modal', () => {
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should close the modal', () => {
                    networkService.removeUserFromAtl.and.returnValue($q.when({status: 200}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should display an error message on error', () => {
                    networkService.removeUserFromAtl.and.returnValue($q.when({status: 500}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
                });

                it('should display an error message on error', () => {
                    networkService.removeUserFromAtl.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
                });
            });
        });
    });
})();
