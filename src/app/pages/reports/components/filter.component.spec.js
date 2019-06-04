(() => {
    'use strict';

    fdescribe('the Reports.Filter component', () => {

        var $compile, $log, $q, Mock, ctrl, el, networkService, scope;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.reports', $provide => {
                $provide.decorator('networkService', $delegate => {
                    $delegate.getFilters = jasmine.createSpy('getFilters');
                    $delegate.createFilter = jasmine.createSpy('createFilter');
                    $delegate.deleteFilter = jasmine.createSpy('deleteFilter');
                    $delegate.getFilterTypes = jasmine.createSpy('getFilterTypes');
                    return $delegate;
                });
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

                scope = $rootScope.$new()

                el = angular.element('<chpl-filter filter-type-name="Listing Report" on-apply-filter="onApplyFilter(filter)" get-filter-data="createFilterDataObject()"></chpl-filter>');

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
            it('should be initialized with filters', () => {
                expect(ctrl.availableFilters.length).toBe(3);
            });

            it('when saving a filter', () => {
                ctrl.saveFilter();
                expect(scope.createFilterDataObject).toHaveBeenCalled();
                expect(networkService.createFilter).toHaveBeenCalled();
            });

            it('when refreshing the list of filters', () => {
                ctrl.refreshFilterList();
                expect(networkService.getFilters).toHaveBeenCalled();
            });

            it('when deleteing a filters', () => {
                ctrl.deleteFilter();
                expect(networkService.deleteFilter).toHaveBeenCalled();
            });

            it('when selecting a filter', () => {
                let filter = {filter: {test: 'test'}};
                ctrl.applyFilter(filter);
                expect(scope.onApplyFilter).toHaveBeenCalledWith(filter.filter);
            });
        });
    });
})();
