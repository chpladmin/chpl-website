(function () {
    'use strict';

    angular.module('chpl.decertifications')
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
                '2011': true,
                '2014': true,
                '2015': true
            },
            certificationStatus: {
                'Active': true,
                'Retired': true,
                'Suspended by ONC-ACB': true,
                'Withdrawn by Developer': true,
                'Withdrawn by Developer Under Surveillance/Review': true,
                'Withdrawn by ONC-ACB': true,
                'Suspended by ONC': true,
                'Terminated by ONC': true
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
            commonService.getAll().then(function (response) {
                if (vm.isPreLoading) {
                    cfpLoadingBar.start();
                }
                var results = response.results;
                for (var i = 0; i < results.length; i++) {
                    results[i].mainSearch = [results[i].developer, results[i].product, results[i].version, results[i].chplProductNumber].join('|');
                    results[i].surveillance = angular.toJson({
                        surveillanceCount: results[i].surveillanceCount,
                        openNonconformityCount: results[i].openNonconformityCount,
                        closedNonconformityCount: results[i].closedNonconformityCount
                    });
                }
                vm.allCps = [];
                vm.displayedCps = [];
                incrementTable(results);
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
            vm.previouslyIds = [];
            vm.viewingPreviouslyCompared = false;
            delete $localStorage.viewingPreviouslyCompared;
            vm.viewingPreviouslyViewed = false;
            delete $localStorage.viewingPreviouslyViewed;
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

        function incrementTable (results) {
            var size = 500, delay = 100;
            if (results.length > 0) {
                vm.isPreLoading = false;
                vm.allCps = vm.allCps.concat(results.splice(0,size));
                $timeout(function () {
                    incrementTable(results);
                }, delay);
            } else {
                vm.isLoading = false;
                if (vm.viewingPreviouslyCompared) {
                    vm.viewPreviouslyCompared();
                } else if (vm.viewingPreviouslyViewed) {
                    vm.viewPreviouslyViewed();
                }
            }
        }

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
                    for (i = 0; i < options.certificationStatuses.length; i++) {
                        if (options.certificationStatuses[i].name === 'Pending') {
                            options.certificationStatuses.splice(i,1);
                            break;
                        }
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
                cqms: { 2011: [], other: [] },
                criteria: { 2011: [], 2014: [], 2015: []},
                editionItems: [],
                statusItems: []
            };
            vm.searchOptions.certBodyNames = $filter('orderBy')(vm.searchOptions.certBodyNames, 'name');
            for (i = 0; i < vm.searchOptions.certBodyNames.length; i++) {
                vm.filterItems.acbItems.push({value: vm.searchOptions.certBodyNames[i].name, selected: vm.defaultRefineModel.acb[vm.searchOptions.certBodyNames[i].name]});
            }
            vm.searchOptions.editions = $filter('orderBy')(vm.searchOptions.editions, 'name');
            for (i = 0; i < vm.searchOptions.editions.length; i++) {
                vm.filterItems.editionItems.push({value: vm.searchOptions.editions[i].name, selected: vm.defaultRefineModel.certificationEdition[vm.searchOptions.editions[i].name]});
            }
            vm.searchOptions.certificationStatuses = $filter('orderBy')(vm.searchOptions.certificationStatuses, 'name');
            for (i = 0; i < vm.searchOptions.certificationStatuses.length; i++) {
                vm.filterItems.statusItems.push({value: vm.searchOptions.certificationStatuses[i].name, selected: vm.defaultRefineModel.certificationStatus[vm.searchOptions.certificationStatuses[i].name]});
            }
            vm.searchOptions.certificationCriterionNumbers = $filter('orderBy')(vm.searchOptions.certificationCriterionNumbers, utilService.sortCert);
            for (i = 0; i < vm.searchOptions.certificationCriterionNumbers.length; i++) {
                var crit = vm.searchOptions.certificationCriterionNumbers[i];
                switch (crit.name.substring(4,7)) {
                case '314':
                    vm.filterItems.criteria[2014].push({value: crit.name, selected: false, display: crit.name + ': ' + crit.title});
                    break;
                case '315':
                    vm.filterItems.criteria[2015].push({value: crit.name, selected: false, display: crit.name + ': ' + crit.title});
                    break;
                default:
                    vm.filterItems.criteria[2011].push({value: crit.name, selected: false, display: crit.name + ': ' + crit.title});
                }
            }
            vm.searchOptions.cqmCriterionNumbers = $filter('orderBy')(vm.searchOptions.cqmCriterionNumbers, utilService.sortCqm);
            for (i = 0; i < vm.searchOptions.cqmCriterionNumbers.length; i++) {
                var cqm = vm.searchOptions.cqmCriterionNumbers[i];
                if (cqm.name.substring(0,3) === 'CMS') {
                    vm.filterItems.cqms.other.push({value: cqm.name, selected: false, display: cqm.name + ': ' + cqm.title});
                } else {
                    vm.filterItems.cqms[2011].push({value: 'NQF-' + cqm.name, selected: false, display: 'NQF-' + cqm.name + ': ' + cqm.title});
                }
            }
        }
    }
})();
