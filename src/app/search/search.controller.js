(function () {
    'use strict';

    angular.module('chpl.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController ($filter, $localStorage, $location, $log, $rootScope, $scope, $timeout, $uibModal, cfpLoadingBar, commonService, utilService, CACHE_TIMEOUT, RELOAD_TIMEOUT) {
        var vm = this;

        vm.browseAll = browseAll;
        vm.certificationStatusFilter = certificationStatusFilter;
        vm.clear = clear;
        vm.clearPreviouslyCompared = clearPreviouslyCompared;
        vm.clearPreviouslyViewed = clearPreviouslyViewed;
        vm.hasResults = hasResults;
        vm.isCategoryChanged = isCategoryChanged;
        vm.loadResults = loadResults;
        vm.registerClearFilter = registerClearFilter;
        vm.registerClearTerm = registerClearTerm;
        vm.registerRestoreComponents = registerRestoreComponents;
        vm.registerRestoreState = registerRestoreState;
        vm.registerSearch = registerSearch;
        vm.reloadResults = reloadResults;
        vm.statusFont = utilService.statusFont;
        vm.triggerClearFilters = triggerClearFilters;
        vm.triggerClearTerm = triggerClearTerm;
        vm.triggerRestoreState = triggerRestoreState;
        vm.triggerSearch = triggerSearch;
        vm.viewCertificationStatusLegend = viewCertificationStatusLegend;
        vm.viewProduct = viewProduct;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            $scope.$on('ClearResults', function () {
                delete $localStorage.clearResults;
                vm.clear();
            });
            if ($localStorage.clearResults) {
                delete $localStorage.clearResults;
                vm.clear();
            }

            vm.categoryChanged = {};
            vm.boxes = {};
            vm.clearFilterHs = [];
            vm.restoreStateHs = [];
            vm.isLoading = true;
            vm.isPreLoading = true;
            cfpLoadingBar.start();

            manageStorage();
            populateSearchOptions();
            restoreResults();
            vm.loadResults();
            setTimestamp();
        }

        function browseAll () {
            vm.triggerClearFilters();
            vm.triggerClearTerm();
            vm.activeSearch = true;
            setTimestamp();
        }

        function clear () {
            vm.triggerClearFilters();
            vm.triggerClearTerm();
            vm.activeSearch = false;
            if (vm.searchForm) {
                vm.searchForm.$setPristine();
            }
        }

        function clearPreviouslyCompared () {
            $localStorage.previouslyCompared = [];
        }

        function clearPreviouslyViewed () {
            vm.previouslyViewed = [];
            $localStorage.previouslyViewed = [];
        }

        function certificationStatusFilter (obj) {
            // TODO: fix
            if (!obj.statuses) {
                return true;
            } else {
                return ((obj.statuses['active'] > 0 && vm.refineModel.certificationStatus['Active']) ||
                        (obj.statuses['withdrawnByAcb'] > 0 && vm.refineModel.certificationStatus['Withdrawn by ONC-ACB']) ||
                        (obj.statuses['withdrawnByDeveloper'] > 0 && vm.refineModel.certificationStatus['Withdrawn by Developer']) ||
                        (obj.statuses['withdrawnByDeveloperUnderSurveillanceReview'] > 0 && vm.refineModel.certificationStatus['Withdrawn by Developer Under Surveillance/Review']) ||
                        (obj.statuses['suspendedByAcb'] > 0 && vm.refineModel.certificationStatus['Suspended by ONC-ACB']) ||
                        (obj.statuses['suspendedByOnc'] > 0 && vm.refineModel.certificationStatus['Suspended by ONC']) ||
                        (obj.statuses['terminatedByOnc'] > 0 && vm.refineModel.certificationStatus['Terminated by ONC']) ||
                        (obj.statuses['retired'] > 0 && vm.refineModel.certificationStatus['Retired']));
            }
        }

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
                    results[i].mainSearch = [results[i].developer, results[i].product, results[i].acbCertificationId, results[i].chplProductNumber, results[i].previousDevelopers].join('|');
                    results[i].surveillance = angular.toJson({
                        hasOpenSurveillance: results[i].hasOpenSurveillance,
                        hasClosedSurveillance: results[i].hasClosedSurveillance,
                        hasOpenNonconformities: results[i].hasOpenNonconformities,
                        hasClosedNonconformities: results[i].hasClosedNonconformities
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

        function registerClearTerm (handler) {
            vm.clearTerm = [handler]
            var removeHandler = function () {
                vm.clearTerm = vm.clearTerm.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }

        function registerRestoreComponents (handler) {
            vm.restoreComponents = [handler];
            var removeHandler = function () {
                vm.restoreComponents = vm.restoreComponents.filter(function (aHandler) {
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
            vm.tableSearch = [handler];
            var removeHandler = function () {
                vm.tableSearch = vm.tableSearch.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }

        function reloadResults () {
            vm.activeSearch = true;
            setTimestamp();
            restoreResults();
        }

        function triggerClearFilters () {
            angular.forEach(vm.clearFilterHs, function (handler) {
                handler();
            });
            vm.triggerSearch();
        }

        function triggerClearTerm () {
            angular.forEach(vm.clearTerm, function (handler) {
                handler();
            });
            vm.triggerSearch();
        }

        function triggerRestoreState () {
            if ($localStorage.searchTableState) {
                var state = angular.fromJson($localStorage.searchTableState);
                angular.forEach(vm.restoreStateHs, function (handler) {
                    handler(state);
                });
            }
        }

        function triggerSearch () {
            if (vm.tableSearch && vm.tableSearch[0]) {
                vm.tableSearch[0]();
            }
        }

        function viewCertificationStatusLegend () {
            vm.viewCertificationStatusLegendInstance = $uibModal.open({
                templateUrl: 'app/components/certificationStatus/certificationStatus.html',
                controller: 'CertificationStatusController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg'
            });
            vm.viewCertificationStatusLegendInstance.result.then(function (response) {
                $log.info(response);
            }, function (result) {
                $log.info(result)
            });
        }

        function viewProduct (cp) {
            setTimestamp();
            if (vm.previouslyViewed.indexOf(cp.id) === -1) {
                vm.previouslyViewed.push(cp.id);
                if (vm.previouslyViewed.length > 20) {
                    vm.previouslyViewed.shift();
                }
                $localStorage.previouslyViewed = vm.previouslyViewed;
            }
            $location.url('/product/' + cp.id);
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
            }
        }

        function manageStorage () {
            if ($localStorage.previouslyViewed) {
                vm.previouslyViewed = $localStorage.previouslyViewed;
            } else {
                vm.previouslyViewed = [];
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
                    for (i = 0; i < options.developerNames.length; i++) {
                        vm.lookaheadSource.all.push({type: 'developer', value: options.developerNames[i].name, statuses: options.developerNames[i].statuses});
                        vm.lookaheadSource.developers.push({type: 'developer', value: options.developerNames[i].name, statuses: options.developerNames[i].statuses});
                    }
                    for (i = 0; i < options.productNames.length; i++) {
                        vm.lookaheadSource.all.push({type: 'product', value: options.productNames[i].name, statuses: options.productNames[i].statuses});
                        vm.lookaheadSource.products.push({type: 'product', value: options.productNames[i].name, statuses: options.productNames[i].statuses});
                    }
                    $localStorage.lookaheadSource = vm.lookaheadSource;
                    setFilterInfo();
                });
        }

        function restoreResults () {
            if ($localStorage.searchTableState && $localStorage.searchTimestamp) {
                var nowStamp = Math.floor((new Date()).getTime() / 1000 / 60);
                var difference = nowStamp - $localStorage.searchTimestamp;
                vm.hasTableState = true;

                if (difference > CACHE_TIMEOUT) {
                    vm.activeSearch = false;
                } else {
                    cfpLoadingBar.start();
                    $timeout(
                        function () {
                            vm.triggerRestoreState();
                            cfpLoadingBar.complete();
                        },
                        RELOAD_TIMEOUT
                    );
                    vm.activeSearch = true;
                    setTimestamp();
                }
            } else {
                vm.hasTableState = false;
            }
        }

        function setFilterInfo () {
            var i;
            vm.defaultRefineModel = {
                acb: {
                    'Drummond Group': true,
                    'ICSA Labs': true,
                    'InfoGard': true
                },
                certificationEdition: {
                    '2011': false,
                    '2014': true,
                    '2015': true
                },
                certificationStatus: {
                    'Active': true,
                    'Retired': false,
                    'Suspended by ONC-ACB': true,
                    'Withdrawn by Developer': false,
                    'Withdrawn by Developer Under Surveillance/Review': false,
                    'Withdrawn by ONC-ACB': false,
                    'Suspended by ONC': true,
                    'Terminated by ONC': false
                }
            };
            vm.refineModel = angular.copy(vm.defaultRefineModel);
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

        function setTimestamp () {
            if (vm.activeSearch) {
                $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
            }
            if (vm.timestampPromise !== null) {
                $timeout.cancel(vm.timestampPromise);
            }
            vm.timestampPromise = $timeout(function () {
                setTimestamp();
            }, 60000); //set timestamp every minute while search is active
        }
    }
})();
