;(function () {
    'use strict';

    describe('app.admin.reports.directive', function () {

        var element, scope, $log, commonService, authService;

        beforeEach(function () {
            var mockCommonService = {};
            var mockAuthService = {};

            module('app.admin', function($provide) {
                $provide.value('commonService', mockCommonService);
                $provide.value('authService', mockAuthService);
            });

            module('app/admin/components/reports.html');

            inject(function($q) {
                mockCommonService.vendorActivity = ['Vendor 1', 'Vendor 2'];
                mockCommonService.productActivity = ['Product 1', 'Product 2'];
                mockCommonService.certBodyActivity  = ['CB 1', 'CB 2'];
                mockCommonService.cpActivity = [{vendor: 'Vend', product: 'Prod', version: 'version', edition: '2014', uploadDate: '2015-07-02'}];

                mockCommonService.getCertifiedProductActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.cpActivity);
                    return defer.promise;
                };

                mockCommonService.getProductActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.productActivity);
                    return defer.promise;
                };

                mockCommonService.getVendorActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.vendorActivity);
                    return defer.promise;
                };

                mockCommonService.getAcbActivity = function () {
                    var defer = $q.defer();
                    defer.resolve(this.certBodyActivity);
                    return defer.promise;
                };

                mockAuthService.isAcbAdmin = function () {
                    return true;
                };

                mockAuthService.isChplAdmin = function () {
                    return true;
                };
            });
        });

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache, $httpBackend) {
            $log = _$log_;
            scope = $rootScope.$new();

            var template = $templateCache.get('app/admin/components/reports.html');
            $templateCache.put('admin/components/reports.html', template);

            element = angular.element('<ai-reports></ai-reports');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should have loaded activity', function () {
            expect(scope.searchedVendors.length).toBeGreaterThan(0);
            expect(scope.searchedProducts.length).toBeGreaterThan(0);
            expect(scope.searchedACBs.length).toBeGreaterThan(0);
            expect(scope.searchedCertifiedProducts.length).toBeGreaterThan(0);
        });

        it('should know if the logged in user is ACB and/or CHPL admin', function () {
            expect(scope.isAcbAdmin).toBeTruthy();
            expect(scope.isChplAdmin).toBeTruthy();
        });
    });
})();
