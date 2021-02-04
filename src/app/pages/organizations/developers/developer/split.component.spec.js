(() => {
  'use strict';

  describe('the Developer Split component', () => {
    var $compile, $log, $q, $state, ctrl, el, mock, networkService, scope, toaster;

    mock = {
      developer: {
        products: [],
      },
      goodResponse: {
        job: {
          jobDataMap: {
            user: {
              email: 'fake',
            },
          },
        },
        status: 200,
      },
    };

    beforeEach(() => {
      angular.mock.module('chpl.organizations', $provide => {
        $provide.decorator('networkService', $delegate => {
          $delegate.getAcbs = jasmine.createSpy('getAcbs');
          $delegate.splitDeveloper = jasmine.createSpy('splitDeveloper');
          return $delegate;
        });
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _$state_, _networkService_, _toaster_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        $state = _$state_;
        toaster = _toaster_;
        networkService = _networkService_;
        networkService.getAcbs.and.returnValue($q.when([]));
        networkService.splitDeveloper.and.returnValue($q.when({
          oldDeveloper: 'a developer',
          newDeveloper: 'new developer',
        }));

        scope = $rootScope.$new();
        scope.developer = mock.developer;

        el = angular.element('<chpl-developers-split developer="developer"></chpl-developers-split>');

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

    describe('template', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should exist', () => {
        expect(ctrl).toBeDefined();
      });
    });

    describe('when moving a product to a new developer', () => {
      it('should remove the product from the old list and add to new', () => {
        ctrl.products = [{productId: 1}, {productId: 2}];
        ctrl.movingProducts = [];
        ctrl.toggleMove({productId: 1}, true);
        expect(ctrl.products).toEqual([{productId: 2}]);
        expect(ctrl.movingProducts).toEqual([{productId: 1}]);
      });
    });

    describe('when moving a product back to the old developer', () => {
      it('should remove the product from the new list and add to old', () => {
        ctrl.products = [];
        ctrl.movingProducts = [{productId: 1}, {productId: 2}];
        ctrl.toggleMove({productId: 1});
        expect(ctrl.products).toEqual([{productId: 1}]);
        expect(ctrl.movingProducts).toEqual([{productId: 2}]);
      });
    });

    describe('when a developer split is saved', () => {
      it('should navigate back to the developers page on a status:200 response', () => {
        spyOn($state, 'go');
        networkService.splitDeveloper.and.returnValue($q.when(mock.goodResponse));
        ctrl.splitDeveloper = {
          newDeveloper: {},
          oldDeveloper: {},
          newProducts: [],
          oldProducts: [],
        };
        ctrl.split();
        scope.$digest();
        expect($state.go).toHaveBeenCalledWith('organizations.developers', {}, {reload: true});
      });

      it('should pop a notice on success', () => {
        spyOn(toaster, 'pop');
        ctrl.developer = {developerId: 'an id'};
        networkService.splitDeveloper.and.returnValue($q.when(mock.goodResponse));
        ctrl.splitDeveloper = {
          newDeveloper: {},
          oldDeveloper: {},
          newProducts: [],
          oldProducts: [],
        };
        ctrl.split();
        scope.$digest();
        expect(toaster.pop).toHaveBeenCalledWith({
          type: 'success',
          title: 'Split submitted',
          body: 'Your action has been submitted and you\'ll get an email at fake when it\'s done',
        });
      });

      it('should report errors if response has errors', () => {
        spyOn($state, 'go');
        networkService.splitDeveloper.and.returnValue($q.when({status: 401, data: {errorMessages: ['This is an error', 'This is another error']}}));
        ctrl.splitDeveloper = {
          newDeveloper: {},
          oldDeveloper: {},
          newProducts: [],
          oldProducts: [],
        };
        ctrl.errorMessages = [];
        ctrl.split();
        scope.$digest();
        expect(ctrl.errorMessages.length).toBe(2);
      });

      it('should pass the the split developer data to the network service', () => {
        spyOn($state, 'go');
        networkService.splitDeveloper.and.returnValue($q.when(mock.goodResponse));
        ctrl.splitDeveloper = {
          newDeveloper: {},
          oldDeveloper: {
            products: [],
          },
          newProducts: [],
          oldProducts: [],
        };
        ctrl.split({});
        scope.$digest();
        expect(networkService.splitDeveloper).toHaveBeenCalledWith(ctrl.splitDeveloper);
      });
    });
  });
})();
