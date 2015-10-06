;(function () {
    'use strict';

    describe('app.userRegistration', function () {

        beforeEach(function () {
            module('app.userRegistration');
        });

        it('should map /userRegistration/hash routes to /userRegistration', function () {
            inject(function($route) {
                expect($route.routes['/userRegistration/:hash'].templateUrl).toEqual('userRegistration/userRegistration.html');
            });
        });

        describe('controller', function () {

            var adminService, mockAdminService, scope, ctrl, $log, $location;
            var validUser, authorizeUser;

            beforeEach(function () {
                mockAdminService = {};
                module('app.userRegistration', function($provide) {
                    $provide.value('adminService', mockAdminService);
                });

                inject(function($q) {
                    mockAdminService.createInvitedUser = function () {
                        $log.debug('createInvitedUser');
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    };
                    mockAdminService.authorizeUser = function () {
                        var defer = $q.defer();
                        defer.resolve();
                        return defer.promise;
                    };
                });
            });

            beforeEach(inject(function (_$log_, $rootScope, $controller, _adminService_, _$location_) {
                $log = _$log_;
                scope = $rootScope.$new();
                adminService = _adminService_;
                $location = _$location_;
                ctrl = $controller('UserRegistrationController', {
                    $scope: scope,
                    $routeParams: {hash: 'fakehash'},
                    adminService: adminService,
                    $location: $location
                });
                validUser = { hash: 'hash',
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
                authorizeUser = { hash: 'hash',
                                  userName: 'subjectName',
                                  password: 'password'
                                }
                scope.$digest();
            }));

            afterEach(function () {
                if ($log.debug.logs.length > 0) {
                    console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
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
                spyOn(adminService, 'createInvitedUser');
                ctrl.createUser();
                expect(adminService.createInvitedUser).not.toHaveBeenCalled();
            });

            xit('should call createUser if the details are complete', function () {
                spyOn(adminService, 'createInvitedUser');
                ctrl.userDetails = validUser;
                ctrl.createUser();
                expect(adminService.createInvitedUser).toHaveBeenCalled();
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
                spyOn(adminService, 'authorizeUser');
                ctrl.authorizeUser();
                expect(adminService.authorizeUser).toHaveBeenCalledWith({subjectName: 'subjectName', password: 'password', hash: 'hash'});
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
