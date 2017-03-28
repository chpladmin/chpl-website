(function () {
    'use strict';

    describe('chpl.cms_lookup', function () {

        var $log, scope, vm, $localStorage, $q, commonService, mock;

        mock = {
            localStorage: {
                lookupCertIds: 'A014E01O3PSTEAV A014E01O3PSTEAV A014E01O3PSTEA7 NOTANID',
                lookupProducts: [{id:296,name:'2013 Systemedx Clinical Navigator',version:'2013.12',chplProductNumber:'CHP-022218',year:'2014',practiceType:'Ambulatory',acb:'InfoGard',vendor:'Systemedx Inc',classification:'Complete EHR',additionalSoftware:'Microsoft+SQL+Server+for+all+criteria',certificationId:'A014E01O3PSTEAV',certificationIdEdition:'2014'}],
                lookupProductsCertIdNotFound: ["A014E01O3PSTEA7"],
                lookupProductsFormatInvalidIds: ["NOTANID"]
            },
            goodResponse: {"products":[{"id":296,"name":"2013 Systemedx Clinical Navigator","version":"2013.12","chplProductNumber":"CHP-022218","year":"2014","practiceType":"Ambulatory","acb":"InfoGard","vendor":"Systemedx Inc","classification":"Complete EHR","additionalSoftware":"Microsoft+SQL+Server+for+all+criteria"}],"ehrCertificationId":"A014E01O3PSTEAV","year":"2014","criteria":null,"cqms":null},
            badResponse: {"products":[],"ehrCertificationId":null,"year":null,"criteria":null,"cqms":null}
        };

        beforeEach(function () {
            module('chpl.cms_lookup', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.lookupCertificationId = jasmine.createSpy('lookupCertificationId');
                    return $delegate;
                });
            });

            inject(function ($controller, $rootScope, _$log_, _$localStorage_, _$q_, _commonService_) {
                $log = _$log_;
                $localStorage = _$localStorage_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.lookupCertificationId.and.returnValue($q.when(mock.goodResponse));

                scope = $rootScope.$new();
                vm = $controller('CmsLookupController', {
                    $scope: scope
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
                expect(commonService.lookupCertificationId).not.toHaveBeenCalled();

                vm.certIds = '';
                vm.lookupCertIds();
                expect(commonService.lookupCertificationId).not.toHaveBeenCalled();
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
                    expect(commonService.lookupCertificationId.calls.count()).toBe(1);
                });

                it('should list the ids that are in an invalid format', function () {
                    vm.certIds = 'NOTANID';
                    vm.lookupCertIds();
                    expect(vm.lookupProductsFormatInvalidIds).toEqual(['NOTANID']);
                });

                it('should list the ids that were not found', function () {
                    vm.certIds = 'A014E01O3PSTEA7';
                    commonService.lookupCertificationId.and.returnValue($q.when(mock.badResponse));
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
                    commonService.lookupCertificationId.and.returnValue($q.reject({status: 500}));
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
    });
})();
