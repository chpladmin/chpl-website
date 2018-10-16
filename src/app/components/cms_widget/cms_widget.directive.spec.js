(function () {
    'use strict';

    describe('chpl.aiCmsWidget', function () {
        var $compile, $httpBackend, $log, $rootScope, el, mock, vm;
        /* eslint-disable quotes */
        mock = {
            endpoint: '/rest/certification_ids',
            searchResponse: {"products": [{"name": "ABELMed EHR - EMR / PM","productId": 6836,"version": "12"},{"name": "4medica iEHR® Cloud Ambulatory Solution mark 2","productId": 6493,"version": "15.10.1"},{"name": "4medica iEHR Cloud Ambulatory Suite","productId": 6993,"version": "15.10"}],"metCounts": {"cqmsAmbulatoryCoreRequiredMet": 7,"criteriaRequired": 21,"cqmsAmbulatoryRequiredMet": 3,"cqmsInpatientRequired": 16,"cqmsAmbulatoryRequired": 3,"domainsRequiredMet": 3,"criteriaCpoeRequiredMet": 1,"criteriaTocRequired": 2,"domainsRequired": 3,"criteriaRequiredMet": 21,"cqmsInpatientRequiredMet": 0,"criteriaCpoeRequired": 1,"cqmsAmbulatoryCoreRequired": 6,"criteriaTocRequiredMet": 2},"metPercentages": {"cqmsInpatient": 0,"cqmsAmbulatory": 100,"cqmDomains": 100,"criteriaMet": 100},"year": "2014","isValid": true,"missingAnd": [],"missingOr": [],"missingCombo": [],"missingXOr": []},
            createResponse: {"products": [{"name": "ABELMed EHR - EMR / PM","productId": 6836,"version": "12"},{"name": "4medica iEHR® Cloud Ambulatory Solution mark 2","productId": 6493,"version": "15.10.1"},{"name": "4medica iEHR Cloud Ambulatory Suite","productId": 6993,"version": "15.10"}],"ehrCertificationId": "0014EPZ0UHS6DFR","metCounts": {"cqmsAmbulatoryCoreRequiredMet": 7,"criteriaRequired": 21,"cqmsAmbulatoryRequiredMet": 3,"cqmsInpatientRequired": 16,"cqmsAmbulatoryRequired": 3,"domainsRequiredMet": 3,"criteriaCpoeRequiredMet": 1,"criteriaTocRequired": 2,"domainsRequired": 3,"criteriaRequiredMet": 21,"cqmsInpatientRequiredMet": 0,"criteriaCpoeRequired": 1,"cqmsAmbulatoryCoreRequired": 6,"criteriaTocRequiredMet": 2},"metPercentages": {"cqmsInpatient": 0,"cqmsAmbulatory": 100,"cqmDomains": 100,"criteriaMet": 100},"year": "2014","isValid": true,"missingAnd": [],"missingOr": [],"missingCombo": [],"missingXOr": []},
            response2015: {"products": [{"name": "(SQI) Solution For Quality Improvement","productId": 9261,"version": "v4.6.9.25"}],"ehrCertificationId": null,"metCounts": {"criteriaDpRequired": 1,"cqmsAmbulatoryCoreRequiredMet": 0,"criteriaRequired": 15,"cqmsAmbulatoryRequiredMet": 0,"cqmsInpatientRequired": 0,"cqmsAmbulatoryRequired": 0,"domainsRequiredMet": 0,"criteriaCpoeRequiredMet": 0,"domainsRequired": 0,"criteriaRequiredMet": 0,"cqmsInpatientRequiredMet": 0,"criteriaCpoeRequired": 1,"criteriaDpRequiredMet": 0,"cqmsAmbulatoryCoreRequired": 0},"metPercentages": {"cqmsInpatient": 0,"cqmsAmbulatory": 0,"cqmDomains": 0,"criteriaMet": 0},"missingAnd": ["170.315 (a)(5)","170.315 (a)(6)","170.315 (a)(7)","170.315 (a)(8)","170.315 (a)(9)","170.315 (a)(11)","170.315 (a)(14)","170.315 (c)(1)","170.315 (b)(1)","170.315 (b)(6)","170.315 (g)(7)","170.315 (g)(8)","170.315 (g)(9)"],"missingOr": [["170.315 (a)(1)","170.315 (a)(2)","170.315 (a)(3)"],["170.315 (h)(1)","170.315 (h)(2)"]],"year": "2015","isValid": false},
            response2014: {"products": [{"name": "Centricity Perinatal (CPN) 6.94.2","productId": 385,"version": "R694200004"}],"ehrCertificationId": null,"metCounts": {"cqmsAmbulatoryCoreRequiredMet": 0,"criteriaRequired": 21,"cqmsAmbulatoryRequiredMet": 0,"cqmsInpatientRequired": 16,"cqmsAmbulatoryRequired": 3,"domainsRequiredMet": 0,"criteriaCpoeRequiredMet": 0,"criteriaTocRequired": 2,"domainsRequired": 3,"criteriaRequiredMet": 2,"cqmsInpatientRequiredMet": 0,"criteriaCpoeRequired": 1,"cqmsAmbulatoryCoreRequired": 6,"criteriaTocRequiredMet": 0},"metPercentages": {"cqmsInpatient": 0,"cqmsAmbulatory": 0,"cqmDomains": 0,"criteriaMet": 9},"missingAnd": ["170.314 (a)(5)","170.314 (a)(6)","170.314 (a)(7)","170.314 (a)(8)","170.314 (b)(7)","170.314 (c)(1)","170.314 (c)(2)","170.314 (c)(3)","170.314 (d)(1)","170.314 (d)(2)","170.314 (d)(3)","170.314 (d)(4)","170.314 (d)(5)","170.314 (d)(6)","170.314 (d)(7)","170.314 (d)(8)"],"missingOr": [["170.314 (a)(1)","170.314 (a)(18)","170.314 (a)(19)","170.314 (a)(20)"]],"missingCombo": [["170.314(b)(1)","170.314(b)(2)","170.314(b)(8)","170.314(h)(1)"],["170.314(b)(1)","170.314(b)(2)","170.314(h)(1)"],["170.314(b)(1)","170.314(b)(2)","170.314(b)(8)"],["170.314(b)(8)","170.314(h)(1)"],["170.314(b)(1)","170.314(b)(2)"]],"missingXOr": [{"6": ["CMS2","CMS50","CMS68","CMS69","CMS75","CMS90","CMS117","CMS126","CMS136","CMS138","CMS146","CMS153","CMS154","CMS155","CMS156","CMS165","CMS166"]},{"16": ["CMS9","CMS26","CMS30","CMS31","CMS32","CMS53","CMS55","CMS60","CMS71","CMS72","CMS73","CMS91","CMS100","CMS102","CMS104","CMS105","CMS107","CMS108","CMS109","CMS110","CMS111","CMS113","CMS114","CMS171","CMS172","CMS178","CMS185","CMS188","CMS190"]}],"year": "2014","isValid": false},
            response2014Added: {"products": [{"name": "Centricity Perinatal (CPN) 6.94.2","productId": 385,"version": "R694200004"},{"name": "Agility EHR","productId": 8137,"version": "10.12"}],"ehrCertificationId": null,"metCounts": {"cqmsAmbulatoryCoreRequiredMet": 8,"criteriaRequired": 21,"cqmsAmbulatoryRequiredMet": 1,"cqmsInpatientRequired": 16,"cqmsAmbulatoryRequired": 3,"domainsRequiredMet": 3,"criteriaCpoeRequiredMet": 1,"criteriaTocRequired": 2,"domainsRequired": 3,"criteriaRequiredMet": 21,"cqmsInpatientRequiredMet": 0,"criteriaCpoeRequired": 1,"cqmsAmbulatoryCoreRequired": 6,"criteriaTocRequiredMet": 2},"metPercentages": {"cqmsInpatient": 0,"cqmsAmbulatory": 100,"cqmDomains": 100,"criteriaMet": 100},"missingAnd": [],"missingOr": [],"missingCombo": [],"missingXOr": [{"0": ["CMS2","CMS50","CMS68","CMS69","CMS75","CMS90","CMS117","CMS126","CMS136","CMS138","CMS146","CMS153","CMS154","CMS155","CMS156","CMS165","CMS166","CMS22","CMS52","CMS56","CMS61","CMS62","CMS64","CMS65","CMS66","CMS74","CMS77","CMS82","CMS122","CMS123","CMS124","CMS125","CMS127","CMS128","CMS129","CMS130","CMS131","CMS132","CMS133","CMS134","CMS135","CMS137","CMS139","CMS140","CMS141","CMS142","CMS143","CMS144","CMS145","CMS147","CMS148","CMS149","CMS157","CMS158","CMS159","CMS160","CMS161","CMS163","CMS164","CMS167","CMS169","CMS177","CMS179","CMS182"]},{"16": ["CMS9","CMS26","CMS30","CMS31","CMS32","CMS53","CMS55","CMS60","CMS71","CMS72","CMS73","CMS91","CMS100","CMS102","CMS104","CMS105","CMS107","CMS108","CMS109","CMS110","CMS111","CMS113","CMS114","CMS171","CMS172","CMS178","CMS185","CMS188","CMS190"]}],"year": "2014","isValid": true},
        };
        /* eslint-enable quotes */

        beforeEach(function () {
            angular.mock.module('chpl.components', 'chpl.services');
            inject(function (_$compile_, _$httpBackend_, $localStorage, _$log_, _$rootScope_) {
                $compile = _$compile_;
                $rootScope = _$rootScope_;
                $log = _$log_;
                $httpBackend = _$httpBackend_;

                delete $localStorage.cmsWidget;

                el = angular.element('<ai-cms-widget></ai-cms-widget>');

                $compile(el)($rootScope.$new());
                $rootScope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should be compiled', function () {
            expect(el.html()).not.toBeNull();
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
                spyOn(vm, 'search');
                vm.addProduct(1);
                expect(vm.search).toHaveBeenCalled();
            });

            it('should not call the /search endpoint when a duplicate product is added', function () {
                vm.widget.productIds = [1];
                spyOn(vm, 'search');
                vm.addProduct(1);
                expect(vm.search).not.toHaveBeenCalled();
            });
        });

        describe('adding 2015 products to the list', function () {
            it('should show missing criteria', function () {
                vm.addProduct(3);
                expect(vm.widget.productIds).toEqual([3]);
                expect(vm.widget.searchResult.missingAnd).not.toBeNull();
                expect(vm.widget.searchResult.missingOr).not.toBeNull();
            });
        });

        describe('adding 2014 products to the list', function () {
            it('should show missing criteria', function () {
                vm.addProduct(4);
                expect(vm.widget.productIds).toEqual([4]);
                expect(vm.widget.searchResult.missingAnd).not.toBeNull();
                expect(vm.widget.searchResult.missingOr).not.toBeNull();
                expect(vm.widget.searchResult.missingCombo).not.toBeNull();
                expect(vm.widget.searchResult.missingXOr).not.toBeNull();
            });

            it('should show missing criteria', function () {
                vm.addProduct(5);
                expect(vm.widget.productIds).toEqual([5]);
                expect(vm.widget.searchResult.missingAnd).toBeUndefined();
                expect(vm.widget.searchResult.missingOr).toBeUndefined();
                expect(vm.widget.searchResult.missingCombo).toBeUndefined();
                expect(vm.widget.searchResult.missingXOr).not.toBeNull();
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
                spyOn(vm, 'search');
                vm.removeProduct(1);
                expect(vm.search).toHaveBeenCalled();
            });

            it('should not call the /search endpoint when a product is removed that doesn\'t exist', function () {
                spyOn(vm, 'search');
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

        describe('when comparing objects', () => {
            const products = [
                { name: 'a name', productId: 1 },
                { name: '2nd name', productId: 2 },
            ];
            const payload = products.map((item) => { return { name: item.name, productId: item.productId + ''}; });

            it('should broadcast comparing products', () => {
                spyOn($rootScope, '$broadcast');
                vm.widget.searchResult = {
                    products: products,
                }
                vm.compare();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('compareAll', payload);
            });

            it('should broadcast "close widget"', () => {
                spyOn($rootScope, '$broadcast');
                vm.widget.searchResult = {
                    products: products,
                }
                vm.compare();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('HideWidget');
            });

            it('should broadcast "show compare widget"', () => {
                spyOn($rootScope, '$broadcast');
                vm.widget.searchResult = {
                    products: products,
                }
                vm.compare();
                expect($rootScope.$broadcast).toHaveBeenCalledWith('ShowCompareWidget');
            });
        });
    });
})();
