(function () {
    'use strict';

    describe('chpl.admin.userManagement.directive', function () {

        var element, scope, $log, ctrl, mockCommonService;

        beforeEach(function () {
            mockCommonService = {};

            module('chpl.templates');
            module('chpl.admin', function ($provide) {
                $provide.value('commonService', mockCommonService);
            });

            inject(function ($q) {
                mockCommonService.users = {"data": {"users":[{"subjectName":"admin","firstName":"Administrator","lastName":"Administrator","email":"info@ainq.com","phoneNumber":"(301) 560-6999","title":null,"accountLocked":false,"accountEnabled":true}]}};

                mockCommonService.getUsers = function () {
                    return $q.when(this.users);
                };

                mockCommonService.inviteUser = function () {
                    return $q.when({hash: 'the hash'});
                };
            });
        });

        beforeEach(inject(function ($compile, _$log_, $rootScope) {
            $log = _$log_;
            scope = $rootScope.$new();

            scope.fakeFunction = function () {};
            scope.userManagementInviteUser = {
                $setPristine: function () {},
                $setUntouched: function () {},
            };

            element = angular.element('<ai-user-management create-user="fakeFunction" modify-user="fakeFunction" delete-user="fakeFunction" cancel-user="fakeFunction"></ai-user-management');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            beforeEach(inject(function ($controller, $q) {
                ctrl = $controller('UserManagementController', {
                    $scope: scope,
                    $element: null,
                });
                spyOn(mockCommonService, 'inviteUser').and.returnValue($q.when({hash: 'the hash'}));
                scope.$digest();
            }));

            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should have CRUD user functions', function () {
                expect(ctrl.updateUser).toBeDefined();
            });

            it('should have an invite user function', function () {
                expect(ctrl.inviteUser).toBeDefined();
            });
        });
    });
})();
