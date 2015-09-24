;(function () {
    'use strict';

    describe('app.admin.userManagement.directive', function () {

        var element, scope, $log, ctrl, adminService, mockAdminService;

        beforeEach(function () {
            mockAdminService = {};
            module('app.admin', function($provide) {
                $provide.value('adminService', mockAdminService);
            },'app/admin/components/userManagement.html');

            inject(function($q) {
                mockAdminService.users = {"data": {"users":[{"subjectName":"admin","firstName":"Administrator","lastName":"Administrator","email":"info@ainq.com","phoneNumber":"(301) 560-6999","title":null,"accountLocked":false,"accountEnabled":true}]}};

                mockAdminService.getUsers = function () {
                    var defer = $q.defer();
                    defer.resolve(this.users);
                    return defer.promise;
                };

                mockAdminService.inviteUser = function () {
                    var defer = $q.defer();
                    defer.resolve();
                    return defer.promise;
                };
            });
        });

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache, $httpBackend) {
            $log = _$log_;
            scope = $rootScope.$new();

            scope.fakeFunction = function () {};
            scope.userManagementInviteUser = {$setPristine: function () {},
                                              $setUntouched: function () {}};

            var template = $templateCache.get('app/admin/components/userManagement.html');
            $templateCache.put('admin/components/userManagement.html', template);

            element = angular.element('<ai-user-management create-user="fakeFunction" modify-user="fakeFunction" delete-user="fakeFunction" cancel-user="fakeFunction"></ai-user-management');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            beforeEach(inject(function ($controller) {
                ctrl = $controller('UserManagementController', {
                    $scope: scope,
                    $element: null
                });
                scope.$digest();
            }));

            it('should exist', function() {
                expect(ctrl).toBeDefined();
            });

            it('should have CRUD user functions', function () {
                expect(ctrl.createUser).toBeDefined();
                expect(ctrl.updateUser).toBeDefined();
                expect(ctrl.deleteUser).toBeDefined();
                expect(ctrl.cancelUser).toBeDefined();
            });

            it('should have an empty object for a new User', function () {
                expect(ctrl.newUser).toEqual({roles:[]});
            });

            it('should have an empty object for a to-be-invited User', function () {
                expect(ctrl.userInvitation).toEqual({roles:[]});
            });

            it('should have an invite user function', function () {
                expect(ctrl.inviteUser).toBeDefined();
            });

            it('should reset invitation fields when user is invited', function () {
                ctrl.userInvitation.email = 'test@example.com';
                ctrl.userInvitation.roles = ['TEST'];

                spyOn(scope.userManagementInviteUser, '$setUntouched');
                spyOn(scope.userManagementInviteUser, '$setPristine');

                ctrl.inviteUser();

                expect(ctrl.userInvitation).toEqual({roles:[]});
                expect(scope.userManagementInviteUser.$setUntouched).toHaveBeenCalled();
                expect(scope.userManagementInviteUser.$setPristine).toHaveBeenCalled();
            });

            it('should call adminServices.inviteUser when user is invited', function () {
                ctrl.userInvitation.email = 'test@example.com';
                ctrl.userInvitation.roles = ['TEST'];

                spyOn(mockAdminService, 'inviteUser');
                ctrl.inviteUser();
                expect(mockAdminService.inviteUser).toHaveBeenCalled();
            });

            it('should call inviteUser with correct parameters', function () {
                ctrl.userInvitation.email = 'test@example.com';
                ctrl.userInvitation.roles = ['TEST'];

                spyOn(mockAdminService, 'inviteUser');
                ctrl.inviteUser();
                expect(mockAdminService.inviteUser).toHaveBeenCalledWith({email: 'test@example.com', roles: ['TEST']});
            });

            it('should pass in acbId if such exists', function () {
                ctrl.userInvitation.email = 'test@example.com';
                ctrl.userInvitation.roles = ['TEST'];
                ctrl.acbId = 4;

                spyOn(mockAdminService, 'inviteUser');
                ctrl.inviteUser();
                expect(mockAdminService.inviteUser).toHaveBeenCalledWith({email: 'test@example.com', roles: ['TEST'], acbId: 4});
            });

            it('should only call inviteUser if there is an email address and at least one role', function () {
                spyOn(mockAdminService, 'inviteUser');
                ctrl.inviteUser();
                expect(mockAdminService.inviteUser).not.toHaveBeenCalled();
            });
        });
    });
})();
