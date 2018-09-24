(function () {
    'use strict';

    describe('the user management compoent', function () {
        var $compile, $log, $q, $uibModal, Mock, actualOptions, ctrl, element, mock, networkService, scope;

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

        beforeEach(function () {
            angular.mock.module('chpl.admin', 'chpl.mock', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getUsers = jasmine.createSpy('getUsers');
                    $delegate.getUsersAtAcb = jasmine.createSpy('getUsersAtAcb');
                    $delegate.getUsersAtAtl = jasmine.createSpy('getUsersAtAtl');
                    return $delegate;
                });
            });

            inject(function (_$compile_, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _networkService_) {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getUsers.and.returnValue($q.when(mock.users));
                networkService.getUsersAtAcb.and.returnValue($q.when(mock.users));
                networkService.getUsersAtAtl.and.returnValue($q.when(mock.users));

                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });

                scope = $rootScope.$new();
                element = angular.element('<ai-user-management acb-id="1"></ai-user-management');
                $compile(element)(scope);
                scope.$digest();
                ctrl = element.isolateScope().$ctrl;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(ctrl).toBeDefined();
        });

        describe('when setting up', function () {
            let acbCallCount;

            describe('for acb management', function () {
                it('should know what the acb id is', function () {
                    expect(ctrl.acbId).toBe('1');
                });

                it('should have the ACB role', function () {
                    expect(ctrl.roles).toEqual(['ROLE_ACB']);
                });

                it('should have called for the correct users', function () {
                    expect(networkService.getUsers).not.toHaveBeenCalled();
                    expect(networkService.getUsersAtAcb).toHaveBeenCalled();
                    expect(networkService.getUsersAtAtl).not.toHaveBeenCalled();
                });
            });

            describe('for atl management', function () {
                beforeEach(function () {
                    acbCallCount = networkService.getUsersAtAcb.calls.count();
                    element = angular.element('<ai-user-management atl-id="2"></ai-user-management');
                    $compile(element)(scope);
                    scope.$digest();
                    ctrl = element.isolateScope().$ctrl;
                });

                it('should know what the atl id is', function () {
                    expect(ctrl.atlId).toBe('2');
                });

                it('should have the ATL role', function () {
                    expect(ctrl.roles).toEqual(['ROLE_ATL']);
                });

                it('should have called for the correct users', function () {
                    expect(networkService.getUsers).not.toHaveBeenCalled();
                    expect(networkService.getUsersAtAcb.calls.count()).toBe(acbCallCount);
                    expect(networkService.getUsersAtAtl).toHaveBeenCalled();
                });
            });

            describe('for general management', function () {
                beforeEach(function () {
                    acbCallCount = networkService.getUsersAtAcb.calls.count();
                    element = angular.element('<ai-user-management></ai-user-management');
                    $compile(element)(scope);
                    scope.$digest();
                    ctrl = element.isolateScope().$ctrl;
                });

                it('should have no acb or atl id', function () {
                    expect(ctrl.atlId).toBeUndefined();
                    expect(ctrl.acbId).toBeUndefined();
                });

                it('should have correct roles', function () {
                    expect(ctrl.roles).toEqual(['ROLE_ADMIN','ROLE_CMS_STAFF','ROLE_ONC_STAFF','ROLE_ACB','ROLE_ATL']);
                });

                it('should have called for the correct users', function () {
                    expect(networkService.getUsers).toHaveBeenCalled();
                    expect(networkService.getUsersAtAcb.calls.count()).toBe(acbCallCount);
                    expect(networkService.getUsersAtAtl).not.toHaveBeenCalled();
                });
            });
        });

        describe('when inviting a user', function () {
            it('should create a modal instance', function () {
                expect(ctrl.modalInstance).toBeUndefined();
                ctrl.inviteUser();
                expect(ctrl.modalInstance).toBeDefined();
            });

            it('should resolve modal values on invite', function () {
                ctrl.inviteUser();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.user()).toEqual({});
                expect(actualOptions.resolve.action()).toEqual('invite');
                expect(actualOptions.resolve.acbId()).toEqual('1');
                expect(actualOptions.resolve.atlId()).toBeUndefined();
            });
        });

        describe('when editing a user', function () {
            it('should create a modal instance', function () {
                expect(ctrl.modalInstance).toBeUndefined();
                ctrl.updateUser({});
                expect(ctrl.modalInstance).toBeDefined();
            });

            it('should resolve modal values on update', function () {
                const aUser = {};
                ctrl.updateUser(aUser);
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.user()).toEqual(aUser);
                expect(actualOptions.resolve.action()).toEqual('edit');
                expect(actualOptions.resolve.acbId()).toEqual('1');
                expect(actualOptions.resolve.atlId()).toBeUndefined();
            });

            it('should refresh users on resolution', function () {
                var serviceCallCount = networkService.getUsersAtAcb.calls.count();
                ctrl.updateUser({});
                ctrl.modalInstance.close();
                expect(networkService.getUsersAtAcb.calls.count()).toBe(serviceCallCount + 1);
            });
        });
    });
})();
