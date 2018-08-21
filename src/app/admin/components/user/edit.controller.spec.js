(function () {
    'use strict';

    describe('admin.EditUserController.controller', function () {
        var $log, $q, Mock, mock, networkService, scope, vm;

        mock = {};
        mock.user = {roles: ['ROLE_ADMIN'], user: {subjectName: 'username', userId: 'userId'}};

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.addRole = jasmine.createSpy('addRole');
                    $delegate.deleteUser = jasmine.createSpy('deleteUser');
                    $delegate.inviteUser = jasmine.createSpy('inviteUser');
                    $delegate.removeUserFromAcb = jasmine.createSpy('removeUserFromAcb');
                    $delegate.removeUserFromAtl = jasmine.createSpy('removeUserFromAtl');
                    $delegate.revokeRole = jasmine.createSpy('revokeRole');
                    $delegate.updateUser = jasmine.createSpy('updateUser');
                    return $delegate;
                });
            });

            inject(function ($controller, _$log_, _$q_, $rootScope, _Mock_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.addRole.and.returnValue($q.when({}));
                networkService.deleteUser.and.returnValue($q.when({}));
                networkService.inviteUser.and.returnValue($q.when({}));
                networkService.removeUserFromAcb.and.returnValue($q.when({}));
                networkService.removeUserFromAtl.and.returnValue($q.when({}));
                networkService.revokeRole.and.returnValue($q.when({}));
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

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('housekeeping', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            it('should have a way to close the modal', function () {
                expect(vm.cancel).toBeDefined();
                vm.cancel();
                expect(Mock.modalInstance.dismiss).toHaveBeenCalled();
            });
        });

        it('should know what roles to display', function () {
            vm.acbId = null;
            vm.atlId = null;
            vm.loadRoles();
            expect(vm.roles).toEqual(['ROLE_ADMIN','ROLE_CMS_STAFF','ROLE_ONC_STAFF','ROLE_ACB','ROLE_ATL']);
            vm.acbId = 3;
            vm.loadRoles();
            expect(vm.roles).toEqual(['ROLE_ACB']);
            vm.acbId = null;
            vm.atlId = 3;
            vm.loadRoles();
            expect(vm.roles).toEqual(['ROLE_ATL']);
        });

        describe('inviting users', function () {
            beforeEach(function () {
                vm.userInvitation = {
                    permissions: ['a role'],
                    emailAddress: 'fake@sample.com',
                }
            });

            it('should call the common service', function () {
                vm.invite();
                scope.$digest();
                expect(networkService.inviteUser).toHaveBeenCalled();
            });

            it('should not call the common service if missing roles', function () {
                vm.userInvitation.permissions = [];
                vm.invite();
                scope.$digest();
                expect(networkService.inviteUser).not.toHaveBeenCalled();
            });

            it('should not call the common service if missing email', function () {
                delete vm.userInvitation.emailAddress;
                vm.invite();
                scope.$digest();
                expect(networkService.inviteUser).not.toHaveBeenCalled();
            });

            it('should not call the common service if missing email', function () {
                vm.userInvitation.emailAddress = '';
                vm.invite();
                scope.$digest();
                expect(networkService.inviteUser).not.toHaveBeenCalled();
            });

            it('should add the acbId if it exists', function () {
                vm.acbId = 1;
                vm.invite();
                scope.$digest();
                expect(vm.userInvitation.acbId).toBe(1);
            });

            it('should add the atlId if it exists', function () {
                vm.atlId = 1;
                vm.invite();
                scope.$digest();
                expect(vm.userInvitation.testingLabId).toBe(1);
            });

            it('should close the modal', function () {
                vm.invite();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should close the modal', function () {
                networkService.inviteUser.and.returnValue($q.when({status: 200}));
                vm.invite();
                scope.$digest();
                expect(Mock.modalInstance.close).toHaveBeenCalled();
            });

            it('should display an error message on error', function () {
                networkService.inviteUser.and.returnValue($q.when({status: 500}));
                vm.invite();
                scope.$digest();
                expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
            });

            it('should display an error message on error', function () {
                networkService.inviteUser.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                vm.invite();
                scope.$digest();
                expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
            });
        });

        describe('saving users', function () {
            describe('role activity', function () {
                it('should call the common service to add roles', function () {
                    vm.save();
                    scope.$digest();
                    expect(networkService.addRole).toHaveBeenCalledWith({subjectName: 'username', role: 'ROLE_ADMIN'});
                });

                it('should call the common service to revoke roles', function () {
                    vm.save();
                    scope.$digest();
                    expect(networkService.revokeRole).toHaveBeenCalledWith({subjectName: 'username', role: 'ROLE_ACB'});
                });

                it('should not call the common service to revoke roles if acb', function () {
                    vm.acbId = 1
                    vm.save();
                    scope.$digest();
                    expect(networkService.revokeRole).not.toHaveBeenCalled();
                });

                it('should not call the common service to revoke roles if atl', function () {
                    vm.atlId = 1
                    vm.save();
                    scope.$digest();
                    expect(networkService.revokeRole).not.toHaveBeenCalled();
                });

                it('should give the user an empty roles array if they don\'t have one', function () {
                    delete vm.user.roles;
                    vm.save();
                    expect(vm.user.roles).toEqual([]);
                });
            });

            describe('user specific', function () {
                it('should call the common service', function () {
                    vm.save();
                    scope.$digest();
                    expect(networkService.updateUser).toHaveBeenCalled();
                });

                it('should close the modal', function () {
                    vm.save();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should close the modal', function () {
                    networkService.updateUser.and.returnValue($q.when({status: 200}));
                    vm.save();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should display an error message on error', function () {
                    networkService.updateUser.and.returnValue($q.when({status: 500}));
                    vm.save();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
                });

                it('should display an error message on error', function () {
                    networkService.updateUser.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                    vm.save();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
                });
            });
        });

        describe('deleting users', function () {
            describe('as non-ACB/non-ATL', function () {
                it('should call the common service', function () {
                    vm.deleteUser();
                    scope.$digest();
                    expect(networkService.deleteUser).toHaveBeenCalledWith('userId');
                });

                it('should close the modal', function () {
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should close the modal', function () {
                    networkService.deleteUser.and.returnValue($q.when({status: 200}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should display an error message on error', function () {
                    networkService.deleteUser.and.returnValue($q.when({status: 500}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
                });

                it('should display an error message on error', function () {
                    networkService.deleteUser.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
                });
            });

            describe('as ACB', function () {
                beforeEach(function () {
                    vm.acbId = 1;
                });

                it('should call the common service', function () {
                    vm.deleteUser();
                    scope.$digest();
                    expect(networkService.removeUserFromAcb).toHaveBeenCalledWith('userId', 1);
                });

                it('should close the modal', function () {
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should close the modal', function () {
                    networkService.removeUserFromAcb.and.returnValue($q.when({status: 200}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should display an error message on error', function () {
                    networkService.removeUserFromAcb.and.returnValue($q.when({status: 500}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
                });

                it('should display an error message on error', function () {
                    networkService.removeUserFromAcb.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
                });
            });

            describe('as ATL', function () {
                beforeEach(function () {
                    vm.atlId = 1;
                });

                it('should call the common service', function () {
                    vm.deleteUser();
                    scope.$digest();
                    expect(networkService.removeUserFromAtl).toHaveBeenCalledWith('userId', 1);
                });

                it('should close the modal', function () {
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should close the modal', function () {
                    networkService.removeUserFromAtl.and.returnValue($q.when({status: 200}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(Mock.modalInstance.close).toHaveBeenCalled();
                });

                it('should display an error message on error', function () {
                    networkService.removeUserFromAtl.and.returnValue($q.when({status: 500}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "[object Object]"');
                });

                it('should display an error message on error', function () {
                    networkService.removeUserFromAtl.and.returnValue($q.reject({data: {error: 'bad thing'}}));
                    vm.deleteUser();
                    scope.$digest();
                    expect(vm.message).toBe('An error occurred. Please try again or contact the administrator. The error was: "bad thing"');
                });
            });
        });
    });
})();
