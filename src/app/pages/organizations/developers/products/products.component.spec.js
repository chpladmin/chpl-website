(() => {
    'use strict';

    describe('the Products component', () => {
        var $compile, $log, $q, ctrl, el, mock, networkService, scope;

        mock = {
            developer: {
                developerId: 636, developerCode: '1635', name: 'Hyland Software,  Inc.', website: 'https://www.onbase.com/',
                address: {addressId: 177, line1: '28500 Clemens Road', line2: null, city: 'Westlake', state: 'OH', zipcode: '44145', country: 'USA'},
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                lastModifiedDate: null, deleted: null, transparencyAttestations: [],
                statusEvents: [{id: null, developerId: 636, status: {id: 1, status: 'Active'}, statusDate: 1459484375763, reason: null}],
                status: {id: 1, status: 'Active'},
            },
            developers: [
                { name: 'a developer' },
            ],
            product: {
                productId: 636, name: 'OnBase,  Inc.', lastModifiedDate: null,
                contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
                owner: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'},
                ownerHistory: [{id: 127, developer: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552570509025}, {id: 89, developer: {developerId: 184, developerCode: '1183', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDate: 1552505343043}],
            },
            products: [
                { name: 'a product' },
            ],
            versions: [
                { name: 'a version' },
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl.organizations', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getDevelopers = jasmine.createSpy('getDevelopers');
                    return $delegate;
                });
                $provide.decorator('chplProductsDirective', $delegate => {
                    $delegate[0].terminal = true;
                    return $delegate;
                });
            });
            inject((_$compile_, _$log_, _$q_, $rootScope, _networkService_) => {
                $compile = _$compile_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getDevelopers.and.returnValue($q.when(mock.developers));

                scope = $rootScope.$new();
                scope.acbs = {acbs: mock.acbs};
                scope.developer = mock.developer;
                scope.product = mock.product;
                scope.products = {products: mock.products};
                scope.versions = mock.versions;

                el = angular.element('<chpl-products developer="developer" product="product" products="products" versions="versions"></chpl-products>');

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
