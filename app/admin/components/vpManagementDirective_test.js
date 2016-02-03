;(function () {
    'use strict';

    describe('app.admin.vpManagement.directive', function () {

        var element, scope, $log, commonService, mockCommonService, mockFileUploader, ctrl, FileUploader;

        beforeEach(function () {
            mockCommonService = {};
            mockFileUploader = function(){};

            module('app.admin', function($provide) {
                $provide.value('commonService', mockCommonService);
                $provide.value('FileUploader', mockFileUploader);
            });

            module('app/admin/components/vpManagement.html');

            inject(function($q) {
                mockCommonService.developers = {developers: ['Developer 1', 'Developer 2']};
                mockCommonService.products = [{name: 'Prod', lastModifiedDate: '2014-05-02'}, 'Product 2'];
                mockCommonService.certs = ['Cert 1', 'Cert 2'];
                mockCommonService.cqms = ['CQM 1', 'CQM 2'];
                mockCommonService.editions = ['Edition 1', 'Edition 2'];
                mockCommonService.practices = ['Practice 1', 'Practice 2'];
                mockCommonService.certBodies = ['CB 1', 'CB 2'];
                mockCommonService.testingLabs = ['TL 1', 'TL 2'];
                mockCommonService.certificationStatuses = ['Active', 'Retired'];
                mockCommonService.uploadingCps = {pendingCertifiedProducts: []};

                mockCommonService.getDevelopers = function () {
                    var defer = $q.defer();
                    defer.resolve(this.developers);
                    return defer.promise;
                };

                mockCommonService.getProducts = function () {
                    var defer = $q.defer();
                    defer.resolve(this.products);
                    return defer.promise;
                };

                mockCommonService.getProduct = function (prodId) {
                    var defer = $q.defer();
                    defer.resolve(this.products[0]);
                    return defer.promise;
                };

                mockCommonService.getProductsByDeveloper = function (developerId) {
                    var defer = $q.defer();
                    defer.resolve(this.products);
                    return defer.promise;
                };

                mockCommonService.getVersionsByProduct = function (developerId) {
                    var defer = $q.defer();
                    defer.resolve(this.products);
                    return defer.promise;
                };

                mockCommonService.getEditions = function () {
                    var defer = $q.defer();
                    defer.resolve(this.editions);
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

                mockCommonService.getCertificationStatuses = function () {
                    var defer = $q.defer();
                    defer.resolve(this.certificationStatuses);
                    return defer.promise;
                };

                mockCommonService.getUploadingCps = function () {
                    var defer = $q.defer();
                    defer.resolve(this.uploadingCps);
                    return defer.promise;
                };

                mockCommonService.getSearchOptions = function () {
                    var defer = $q.defer();
                    defer.resolve({});
                    return defer.promise;
                };

                mockCommonService.getAtls = function () { return $q.when(mockCommonService.testingLabs); };
            });
        });

        beforeEach(inject(function ($compile, $rootScope, _$log_, $templateCache, $httpBackend) {
            $log = _$log_;
            scope = $rootScope.$new();

            var template = $templateCache.get('app/admin/components/vpManagement.html');
            $templateCache.put('admin/components/vpManagement.html', template);

            $httpBackend.whenGET('common/components/certs.html')
                .respond(200, '<div></div>');
            $httpBackend.whenGET('admin/components/additionalSoftware.html')
                .respond(200, '<div></div>');
            $httpBackend.whenGET('common/components/cap.html')
                .respond(200, '<div></div>');
            $httpBackend.whenGET('common/components/surveillance.html')
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

            var fileUploader;

            beforeEach(inject(function ($controller, _commonService_, $q, _FileUploader_) {
                commonService = _commonService_;
                FileUploader = _FileUploader_;

                spyOn(commonService, 'getProduct').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve({});
                    return defer.promise;
                });

                spyOn(commonService, 'getProductsByDeveloper').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve({});
                    return defer.promise;
                });

                spyOn(commonService, 'getVersionsByProduct').and.callFake(function () {
                    var defer = $q.defer();
                    defer.resolve({});
                    return defer.promise;
                });

                ctrl = $controller('VpManagementController', {
                    $scope: scope,
                    $element: null,
                    commonService: commonService,
                    FileUploader: FileUploader});
                scope.$digest();
            }));

            it('should exist', function() {
                expect(ctrl).toBeDefined();
            });

            it('should have developers at load', function () {
                expect(ctrl.developers.length).toBe(2);
            });

            it('shouldn\'t do anything if no developer is selected', function () {
                ctrl.selectDeveloper();
                expect(ctrl.activeDeveloper).toBe('');
                expect(ctrl.mergeDeveloper).toBeUndefined();
            });

            it('should set the activeDeveloper and call getProductsByDeveloper if there\'s one selected developer', function () {
                expect(ctrl.activeDeveloper).toEqual('');
                ctrl.developerSelect = [{developer: 'developer1'}];
                ctrl.selectDeveloper();
                expect(ctrl.activeDeveloper).toEqual([{developer: 'developer1'}]);
                expect(commonService.getProductsByDeveloper).toHaveBeenCalled();
            });

            it('should create a mergeDeveloper if more than one developer is selected', function () {
                expect(ctrl.mergeDeveloper).toBeUndefined();
                ctrl.developerSelect = {developer: 'developer1'};
                ctrl.mergingDevelopers = [{developer: 'developer2'}];
                ctrl.selectDeveloper();
                expect(ctrl.mergeDeveloper).toEqual({developer: 'developer1'});
            });

            it('shouldn\'t do anything if no product is selected', function () {
                ctrl.selectProduct();
                expect(ctrl.activeProduct).toBe('');
                expect(ctrl.mergeProduct).toBeUndefined();
            });

            it('should set the activeProduct and call getVersionsByProduct if there\'s one selected product', function () {
                expect(ctrl.activeProduct).toBe('');
                ctrl.productSelect = {product: 'product1'};
                ctrl.activeDeveloper = {developerId: '123'};
                ctrl.selectProduct();
                expect(ctrl.activeProduct).toEqual({product: 'product1', developerId: '123'});
                expect(commonService.getVersionsByProduct).toHaveBeenCalled();
            });

            it('should create a mergeProduct if more than one product is selected', function () {
                expect(ctrl.mergeProduct).toBeUndefined();
                ctrl.activeDeveloper = {developerId: '123'};
                ctrl.productSelect = {product: 'product1'};
                ctrl.mergingProducts = [{product: 'product1'}, {product: 'product2'}];
                ctrl.selectProduct();
                expect(ctrl.mergeProduct).toEqual({product: 'product1', developerId: '123'});
            });
        });
    });
})();
