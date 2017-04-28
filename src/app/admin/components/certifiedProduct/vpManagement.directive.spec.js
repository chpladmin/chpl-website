(function () {
    'use strict';

    describe('chpl.admin.vpManagement.directive', function () {

        var el, $log, $q, commonService, authService, vm, /*FileUploader,*/ mock, Mock, $uibModal, actualOptions;

        mock = {};
        mock.developers = {developers: [{name: 'Developer 1', transparencyAttestations: []}, {name: 'Developer 2', transparencyAttestations: []}]};
        mock.products = [{name: 'Prod', lastModifiedDate: '2014-05-02'}, 'Product 2'];
        mock.certs = ['Cert 1', 'Cert 2'];
        mock.cqms = ['CQM 1', 'CQM 2'];
        mock.editions = ['Edition 1', 'Edition 2'];
        mock.practices = ['Practice 1', 'Practice 2'];
        mock.certBodies = ['CB 1', 'CB 2'];
        mock.testingLabs = ['TL 1', 'TL 2'];
        mock.certificationStatuses = ['Active', 'Retired'];
        mock.uploadingCps = {pendingCertifiedProducts: []};
        mock.uploadingSurveillances = {surveillances: []};
        mock.fakeModalOptions = {
            templateUrl: 'app/admin/components/certifiedProduct/product/split.html',
            controller: 'SplitProductController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                product: jasmine.any(Function),
                versions: jasmine.any(Function)
            }
        };

        beforeEach(function () {
            module('chpl.mock', 'chpl.templates', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.isAcbAdmin = jasmine.createSpy('isAcbAdmin');
                    $delegate.isAcbStaff = jasmine.createSpy('isAcbStaff');
                    $delegate.isChplAdmin = jasmine.createSpy('isChplAdmin');
                    $delegate.isOncStaff = jasmine.createSpy('isOncStaff');
                    return $delegate;
                });

                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getAccessibilityStandards = jasmine.createSpy('getAccessibilityStandards');
                    $delegate.getAtls = jasmine.createSpy('getAtls');
                    $delegate.getCertBodies = jasmine.createSpy('getCertBodies');
                    $delegate.getCertificationStatuses = jasmine.createSpy('getCertificationStatuses');
                    $delegate.getDevelopers = jasmine.createSpy('getDevelopers');
                    $delegate.getEditions = jasmine.createSpy('getEditions');
                    $delegate.getPractices = jasmine.createSpy('getPractices');
                    $delegate.getProduct = jasmine.createSpy('getProduct');
                    $delegate.getProducts = jasmine.createSpy('getProducts');
                    $delegate.getProductsByDeveloper = jasmine.createSpy('getProductsByDeveloper');
                    $delegate.getQmsStandards = jasmine.createSpy('getQmsStandards');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    $delegate.getTargetedUsers = jasmine.createSpy('getTargetedUsers');
                    $delegate.getTestFunctionality = jasmine.createSpy('getTestFunctionality');
                    $delegate.getTestStandards = jasmine.createSpy('getTestStandards');
                    $delegate.getTestTools = jasmine.createSpy('getTestTools');
                    $delegate.getUcdProcesses = jasmine.createSpy('getUcdProcesses');
                    $delegate.getUploadingCps = jasmine.createSpy('getUploadingCps');
                    $delegate.getUploadingSurveillances = jasmine.createSpy('getUploadingSurveillances');
                    $delegate.getVersionsByProduct = jasmine.createSpy('getVersionsByProduct');
                    $delegate.updateProduct = jasmine.createSpy('updateProduct');

                    return $delegate;
                });

                $provide.decorator('FileUploader', function ($delegate) {
                    return $delegate;
                });
            });

            inject(function ($controller, _commonService_, _authService_, /*_FileUploader_,*/ $compile, $rootScope, _$log_, _$q_, _Mock_, _$uibModal_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                //FileUploader = _FileUploader_;
                authService = _authService_;
                authService.getApiKey.and.returnValue($q.when('fake api key'));
                authService.getToken.and.returnValue($q.when('fake token'));
                authService.isAcbAdmin.and.returnValue($q.when(true));
                authService.isAcbStaff.and.returnValue($q.when(true));
                authService.isChplAdmin.and.returnValue($q.when(true));
                authService.isOncStaff.and.returnValue($q.when(true));
                commonService = _commonService_;
                commonService.getAccessibilityStandards.and.returnValue($q.when([]));
                commonService.getAtls.and.returnValue($q.when(mock.testingLabs));
                commonService.getCertBodies.and.returnValue($q.when(mock.certBodies));
                commonService.getCertificationStatuses.and.returnValue($q.when(mock.certificationStatuses));
                commonService.getDevelopers.and.returnValue($q.when(mock.developers));
                commonService.getEditions.and.returnValue($q.when(mock.editions));
                commonService.getPractices.and.returnValue($q.when(mock.practices));
                commonService.getProduct.and.returnValue($q.when(mock.products[0]));
                commonService.getProducts.and.returnValue($q.when(mock.products));
                commonService.getProductsByDeveloper.and.returnValue($q.when(mock.products));
                commonService.getQmsStandards.and.returnValue($q.when([]));
                commonService.getSearchOptions.and.returnValue($q.when({}));
                commonService.getTargetedUsers.and.returnValue($q.when([]));
                commonService.getTestFunctionality.and.returnValue($q.when([]));
                commonService.getTestStandards.and.returnValue($q.when([]));
                commonService.getTestTools.and.returnValue($q.when([]));
                commonService.getUcdProcesses.and.returnValue($q.when([]));
                commonService.getUploadingCps.and.returnValue($q.when(mock.uploadingCps));
                commonService.getUploadingSurveillances.and.returnValue($q.when(mock.uploadingSurveillances));
                commonService.getVersionsByProduct.and.returnValue($q.when(mock.products));

                el = angular.element('<ai-vp-management></ai-vp-management');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have developers at load', function () {
            expect(vm.developers.length).toBe(2);
        });

        it('shouldn\'t do anything if no developer is selected', function () {
            vm.selectDeveloper();
            expect(vm.activeDeveloper).toBe('');
            expect(vm.mergeDeveloper).toBeUndefined();
        });

        it('should set the activeDeveloper and call getProductsByDeveloper if there\'s one selected developer', function () {
            expect(vm.activeDeveloper).toEqual('');
            vm.developerSelect = [{developer: 'developer1'}];
            vm.selectDeveloper();
            expect(vm.activeDeveloper).toEqual([{developer: 'developer1'}]);
            expect(commonService.getProductsByDeveloper).toHaveBeenCalled();
        });

        it('should create a mergeDeveloper if more than one developer is selected', function () {
            expect(vm.mergeDeveloper).toBeUndefined();
            vm.developerSelect = {developer: 'developer1'};
            vm.mergingDevelopers = [{developer: 'developer2'}];
            vm.selectDeveloper();
            expect(vm.mergeDeveloper).toEqual({developer: 'developer1'});
        });

        it('shouldn\'t do anything if no product is selected', function () {
            vm.selectProduct();
            expect(vm.activeProduct).toBe('');
            expect(vm.mergeProduct).toBeUndefined();
        });

        it('should set the activeProduct and call getVersionsByProduct if there\'s one selected product', function () {
            expect(vm.activeProduct).toBe('');
            vm.productSelect = {product: 'product1'};
            vm.activeDeveloper = {developerId: '123'};
            vm.selectProduct();
            expect(vm.activeProduct).toEqual({product: 'product1', developerId: '123'});
            expect(commonService.getVersionsByProduct).toHaveBeenCalled();
        });

        it('should create a mergeProduct if more than one product is selected', function () {
            expect(vm.mergeProduct).toBeUndefined();
            vm.activeDeveloper = {developerId: '123'};
            vm.productSelect = {product: 'product1'};
            vm.mergingProducts = [{product: 'product1'}, {product: 'product2'}];
            vm.selectProduct();
            expect(vm.mergeProduct).toEqual({product: 'product1', developerId: '123'});
        });

        describe('splitting a Product', function () {
            it('should create a modal instance when a Product is to be split', function () {
                vm.activeProduct = mock.products[0];
                expect(vm.splitProductInstance).toBeUndefined();
                vm.splitProduct()
                expect(vm.splitProductInstance).toBeDefined();
            });

            it('should resolve the product & associated versions on a split', function () {
                var product = mock.products[0];
                vm.activeProduct = product;
                vm.versions = [1,2,3];
                vm.splitProduct()
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.product()).toEqual(mock.products[0]);
                expect(actualOptions.resolve.versions()).toEqual([1,2,3]);
            });

            it('should set the activeProduct and versions to match the returned data', function () {
                var product = mock.products[0];
                vm.products = [1,2];
                vm.activeProduct = product;
                vm.versions = [1,2,3];
                vm.splitProduct()
                vm.splitProductInstance.close({product: 'product', versions: [1,2], newProduct: 'new'});
                expect(vm.activeProduct).toEqual('product');
                expect(vm.versions).toEqual([1,2]);
                expect(vm.products[2]).toEqual('new');
            });

            it('should log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                var product = mock.products[0];
                vm.activeProduct = product;
                vm.splitProduct()
                vm.splitProductInstance.dismiss('cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should report messages if they were sent back', function () {
                var product = mock.products[0];
                vm.activeProduct = product;
                vm.splitProduct()
                vm.splitProductInstance.dismiss('split messages');
                expect(vm.productMessage).toBe('split messages');
            });
        });

        describe('editing a Listing', function () {
            var listingEditOptions;
            beforeEach(function () {
                listingEditOptions = {
                    templateUrl: 'app/admin/components/certifiedProduct/certifiedProduct/edit.html',
                    controller: 'EditCertifiedProductController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        activeCP: jasmine.any(Function),
                        isAcbAdmin: jasmine.any(Function),
                        isAcbStaff: jasmine.any(Function),
                        isChplAdmin: jasmine.any(Function),
                        resources: jasmine.any(Function),
                        workType: jasmine.any(Function)
                    }
                };
            });

            it('should create a modal instance when a Listing is to be edited', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.editCertifiedProduct()
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements on edit', function () {
                vm.editCertifiedProduct()
                expect($uibModal.open).toHaveBeenCalledWith(listingEditOptions);
                expect(actualOptions.resolve.activeCP()).toEqual('');
                actualOptions.resolve.isAcbAdmin().then(function (result) { expect(result).toEqual(true); });
                actualOptions.resolve.isAcbStaff().then(function (result) { expect(result).toEqual(true); });
                actualOptions.resolve.isChplAdmin().then(function (result) { expect(result).toEqual(true); });
                expect(actualOptions.resolve.resources()).toEqual(vm.resources);
                expect(actualOptions.resolve.workType()).toEqual(vm.workType);
                el.isolateScope().$digest();
            });

            it('should do stuff with the returned data', function () {
                var result = {id: 4};
                spyOn(vm, 'refreshDevelopers');
                spyOn(vm, 'loadCp');
                vm.editCertifiedProduct();
                vm.modalInstance.close(result);
                expect(vm.activeCP).toEqual(result);
                expect(vm.productId).toEqual(result.id);
                expect(vm.refreshDevelopers).toHaveBeenCalled();
                expect(vm.loadCp).toHaveBeenCalled();
            });

            it('should log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                vm.editCertifiedProduct();
                vm.modalInstance.dismiss('cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should report messages if they were sent back', function () {
                vm.editCertifiedProduct();
                vm.modalInstance.dismiss('cancelled');
                vm.modalInstance.dismiss('edit messages');
                expect(vm.cpMessage).toBe('edit messages');
            });
        });
    });
})();
