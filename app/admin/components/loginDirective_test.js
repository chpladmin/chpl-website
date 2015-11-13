;(function () {
    'use strict';

    describe('app.admin.login.directive', function () {

        var element, scope, $log, authService, mockAuthService, commonService, mockCommonService, ctrl, $q;

        beforeEach(function () {
            mockCommonService = {};
            mockAuthService = {};

            module('app.admin', function($provide) {
                $provide.value('commonService', mockCommonService);
                $provide.value('authService', mockAuthService);
            });

            module('app/admin/components/login.html');

            inject(function($q) {
                mockAuthService.logout = function () {};
                mockCommonService.login = function (userObject) {};
                mockAuthService.isAuthed = function () {return true};
            });
        });

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache) {
            $log = _$log_;
            scope = $rootScope.$new();

            var template = $templateCache.get('app/admin/components/login.html');
            $templateCache.put('admin/components/login.html', template);

            element = angular.element('<ai-login></ai-login');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            beforeEach(inject(function ($controller, _commonService_, _$q_) {
                commonService = _commonService_;
                $q = _$q_;

                ctrl = $controller('LoginController', {
                    $scope: scope,
                    $element: null,
                    commonService: commonService});
                scope.$digest();
            }));

            it('should exist', function() {
                expect(ctrl).toBeDefined();
            });

            it('should have a function to log in', function () {
                expect(ctrl.login).toBeDefined();
            });

            it('should call commonService.login with correct parameters', function () {
                spyOn(commonService, 'login').and.callFake(function () {
                    return $q.when({});
                });
                ctrl.userName = 'test';
                ctrl.password = 'password';
                ctrl.login();
                expect(commonService.login).toHaveBeenCalledWith({userName: 'test', password: 'password'});
            });

            xit('should have an error message if login credentials are bad', function () {
                spyOn(commonService, 'login').and.callFake(function () {
                    var defer = $q.defer();
                    defer.reject('Invalid username / password');
                    return defer.promise;
                });
                ctrl.login()
                    .then(function (response) {
                        $log.debug(response);
                        expect(ctrl.message).toBe('Invalid username / password')
                    });
            });
        });
    });
})();
