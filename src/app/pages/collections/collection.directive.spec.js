(function () {
    'use strict';

    describe('the Collections', function () {
        var $compile, $interval, $log, $q, CACHE_REFRESH_TIMEOUT, Mock, el, mock, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.collections', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getCollection = jasmine.createSpy('getCollection');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');

                    return $delegate;
                });
            });

            inject(function (_$compile_, $controller, _$interval_, _$log_, _$q_, $rootScope, _CACHE_REFRESH_TIMEOUT_, _Mock_, _networkService_) {
                $compile = _$compile_;
                $interval = _$interval_;
                $log = _$log_;
                $q = _$q_;
                CACHE_REFRESH_TIMEOUT = _CACHE_REFRESH_TIMEOUT_
                Mock = _Mock_;
                mock = {
                    searchOptions: angular.copy(Mock.search_options),
                };
                mock.searchOptions.certBodyNames[0].retired = true;
                mock.searchOptions.certBodyNames[0].retirementDate = new Date();
                networkService = _networkService_;
                networkService.getCollection.and.returnValue($q.when({'results': angular.copy(Mock.allCps)}));
                networkService.getSearchOptions.and.returnValue($q.when(mock.searchOptions));

                el = angular.element('<ai-collection collection-key="apiDocumentation" columns="columns" filters="filters" refine-model="refineModel"><ai-body-text>This is body text</ai-body-text><ai-title>Title</ai-title></ai-collection>');

                scope = $rootScope.$new();
                scope.columns = [];
                scope.filters = [];
                scope.refineModel = {};
                $compile(el)(scope);
                scope.$digest();
                vm = el.isolateScope().vm;
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(function (o) { return angular.toJson(o); }).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', function () {
            it('should be compiled', function () {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', function () {
            it('should exist', function () {
                expect(vm).toBeDefined();
            });

            describe('when figuring out if filters have changed', function () {
                it('should report true if any filter has changes', function () {
                    vm.filters = ['acb', 'atl'];
                    vm.categoryChanged = {
                        acb: false,
                        atl: true,
                    };
                    expect(vm.isCategoryChanged()).toBe(true);
                });
            });

            describe('on load', () => {
                describe('with no acb filter', () => {
                    it('should not call for search_options', () => {
                        expect(networkService.getSearchOptions).not.toHaveBeenCalled();
                    });
                });

                describe('with acb filter', () => {
                    beforeEach(() => {
                        //scope = $rootScope.$new();
                        scope.filters = ['acb'];
                        el = angular.element('<ai-collection collection-key="apiDocumentation" columns="columns" filters="filters" refine-model="refineModel"><ai-body-text>This is body text</ai-body-text><ai-title>Title</ai-title></ai-collection>');
                        $compile(el)(scope);
                        scope.$digest();
                        vm = el.isolateScope().vm;
                    });

                    it('should call for search_options', () => {
                        expect(networkService.getSearchOptions).toHaveBeenCalled();
                    });

                    it('should set acb filters to results from search_options', () => {
                        expect(vm.filterItems.acbItems).toBeDefined();
                    });

                    it('should sort the names', () => {
                        expect(vm.filterItems.acbItems[1].value).toBe('Drummond Group');
                    });

                    it('should mark retired ones as retired', () => {
                        expect(vm.filterItems.acbItems[0].value).toBe('CCHIT');
                        expect(vm.filterItems.acbItems[0].display).toBe('CCHIT (Retired)');
                    });

                    it('should unselect old retired ones', () => {
                        expect(vm.filterItems.acbItems[0].selected).toBe(false);
                    });

                    it('should not unselect newly retired ones', () => {
                        expect(vm.filterItems.acbItems[2].selected).toBe(true);
                    });
                });
            });
        });

        describe('updating results data in the background', function () {
            it('should refresh the list on a timer', function () {
                expect(networkService.getCollection.calls.count()).toBe(1);
                $interval.flush(CACHE_REFRESH_TIMEOUT * 1000);
                expect(networkService.getCollection.calls.count()).toBe(2);
                $interval.flush(CACHE_REFRESH_TIMEOUT * 1000);
                expect(networkService.getCollection.calls.count()).toBe(3);
            });

            it('should be able to stop the refresh interval', function () {
                expect(vm.stopCacheRefreshPromise).toBeDefined();
                expect(vm.stopCacheRefresh).toBeDefined();
                vm.stopCacheRefresh();
                expect(vm.stopCacheRefreshPromise).not.toBeDefined();
            });

            it('should integrate results on the timer', function () {
                vm.collectionKey = 'apiDocumentation';
                vm.loadResults();
                var initialCount = vm.allCps.length;
                var newResults = angular.copy(vm.allCps);
                newResults.push(angular.copy(newResults[0]));
                expect(vm.allCps.length).toBe(initialCount);
                networkService.getCollection.and.returnValue($q.when({'results': newResults}));
                $interval.flush(CACHE_REFRESH_TIMEOUT * 1000);
                expect(vm.allCps.length).toBe(initialCount + 1);
            });
        });
    });
})();
