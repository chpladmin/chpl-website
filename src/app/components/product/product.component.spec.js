(() => {
    'use strict';

    describe('the Product component', () => {
        var $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            product: {
                productId: 636, name: 'OnBase,  Inc.', lastModifiedDate: null,
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                owner: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'},
                ownerHistory: [{id: 127, developer: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552570509025}, {id: 89, developer: {developerId: 184, developerCode: '1183', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552505343043}],
            },
            productTweaked: {
                productId: 636, name: 'OnBase,  Inc.', lastModifiedDate: null,
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                owner: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'},
                ownerHistory: [{id: 127, developer: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552570509025, transferDateObject: new Date(1552570509025), $$hashKey: jasmine.any(String)}, {id: 89, developer: {developerId: 184, developerCode: '1183', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552505343043, transferDateObject: new Date(1552505343043), $$hashKey: jasmine.any(String)}],
            },
            searchOptions: {
                certificationStatuses: [
                    {name: 'Active'},
                ],
            },
        };

        beforeEach(() => {
            angular.mock.module('chpl.components', $provide => {
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
                scope.product = mock.product;
                scope.searchOptions = mock.searchOptions;

                el = angular.element('<chpl-product product="product" search-options="searchOptions"></chpl-product>');

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

            describe('on change/init', () => {
                it('should make copies of inputs', () => {
                    expect(ctrl.product).not.toBe(mock.productTweaked);
                    expect(ctrl.product).toEqual(mock.productTweaked);
                });

                it('shouldn\'t change anything that shouldn\'t change', () => {
                    // save old state
                    let product = ctrl.product;

                    // make changes
                    ctrl.$onChanges({});

                    //assert
                    expect(product).toBe(ctrl.product);
                });

                it('should get status items', () => {
                    expect(ctrl.statusItems).toEqual([{value: 'Active', selected: true}]);
                });
            });
        });
    });
})();
