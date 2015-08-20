;(function () {
    'use strict';

    describe('app.api', function () {

        var apiService, scope, ctrl, $log;

        beforeEach(function () {
            var mockApiService = {};
            module('app.api', function($provide) {
                $provide.value('apiService', mockApiService);
            });

            inject(function($q) {
                mockApiService.apiCalls = [
                    { name: 'List Users', endpoint: '/auth/list_users' },
                    { name: 'Authenticate', endpoint: '/auth/authenticate' }
                ];

                mockApiService.apiEntities = [
                    { name: 'List Users', endpoint: '/auth/list_users' },
                    { name: 'Authenticate', endpoint: '/auth/authenticate' }
                ];

                mockApiService.getApiCalls = function () {
                    var defer = $q.defer();
                    defer.resolve(this.apiCalls);
                    return defer.promise;
                };

                mockApiService.getApiEntities = function () {
                    var defer = $q.defer();
                    defer.resolve(this.apiEntities);
                    return defer.promise;
                };
            });
        });

        beforeEach(inject(function (_$log_, $rootScope, $controller, _apiService_) {
            $log = _$log_;
            scope = $rootScope.$new();
            apiService = _apiService_;
            ctrl = $controller('ApiController', {
                $scope: scope,
                apiService: apiService
            });
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should load api endpoints at start', function () {
                expect(ctrl.apiCalls.length).toBeGreaterThan(0);
            });
        });
    });
})();
