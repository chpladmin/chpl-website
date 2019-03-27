(() => {
    'use strict';

    xdescribe('the Developers component', () => {
        var $compile, $log, ctrl, el, mock, scope;

        mock = {
            acbs: [
                { name: 'an acb' },
            ],
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
            products: [
                { name: 'a product' },
            ],
        };

        beforeEach(() => {
            angular.mock.module('chpl', 'chpl.organizations', $provide => {
                $provide.decorator('chplDevelopersDirective', $delegate => {
                    $delegate[0].terminal = true;
                    return $delegate;
                });
            });
            inject((_$compile_, _$log_, $rootScope) => {
                $compile = _$compile_;
                $log = _$log_;

                scope = $rootScope.$new();
                scope.acbs = {acbs: mock.acbs};
                scope.developer = mock.developer;
                scope.developers = mock.developers;
                scope.products = mock.products;

                el = angular.element('<chpl-developers allowed-acbs="acbs" developer="developer" developers="developers" products="products"></chpl-developers>');

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
