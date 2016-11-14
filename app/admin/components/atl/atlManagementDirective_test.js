;(function () {
    'use strict';

    describe('app.admin.atlManagement.directive', function () {

        var element, scope, $log, authService, ctrl, commonService;

        beforeEach(function () {
            var mockAuthService = {};
            var mockCommonService = {};

            module('app.admin', function($provide) {
                $provide.value('authService', mockAuthService);
                $provide.value('commonService', mockCommonService);
            });

            module('app/admin/components/atl/atlManagement.html');
            module('app/admin/components/user/userManagement.html');
            module('app/common/components/a.html');

            mockCommonService.atls = {atls: [{name: 'test', id: 1, address: {}}, {name: 'test2', id: 2, address: {}}]};

            inject(function($q) {
                mockAuthService.isAtlAdmin = function () {
                    return true;
                };

                mockAuthService.isChplAdmin = function () {
                    return true;
                };

                mockCommonService.addressRequired = function () {
                    return false;
                };

                mockCommonService.getAtls = function () {
                    return $q.when(mockCommonService.atls);
                };

                mockCommonService.getUsersAtAtl = function (atlId) {
                    return $q.when({});
                };

                mockCommonService.simpleApiCall = function (endpoint) {
                    return $q.when({});
                };

                mockCommonService.getUsers = function (endpoint) {
                    return $q.when({});
                };
            });
        });

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache, $httpBackend) {
            $log = _$log_;
            scope = $rootScope.$new();

            scope.fakeFunction = function () {};

            var template = $templateCache.get('app/admin/components/atl/atlManagement.html');
            $templateCache.put('admin/components/atl/atlManagement.html', template);
            template = $templateCache.get('app/admin/components/user/userManagement.html');
            $templateCache.put('admin/components/user/userManagement.html', template);
            template = $templateCache.get('app/common/components/a.html');
            $templateCache.put('common/components/a.html', template);

            element = angular.element('<ai-atl-management create-atl="fakeFunction"></ai-atl-management');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            beforeEach(inject(function ($controller, _commonService_, $q, $httpBackend) {
                commonService = _commonService_;

                ctrl = $controller('AtlManagementController', {
                    $scope: scope,
                    $element: null,
                    commonService: commonService
                });
                scope.$digest();
            }));

            it('should exist', function() {
                expect(ctrl).toBeDefined();
            });

            it('should know if the logged in user is ATL and/or CHPL admin', function () {
                expect(ctrl.isAtlAdmin).toBeTruthy();
                expect(ctrl.isChplAdmin).toBeTruthy();
            });
        });
    });
})();
