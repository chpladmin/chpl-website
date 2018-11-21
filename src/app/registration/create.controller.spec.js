(function () {
    'use strict';

    describe('chpl.registration.controller', function () {

        var $location, $log, $q, authService, networkService, scope, vm;

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
                fullName: 'fullName',
                email: 'email@email.email',
                phoneNumber: 'phone',
            },
        };

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.registration', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getUsername = jasmine.createSpy('getUsername');
                    $delegate.isAuthed = jasmine.createSpy('isAuthed');
                    return $delegate;
                });
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.authorizeUser = jasmine.createSpy('authorizeUser');
                    $delegate.createInvitedUser = jasmine.createSpy('createInvitedUser');
                    return $delegate;
                });
            });

            inject(function ($controller, _$location_, _$log_, _$q_, $rootScope, _authService_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                $location = _$location_;
                authService = _authService_;
                authService.getUsername.and.returnValue('username');
                authService.isAuthed.and.returnValue(true);
                networkService = _networkService_;
                networkService.authorizeUser.and.returnValue($q.when({}));
                networkService.createInvitedUser.and.returnValue($q.when({}));

                scope = $rootScope.$new();
                vm = $controller('CreateController', {
                    $scope: scope,
                    $routeParams: {hash: 'fakehash'},
                    authService: authService,
                    networkService: networkService,
                    $location: $location,
                });
                scope.$digest();
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
            expect(networkService.createInvitedUser).not.toHaveBeenCalled();
        });

        it('should have an isAuthed function', function () {
            expect(vm.isAuthed).toBeDefined();
        });

        it('should call createUser if the details are complete', function () {
            vm.userDetails = angular.copy(mock.validUser);
            vm.createUser();
            expect(networkService.createInvitedUser).toHaveBeenCalled();
        });

        it('should require password and verify password to be equal', function () {
            vm.userDetails = angular.copy(mock.validUser);
            expect(vm.validateUser()).toBe(true);
            vm.userDetails.user.password = 'test';
            vm.userDetails.user.passwordverify = 'test2';
            expect(vm.validateUser()).not.toBe(true);
        });

        it('should call "authorizeUser" if the user tries to log in', function () {
            vm.authorizeUser();
            expect(networkService.authorizeUser).toHaveBeenCalledWith({hash: 'fakehash'}, 'username');
        });

        it('should redirect to /admin after authorizeUser is finished', function () {
            spyOn($location, 'path');
            vm.authorizeDetails = mock.authorizeUser;
            vm.authorizeUser();
            scope.$digest();
            expect($location.path).toHaveBeenCalledWith('/admin');
        });

        it('should know what values are disallowed in passwords', function () {
            expect(vm.extras).toEqual(['chpl']);
            vm.userDetails = angular.copy(mock.validUser);
            vm.userDetails.user.friendlyName = 'friendly';
            vm.setExtras();
            expect(vm.extras).toEqual(['chpl', 'subjectName', 'fullName', 'friendly', 'email@email.email', 'phone']);
        });

        it('should be in CREATE-ACCOUNT mode', function () {
            vm.changeDisplayMode('CREATE-ACCOUNT');
            expect(vm.isCreateAccountMode()).toBe(true);
        });

        it('should be in CREATE-ACCOUNT-SUCCESS mode', function () {
            vm.changeDisplayMode('CREATE-ACCOUNT-SUCCESS');
            expect(vm.isCreateAccountSuccessMode()).toBe(true);
        });

        it('should be in SIGN-IN mode', function () {
            vm.changeDisplayMode('SIGN-IN');
            expect(vm.isSignInMode()).toBe(true);
        });
    });
})();
