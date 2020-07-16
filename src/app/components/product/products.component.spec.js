(() => {
    'use strict';

    describe('the Products component', () => {
        var $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            products: [{
                productId: 636, name: 'OnBase,  Inc.', lastModifiedDate: null,
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                owner: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'},
                ownerHistory: [{id: 127, developer: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552570509025}, {id: 89, developer: {developerId: 184, developerCode: '1183', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552505343043}],
            }],
            searchOptions: {
                certificationStatuses: [
                    {name: 'Active'},
                ],
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
                $provide.factory('chplProductDirective', () => ({}));
                $provide.decorator('networkService', $delegate => {
                    $delegate.getProductsByVersion = jasmine.createSpy('getProductsByVersion');
                    $delegate.getVersionsByProduct = jasmine.createSpy('getVersionsByProduct');
                    return $delegate;
                });
            });

            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getProductsByVersion.and.returnValue($q.when([]));
                networkService.getVersionsByProduct.and.returnValue($q.when([]));

                scope = $rootScope.$new();
                scope.products = mock.products;
                scope.searchOptions = mock.searchOptions;

                el = angular.element('<chpl-products products="products" search-options="searchOptions"></chpl-products>');

                $compile(el)(scope);
                scope.$digest();
                ctrl = el.isolateScope().$ctrl;
            });
        });

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('view', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(ctrl).toEqual(jasmine.any(Object));
            });
        });
    });
})();
