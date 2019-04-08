(function () {
    'use strict';

    describe('the CHPL Navigation', function () {

        var $httpProvider, $log, authInterceptor, authService, mock, toaster;
        mock = {
            apiKey: 'apiKey',
            falseApiUrl: 'http://example.com',
            token: 'example token',
            trueApiUrl: '/rest',
        };

        beforeEach(function () {
            angular.mock.module('chpl.navigation', 'chpl', function (_$httpProvider_, $provide) {
                $httpProvider = _$httpProvider_;
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');
                    $delegate.logout = jasmine.createSpy('logout');
                    $delegate.saveToken = jasmine.createSpy('saveToken');
                    return $delegate;
                });
            });
        });

        beforeEach(inject(function (_$log_, _authInterceptor_, _authService_, _toaster_) {
            authInterceptor = _authInterceptor_;
            $log = _$log_;
            toaster = _toaster_;
            authService = _authService_;
            authService.getApiKey.and.returnValue(mock.apiKey);
            authService.getToken.and.returnValue(mock.token);
            authService.hasAnyRole.and.returnValue(false);
            authService.logout.and.returnValue();
            authService.saveToken.and.returnValue();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('interceptor', function () {
            it('should be defined', function () {
                expect(authInterceptor).toBeDefined();
            });

            it('should be loaded as an interceptor', function () {
                expect($httpProvider.interceptors).toContain('authInterceptor');
            });

            describe('when dealing with JWT', function () {
                it('should not put the token in the headers if there isn\'t one', function () {
                    authService.getToken.and.returnValue('');
                    var config = authInterceptor.request({headers: {}, url: mock.trueApiUrl });
                    expect(config.headers['Authorization']).toBe(undefined);
                });

                it('should put the token in the headers when there is one, and the API location matches', function () {
                    var config = authInterceptor.request({headers: {}, url: mock.trueApiUrl });
                    expect(config.headers['Authorization']).toBe('Bearer ' + mock.token);
                });

                it('should not put the token in the headers when there is one, but the API location is not correct', function () {
                    var config = authInterceptor.request({headers: {}, url: mock.falseApiUrl });
                    expect(config.headers['Authorization']).toBe(undefined);
                });

                it('should pass the response through unchanged if it\'s not coming from the defined URL', function () {
                    var headers = {config: {url: mock.falseApiUrl}, headers: function () {return [];}};
                    var response = authInterceptor.response(headers);
                    expect(response).toBe(headers);
                });

                it('should set the token if one is found, from the correct URL', function () {
                    var headers = {config: {url: mock.trueApiUrl}, data: '{"token":"this is my token"}', headers: function () {return [];}};
                    authInterceptor.response(headers);
                    expect(authService.saveToken).toHaveBeenCalled();
                });

                it('should not set the token if there isn\'t one, from the correct URL', function () {
                    var headers = {config: {url: mock.trueApiUrl}, data: '{}', headers: function () {return [];}};
                    authInterceptor.response(headers);
                    expect(authService.saveToken).not.toHaveBeenCalled();
                });

                it('should JSON parse a "string" token object', function () {
                    var headers = {config: {url: mock.trueApiUrl}, data: '{"token":"this is my token"}'};
                    var response = authInterceptor.response(headers);
                    expect(response).toEqual({config: {url: mock.trueApiUrl}, data: {token: 'this is my token'}});
                });
            });

            describe('when dealing with response headers', function () {
                var response;
                beforeEach(function () {
                    response = {config: {url: mock.trueApiUrl}};
                });

                it('should pop toast if a chpl id changed', function () {
                    response.headers = function () { return {'chpl-id-changed': 'an id'}; };
                    spyOn(toaster, 'pop');
                    authInterceptor.response(response);
                    expect(toaster.pop).toHaveBeenCalledWith({
                        type: 'success',
                        title: 'CHPL ID Changed',
                        body: 'Your activity caused a CHPL Product Number to change',
                    });
                });

                it('should pop toast if multiple chpl ids changed', function () {
                    response.headers = function () { return {'chpl-id-changed': 'an id, another id'}; };
                    spyOn(toaster, 'pop');
                    authInterceptor.response(response);
                    expect(toaster.pop).toHaveBeenCalledWith({
                        type: 'success',
                        title: 'CHPL IDs Changed',
                        body: 'Your activity caused CHPL Product Numbers to change',
                    });
                });

                it('should pop toast if the listing cache was evicted', function () {
                    response.headers = function () { return {'cache-cleared': 'listingCollection'}; };
                    spyOn(toaster, 'pop');
                    authInterceptor.response(response);
                    expect(toaster.pop).toHaveBeenCalledWith({
                        type: 'warning',
                        title: 'Update processing',
                        body: 'Your changes may not be reflected immediately in the search results and shortcuts pages. Please contact CHPL admin if you have any concerns',
                    });
                });

                it('should log the user out if their token is invalid', () => {
                    let count = authService.logout.calls.count();
                    let headers = {config: {url: mock.trueApiUrl}, data: '{"stuff":"stuff"}'};
                    authInterceptor.response(headers);
                    expect(authService.logout.calls.count()).toBe(count);
                    headers = {config: {url: mock.trueApiUrl}, data: '{"error":"an error"}'};
                    authInterceptor.response(headers);
                    expect(authService.logout.calls.count()).toBe(count);
                    headers = {config: {url: mock.trueApiUrl}, data: '{"error":"Invalid authentication token."}'};
                    authInterceptor.response(headers);
                    expect(authService.logout.calls.count()).toBe(count);
                    authService.hasAnyRole.and.returnValue(true);
                    authInterceptor.response(headers);
                    expect(authService.logout.calls.count()).toBe(count + 1);
                });
            });
        });
    });
})();
