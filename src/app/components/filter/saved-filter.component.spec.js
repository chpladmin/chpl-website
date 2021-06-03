(() => {
  describe('the Saved Filter component', () => {
    let $compile;
    let $log;
    let $q;
    let Mock;
    let ctrl;
    let el;
    let networkService;
    let scope;

    beforeEach(() => {
      angular.mock.module('chpl.mock', 'chpl.components', ($provide) => {
        $provide.decorator('networkService', ($delegate) => ({
          ...$delegate,
          getFilters: jasmine.createSpy('getFilters'),
          createFilter: jasmine.createSpy('createFilter'),
          deleteFilter: jasmine.createSpy('deleteFilter'),
          getFilterTypes: jasmine.createSpy('getFilterTypes'),
        }));
      });

      inject((_$compile_, _$log_, _$q_, $rootScope, _Mock_, _networkService_) => {
        $compile = _$compile_;
        $log = _$log_;
        $q = _$q_;
        Mock = _Mock_;
        networkService = _networkService_;

        networkService.getFilters.and.returnValue($q.when(Mock.developerReportsFilter));
        networkService.createFilter.and.returnValue($q.when({}));
        networkService.deleteFilter.and.returnValue($q.when({}));
        networkService.getFilterTypes.and.returnValue($q.when(Mock.filterTypes));

        scope = $rootScope.$new();

        el = angular.element('<chpl-saved-filter filter-type-name="Listing Report" on-apply-filter="onApplyFilter(filter)" get-filter-data="createFilterDataObject()"></chpl-saved-filter>');

        scope.onApplyFilter = jasmine.createSpy('onApplyFilter');
        scope.createFilterDataObject = jasmine.createSpy('createFilterDataObject');

        $compile(el)(scope);
        scope.$digest();
        ctrl = el.isolateScope().$ctrl;
      });
    });

    afterEach(() => {
      if ($log.debug.logs.length > 0) {
        /* eslint-disable no-console,angular/log */
        console.log(`Debug:\n${$log.debug.logs.map((o) => angular.toJson(o)).join('\n')}`);
        /* eslint-enable no-console,angular/log */
      }
    });

    describe('view', () => {
      it('should be compiled', () => {
        expect(el.html()).not.toEqual(null);
      });
    });

    describe('controller', () => {
      it('should be initialized with filters', () => {
        expect(ctrl.availableFilters.length).toBe(3);
      });

      it('should give errors when saving a filter with no name', () => {
        ctrl.saveFilter();
        expect(scope.createFilterDataObject).not.toHaveBeenCalled();
        expect(networkService.createFilter).not.toHaveBeenCalled();
        expect(ctrl.errorMessage).toBe('Filter name is required');
      });

      it('should succeed when saving a filter', () => {
        ctrl.filterName = 'a new name';
        ctrl.saveFilter();
        expect(scope.createFilterDataObject).toHaveBeenCalled();
        expect(networkService.createFilter).toHaveBeenCalled();
        expect(ctrl.errorMessage).toBeUndefined();
      });

      it('should get filters from the network on refresh', () => {
        ctrl.refreshFilterList();
        expect(networkService.getFilters).toHaveBeenCalled();
      });

      it('should use the network service to deleting filters', () => {
        ctrl.deleteFilter();
        expect(networkService.deleteFilter).toHaveBeenCalled();
      });

      it('should apply filters when one is selected when selecting a filter', () => {
        const filter = { filter: { test: 'test' } };
        ctrl.applyFilter(filter);
        expect(scope.onApplyFilter).toHaveBeenCalledWith(filter.filter);
      });
    });
  });
})();
