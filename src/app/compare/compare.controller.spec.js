(function () {
    'use strict';

    describe('chpl.compare.compare', function () {

        var commonService, utilService, scope, ctrl, $log;

        beforeEach(function () {
            var mockCommonService = {};
            var mockUtilService = {};
            module('chpl.compare', function ($provide) {
                $provide.value('commonService', mockCommonService);
                $provide.value('utilService', mockUtilService);
            });

            inject(function ($q) {
                mockCommonService.products = [{
                    developer: 'Developer',
                    product: 'Product',
                    certificationDate: '2015-02-01 00:00:00.00',
                    certificationResults: [],
                    certificationEdition: {name: '2014'},
                    cqmResults: [],
                    applicableCqmCriteria: []
                }];

                mockCommonService.getProduct = function () {
                    var defer = $q.defer();
                    defer.resolve(this.products[0]);
                    return defer.promise;
                };

                mockUtilService.sortCert = function () { return 0; };
                mockUtilService.sortCqm = function () { return 0; };
            });
        });

        beforeEach(inject(function (_$log_, $rootScope, $controller, _commonService_, _utilService_) {
            $log = _$log_;
            scope = $rootScope.$new();
            commonService = _commonService_;
            utilService = _utilService_;
            ctrl = $controller('CompareController', {
                $scope: scope,
                $routeParams: {compareIds: '123&234'},
                commonService: commonService,
                utilService: utilService
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
