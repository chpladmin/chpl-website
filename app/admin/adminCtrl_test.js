;(function () {
    'use strict';

    describe('app.admin', function () {

        var scope, $log, mockAuthService, ctrl;

        beforeEach(function () {
            mockAuthService = {};

            module('app.admin', function($provide) {
                $provide.value('authService', mockAuthService);
            });

            inject(function($q) {
                mockAuthService.getUsername = function () { return 'fake';};
                mockAuthService.isAuthed = function () { return true; };
                mockAuthService.isChplAdmin = function () { return true ;};
                mockAuthService.isAcbAdmin = function () { return true ;};
            });
        });

        it('should map /admin routes to /admin', function () {
            inject(function($route) {
                expect($route.routes['/admin'].templateUrl).toEqual('admin/admin.html');
            });
        });

        describe('controller', function () {

            beforeEach(inject(function (_$log_, $rootScope, $controller, _authService_) {
                $log = _$log_;
                scope = $rootScope.$new();
                ctrl = $controller('AdminController', {
                    authService: _authService_
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

            it('should know the logged in user\' name', function () {
                expect(ctrl.username).toBe('fake');
            });

            it('should have a default screen set up', function () {
                expect(ctrl.screen).toBe('dpManagement');
            });

            it('should know if the user is an ACB admin', function () {
                expect(ctrl.isAcbAdmin).toBeTruthy();
            });

            it('should know if the user is a CHPL admin', function () {
                expect(ctrl.isChplAdmin).toBeTruthy();
            });

            it('should know if the user is logged in', function () {
                expect(ctrl.isAuthed).toBeTruthy();
            });

            it('should have a way to change screens', function () {
                expect(ctrl.changeScreen).toBeDefined();
            });

            it('should change to a different screen when called', function () {
                ctrl.changeScreen('test');
                expect(ctrl.screen).toBe('test');
            });

            it('should have a function to register handlers', function () {
                expect(ctrl.triggerRefresh).toBeDefined();
            });

            it('should add a handler function is one is passed in', function () {
                expect(ctrl.handlers.length).toBe(0);
                ctrl.triggerRefresh(function () {});
                expect(ctrl.handlers.length).toBe(1);
            });

            it('should have a function to trigger handlers', function () {
                expect(ctrl.refresh).toBeDefined();
            });

            it('should call handler functions when triggered', function () {
                this.aFunc = function () {};
                spyOn(this, 'aFunc');
                ctrl.triggerRefresh(this.aFunc);
                ctrl.refresh();
                expect(this.aFunc).toHaveBeenCalled();
            });
        });
    });
})();
