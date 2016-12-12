(function () {
    'use strict';

    describe('chpl.registration', function () {

        beforeEach(function () {
            module('chpl.registration');
        });

        describe('controller', function () {

            var authService, commonService, mockAuthService, mockCommonService, scope, ctrl, $log, $location;
            var validUser, authorizeUser;

            beforeEach(function () {
                mockAuthService = {};
                mockCommonService = {};
                module('chpl.registration', function($provide) {
                    $provide.value('commonService', mockCommonService);
                    $provide.value('authService', mockAuthService);
                });

                inject(function($q) {
                    mockCommonService.createInvitedUser = function () {
                        $log.debug('createInvitedUser');
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    };
                    mockCommonService.authorizeUser = function () {
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    };
                    mockAuthService.isAuthed = function () { return $q.when(true); };
                });
            });

            beforeEach(inject(function (_$log_, $rootScope, $controller, _commonService_, _authService_, _$location_) {
                $log = _$log_;
                scope = $rootScope.$new();
                authService = _authService_;
                commonService = _commonService_;
                $location = _$location_;
                ctrl = $controller('CreateController', {
                    $scope: scope,
                    $routeParams: {hash: 'fakehash'},
                    authService: authService,
                    commonService: commonService,
                    $location: $location
                });
                validUser = {
                    hash: 'hash',
                    user: {
                        subjectName: 'subjectName',
                        password: 'password',
                        passwordverify: 'password',
                        title: 'title',
                        firstName: 'firstName',
                        lastName: 'lastName',
                        email: 'email@email.email',
                        phoneNumber: 'phone'
                    }
                }
                authorizeUser = {
                    hash: 'hash',
                    userName: 'subjectName',
                    password: 'password'
                }
                scope.$digest();
            }));

            afterEach(function () {
                if ($log.debug.logs.length > 0) {
                    //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
                }
            });

            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should have a "create user" function', function () {
                expect(ctrl.createUser).toBeDefined();
            });

            it('should have the hash as part of the userDetails object', function () {
                expect(ctrl.userDetails.hash).toBe('fakehash');
            });

            it('should not call createUser if the details aren\'t complete', function () {
                spyOn(commonService, 'createInvitedUser');
                ctrl.createUser();
                expect(commonService.createInvitedUser).not.toHaveBeenCalled();
            });

            it('should have an isAuthed function', function () {
                expect(ctrl.isAuthed).toBeDefined();
            });

            xit('should call createUser if the details are complete', function () {
                spyOn(commonService, 'createInvitedUser');
                ctrl.userDetails = validUser;
                ctrl.createUser();
                expect(commonService.createInvitedUser).toHaveBeenCalled();
            });

            it('should require password and verify password to be equal', function () {
                ctrl.userDetails = validUser;
                expect(ctrl.validateUser()).toBe(true);
                ctrl.userDetails.user.password = 'test';
                ctrl.userDetails.user.passwordverify = 'test2';
                expect(ctrl.validateUser()).not.toBe(true);
            });

            xit('should call "authorizeUser" if the user tries to log in', function () {
                ctrl.authorizeDetails = authorizeUser;
                $log.debug(ctrl.authorizeDetails.hash);
                spyOn(commonService, 'authorizeUser');
                ctrl.authorizeUser();
                expect(commonService.authorizeUser).toHaveBeenCalledWith({subjectName: 'subjectName', password: 'password', hash: 'hash'});
            });

            xit('should redirect to /admin after createUser is finished', function () {
                spyOn($location, 'path');
                ctrl.userDetails = validUser;
                ctrl.createUser();
                expect($location.path).toHaveBeenCalledWith('/admin');
            });

            xit('should redirect to /admin after authorizeUser is finished', function () {
                spyOn($location, 'path');
                ctrl.authorizeDetails = authorizeUser;
                ctrl.authorizeUser();
                expect($location.path).toHaveBeenCalledWith('/admin');
            });
        });
    });
})();
