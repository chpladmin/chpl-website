/* eslint-disable quotes */
(function () {
    'use strict';

    describe('chpl.aiCmsWidget', function () {
        var $compile, $rootScope, vm, el, $log, mock, $httpBackend;
        mock = {
            endpoint: '/rest/certification_ids',
            searchResponse: {"products":[{"name":"ABELMed EHR - EMR / PM","productId":6836,"version":"12"},{"name":"4medica iEHR® Cloud Ambulatory Solution mark 2","productId":6493,"version":"15.10.1"},{"name":"4medica iEHR Cloud Ambulatory Suite","productId":6993,"version":"15.10"}],"metCounts":{"cqmsAmbulatoryCoreRequiredMet":7,"criteriaRequired":21,"cqmsAmbulatoryRequiredMet":3,"cqmsInpatientRequired":16,"cqmsAmbulatoryRequired":3,"domainsRequiredMet":3,"criteriaCpoeRequiredMet":1,"criteriaTocRequired":2,"domainsRequired":3,"criteriaRequiredMet":21,"cqmsInpatientRequiredMet":0,"criteriaCpoeRequired":1,"cqmsAmbulatoryCoreRequired":6,"criteriaTocRequiredMet":2},"metPercentages":{"cqmsInpatient":0,"cqmsAmbulatory":100,"cqmDomains":100,"criteriaMet":100},"year":"2014","isValid":true},
            createResponse: {"products":[{"name":"ABELMed EHR - EMR / PM","productId":6836,"version":"12"},{"name":"4medica iEHR® Cloud Ambulatory Solution mark 2","productId":6493,"version":"15.10.1"},{"name":"4medica iEHR Cloud Ambulatory Suite","productId":6993,"version":"15.10"}],"ehrCertificationId":"0014EPZ0UHS6DFR","metCounts":{"cqmsAmbulatoryCoreRequiredMet":7,"criteriaRequired":21,"cqmsAmbulatoryRequiredMet":3,"cqmsInpatientRequired":16,"cqmsAmbulatoryRequired":3,"domainsRequiredMet":3,"criteriaCpoeRequiredMet":1,"criteriaTocRequired":2,"domainsRequired":3,"criteriaRequiredMet":21,"cqmsInpatientRequiredMet":0,"criteriaCpoeRequired":1,"cqmsAmbulatoryCoreRequired":6,"criteriaTocRequiredMet":2},"metPercentages":{"cqmsInpatient":0,"cqmsAmbulatory":100,"cqmDomains":100,"criteriaMet":100},"year":"2014","isValid":true},
        };

        beforeEach(function () {
            module('chpl.cms-widget');
            inject(function (_$compile_, _$httpBackend_, _$log_, _$rootScope_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $httpBackend = _$httpBackend_;

                el = angular.element('<ai-cms-widget></ai-cms-widget>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.debug("\n Debug: " + $log.debug.logs.join("\n Debug: "));
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toEqual(null);
        });

        it('should have isolate scope object with instanciate members', function () {
            expect(vm).toEqual(jasmine.any(Object));
            expect(vm.widget).toEqual({productIds: []});
        });

        describe('adding products to the list', function () {
            it('should have a way to add product IDs to the array', function () {
                vm.addProduct(1);
                expect(vm.widget.productIds).toEqual([1]);
                vm.addProduct(1);
                expect(vm.widget.productIds).toEqual([1]);
                vm.addProduct(2);
                expect(vm.widget.productIds).toEqual([1,2]);
            });

            it('should call the /search endpoint when a product is added', function () {
                spyOn(vm,'search');
                vm.addProduct(1);
                expect(vm.search).toHaveBeenCalled();
            });

            it('should not call the /search endpoint when a duplicate product is added', function () {
                vm.widget.productIds = [1];
                spyOn(vm,'search');
                vm.addProduct(1);
                expect(vm.search).not.toHaveBeenCalled();
            });
        });

        describe('clearing Product IDs', function () {
            beforeEach(function () {
                vm.widget.productIds = [1,2,3];
            });

            it('should have a way to remove product IDs from the array', function () {
                expect(vm.widget.productIds).toEqual([1,2,3]);
                vm.removeProduct(1);
                expect(vm.widget.productIds).toEqual([2,3]);
                vm.removeProduct(1);
                expect(vm.widget.productIds).toEqual([2,3]);
            });

            it('should treat coerce strings to numbers as IDs', function () {
                vm.removeProduct('1');
                expect(vm.widget.productIds).toEqual([2,3]);
            });

            it('should call the /search endpoint when a product is removed', function () {
                spyOn(vm,'search');
                vm.removeProduct(1);
                expect(vm.search).toHaveBeenCalled();
            });

            it('should not call the /search endpoint when a product is removed that doesn\'t exist', function () {
                spyOn(vm,'search');
                vm.removeProduct(4);
                expect(vm.search).not.toHaveBeenCalled();
            });

            it('should have a way to clear all the product IDs', function () {
                vm.clearProducts();
                expect(vm.widget).toEqual({productIds: []});
            });
        });

        it('should have a way to toggle the state of a productId', function () {
            vm.widget.productIds = [1,2,3];
            vm.toggleProduct(3);
            vm.toggleProduct(4);
            expect(vm.widget.productIds).toEqual([1,2,4]);
        });

        describe('back end interaction', function () {
            beforeEach(function () {
                vm.widget.productIds = [1,2,3];
                $httpBackend.whenGET(mock.endpoint + '/search?ids=1,2,3')
                    .respond(mock.searchResponse);
                $httpBackend.whenPOST(mock.endpoint + '/create?ids=1,2,3')
                    .respond(mock.createResponse);
            });

            it('should call the search endpoint on search', function () {
                vm.search();
                $httpBackend.flush();
            });

            it('should not call the search endpoint on search if there aren\'t any ids', function () {
                vm.widget.productIds = [];
                vm.search();
            });

            it('should set widget.searchResult to empty there aren\'t any ids', function () {
                vm.widget.productIds = [];
                vm.search();
                expect(vm.widget.searchResult).toEqual({});
            });

            it('should set the vm.products on search', function () {
                vm.search();
                $httpBackend.flush();
                expect(vm.widget.searchResult.products).toEqual(mock.searchResponse.products);
            });

            it('should send the ids the vm.products on create', function () {
                vm.create();
                $httpBackend.flush();
                expect(vm.widget.createResponse.products).toEqual(mock.createResponse.products);
            });
        });
    });
})();
