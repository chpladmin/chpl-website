;(function () {
    'use strict';

    describe('app.api', function () {

        beforeEach(module('app.api', function ($provide) {
            $provide.constant('devAPI', 'http://ainq.com');
        }));

        var apiService, $httpBackend, $log;

        var mock = {};
        mock.endpoints = [{ name: 'List Users', description: 'List all CHPL users', request: '/list_users' },{ name: 'List ACBs', description: 'List all registered ACBs', request: '/list_acbs' }];

        beforeEach(inject(function (_$log_, _apiService_, _$httpBackend_) {
            $log = _$log_;
            apiService  = _apiService_;
            $httpBackend = _$httpBackend_;

            $httpBackend.whenGET(/list_api_calls/).respond(mock.endpoints);
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        afterEach(function () {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('service', function () {
            it('should return api calls', function () {
                apiService.getApiCalls().then(function(response) {
                    expect(response).toEqual(mock.endpoints);
                });
                $httpBackend.flush();
            });

            it('should return a reject if the response is not the right type', function () {
                $httpBackend.expectGET(/list_api_calls/).respond('bad data');
                apiService.getApiCalls().then(function(response) {
                    expect(response).toEqual('bad data');
                });
                $httpBackend.flush();
            });

            it('should return a reject if the response fails', function () {
                $httpBackend.expectGET(/list_api_calls/).respond(404, {message: 'bad data'});
                apiService.getApiCalls().then(function(response) {
                    expect(response).toEqual(404, {message: 'bad data'});
                });
                $httpBackend.flush();
            });
        });
    });
})();
