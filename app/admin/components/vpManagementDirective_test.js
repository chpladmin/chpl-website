;(function () {
    'use strict';

    describe('app.admin.vpManagement.directive', function () {

        var element, scope, $log, commonService, ctrl;

        beforeEach(function () {
            var mockCommonService = {};

            module('app.admin', function($provide) {
                $provide.value('commonService', mockCommonService);
            });

            module('app/admin/components/vpManagement.html');

            inject(function($q) {
                mockCommonService.vendors = ['Vendor 1', 'Vendor 2'];
                mockCommonService.products = ['Product 1', 'Product 2'];
                mockCommonService.certs = ['Cert 1', 'Cert 2'];
                mockCommonService.cqms = ['CQM 1', 'CQM 2'];
                mockCommonService.editions = ['Edition 1', 'Edition 2'];
                mockCommonService.classifications = ['Classification 1', 'Classification 2'];
                mockCommonService.practices  = ['Practice 1', 'Practice 2'];
                mockCommonService.certBodies  = ['CB 1', 'CB 2'];
                mockCommonService.uploadingCps = [{vendor: 'Vend', product: 'Prod', version: 'version', edition: '2014', uploadDate: '2015-07-02'}];

                mockCommonService.getVendors = function () {
                    var defer = $q.defer();
                    defer.resolve(this.vendors);
                    return defer.promise;
                };

                mockCommonService.getProducts = function () {
                    var defer = $q.defer();
                    defer.resolve(this.products);
                    return defer.promise;
                };

                mockCommonService.getEditions = function () {
                    var defer = $q.defer();
                    defer.resolve(this.editions);
                    return defer.promise;
                };

                mockCommonService.getClassifications = function () {
                    var defer = $q.defer();
                    defer.resolve(this.classifications);
                    return defer.promise;
                };

                mockCommonService.getPractices = function () {
                    var defer = $q.defer();
                    defer.resolve(this.practices);
                    return defer.promise;
                };

                mockCommonService.getCertBodies = function () {
                    var defer = $q.defer();
                    defer.resolve(this.certBodies);
                    return defer.promise;
                };

                mockCommonService.getUploadingCps = function () {
                    var defer = $q.defer();
                    defer.resolve(this.uploadingCps);
                    return defer.promise;
                };
            });
        });

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache, $httpBackend) {
            $log = _$log_;
            scope = $rootScope.$new();

            var template = $templateCache.get('app/admin/components/vpManagement.html');
            $templateCache.put('admin/components/vpManagement.html', template);

            $httpBackend.whenGET('common/components/certs.html')
                .respond(200, '<div></div>');
            element = angular.element('<ai-vp-management></ai-vp-management');
            $compile(element)(scope);
            scope.$digest();
        }));

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        describe('controller', function () {

            beforeEach(inject(function ($controller, _commonService_) {
                commonService = _commonService_;

                ctrl = $controller('VpManagementController', {
                    $scope: scope,
                    $element: null,
                    commonService: commonService});
                scope.$digest();
            }));

            it('should exist', function() {
                expect(ctrl).toBeDefined();
            });

            it('should have vendors at load', function () {
                expect(ctrl.vendors.length).toBe(2);
            });
        });
    });
})();
