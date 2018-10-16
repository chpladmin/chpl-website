(function () {
    'use strict';

    describe('the Collections', function () {
        var $interval, $log, $q, el, CACHE_REFRESH_TIMEOUT, Mock, networkService, scope, vm;

        beforeEach(function () {
            angular.mock.module('chpl.mock', 'chpl.collections', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getCollection = jasmine.createSpy('getCollection');

                    return $delegate;
                });
            });

            inject(function ($compile, $controller, _$interval_, _$log_, _$q_, $rootScope, _CACHE_REFRESH_TIMEOUT_, _Mock_, _networkService_) {
                CACHE_REFRESH_TIMEOUT = _CACHE_REFRESH_TIMEOUT_
                Mock = _Mock_;
                $interval = _$interval_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;
                networkService.getCollection.and.returnValue($q.when({'results': angular.copy(Mock.allCps)}));

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
