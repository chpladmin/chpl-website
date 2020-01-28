(function () {
    'use strict';

    angular.module('chpl.collections')
        .directive('aiCollection', aiCollection)
        .controller('CollectionController', CollectionController);

    /** @ngInject */
    function aiCollection () {
        return {
            bindToController: {
                callFunction: '&?',
                collectionKey: '@',
                columns: '=',
                filters: '=?',
                refineModel: '=?',
                searchText: '@?',
            },
            controller: 'CollectionController',
            controllerAs: 'vm',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'chpl.collections/collection.html',
            transclude: {
                aiBodyText: 'aiBodyText',
                aiFooterText: '?aiFooterText',
                aiTitle: 'aiTitle',
            },
        };
    }

    /** @ngInject */
    function CollectionController ($filter, $interval, $localStorage, $log, $scope, $timeout, CACHE_REFRESH_TIMEOUT, RELOAD_TIMEOUT, collectionsService, networkService) {
        var vm = this;

        vm.hasResults = hasResults;
        vm.isCategoryChanged = isCategoryChanged;
        vm.isFilterActive = isFilterActive;
        vm.loadResults = loadResults;
        vm.parseDataElement = parseDataElement;
        vm.refreshResults = refreshResults;
        vm.registerClearFilter = registerClearFilter;
        vm.registerSearch = registerSearch;
        vm.stopCacheRefresh = stopCacheRefresh;
        vm.triggerClearFilters = triggerClearFilters;
        vm.triggerSearch = triggerSearch;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.categoryChanged = {};
            vm.clearFilterHs = [];
            vm.isPreLoading = true;

            if (!vm.searchText) {
                vm.searchText = 'Search by Developer, Product, Version, or CHPL ID';
            }
            setFilterInfo();
            networkService.getSearchOptions().then(options => {
                vm.certificationCriteria = options.certificationCriteria;
                vm.loadResults();
            });
        }

        function hasResults () {
            return angular.isDefined(vm.allCps);
        }

        function isCategoryChanged () {
            var ret = false;
            for (var i = 0; i < vm.filters.length; i++) {
                ret = ret || vm.categoryChanged[vm.filters[i]];
            }
            return ret;
        }

        function isFilterActive (key) {
            return vm.filters && vm.filters.length > 0 && vm.filters.indexOf(key) > -1;
        }

        function loadResults () {
            refreshResults();
            vm.stopCacheRefreshPromise = $interval(vm.refreshResults, CACHE_REFRESH_TIMEOUT * 1000);
        }

        function parseDataElement (cp, col) {
            var ret = cp[col.predicate];
            if (col.nullDisplay && (ret === null || angular.isUndefined(ret))) {
                ret = col.nullDisplay;
            }
            if (col.transformFn) {
                ret = col.transformFn(ret);
            }
            if (col.isDate) {
                ret = $filter('date')(ret,'mediumDate','UTC');
            }
            if (col.isLink) {
                if (col.initialPanel) {
                    ret = '<a href="#/product/' + cp.id + '/' + col.initialPanel + '">' + ret + '</a>';
                } else {
                    ret = '<a href="#/product/' + cp.id + '">' + ret + '</a>';
                }
            }
            return ret;
        }

        function refreshResults () {
            networkService.getCollection(vm.collectionKey).then(function (response) {
                response.certificationCriteria = vm.certificationCriteria;
                vm.allCps = collectionsService.translate(vm.collectionKey, response);
                vm.isPreLoading = false;
            }, function (error) {
                $log.debug(error);
            });
        }

        function registerClearFilter (handler) {
            vm.clearFilterHs.push(handler);
            var removeHandler = function () {
                vm.clearFilterHs = vm.clearFilterHs.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }

        function registerSearch (handler) {
            vm.tableSearchHs = [handler];
            var removeHandler = function () {
                vm.tableSearchHs = vm.tableSearchHs.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }

        function stopCacheRefresh () {
            if (angular.isDefined(vm.stopCacheRefreshPromise)) {
                $interval.cancel(vm.stopCacheRefreshPromise);
                vm.stopCacheRefreshPromise = undefined;
            }
        }

        function triggerClearFilters () {
            angular.forEach(vm.clearFilterHs, function (handler) {
                handler();
            });
            vm.triggerSearch();
        }

        function triggerSearch () {
            if (vm.tableSearchHs && vm.tableSearchHs[0]) {
                vm.tableSearchHs[0]();
            }
        }

        ////////////////////////////////////////////////////////////////////

        function setFilterInfo () {
            vm.filterItems = {
                pageSize: '50',
            };
            if (vm.isFilterActive('acb')) {
                networkService.getSearchOptions()
                    .then(options => {
                        vm.filterItems.acbItems = options.acbs
                            .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                            .map(acb => {
                                let ret = {
                                    value: acb.name,
                                    retired: acb.retired,
                                };
                                if (acb.retired) {
                                    ret.display = ret.value + ' (Retired)';
                                    ret.selected = ((new Date()).getTime() - acb.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4);
                                } else {
                                    ret.selected = true;
                                }
                                return ret;
                            });
                    });
            }
            if (vm.isFilterActive('certificationStatus')) {
                vm.filterItems.statusItems = angular.copy(vm.refineModel.certificationStatus);
            }
            if (vm.isFilterActive('acbAttestations')) {
                vm.filterItems.acbAttestations = angular.copy(vm.refineModel.acbAttestations);
            }
            if (vm.isFilterActive('edition')) {
                vm.filterItems.editionItems = angular.copy(vm.refineModel.edition);
            }
        }

        $scope.$on('$destroy', function () {
            vm.stopCacheRefresh();
        });
    }
})();
