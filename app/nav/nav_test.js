;(function () {
    'use strict';

    describe('app.nav', function () {

        var httpProvider, authInterceptor, authService;
        var token = 'example token';
        var username = 'user name';
        var invalidLogin = 'Invalid username or password';
        var mockAuthService;
        var trueApiUrl = 'http://localhost:8080/chpl-service';
        var falseApiUrl = 'http://example.com';

        beforeEach(function() {
            mockAuthService = {};

            module('app.nav', function ($provide, $httpProvider) {
                $provide.value('authService', mockAuthService);
                httpProvider = $httpProvider;
            });

            inject(function($q) {
                mockAuthService.getToken = function () {
                    return token;
                };

                mockAuthService.saveToken = function (token) {
                };

                mockAuthService.getUsername = function () {
                    return username;
                };

                mockAuthService.logout = function () {
                };

                mockAuthService.isAuthed = function () {
                };
            });

            inject(function (_authInterceptor_) {
                authInterceptor = _authInterceptor_;
            });
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
                var headers = {config: {url: trueApiUrl}, data: {token: token}};
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

            it('should have a method to check if the path is active', function () {
                $location.path('/privacy');
                expect($location.path()).toBe('/privacy');
                expect(ctrl.isActive('/privacy')).toBe(true);
                expect(ctrl.isActive('/search')).toBe(false);
            });

            it('should return the user name of the logged in user', function () {
                expect(ctrl.getUsername()).toEqual(username);
            });

            it('should return an invalid username message if the request is bad', function () {
                var response = {status: 404};
                expect(ctrl.message).toBe(undefined);
                ctrl.handleLogin(response);
                expect(ctrl.message).toBe(invalidLogin);
            });

            it('should return an invalid username message if the credentials are bad', function () {
                var response = {status: 200, data: {}};
                ctrl.handleLogin(response);
                expect(ctrl.message).toBe(invalidLogin);
            });

            it('should change the location to "/admin" on a successful login', function () {
                var response = {status: 200, data: {token: 'a token'}};
                ctrl.handleLogin(response);
                expect($location.path()).toBe('/admin');
                expect(ctrl.message).toBe('');
            });

            it('should call the authService to log out', function () {
                spyOn(mockAuthService, 'logout');
                ctrl.logout();
                expect(mockAuthService.logout).toHaveBeenCalled();
            });

            it('should call the authService to check if the user is authenticated', function () {
                spyOn(mockAuthService, 'isAuthed');
                ctrl.isAuthed();
                expect(mockAuthService.isAuthed).toHaveBeenCalled();
            });
        });
    });
})();
