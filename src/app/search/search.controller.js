(function () {
    'use strict';

    angular.module('chpl.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController ($analytics, $filter, $interval, $localStorage, $location, $log, $rootScope, $scope, $timeout, $uibModal, CACHE_REFRESH_TIMEOUT, CACHE_TIMEOUT, RELOAD_TIMEOUT, SPLIT_PRIMARY, networkService, utilService) {
        var vm = this;

        vm.browseAll = browseAll;
        vm.clear = clear;
        vm.clearPreviouslyCompared = clearPreviouslyCompared;
        vm.clearPreviouslyViewed = clearPreviouslyViewed;
        vm.hasResults = hasResults;
        vm.isCategoryChanged = isCategoryChanged;
        vm.loadResults = loadResults;
        vm.refreshResults = refreshResults;
        vm.registerAllowAll = registerAllowAll;
        vm.registerClearFilter = registerClearFilter;
        vm.registerRestoreComponents = registerRestoreComponents;
        vm.registerRestoreState = registerRestoreState;
        vm.registerSearch = registerSearch;
        vm.registerShowRetired = registerShowRetired;
        vm.reloadResults = reloadResults;
        vm.statusFont = utilService.statusFont;
        vm.stopCacheRefresh = stopCacheRefresh;
        vm.triggerAllowAll = triggerAllowAll;
        vm.triggerClearFilters = triggerClearFilters;
        vm.triggerRestoreState = triggerRestoreState;
        vm.triggerSearch = triggerSearch;
        vm.triggerShowRetired = triggerShowRetired;
        vm.viewCertificationStatusLegend = viewCertificationStatusLegend;
        vm.viewPreviouslyCompared = viewPreviouslyCompared;
        vm.viewPreviouslyViewed = viewPreviouslyViewed;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            $scope.$on('ClearResults', function () {
                vm.clear();
            });

            vm.allowAllHs = [];
            vm.boxes = {};
            vm.categoryChanged = {};
            vm.clearFilterHs = [];
            vm.displayedCps = [];
            vm.isLoading = true;
            vm.isPreLoading = true;
            vm.restoreStateHs = [];
            vm.showRetiredHs = [];
            vm.SPLIT_PRIMARY = SPLIT_PRIMARY;

            manageStorage();
            populateSearchOptions();
            restoreResults();
            if ($localStorage.clearResults) {
                vm.clear();
            }
            vm.loadResults();
            setTimestamp();
        }

        vm.defaultRefineModel = {
            acb: {
                'CCHIT': false,
                'SLI Global': false,
                'Surescripts LLC': false,
                'Drummond Group': true,
                'ICSA Labs': true,
                'InfoGard': true,
            },
            certificationEdition: {
                '2011': false,
                '2014': true,
                '2015': true,
            },
            certificationStatus: {
                'Active': true,
                'Retired': false,
                'Suspended by ONC-ACB': true,
                'Withdrawn by Developer': false,
                'Withdrawn by Developer Under Surveillance/Review': false,
                'Withdrawn by ONC-ACB': false,
                'Suspended by ONC': true,
                'Terminated by ONC': false,
            },
        };
        vm.retired = {
            acb: {'CCHIT': true, 'SLI Global': true, 'Surescripts LLC': true},
            edition: { '2011': true },
        };

        function browseAll () {
            $analytics.eventTrack('Browse All', { category: 'Search' });
            vm.triggerClearFilters();
            vm.activeSearch = true;
            setTimestamp();
        }

        function clear () {
            delete $localStorage.clearResults;
            vm.triggerClearFilters();
            vm.activeSearch = false;
            if (vm.searchForm) {
                vm.searchForm.$setPristine();
            }
        }

        function clearPreviouslyCompared () {
            vm.previouslyCompared = [];
            vm.previouslyIds = [];
            vm.viewingPreviouslyCompared = false;
            $localStorage.previouslyCompared = [];
            delete $localStorage.viewingPreviouslyCompared;
        }

        function clearPreviouslyViewed () {
            vm.previouslyViewed = [];
            vm.previouslyIds = [];
            vm.viewingPreviouslyViewed = false;
            $localStorage.previouslyViewed = [];
            delete $localStorage.viewingPreviouslyViewed;
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

        function loadResults () {
            networkService.getAll().then(function (response) {
                var results = response.results;
                vm.allCps = [];
                incrementTable(parseAllResults(results));
            }, function (error) {
                $log.debug(error);
            });

            vm.stopCacheRefreshPromise = $interval(vm.refreshResults, CACHE_REFRESH_TIMEOUT * 1000);
        }

        function refreshResults () {
            networkService.getAll().then(function (response) {
                var results = response.results;
                vm.allCps = parseAllResults(results);
            }, function (error) {
                $log.debug(error);
            });
        }

        function registerAllowAll (handler) {
            vm.allowAllHs.push(handler);
            var removeHandler = function () {
                vm.allowAllHs = vm.allowAllHs.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
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

        function registerShowRetired (handler) {
            vm.showRetiredHs.push(handler);
            var removeHandler = function () {
                vm.showRetiredHs = vm.showRetiredHs.filter(function (aHandler) {
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

        function stopCacheRefresh () {
            if (angular.isDefined(vm.stopCacheRefreshPromise)) {
                $interval.cancel(vm.stopCacheRefreshPromise);
                vm.stopCacheRefreshPromise = undefined;
            }
        }

        function triggerAllowAll () {
            vm.previouslyIds = [];
            vm.viewingPreviouslyCompared = false;
            delete $localStorage.viewingPreviouslyCompared;
            vm.viewingPreviouslyViewed = false;
            delete $localStorage.viewingPreviouslyViewed;
            angular.forEach(vm.allowAllHs, function (handler) {
                handler();
            });
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

        function triggerShowRetired () {
            vm.previouslyIds = [];
            vm.viewingPreviouslyCompared = false;
            delete $localStorage.viewingPreviouslyCompared;
            vm.viewingPreviouslyViewed = false;
            delete $localStorage.viewingPreviouslyViewed;
            angular.forEach(vm.showRetiredHs, function (handler) {
                handler();
            });
        }

        function viewCertificationStatusLegend () {
            vm.viewCertificationStatusLegendInstance = $uibModal.open({
                templateUrl: 'app/components/certificationStatus/certificationStatus.html',
                controller: 'CertificationStatusController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
            });
            vm.viewCertificationStatusLegendInstance.result.then(function (response) {
                $log.info(response);
            }, function (result) {
                $log.info(result)
            });
        }

        function viewPreviouslyCompared (doNotSearch) {
            if (!doNotSearch) {
                vm.triggerClearFilters();
                vm.triggerAllowAll();
            }
            $localStorage.viewingPreviouslyCompared = true;
            vm.viewingPreviouslyCompared = true;
            vm.previouslyIds = [{ value: -1, selected: false}];
            angular.forEach(vm.previouslyCompared, function (id) {
                vm.previouslyIds.push({value: id, selected: true})
            });
            if (!doNotSearch) {
                $analytics.eventTrack('View Previously Compared', { category: 'Search' });
                vm.triggerSearch();
            }
        }

        function viewPreviouslyViewed (doNotSearch) {
            if (!doNotSearch) {
                vm.triggerClearFilters();
                vm.triggerAllowAll();
            }
            $localStorage.viewingPreviouslyViewed = true;
            vm.viewingPreviouslyViewed = true;
            vm.previouslyIds = [{ value: -1, selected: false}];
            angular.forEach(vm.previouslyViewed, function (id) {
                vm.previouslyIds.push({value: id, selected: true})
            });
            if (!doNotSearch) {
                $analytics.eventTrack('View Previously Viewed', { category: 'Search' });
                vm.triggerSearch();
            }
        }

/*        function viewProduct (cp) {
            setTimestamp();
            if (vm.previouslyViewed.indexOf((cp.id + '')) === -1) {
                vm.previouslyViewed.push((cp.id + ''));
                if (vm.previouslyViewed.length > 20) {
                    vm.previouslyViewed.shift();
                }
                $localStorage.previouslyViewed = vm.previouslyViewed;
            }
            $location.url('/product/' + cp.id);
        }*/

        ////////////////////////////////////////////////////////////////////

        function incrementTable (results) {
            var delay = 100, size = 500;
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

        function manageStorage () {
            if ($localStorage.previouslyCompared) {
                vm.previouslyCompared = $localStorage.previouslyCompared;
            } else {
                vm.previouslyCompared = [];
            }
            if ($localStorage.viewingPreviouslyCompared) {
                vm.viewingPreviouslyCompared = true;
                vm.viewPreviouslyCompared(true);
            }
            if ($localStorage.previouslyViewed) {
                vm.previouslyViewed = $localStorage.previouslyViewed;
            } else {
                vm.previouslyViewed = [];
            }
            if ($localStorage.viewingPreviouslyViewed) {
                vm.viewingPreviouslyViewed = true;
                vm.viewPreviouslyViewed(true);
            }
        }

        function parseAllResults (results) {
            for (var i = 0; i < results.length; i++) {
                results[i].mainSearch = [results[i].developer, results[i].product, results[i].acbCertificationId, results[i].chplProductNumber].join('|');
                results[i].developerSearch = results[i].developer;
                if (results[i].previousDevelopers) {
                    results[i].mainSearch += '|' + results[i].previousDevelopers;
                    results[i].developerSearch += '|' + results[i].previousDevelopers;
                }
                results[i].surveillance = angular.toJson({
                    surveillanceCount: results[i].surveillanceCount,
                    openNonconformityCount: results[i].openNonconformityCount,
                    closedNonconformityCount: results[i].closedNonconformityCount,
                });
            }
            return results;
        }

        function populateSearchOptions () {
            vm.lookaheadSource = {all: [], developers: [], products: []};
            networkService.getSearchOptions(true)
                .then(function (options) {
                    vm.searchOptions = options;
                    var i;
                    options.practiceTypes = [];
                    for (i = 0; i < options.practiceTypeNames.length; i++) {
                        options.practiceTypes.push(options.practiceTypeNames[i].name);
                    }
                    for (i = 0; i < options.certBodyNames.length; i++) {
                        if (options.certBodyNames[i].name === 'Pending') {
                            options.certBodyNames.splice(i,1);
                            break;
                        }
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
                    setFilterInfo(vm.defaultRefineModel);
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
                    $timeout(
                        function () {
                            vm.triggerRestoreState();
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

        function setFilterInfo (refineModel) {
            var i, obj;
            vm.refineModel = angular.copy(refineModel);
            vm.filterItems = {
                pageSize: '50',
                acbItems: [],
                cqms: { 2011: [], other: [] },
                criteria: { 2011: [], 2014: [], 2015: []},
                editionItems: [],
                statusItems: [],
            };
            vm.searchOptions.certBodyNames = $filter('orderBy')(vm.searchOptions.certBodyNames, 'name');
            for (i = 0; i < vm.searchOptions.certBodyNames.length; i++) {
                obj = {
                    value: vm.searchOptions.certBodyNames[i].name,
                    selected: vm.defaultRefineModel.acb[vm.searchOptions.certBodyNames[i].name],
                };
                if (vm.retired.acb[vm.searchOptions.certBodyNames[i].name]) {
                    obj.display = obj.value + ' (Retired)';
                    obj.retired = true;
                }
                vm.filterItems.acbItems.push(obj);
            }
            vm.searchOptions.editions = $filter('orderBy')(vm.searchOptions.editions, 'name');
            for (i = 0; i < vm.searchOptions.editions.length; i++) {
                obj = {
                    value: vm.searchOptions.editions[i].name,
                    selected: vm.defaultRefineModel.certificationEdition[vm.searchOptions.editions[i].name],
                };
                if (vm.retired.edition[vm.searchOptions.editions[i].name]) {
                    obj.display = obj.value + ' (Retired)';
                    obj.retired = true;
                }
                vm.filterItems.editionItems.push(obj);
            }
            vm.searchOptions.certificationStatuses = $filter('orderBy')(vm.searchOptions.certificationStatuses, 'name');
            for (i = 0; i < vm.searchOptions.certificationStatuses.length; i++) {
                obj = {
                    value: vm.searchOptions.certificationStatuses[i].name,
                    selected: vm.defaultRefineModel.certificationStatus[vm.searchOptions.certificationStatuses[i].name],
                };
                if (obj.value === 'Retired') {
                    obj.retired = true;
                }
                vm.filterItems.statusItems.push(obj);
            }
            vm.searchOptions.certificationCriterionNumbers = $filter('orderBy')(vm.searchOptions.certificationCriterionNumbers, utilService.sortCert);
            for (i = 0; i < vm.searchOptions.certificationCriterionNumbers.length; i++) {
                var crit = vm.searchOptions.certificationCriterionNumbers[i];
                obj = {
                    value: crit.name,
                    selected: false,
                    display: crit.name + ': ' + crit.title,
                };
                switch (crit.name.substring(4,7)) {
                case '314':
                    vm.filterItems.criteria[2014].push(obj);
                    break;
                case '315':
                    vm.filterItems.criteria[2015].push(obj);
                    break;
                default:
                    obj.display = obj.display + ' (Retired)';
                    obj.retired = true;
                    vm.filterItems.criteria[2011].push(obj);
                }
            }
            vm.searchOptions.cqmCriterionNumbers = $filter('orderBy')(vm.searchOptions.cqmCriterionNumbers, utilService.sortCqm);
            for (i = 0; i < vm.searchOptions.cqmCriterionNumbers.length; i++) {
                var cqm = vm.searchOptions.cqmCriterionNumbers[i];
                obj = {
                    selected: false,
                };
                if (cqm.name.substring(0,3) === 'CMS') {
                    obj.value = cqm.name;
                    obj.display = cqm.name + ': ' + cqm.title;
                    vm.filterItems.cqms.other.push(obj);
                } else {
                    obj.value = 'NQF-' + cqm.name;
                    obj.display = 'NQF-' + cqm.name + ': ' + cqm.title + '( Retired)';
                    obj.retired = true;
                    vm.filterItems.cqms[2011].push(obj);
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

        $scope.$on('$destroy', function () {
            vm.stopCacheRefresh();
        });
    }
})();
