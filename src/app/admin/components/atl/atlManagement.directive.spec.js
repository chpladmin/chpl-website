(function () {
    'use strict';

    describe('chpl.admin.atlManagement.directive', function () {

        var element, scope, $log, ctrl, commonService;

        beforeEach(function () {
            var mockAuthService = {};
            var mockCommonService = {};

            module('chpl.templates');
            module('chpl.admin', function ($provide) {
                $provide.value('authService', mockAuthService);
                $provide.value('commonService', mockCommonService);
            });

            mockCommonService.atls = {atls: [{name: 'test', id: 1, address: {}}, {name: 'test2', id: 2, address: {}}]};

            inject(function ($q) {
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

                mockCommonService.getUsersAtAtl = function () {
                    return $q.when({});
                };

                mockCommonService.simpleApiCall = function () {
                    return $q.when({});
                };

                mockCommonService.getUsers = function () {
                    return $q.when({});
                };
            });
        });

        beforeEach(inject(function ($compile, _$log_, $rootScope) {
            $log = _$log_;
            scope = $rootScope.$new();

            scope.fakeFunction = function () {};

            element = angular.element('<ai-atl-management create-atl="fakeFunction"></ai-atl-management');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            beforeEach(inject(function ($controller, _commonService_) {
                commonService = _commonService_;

                ctrl = $controller('AtlManagementController', {
                    $scope: scope,
                    $element: null,
                    commonService: commonService,
                });
                scope.$digest();
            }));

            it('should exist', function () {
                expect(ctrl).toBeDefined();
            });

            it('should know if the logged in user is ATL and/or CHPL admin', function () {
                expect(ctrl.isAtlAdmin).toBeTruthy();
                expect(ctrl.isChplAdmin).toBeTruthy();
            });
        });
    });
})();
