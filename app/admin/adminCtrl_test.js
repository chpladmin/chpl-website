;(function () {
    'use strict';

    describe('app.admin', function () {

        beforeEach(function () {
            module('app.admin');
        });

        it('should map /admin routes to /admin', function () {
            inject(function($route) {
                expect($route.routes['/admin'].templateUrl).toEqual('admin/admin.html');
            });
        });

        describe('controller', function () {

            var commonService, userService, scope, ctrl, $log, $location;

            beforeEach(function () {
                var mockUserService = {};
                module('app.admin', function($provide) {
                    $provide.value('userService', mockUserService);
                });

                inject(function($q) {
                    mockUserService.users = {"data": {"users":[{"subjectName":"admin","firstName":"Administrator","lastName":"Administrator","email":"info@ainq.com","phoneNumber":"(301) 560-6999","title":null,"accountLocked":false,"accountEnabled":true}]}};

                    mockUserService.getUsers = function () {
                        var defer = $q.defer();
                        defer.resolve(this.users);
                        return defer.promise;
                    };
                });
            });

            beforeEach(inject(function (_$log_, $rootScope, $controller, _commonService_, _userService_, _$location_) {
                $log = _$log_;
                scope = $rootScope.$new();
                commonService = _commonService_;
                userService = _userService_;
                $location = _$location_;
                ctrl = $controller('AdminController', {
                    $scope: scope,
                    $location: $location,
                    commonService: commonService,
                    userService: userService
                });
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

            it('should have a way to allow users to log in', function () {
                expect(ctrl.login).toBeDefined();
            });

        });
    });
})();
