(function () {
    'use strict';

    describe('the user management compoent', function () {
        var $log, $q, ctrl, element, mock, networkService, scope;

        mock = {
            users: {
                data: {
                    users: [
                        {'subjectName': 'admin','fullName': 'Administrator','friendlyName': 'Administrator','email': 'info@ainq.com','phoneNumber': '(301) 560-6999','title': null,'accountLocked': false,'accountEnabled': true},
                    ],
                },
            },
        };

        beforeEach(function () {
            angular.mock.module('chpl.admin', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getUsers = jasmine.createSpy('getUsers');
                    $delegate.getUsersAtAcb = jasmine.createSpy('getUsersAtAcb');
                    $delegate.getUsersAtAtl = jasmine.createSpy('getUsersAtAtl');
                    $delegate.inviteUser = jasmine.createSpy('inviteUser');
                    return $delegate;
                });
            });

            inject(function ($compile, _$log_, _$q_, $rootScope, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getUsers.and.returnValue($q.when(mock.users));
                networkService.getUsersAtAcb.and.returnValue($q.when(mock.users));
                networkService.getUsersAtAtl.and.returnValue($q.when(mock.users));
                networkService.inviteUser.and.returnValue($q.when({hash: 'the hash'}));

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

        it('should have CRUD user functions', function () {
            expect(ctrl.updateUser).toBeDefined();
        });

        it('should have an invite user function', function () {
            expect(ctrl.inviteUser).toBeDefined();
        });

        it('should know what the acb id is', function () {
            expect(ctrl.acbId).toBe('1');
        });
    });
})();
