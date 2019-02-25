(() => {
    'use strict';

    fdescribe('the user management component,', () => {
        var $compile, $location, $log, $q, $rootScope, $uibModal, Mock, actualOptions, authService, ctrl, el, mock, networkService, scope;

        mock = {
            users: {
                data: {
                    users: [
                        {'subjectName': 'admin','fullName': 'Administrator','friendlyName': 'Administrator','email': 'info@ainq.com','phoneNumber': '(301) 560-6999','title': null,'accountLocked': false,'accountEnabled': true},
                    ],
                },
            },
            fakeModalOptions: {
                templateUrl: 'chpl.admin/components/user/edit.html',
                controller: 'EditUserController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    user: jasmine.any(Function),
                    action: jasmine.any(Function),
                    acbId: jasmine.any(Function),
                    atlId: jasmine.any(Function),
                },
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.admin', 'chpl.mock', $provide => {
                $provide.decorator('$location', $delegate => {
                    $delegate.path = jasmine.createSpy('path');
                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getUsers = jasmine.createSpy('getUsers');
                    $delegate.getUsersAtAcb = jasmine.createSpy('getUsersAtAcb');
                    $delegate.getUsersAtAtl = jasmine.createSpy('getUsersAtAtl');
                    $delegate.impersonateUser = jasmine.createSpy('impersonateUser');
                    return $delegate;
                });
            });

            inject((_$compile_, _$location_, _$log_, _$q_, _$rootScope_, _$uibModal_, _Mock_, _authService_, _networkService_) => {
                $compile = _$compile_;
                $location = _$location_;
                $location.path.and.returnValue('path');
                $log = _$log_;
                $q = _$q_;
                $rootScope = _$rootScope_;
                authService = _authService_;
                networkService = _networkService_;
                networkService.getUsers.and.returnValue($q.when(mock.users));
                networkService.getUsersAtAcb.and.returnValue($q.when(mock.users));
                networkService.getUsersAtAtl.and.returnValue($q.when(mock.users));
                networkService.impersonateUser.and.returnValue($q.when({token: 'a new token'}));

                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(options => {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                el = angular.element('<ai-user-management acb-id="1"></ai-user-management');

                scope = $rootScope.$new();
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

        describe('template', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toBeDefined();
            });
        });

        describe('when setting up for', () => {
            let acbCallCount;

            describe('acb management,', () => {
                it('should know what the acb id is', () => {
                    expect(ctrl.acbId).toBe('1');
                });

                it('should have called for the correct users', () => {
                    expect(networkService.getUsers).not.toHaveBeenCalled();
                    expect(networkService.getUsersAtAcb).toHaveBeenCalled();
                    expect(networkService.getUsersAtAtl).not.toHaveBeenCalled();
                });
            });

            describe('atl management,', () => {
                beforeEach(() => {
                    acbCallCount = networkService.getUsersAtAcb.calls.count();
                    el = angular.element('<ai-user-management atl-id="2"></ai-user-management');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                });

                it('should know what the atl id is', () => {
                    expect(ctrl.atlId).toBe('2');
                });

                it('should have called for the correct users', () => {
                    expect(networkService.getUsers).not.toHaveBeenCalled();
                    expect(networkService.getUsersAtAcb.calls.count()).toBe(acbCallCount);
                    expect(networkService.getUsersAtAtl).toHaveBeenCalled();
                });
            });

            describe('general management,', () => {
                beforeEach(() => {
                    acbCallCount = networkService.getUsersAtAcb.calls.count();
                    el = angular.element('<ai-user-management></ai-user-management');
                    $compile(el)(scope);
                    scope.$digest();
                    ctrl = el.isolateScope().$ctrl;
                });

                it('should have no acb or atl id', () => {
                    expect(ctrl.atlId).toBeUndefined();
                    expect(ctrl.acbId).toBeUndefined();
                });

                it('should have called for the correct users', () => {
                    expect(networkService.getUsers).toHaveBeenCalled();
                    expect(networkService.getUsersAtAcb.calls.count()).toBe(acbCallCount);
                    expect(networkService.getUsersAtAtl).not.toHaveBeenCalled();
                });
            });
        });

        describe('when inviting a user,', () => {
            it('should create a modal instance', () => {
                expect(ctrl.modalInstance).toBeUndefined();
                ctrl.inviteUser();
                expect(ctrl.modalInstance).toBeDefined();
            });

            it('should resolve modal values on invite', () => {
                ctrl.inviteUser();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.user()).toEqual({});
                expect(actualOptions.resolve.action()).toEqual('invite');
                expect(actualOptions.resolve.acbId()).toEqual('1');
                expect(actualOptions.resolve.atlId()).toBeUndefined();
            });
        });

        describe('when editing a user,', () => {
            it('should create a modal instance', () => {
                expect(ctrl.modalInstance).toBeUndefined();
                ctrl.updateUser({});
                expect(ctrl.modalInstance).toBeDefined();
            });

            it('should resolve modal values on update', () => {
                const aUser = {};
                ctrl.updateUser(aUser);
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.user()).toEqual(aUser);
                expect(actualOptions.resolve.action()).toEqual('edit');
                expect(actualOptions.resolve.acbId()).toEqual('1');
                expect(actualOptions.resolve.atlId()).toBeUndefined();
            });

            it('should refresh users on resolution', () => {
                var serviceCallCount = networkService.getUsersAtAcb.calls.count();
                ctrl.updateUser({});
                ctrl.modalInstance.close();
                expect(networkService.getUsersAtAcb.calls.count()).toBe(serviceCallCount + 1);
            });
        });

        describe('when impersonating a user', () => {
            it('should call the network service', () => {
                const aUser = {userid: 'user'};
                ctrl.impersonateUser(aUser);
                expect(networkService.impersonateUser).toHaveBeenCalledWith(aUser);
            });

            it('should save the new token', () => {
                const aUser = {userid: 'user'};
                ctrl.impersonateUser(aUser);
                spyOn(authService, 'saveToken');
                scope.$digest();
                expect(authService.saveToken).toHaveBeenCalledWith('a new token');
            });

            it('should broadcast impersonation', () => {
                const aUser = {userid: 'user'};
                ctrl.impersonateUser(aUser);
                spyOn($rootScope, '$broadcast');
                scope.$digest();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('impersonating');
            });

            it('should redirect to admin', () => {
                const aUser = {userid: 'user'};
                ctrl.impersonateUser(aUser);
                scope.$digest();
                expect($location.path).toHaveBeenCalledWith('/admin');
            });
        });
    });
})();
