(function () {
    'use strict';

    describe('chpl.registration.controller', function () {

        var authService, commonService, scope, vm, $log, $location, $q;

        var mock = {};
        mock.authorizeUser = {
            hash: 'hash',
            userName: 'subjectName',
            password: 'password',
        };
        mock.validUser = {
            hash: 'hash',
            user: {
                subjectName: 'subjectName',
                password: 'password',
                passwordverify: 'password',
                title: 'title',
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'email@email.email',
                phoneNumber: 'phone',
            },
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.registration', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.authorizeUser = jasmine.createSpy('authorizeUser');
                    $delegate.createInvitedUser = jasmine.createSpy('createInvitedUser');
                    return $delegate;
                });
                $provide.decorator('authService', function ($delegate) {
                    $delegate.isAuthed = jasmine.createSpy('isAuthed');
                    return $delegate;
                });
            });

            inject(function ($controller, _$location_, _$log_, _$q_, $rootScope, _authService_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                $location = _$location_;
                authService = _authService_;
                authService.isAuthed.and.returnValue(true);
                commonService = _commonService_;
                commonService.authorizeUser.and.returnValue($q.when({}));
                commonService.createInvitedUser.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('CreateController', {
                    $scope: scope,
                    $routeParams: {hash: 'fakehash'},
                    authService: authService,
                    commonService: commonService,
                    $location: $location,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have a "create user" function', function () {
            expect(vm.createUser).toBeDefined();
        });

        it('should have the hash as part of the userDetails object', function () {
            expect(vm.userDetails.hash).toBe('fakehash');
        });

        it('should not call createUser if the details aren\'t complete', function () {
            vm.createUser();
            expect(commonService.createInvitedUser).not.toHaveBeenCalled();
        });

        it('should have an isAuthed function', function () {
            expect(vm.isAuthed).toBeDefined();
        });

        it('should call createUser if the details are complete', function () {
            vm.userDetails = mock.validUser;
            vm.createUser();
            expect(commonService.createInvitedUser).toHaveBeenCalled();
        });

        it('should require password and verify password to be equal', function () {
            vm.userDetails = mock.validUser;
            expect(vm.validateUser()).toBe(true);
            vm.userDetails.user.password = 'test';
            vm.userDetails.user.passwordverify = 'test2';
            expect(vm.validateUser()).not.toBe(true);
        });

        it('should call "authorizeUser" if the user tries to log in', function () {
            vm.authorizeUser();
            expect(commonService.authorizeUser).toHaveBeenCalledWith({hash: 'fakehash'});
        });

        it('should redirect to /admin after authorizeUser is finished', function () {
            spyOn($location, 'path');
            vm.authorizeDetails = mock.authorizeUser;
            vm.authorizeUser();
            scope.$digest();
            expect($location.path).toHaveBeenCalledWith('/admin');
        });
    });
})();
