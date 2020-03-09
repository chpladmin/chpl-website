(() => {
    'use strict';

    describe('the Collections', () => {
        var $compile, $interval, $log, $q, CACHE_REFRESH_TIMEOUT, Mock, collectionsService, el, mock, networkService, scope, vm;

        beforeEach(() => {
            angular.mock.module('chpl.mock', 'chpl.collections', $provide => {
                $provide.decorator('collectionsService', $delegate => {
                    $delegate.translate = jasmine.createSpy('translate');

                    return $delegate;
                });
                $provide.decorator('networkService', $delegate => {
                    $delegate.getCollection = jasmine.createSpy('getCollection');
                    $delegate.getSearchOptions = jasmine.createSpy('getSearchOptions');

                    return $delegate;
                });
            });

            inject((_$compile_, $controller, _$interval_, _$log_, _$q_, $rootScope, _CACHE_REFRESH_TIMEOUT_, _Mock_, _collectionsService_, _networkService_) => {
                $compile = _$compile_;
                $interval = _$interval_;
                $log = _$log_;
                $q = _$q_;
                CACHE_REFRESH_TIMEOUT = _CACHE_REFRESH_TIMEOUT_
                Mock = _Mock_;
                mock = {
                    searchOptions: angular.copy(Mock.searchOptions),
                };
                mock.searchOptions.acbs[0].retired = true;
                mock.searchOptions.acbs[0].retirementDate = new Date();
                collectionsService = _collectionsService_;
                collectionsService.translate.and.returnValue([]);
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

        afterEach(() => {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + $log.debug.logs.map(o => angular.toJson(o)).join('\n'));
                /* eslint-enable no-console,angular/log */
            }
        });

        describe('directive', () => {
            it('should be compiled', () => {
                expect(el.html()).not.toEqual(null);
            });
        });

        describe('controller', () => {
            it('should exist', () => {
                expect(vm).toBeDefined();
            });

            describe('when figuring out if filters have changed', () => {
                it('should report true if any filter has changes', () => {
                    vm.filters = ['acb', 'atl'];
                    vm.categoryChanged = {
                        acb: false,
                        atl: true,
                    };
                    expect(vm.isCategoryChanged()).toBe(true);
                });
            });

            describe('on load', () => {
                beforeEach(() => {
                    //scope = $rootScope.$new();
                    scope.filters = ['acb'];
                    el = angular.element('<ai-collection collection-key="apiDocumentation" columns="columns" filters="filters" refine-model="refineModel"><ai-body-text>This is body text</ai-body-text><ai-title>Title</ai-title></ai-collection>');
                    $compile(el)(scope);
                    scope.$digest();
                    vm = el.isolateScope().vm;
                });

                it('should call for searchOptions', () => {
                    expect(networkService.getSearchOptions).toHaveBeenCalled();
                });

                it('should set acb filters to results from searchOptions', () => {
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

        describe('updating results data in the background', () => {
            it('should refresh the list on a timer', () => {
                expect(networkService.getCollection.calls.count()).toBe(1);
                $interval.flush(CACHE_REFRESH_TIMEOUT * 1000);
                expect(networkService.getCollection.calls.count()).toBe(2);
                $interval.flush(CACHE_REFRESH_TIMEOUT * 1000);
                expect(networkService.getCollection.calls.count()).toBe(3);
            });

            it('should be able to stop the refresh interval', () => {
                expect(vm.stopCacheRefreshPromise).toBeDefined();
                expect(vm.stopCacheRefresh).toBeDefined();
                vm.stopCacheRefresh();
                expect(vm.stopCacheRefreshPromise).not.toBeDefined();
            });
        });
    });
})();
