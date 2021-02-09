(() => {
  'use strict';

  describe('the Compare component', () => {
    let $componentController, $log, $q, $stateParams, ctrl, mock, networkService, scope;

    mock = {
      listing: {
        developer: 'Developer',
        product: 'Product',
        certificationDate: '2015-02-01 00:00:00.00',
        certificationResults: [],
        certificationEdition: {name: '2014'},
        cqmResults: [],
        applicableCqmCriteria: [],
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.compare', $provide => {
        $provide.factory('aiCmsWidgetButton', () => ({}));
        $provide.decorator('networkService', $delegate => {
          $delegate.getListing = jasmine.createSpy('getListing');
          return $delegate;
        });
      });
      inject((_$componentController_, _$log_, _$q_, $rootScope, _$stateParams_, _networkService_) => {
        $componentController = _$componentController_;
        $log = _$log_;
        $q = _$q_;
        $stateParams = _$stateParams_;
        networkService = _networkService_;
        networkService.getListing.and.returnValue($q.when(mock.listing));

        scope = $rootScope.$new();
        $stateParams.compareIds = '123';
        ctrl = $componentController('chplCompare', {
          $scope: scope,
          $stateParams: $stateParams,
        });
        ctrl.$onInit();
        scope.$digest();
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(ctrl).toEqual(jasmine.any(Object));
      });

      it('should know if an element is open, and toggle open status', () => {
        var element = 'element';
        expect(ctrl.isShowing(element)).toBe(false);

        ctrl.toggle('element');
        expect(ctrl.isShowing(element)).toBe(true);

        ctrl.toggle('element');
        expect(ctrl.isShowing(element)).toBe(false);
      });

      it('should not allow more than one element to be open at once', () => {
        var ele1 = 'element1';
        var ele2 = 'element2';

        ctrl.toggle(ele1);
        expect(ctrl.isShowing(ele1)).toBe(true);
        expect(ctrl.isShowing(ele2)).toBe(false);
      });

      it('should track products to compare', () => {
        expect(ctrl.listings.length).toBe(1);
      });

      it('should know what to compare', () => {
        expect(ctrl.compareIds).toEqual(['123']);
      });
    });
  });
})();
