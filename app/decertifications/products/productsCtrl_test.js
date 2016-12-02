(function() {
    'use strict';

    describe('decertifications.products.controller', function() {
        var vm, scope, ctrl, $log, $timeout, $q, commonService, mock;
        mock = {
            decertifiedProducts: [
                {
                    acb: {name: 'acb1'},
                    certificationDate: new Date('03/19/2013'),
                    chplProductNumber: 'CHP-123123',
                    developer: {name: 'dev 1'},
                    edition: {name: '2014'},
                    estimatedUsers: 4,
                    product: {name: 'prod 1'},
                    status: {name: 'status 1'},
                    version: {name: 'ver 1'}
                },{
                    acb: {name: 'acb2'},
                    certificationDate: new Date('03/29/2015'),
                    chplProductNumber: '15.01.02.PROD.VER.1.2.1',
                    developer: {name: 'dev 2'},
                    edition: {name: '2015'},
                    estimatedUsers: 8,
                    product: {name: 'prod 2'},
                    status: {name: 'status 2'},
                    version: {name: 'ver 2'}
                }
            ],

            modifiedDecertifiedProducts: [
                {
                    acb: 'acb1',
                    certificationDate: new Date('03/19/2013'),
                    chplProductNumber: 'CHP-123123',
                    developer: 'dev 1',
                    edition: '2014',
                    estimatedUsers: 4,
                    product: 'prod 1',
                    status: 'status 1',
                    version: 'ver 1'
                },{
                    acb: 'acb2',
                    certificationDate: new Date('03/29/2015'),
                    chplProductNumber: '15.01.02.PROD.VER.1.2.1',
                    developer: 'dev 2',
                    edition: '2015',
                    estimatedUsers: 8,
                    product: 'prod 2',
                    status: 'status 2',
                    version: 'ver 2'
                }
            ],
            filter: { acb: 'Drummond', product: 'epic', status: 'broke'},
            searchOptions: {
                certBodyNames: [{name: 'ICSA Labs'}, {name: 'Drummond Group'}, {name: 'Infogard'}],
                certificationStatuses: [{name: 'Active'},{name: 'Withdrawn by Developer'},{name: 'Retired'},{name: 'Withdrawn by ONC-ACB'},{name: 'Suspended by ONC-ACB'},{name: 'Pending'}]
            }
        };
        for (var i = 0; i < mock.modifiedDecertifiedProducts.length; i++) {
            mock.modifiedDecertifiedProducts[i].certificationDateValue = mock.modifiedDecertifiedProducts[i].certificationDate.getTime();
        };

        beforeEach(function () {
            module('app.decertifications', function ($provide) {
                $provide.decorator('commonService', function ($delegate) {
                    $delegate.getDecertifiedProducts = jasmine.createSpy('getDecertifiedProducts');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');
                    return $delegate;
                });
            });

            inject(function($controller, $rootScope, _$log_, _$q_, _commonService_) {
                $log = _$log_;
                $q = _$q_;
                commonService = _commonService_;
                commonService.getDecertifiedProducts.and.returnValue($q.when({data: mock.decertifiedProducts}));
                commonService.getSearchOptions.and.returnValue($q.when(mock.searchOptions));

                scope = $rootScope.$new();
                vm = $controller('DecertifiedProductsController', {
                    $scope: scope
                });
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                console.debug('\n Debug: ' + $log.debug.logs.join('\n Debug: '));
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        it('should have called the commonService to load decertified Products', function () {
            expect(commonService.getDecertifiedProducts).toHaveBeenCalled();
        });

        it('should know how many decertified Products there are', function () {
            expect(vm.decertifiedProducts.length).toBe(2);
        });

        it('should set the displayed Products to match the found ones', function () {
            expect(vm.displayedProducts).toEqual(mock.decertifiedProducts);
        });

        it('should load the ACBs at page load', function () {
            expect(vm.acbs).toEqual(mock.searchOptions.certBodyNames);
        });

        it('should load the product statuses at page load', function () {
            expect(vm.statuses).toEqual(mock.searchOptions.certificationStatuses);
        });

        it('should generate the smart-table fields', function () {
            expect(vm.modifiedDecertifiedProducts).toEqual(mock.modifiedDecertifiedProducts);
        });
    });
})();
