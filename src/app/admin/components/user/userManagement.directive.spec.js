(function () {
    'use strict';

    describe('chpl.admin.userManagement.directive', function () {

        var $log, ctrl, element, mockCommonService, scope;

        beforeEach(function () {
            mockCommonService = { };

            angular.mock.module('chpl.admin', function ($provide) {
                $provide.value('networkService', mockCommonService);
            });

            inject(function ($q) {
                mockCommonService.users = {'data': {'users': [{'subjectName': 'admin','fullName': 'Administrator','friendlyName': 'Administrator','email': 'info@ainq.com','phoneNumber': '(301) 560-6999','title': null,'accountLocked': false,'accountEnabled': true}]}};

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
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
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
