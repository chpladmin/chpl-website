;(function () {
    'use strict';

    describe('app.compare.compare', function () {

        var commonService, scope, ctrl, $log;

        beforeEach(function () {
            var mockCommonService = {};
            module('app.compare', function($provide) {
                $provide.value('commonService', mockCommonService);
            });

            inject(function($q) {
                mockCommonService.products = [
                    { developer: 'Developer',
                      product: 'Product',
                      certificationDate: '2015-02-01 00:00:00.00',
                      certificationResults: [],
                      cqmResults: [],
                      applicableCqmCriteria: []}
                ];

                mockCommonService.getProduct = function (pid) {
                    var defer = $q.defer();
                    defer.resolve(this.products[0]);
                    return defer.promise;
                };
            });
        });

        beforeEach(inject(function (_$log_, $rootScope, $controller, _commonService_) {
            $log = _$log_;
            scope = $rootScope.$new();
            commonService = _commonService_;
            ctrl = $controller('CompareController', {
                $scope: scope,
                $routeParams: {compareIds: '123&234'},
                commonService: commonService
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

        it('should know if an element is open, and toggle open status', function () {
            var element = 'element';
            expect(ctrl.isShowing(element)).toBe(false);

            ctrl.toggle('element');
            expect(ctrl.isShowing(element)).toBe(true);

            ctrl.toggle('element');
            expect(ctrl.isShowing(element)).toBe(false);
        });

        it('should not allow more than one element to be open at once', function () {
            var ele1 = 'element1';
            var ele2 = 'element2';

            ctrl.toggle(ele1);
            expect(ctrl.isShowing(ele1)).toBe(true);
            expect(ctrl.isShowing(ele2)).toBe(false);
        });

        it('should track products to compare', function () {
            expect(ctrl.products.length).toBe(2);
        });
    });
})();
