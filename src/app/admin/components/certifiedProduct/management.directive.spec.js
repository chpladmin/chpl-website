(function () {
    'use strict';

    describe('chpl.admin.listing.management.directive', function () {
        var $log, $q, $uibModal, Mock, actualOptions, authService, el, mock, networkService, vm;

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
            templateUrl: 'chpl.admin/components/certifiedProduct/product/split.html',
            controller: 'SplitProductController',
            controllerAs: 'vm',
            animation: false,
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            resolve: {
                product: jasmine.any(Function),
                versions: jasmine.any(Function),
            },
        };

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.admin', function ($provide) {
                $provide.decorator('authService', function ($delegate) {
                    $delegate.getApiKey = jasmine.createSpy('getApiKey');
                    $delegate.getToken = jasmine.createSpy('getToken');
                    $delegate.hasAnyRole = jasmine.createSpy('hasAnyRole');

                    return $delegate;
                });

                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getAccessibilityStandards = jasmine.createSpy('getAccessibilityStandards');
                    $delegate.getAcbs = jasmine.createSpy('getAcbs');
                    $delegate.getAtls = jasmine.createSpy('getAtls');
                    $delegate.getCertBodies = jasmine.createSpy('getCertBodies');
                    $delegate.getCertificationStatuses = jasmine.createSpy('getCertificationStatuses');
                    $delegate.getCollection = jasmine.createSpy('getCollection');
                    $delegate.getDevelopers = jasmine.createSpy('getDevelopers');
                    $delegate.getEditions = jasmine.createSpy('getEditions');
                    $delegate.getMeasures = jasmine.createSpy('getMeasures');
                    $delegate.getMeasureTypes = jasmine.createSpy('getMeasureTypes');
                    $delegate.getPendingListings = jasmine.createSpy('getPendingListings');
                    $delegate.getPractices = jasmine.createSpy('getPractices');
                    $delegate.getListing = jasmine.createSpy('getListing');
                    $delegate.getProducts = jasmine.createSpy('getProducts');
                    $delegate.getProductsByDeveloper = jasmine.createSpy('getProductsByDeveloper');
                    $delegate.getQmsStandards = jasmine.createSpy('getQmsStandards');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    $delegate.getTargetedUsers = jasmine.createSpy('getTargetedUsers');
                    $delegate.getTestData = jasmine.createSpy('getTestData');
                    $delegate.getTestFunctionality = jasmine.createSpy('getTestFunctionality');
                    $delegate.getTestProcedures = jasmine.createSpy('getTestProcedures');
                    $delegate.getTestStandards = jasmine.createSpy('getTestStandards');
                    $delegate.getTestTools = jasmine.createSpy('getTestTools');
                    $delegate.getUcdProcesses = jasmine.createSpy('getUcdProcesses');
                    $delegate.getUploadingSurveillances = jasmine.createSpy('getUploadingSurveillances');
                    $delegate.getVersionsByProduct = jasmine.createSpy('getVersionsByProduct');
                    $delegate.massRejectPendingListings = jasmine.createSpy('massRejectPendingListings');
                    $delegate.massRejectPendingSurveillance = jasmine.createSpy('massRejectPendingSurveillance');
                    $delegate.rejectPendingCp = jasmine.createSpy('rejectPendingCp');
                    $delegate.updateProduct = jasmine.createSpy('updateProduct');

                    return $delegate;
                });
            });

            inject(function ($compile, $controller, _$log_, _$q_, $rootScope, _$uibModal_, _Mock_, _authService_, _networkService_) {
                $log = _$log_;
                $q = _$q_;
                Mock = _Mock_;
                $uibModal = _$uibModal_;
                spyOn($uibModal, 'open').and.callFake(function (options) {
                    actualOptions = options;
                    return Mock.fakeModal;
                });
                authService = _authService_;
                authService.getApiKey.and.returnValue('fake api key');
                authService.getToken.and.returnValue('fake token');
                authService.hasAnyRole.and.returnValue(true);
                networkService = _networkService_;
                networkService.getAccessibilityStandards.and.returnValue($q.when([]));
                networkService.getAcbs.and.returnValue($q.when({}));
                networkService.getAtls.and.returnValue($q.when(mock.testingLabs));
                networkService.getCertBodies.and.returnValue($q.when(mock.certBodies));
                networkService.getCertificationStatuses.and.returnValue($q.when(mock.certificationStatuses));
                networkService.getCollection.and.returnValue($q.when([]));
                networkService.getDevelopers.and.returnValue($q.when(mock.developers));
                networkService.getEditions.and.returnValue($q.when(mock.editions));
                networkService.getPractices.and.returnValue($q.when(mock.practices));
                networkService.getListing.and.returnValue($q.when(mock.products[0]));
                networkService.getMeasures.and.returnValue($q.when({}));
                networkService.getMeasureTypes.and.returnValue($q.when({}));
                networkService.getProducts.and.returnValue($q.when(mock.products));
                networkService.getProductsByDeveloper.and.returnValue($q.when(mock.products));
                networkService.getQmsStandards.and.returnValue($q.when([]));
                networkService.getSearchOptions.and.returnValue($q.when({}));
                networkService.getTargetedUsers.and.returnValue($q.when([]));
                networkService.getTestData.and.returnValue($q.when({data: []}));
                networkService.getTestFunctionality.and.returnValue($q.when({data: []}));
                networkService.getTestProcedures.and.returnValue($q.when({data: []}));
                networkService.getTestStandards.and.returnValue($q.when({data: []}));
                networkService.getTestTools.and.returnValue($q.when([]));
                networkService.getUcdProcesses.and.returnValue($q.when([]));
                networkService.getPendingListings.and.returnValue($q.when(mock.uploadingCps));
                networkService.getUploadingSurveillances.and.returnValue($q.when(mock.uploadingSurveillances));
                networkService.getVersionsByProduct.and.returnValue($q.when(mock.products));
                networkService.massRejectPendingListings.and.returnValue($q.when({}));
                networkService.massRejectPendingSurveillance.and.returnValue($q.when({}));
                networkService.rejectPendingCp.and.returnValue($q.when({}));

                el = angular.element('<ai-vp-management></ai-vp-management');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
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
            expect(networkService.getProductsByDeveloper).toHaveBeenCalled();
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
            expect(networkService.getVersionsByProduct).toHaveBeenCalled();
        });

        describe('splitting a Product', function () {
            it('should create a modal instance when a Product is to be split', function () {
                vm.activeProduct = mock.products[0];
                expect(vm.splitProductInstance).toBeUndefined();
                vm.splitProduct();
                expect(vm.splitProductInstance).toBeDefined();
            });

            it('should resolve the product & associated versions on a split', function () {
                var product = mock.products[0];
                vm.activeProduct = product;
                vm.versions = [1,2,3];
                vm.splitProduct();
                expect($uibModal.open).toHaveBeenCalledWith(mock.fakeModalOptions);
                expect(actualOptions.resolve.product()).toEqual(mock.products[0]);
                expect(actualOptions.resolve.versions()).toEqual([1,2,3]);
            });

            it('should set the activeProduct and versions to match the returned data', function () {
                var product = mock.products[0];
                vm.products = [1,2];
                vm.activeProduct = product;
                vm.versions = [1,2,3];
                vm.splitProduct();
                vm.splitProductInstance.close({product: 'product', versions: [1,2], newProduct: 'new'});
                expect(vm.activeProduct).toEqual('product');
                expect(vm.versions).toEqual([1,2]);
                expect(vm.products[2]).toEqual('new');
            });

            it('should log a cancelled modal', function () {
                var logCount = $log.info.logs.length;
                var product = mock.products[0];
                vm.activeProduct = product;
                vm.splitProduct();
                vm.splitProductInstance.dismiss('cancelled');
                expect($log.info.logs.length).toBe(logCount + 1);
            });

            it('should report messages if they were sent back', function () {
                var product = mock.products[0];
                vm.activeProduct = product;
                vm.splitProduct();
                vm.splitProductInstance.dismiss('split messages');
                expect(vm.productMessage).toBe('split messages');
            });
        });

        describe('editing a Listing', function () {
            var listingEditOptions;
            beforeEach(function () {
                listingEditOptions = {
                    templateUrl: 'chpl.admin/components/certifiedProduct/listing/edit.html',
                    controller: 'EditCertifiedProductController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        activeCP: jasmine.any(Function),
                        isAcbAdmin: jasmine.any(Function),
                        isChplAdmin: jasmine.any(Function),
                        resources: jasmine.any(Function),
                        workType: jasmine.any(Function),
                    },
                };
            });

            it('should create a modal instance when a Listing is to be edited', function () {
                expect(vm.modalInstance).toBeUndefined();
                vm.editCertifiedProduct();
                expect(vm.modalInstance).toBeDefined();
            });

            it('should resolve elements on edit', function () {
                vm.editCertifiedProduct();
                expect($uibModal.open).toHaveBeenCalledWith(listingEditOptions);
                expect(actualOptions.resolve.activeCP()).toEqual('');
                expect(actualOptions.resolve.isAcbAdmin()).toEqual(true);
                expect(actualOptions.resolve.isChplAdmin()).toEqual(true);
                expect(actualOptions.resolve.resources()).toEqual(vm.resources);
                expect(actualOptions.resolve.workType()).toEqual('manage');
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
