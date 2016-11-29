;(function () {
    'use strict';

    describe('app.nav', function () {

        var httpProvider, authInterceptor, authService, mockAuthService, $log;
        var username = 'user name';
        var token = 'example token';
        var trueApiUrl = 'http://localhost:8080/chpl-service';
        var falseApiUrl = 'http://example.com';

        beforeEach(function() {
            mockAuthService = {};

            module('app.nav', function ($provide, $httpProvider) {
                $provide.value('authService', mockAuthService);
                httpProvider = $httpProvider;
            });

            inject(function(_authInterceptor_, _$log_) {
                mockAuthService.getToken = function () { return token; };
                mockAuthService.getApiKey = function () { return 'key'; };
                mockAuthService.saveToken = function (token) { };
                mockAuthService.getUsername = function () { return username; };
                mockAuthService.logout = function () { };
                mockAuthService.isAuthed = function () { };
                authInterceptor = _authInterceptor_;
                $log = _$log_;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('authInterceptor', function () {
            it('should have a defined Interceptor', function () {
                expect(authInterceptor).toBeDefined();
            });

            it('should have the interceptor as an interceptor', function () {
                expect(httpProvider.interceptors).toContain('authInterceptor');
            });

            it('should not put a token in the headers if there isn\'t one', function () {
                inject(function($q) {
                    mockAuthService.getToken = function () {
                        return '';
                    }
                });
                var config = authInterceptor.request({headers: {}, url: trueApiUrl });
                expect(config.headers['Authorization']).toBe(undefined);
            });

            it('should put a token in the headers when there is one, and the API location matches', function () {
                var config = authInterceptor.request({headers: {}, url: trueApiUrl });
                expect(config.headers['Authorization']).toBe('Bearer ' + token);
            });

            it('should not put a token in the headers when there is one, but the API location is not correct', function () {
                var config = authInterceptor.request({headers: {}, url: falseApiUrl });
                expect(config.headers['Authorization']).toBe(undefined);
            });

            it('should pass the response through unchanged if it\' not coming from the defined URL', function () {
                var headers = {config: {url: falseApiUrl}};
                var response = authInterceptor.response(headers);
                expect(response).toBe(headers);
            });

            it('should set the token if one is found, from the correct URL', function () {
                var headers = {config: {url: trueApiUrl}, data: "{\"token\":\"this is my token\"}"};
                spyOn(mockAuthService, 'saveToken');
                authInterceptor.response(headers);
                expect(mockAuthService.saveToken).toHaveBeenCalled();
            });

            it('should JSON parse a "string" data object', function () {
                var headers = {config: {url: trueApiUrl}, data: "{\"token\":\"this is my token\"}"};
                var response = authInterceptor.response(headers);
                expect(response).toEqual({config: {url: trueApiUrl}, data: {token: 'this is my token'}});
            });
        });

        describe('controller', function () {
            var scope, $location, createController, ctrl;

            beforeEach(inject(function ($rootScope, $controller, _$location_) {
                $location = _$location_;
                scope = $rootScope.$new();

                ctrl = $controller('NavigationController', {
                    '$scope': scope
                });
            }));

            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should return the user name of the logged in user', function () {
                expect(ctrl.getUsername()).toEqual(username);
            });

            it('should call the authService to check if the user is authenticated', function () {
                spyOn(mockAuthService, 'isAuthed');
                ctrl.isAuthed();
                expect(mockAuthService.isAuthed).toHaveBeenCalled();
            });

            it('should know what page is active', function () {
                spyOn($location,'path').and.returnValue('/admin/userManagement');
                expect(ctrl.isActive('admin')).toBe(true);
                expect(ctrl.isActive('resources')).toBe(false);
            });
        });
    });
})();
