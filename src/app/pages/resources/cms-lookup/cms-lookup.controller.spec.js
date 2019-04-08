(function () {
    'use strict';

    describe('chpl.cms_lookup', function () {

        var $localStorage, $log, $q, mock, networkService, scope, utilService, vm;

        mock = {
            localStorage: {
                lookupCertIds: 'A014E01O3PSTEAV A014E01O3PSTEAV A014E01O3PSTEA7 NOTANID',
                lookupProducts: [{id: 296, name: '2013 Systemedx Clinical Navigator', version: '2013.12', chplProductNumber: 'CHP-022218', year: '2014', practiceType: 'Ambulatory', acb: 'UL LLC', vendor: 'Systemedx Inc', classification: 'Complete EHR', additionalSoftware: 'Microsoft+SQL+Server+for+all+criteria', certificationId: 'A014E01O3PSTEAV', certificationIdEdition: '2014'}],
                lookupProductsCertIdNotFound: ['A014E01O3PSTEA7'],
                lookupProductsFormatInvalidIds: ['NOTANID'],
            },
            goodResponse: {'products': [{'id': 296,'name': '2013 Systemedx Clinical Navigator','version': '2013.12','chplProductNumber': 'CHP-022218','year': '2014','practiceType': 'Ambulatory','acb': 'UL LLC','vendor': 'Systemedx Inc','classification': 'Complete EHR','additionalSoftware': 'Microsoft+SQL+Server+for+all+criteria'}],'ehrCertificationId': 'A014E01O3PSTEAV','year': '2014','criteria': null,'cqms': null},
            badResponse: {'products': [],'ehrCertificationId': null,'year': null,'criteria': null,'cqms': null},
            csvData: {
                name: 'CMS_ID.A014E01O3PSTEAV.csv',
                values: [
                    ['CMS EHR Certification ID', 'CMS EHR Certification ID Edition', 'Product Name', 'Version', 'Developer', 'CHPL Product Number', 'Product Certification Edition', 'Classification Type', 'Practice Type'],
                    ['A014E01O3PSTEAV', '2014', '2013 Systemedx Clinical Navigator', '2013.12', 'Systemedx Inc', 'CHP-022218', '2014', 'Complete EHR', 'Ambulatory'],
                ],
            },
        };

        beforeEach(function () {
            angular.mock.module('chpl.cms_lookup', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.lookupCertificationId = jasmine.createSpy('lookupCertificationId');
                    return $delegate;
                });
                $provide.decorator('utilService', function ($delegate) {
                    $delegate.makeCsv = jasmine.createSpy('makeCsv');
                    return $delegate;
                });
            });

            inject(function ($controller, _$localStorage_, _$log_, _$q_, $rootScope, _networkService_, _utilService_) {
                $log = _$log_;
                $localStorage = _$localStorage_;
                $localStorage.lookupCertIds = null;
                $localStorage.lookupProducts = null;
                $q = _$q_;
                networkService = _networkService_;
                networkService.lookupCertificationId.and.returnValue($q.when(mock.goodResponse));
                utilService = _utilService_;
                utilService.makeCsv.and.returnValue();

                scope = $rootScope.$new();
                vm = $controller('CmsLookupController', {
                    $scope: scope,
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                //console.log('Debug log, ' + $log.debug.logs.length + ' length:\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('the controller should exist', function () {
            expect(vm).toBeDefined();
        });

        describe('the cms lookup parsing function', function () {
            it('should only do something if there are certIds to parse', function () {
                vm.certIds = undefined;
                vm.lookupCertIds();
                expect(networkService.lookupCertificationId).not.toHaveBeenCalled();

                vm.certIds = '';
                vm.lookupCertIds();
                expect(networkService.lookupCertificationId).not.toHaveBeenCalled();
            });

            it('should convert certIds', function () {
                vm.certIds = 'as,;   b3';
                vm.lookupCertIds();
                expect(vm.certIds).toBe('AS B3');
            });

            it('should clear localstorage certIds if certids is empty', function () {
                $localStorage.lookupCertIds = 'old';
                vm.certIds = '  ';
                vm.lookupCertIds();
                expect($localStorage.lookupCertIds).toBeUndefined();
                expect(vm.certIds).toBe(null);
            });

            describe('the service interaction', function () {
                it('should only lookup IDs once', function () {
                    vm.certIds = 'A014E01O3PSTEAV A014E01O3PSTEAV';
                    vm.lookupCertIds();
                    expect(networkService.lookupCertificationId.calls.count()).toBe(1);
                });

                it('should list the ids that are in an invalid format', function () {
                    vm.certIds = 'NOTANID';
                    vm.lookupCertIds();
                    expect(vm.lookupProductsFormatInvalidIds).toEqual(['NOTANID']);
                });

                it('should list the ids that were not found', function () {
                    vm.certIds = 'A014E01O3PSTEA7';
                    networkService.lookupCertificationId.and.returnValue($q.when(mock.badResponse));
                    vm.lookupCertIds();
                    scope.$digest();
                    expect(vm.lookupProductsCertIdNotFound).toEqual(['A014E01O3PSTEA7']);
                    expect($localStorage.lookupProductsCertIdNotFound).toEqual(['A014E01O3PSTEA7']);
                });

                it('should list the products that make up an ID', function () {
                    vm.certIds = 'A014E01O3PSTEAV';
                    vm.lookupCertIds();
                    scope.$digest();
                    expect(vm.lookupProducts).toEqual(mock.localStorage.lookupProducts);
                });

                it('should save stuff in localStorage', function () {
                    vm.certIds = 'A014E01O3PSTEAV NOTANID';
                    vm.lookupCertIds();
                    scope.$digest();
                    expect($localStorage.lookupProducts).toEqual(mock.localStorage.lookupProducts);
                    expect($localStorage.lookupProductsFormatInvalidIds).toEqual(mock.localStorage.lookupProductsFormatInvalidIds);
                });

                it('should clear stuff if the response fails', function () {
                    $localStorage.lookupProducts = 'fake';
                    $localStorage.lookupProductsFormatInvalidIds = 'fake';
                    $localStorage.lookupProductsCertIdNotFound = 'fake';
                    vm.lookupProducts = [];
                    networkService.lookupCertificationId.and.returnValue($q.reject({status: 500}));
                    vm.certIds = 'A014E01O3PSTEAV A014E01O3PSTEAV NOTANID A014E01O3PSTEA7';
                    vm.lookupCertIds();
                    scope.$digest();
                    expect($localStorage.lookupProducts).toBeUndefined();
                    expect($localStorage.lookupProductsFormatInvalidIds).toBeUndefined();
                    expect($localStorage.lookupProductsCertIdNotFound).toBeUndefined();
                    expect(vm.lookupProducts).toBe(null);
                });
            });
        });

        describe('getting a csv', function () {
            it('should build the csv object', function () {
                vm.certIds = 'A014E01O3PSTEAV';
                vm.lookupCertIds();
                scope.$digest();
                expect(vm.csvData).toEqual(mock.csvData);
            });

            it('should call the networkService to convert JSON -> CSV', function () {
                vm.certIds = 'A014E01O3PSTEAV';
                vm.lookupCertIds();
                scope.$digest();
                vm.getCsv();
                expect(utilService.makeCsv).toHaveBeenCalledWith(mock.csvData);
            });

            it('should only have the CMS ID once in the filename', function () {
                var multIdResponse = {'products': [
                    {'id': 296,'name': '2013 Systemedx Clinical Navigator','version': '2013.12','chplProductNumber': 'CHP-022218','year': '2014','practiceType': 'Ambulatory','acb': 'UL LLC','vendor': 'Systemedx Inc','classification': 'Complete EHR','additionalSoftware': 'Microsoft+SQL+Server+for+all+criteria'},
                    {'id': 296,'name': '2013 Systemedx Clinical Navigator','version': '2013.12','chplProductNumber': 'CHP-022218','year': '2014','practiceType': 'Ambulatory','acb': 'UL LLC','vendor': 'Systemedx Inc','classification': 'Complete EHR','additionalSoftware': 'Microsoft+SQL+Server+for+all+criteria'},
                ],'ehrCertificationId': 'A014E01O3PSTEAV','year': '2014','criteria': null,'cqms': null};
                networkService.lookupCertificationId.and.returnValue($q.when(multIdResponse));
                vm.certIds = 'A014E01O3PSTEAV';
                vm.lookupCertIds();
                scope.$digest();
                expect(vm.csvData.name).toBe('CMS_ID.A014E01O3PSTEAV.csv');
            });
        });
    });
})();
