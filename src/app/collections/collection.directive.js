(function () {
    'use strict';

    angular.module('chpl.collections')
        .directive('aiCollection', aiCollection)
        .controller('CollectionController', CollectionController);

    /** @ngInject */
    function aiCollection () {
        return {
            bindToController: {
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
            templateUrl: 'app/collections/collection.html',
            transclude: {
                aiBodyText: 'aiBodyText',
                aiFooterText: '?aiFooterText',
                aiTitle: 'aiTitle',
            },
        };
    }

    /** @ngInject */
    function CollectionController ($filter, $localStorage, $log, $timeout, RELOAD_TIMEOUT, collectionsService, commonService) {
        var vm = this;

        vm.hasResults = hasResults;
        vm.isCategoryChanged = isCategoryChanged;
        vm.isFilterActive = isFilterActive;
        vm.loadResults = loadResults;
        vm.parseDataElement = parseDataElement;
        vm.registerClearFilter = registerClearFilter;
        //vm.registerRestoreState = registerRestoreState;
        vm.registerSearch = registerSearch;
        vm.triggerClearFilters = triggerClearFilters;
        //vm.triggerRestoreState = triggerRestoreState;
        vm.triggerSearch = triggerSearch;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.categoryChanged = {};
            vm.clearFilterHs = [];
            //vm.restoreStateHs = [];
            vm.isPreLoading = true;

            if (!vm.searchText) {
                vm.searchText = 'Search by Developer, Product, Version, or CHPL ID';
            }
            setFilterInfo();
            //restoreResults();
            vm.loadResults();
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
            commonService.getCollection(vm.collectionKey).then(function (response) {
                vm.allCps = collectionsService.translate(vm.collectionKey, response);
                vm.isPreLoading = false;
            }, function (error) {
                $log.debug(error);
            });
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

        function registerClearFilter (handler) {
            vm.clearFilterHs.push(handler);
            var removeHandler = function () {
                vm.clearFilterHs = vm.clearFilterHs.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }

        /*
        function registerRestoreState (handler) {
            vm.restoreStateHs.push(handler);
            var removeHandler = function () {
                vm.restoreStateHs = vm.restoreStateHs.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }
        */

        function registerSearch (handler) {
            vm.tableSearchHs = [handler];
            var removeHandler = function () {
                vm.tableSearchHs = vm.tableSearchHs.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }

        function triggerClearFilters () {
            angular.forEach(vm.clearFilterHs, function (handler) {
                handler();
            });
            vm.triggerSearch();
        }

        /*
        function triggerRestoreState () {
            if ($localStorage[vm.dataStore]) {
                var state = angular.fromJson($localStorage[vm.dataStore]);
                angular.forEach(vm.restoreStateHs, function (handler) {
                    handler(state);
                });
            }
        }
        */

        function triggerSearch () {
            if (vm.tableSearchHs && vm.tableSearchHs[0]) {
                vm.tableSearchHs[0]();
            }
        }

        ////////////////////////////////////////////////////////////////////

        /*
        function restoreResults () {
            if ($localStorage[vm.dataStore]) {
                $timeout(
                    function () {
                        vm.triggerRestoreState();
                    },
                    RELOAD_TIMEOUT
                );
            }
        }
        */

        function setFilterInfo () {
            vm.filterItems = {
                pageSize: '50',
            };
            if (vm.isFilterActive('acb')) {
                vm.filterItems.acbItems = angular.copy(vm.refineModel.acb);
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
    }
})();
