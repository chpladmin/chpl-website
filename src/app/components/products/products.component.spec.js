(() => {
  'use strict';

  describe('the Products component', () => {
    var $compile, $log, ctrl, el, mock, scope;

    mock = {
      developers: [],
      products: [{
        productId: 636, name: 'OnBase,  Inc.', lastModifiedDate: null,
        contact: {contactId: 612, fullName: 'Kress Van Voorhis', friendlyName: null, email: 'kc.van.voorhis@onbase.com', phoneNumber: '440.788.5347', title: 'Customer Advisor'},
        owner: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'},
        ownerHistory: [{id: 127, developer: {developerId: 2042, developerCode: '3041', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDay: '2022-02-21'}, {id: 89, developer: {developerId: 184, developerCode: '1183', name: 'CPSI (Computer Programs and Systems),  Inc.'}, transferDay: '2021-02-11'}],
        versions: [{
          listings: [{
            acb: {name: 'name'},
            certificationStatus: 'Active',
          }],
        }],
      }],
      searchOptions: {
        certificationStatuses: [
          {name: 'Active'},
        ],
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.components');

      inject((_$compile_, _$log_, $rootScope) => {
        $compile = _$compile_;
        $log = _$log_;

        scope = $rootScope.$new();
        scope.developers = mock;
        scope.products = mock.products;
        scope.searchOptions = mock.searchOptions;

        el = angular.element('<chpl-products developers="developers" products="products" search-options="searchOptions"></chpl-products>');

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

      describe('on init', () => {
        it('should get status items', () => {
          expect(ctrl.statusItems).toEqual([{value: 'Active', selected: true}]);
        });
      });
    });
  });
})();
