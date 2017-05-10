(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('NonconformitiesController', NonconformitiesController);

    /** @ngInject */
    function NonconformitiesController ($filter, $localStorage, $log, $rootScope, $scope, $timeout, cfpLoadingBar, commonService, utilService, CACHE_TIMEOUT, RELOAD_TIMEOUT) {
        var vm = this;

        vm.hasResults = hasResults;
        vm.isCategoryChanged = isCategoryChanged;
        vm.loadResults = loadResults;
        vm.registerClearFilter = registerClearFilter;
        vm.registerRestoreState = registerRestoreState;
        vm.registerSearch = registerSearch;
        vm.triggerClearFilters = triggerClearFilters;
        vm.triggerRestoreState = triggerRestoreState;
        vm.triggerSearch = triggerSearch;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.categoryChanged = {};
            vm.clearFilterHs = [];
            vm.restoreStateHs = [];
            vm.isLoading = true;
            vm.isPreLoading = true;
            cfpLoadingBar.start();

            populateSearchOptions();
            restoreResults();
            vm.loadResults();
        }

        vm.defaultRefineModel = {
            acb: {
                'Drummond Group': true,
                'ICSA Labs': true,
                'InfoGard': true
            },
            certificationEdition: {
                '2014': true,
                '2015': true
            },
            surveillance: {
                surveillance: 'has-had',
                NC: {
                    open: true,
                    closed: true
                }
            }
        };

        function hasResults () {
            return angular.isDefined(vm.allCps);
        }

        function isCategoryChanged (categories) {
            var ret = false;
            for (var i = 0; i < categories.length; i++) {
                ret = ret || vm.categoryChanged[categories[i]];
            }
            return ret;
        }

        function loadResults() {
            commonService.getAllNonconformities().then(function (response) {
                if (vm.isPreLoading) {
                    cfpLoadingBar.start();
                }
                var results = response.results;
                vm.allCps = [];
                vm.displayedCps = [];
                for (var i = 0; i < results.length; i++) {
                    if (results[i].surveillanceCount > 0 && (results[i].openNonconformityCount > 0 || results[i].closedNonconformityCount > 0)) {
                        results[i].mainSearch = [results[i].developer, results[i].product, results[i].version, results[i].chplProductNumber].join('|');
                        results[i].surveillance = angular.toJson({
                            surveillanceCount: results[i].surveillanceCount,
                            openNonconformityCount: results[i].openNonconformityCount,
                            closedNonconformityCount: results[i].closedNonconformityCount
                        });
                        vm.allCps.push(results[i]);
                    }
                }
                vm.isPreLoading = false;
                vm.isLoading = false;
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

        function registerRestoreState (handler) {
            vm.restoreStateHs.push(handler);
            var removeHandler = function () {
                vm.restoreStateHs = vm.restoreStateHs.filter(function (aHandler) {
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

        function triggerClearFilters () {
            angular.forEach(vm.clearFilterHs, function (handler) {
                handler();
            });
            vm.triggerSearch();
        }

        function triggerRestoreState () {
            if ($localStorage.nonconformitiesTableState) {
                var state = angular.fromJson($localStorage.nonconformitiesTableState);
                angular.forEach(vm.restoreStateHs, function (handler) {
                    handler(state);
                });
            }
        }

        function triggerSearch () {
            if (vm.tableSearchHs && vm.tableSearchHs[0]) {
                vm.tableSearchHs[0]();
            }
        }

        ////////////////////////////////////////////////////////////////////

        function populateSearchOptions () {
            vm.lookaheadSource = {all: [], developers: [], products: []};
            commonService.getSearchOptions()
                .then(function (options) {
                    if (vm.isPreLoading) {
                        cfpLoadingBar.start();
                    }

                    vm.searchOptions = options;
                    var i;
                    options.practiceTypes = [];
                    for (i = 0; i < options.practiceTypeNames.length; i++) {
                        options.practiceTypes.push(options.practiceTypeNames[i].name);
                    }
                    setFilterInfo(vm.defaultRefineModel);
                });
        }

        function restoreResults () {
            if ($localStorage.nonconformitiesTableState) {
                vm.hasTableState = true;

                cfpLoadingBar.start();
                $timeout(
                    function () {
                        vm.triggerRestoreState();
                        cfpLoadingBar.complete();
                    },
                    RELOAD_TIMEOUT
                );
            }
        }

        function setFilterInfo (refineModel) {
            var i;
            vm.refineModel = angular.copy(refineModel);
            vm.filterItems = {
                pageSize: '50',
                acbItems: [],
                editionItems: []
            };
            vm.searchOptions.certBodyNames = $filter('orderBy')(vm.searchOptions.certBodyNames, 'name');
            for (i = 0; i < vm.searchOptions.certBodyNames.length; i++) {
                vm.filterItems.acbItems.push({value: vm.searchOptions.certBodyNames[i].name, selected: vm.defaultRefineModel.acb[vm.searchOptions.certBodyNames[i].name]});
            }
            vm.searchOptions.editions = $filter('orderBy')(vm.searchOptions.editions, 'name');
            for (i = 0; i < vm.searchOptions.editions.length; i++) {
                if (vm.searchOptions.editions[i].name !== '2011') {
                    vm.filterItems.editionItems.push({value: vm.searchOptions.editions[i].name, selected: vm.defaultRefineModel.certificationEdition[vm.searchOptions.editions[i].name]});
                }
            }
        }
    }
})();
