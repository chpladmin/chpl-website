;(function () {
    'use strict';

    describe('app.loginServices', function () {

        beforeEach(module('app.loginServices'));

        var $log
        beforeEach(inject(function (_$log_) {
            $log = _$log_;
        }));
        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('app.loginServices.authservices', function () {
            var authService;
            var token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VybmFtZSI6InRlc3QyIiwiaWQiOjIsImV4cCI6MTQzNjUyODYwNiwiaWF0IjoxNDM2NDQyMjA2fQ.Fo482cebe7EfuTtGHjvgsMByC0l-V8ZULMlCNVoxWmI';

            beforeEach(inject(function (_authService_) {
                authService  = _authService_;
                authService.logout();
            }));

            it('should parse a JWT Token', function () {
                expect(authService.parseJwt(token).username).toBe('test2');
                expect(authService.parseJwt(token).exp).toBe(1436528606);
                expect(authService.parseJwt(token).iat).toBe(1436442206);
                expect(authService.parseJwt(token).id).toBe(2);
            });

            it('should save a JWT Token', function () {
                authService.saveToken(token);
                expect(authService.getToken()).toBe(token);
            });

            // test results are dependent on token time in token; need to figure out how to remove that dependency
            xit('should know if someone is authenticated', function () {
                expect(authService.isAuthed()).toBe(false);
                authService.saveToken(token);
                expect(authService.isAuthed()).toBe(true);
                authService.logout();
                expect(authService.isAuthed()).toBe(false);
            });
        });
    });
})();
