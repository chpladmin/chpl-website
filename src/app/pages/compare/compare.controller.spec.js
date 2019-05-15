(function () {
    'use strict';

    describe('chpl.compare.compare', function () {

        var $log, ctrl, networkService, scope, utilService;

        beforeEach(function () {
            var mockCommonService = {};
            var mockUtilService = {};
            angular.mock.module('chpl.compare', function ($provide) {
                $provide.value('networkService', mockCommonService);
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
                    applicableCqmCriteria: [],
                }];

                mockCommonService.getListing = function () {
                    var defer = $q.defer();
                    defer.resolve(this.products[0]);
                    return defer.promise;
                };

                mockUtilService.sortCert = function () { return 0; };
                mockUtilService.sortCqm = function () { return 0; };
            });
        });

        beforeEach(inject(function ($controller, _$log_, $rootScope, _networkService_, _utilService_) {
            $log = _$log_;
            scope = $rootScope.$new();
            networkService = _networkService_;
            utilService = _utilService_;
            ctrl = $controller('CompareController', {
                $scope: scope,
                $stateParams: {compareIds: '123&234'},
                networkService: networkService,
                utilService: utilService,
            });
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
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

        it('should know what to compare', () => {
            expect(ctrl.compareIds).toEqual(['123', '234']);
        });
    });
})();
