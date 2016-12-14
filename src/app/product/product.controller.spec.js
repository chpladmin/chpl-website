(function () {
    'use strict';

    describe('chpl.product.controller', function () {

        var commonService, scope, ctrl, $log;

        beforeEach(function () {
            var mockCommonService = {};
            var mockAuthService = {};
            module('chpl.product', function($provide) {
                $provide.value('commonService', mockCommonService);
                $provide.value('authService', mockAuthService);
            });

            inject(function($q) {
                mockCommonService.products = [
                    { developer: 'Developer', product: 'Product' }
                ];

                mockCommonService.getProduct = function () {
                    var defer = $q.defer();
                    defer.resolve(this.products[0]);
                    return defer.promise;
                };

                mockCommonService.getCap = function () {
                    return $q.when({plans: []});
                };

                mockCommonService.getSurveillance = function () {
                    return $q.when({surveillance: []});
                };

                mockAuthService.isAuthed = function () { return true; };
            });
        });

        beforeEach(inject(function (_$log_, $rootScope, $controller, _commonService_) {
            $log = _$log_;
            scope = $rootScope.$new();
            commonService = _commonService_;
            ctrl = $controller('ProductController', {
                $scope: scope,
                $routeParams: {id: '123234'},
                commonService: commonService
            });
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(ctrl).toBeDefined();
        });
    });
})();
