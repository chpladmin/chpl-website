(function () {
    'use strict';

    angular.module('chpl.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController ($analytics, $filter, $interval, $localStorage, $location, $log, $rootScope, $scope, $timeout, $uibModal, CACHE_REFRESH_TIMEOUT, CACHE_TIMEOUT, RELOAD_TIMEOUT, SPLIT_PRIMARY, featureFlags, networkService, utilService) {
        var vm = this;

        vm.browseAll = browseAll;
        vm.clear = clear;
        vm.clearPreviouslyCompared = clearPreviouslyCompared;
        vm.clearPreviouslyViewed = clearPreviouslyViewed;
        vm.hasResults = hasResults;
        vm.isCategoryChanged = isCategoryChanged;
        vm.isOn = featureFlags.isOn;
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
            vm.downloadResultsCategories = [
                { display: 'Edition', enabled: true, columns: [{ display: 'Edition', key: 'edition' }] },
                { display: 'Product data', enabled: true, columns: [
                    { display: 'Developer', key: 'developer' },
                    { display: 'Product', key: 'product' },
                    { display: 'Version', key: 'version' },
                ]},
                { display: 'Certification Date', enabled: true, columns: [{ display: 'Certification Date', key: 'certificationDate', transform: date => $filter('date')(date, 'mediumDate', 'UTC') }] },
                { display: 'CHPL ID', enabled: true, columns: [{ display: 'CHPL ID', key: 'chplProductNumber' }] },
                { display: 'ONC-ACB', enabled: false, columns: [{ display: 'ONC-ACB', key: 'acb' }] },
                { display: 'Practice Type', enabled: false, columns: [{ display: 'Practice Type', key: 'practiceType' }] },
                { display: 'Status', enabled: true, columns: [{ display: 'Status', key: 'certificationStatus' }] },
                { display: 'Details', enabled: true, columns: [{ display: 'Details', key: 'id', transform: id => 'https://chpl.healthit.gov/#/product/' + id }] },
                { display: 'Certification Criteria', enabled: false, columns: [{ display: 'Certification Criteria', key: 'criteriaMet', transform: crit => crit ? crit.split(SPLIT_PRIMARY).sort(utilService.sortCertActual).join('\n') : '' }] },
                { display: 'Clinical Quality Measures', enabled: false, columns: [{ display: 'Clinical Quality Measures', key: 'cqmsMet', transform: cqm => cqm ? cqm.split(SPLIT_PRIMARY).sort(utilService.sortCqmActual).join('\n') : '' }] },
                { display: 'Surveillance', enabled: false, columns: [
                    { display: 'Total Surveillance', key: 'surveillanceCount' },
                    { display: 'Open Nonconformities', key: 'openNonconformityCount' },
                    { display: 'Closed Nonconformtities', key: 'closedNonconformityCount' },
                ]},
            ];

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
            edition: { '2011': true },
        };
        if (vm.isOn('effective-rule-date')) {
            vm.retired.edition['2014'] = true;
        }

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
                var results = angular.copy(response.results);
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
                templateUrl: 'chpl.components/certification-status/certification-status.html',
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
            networkService.getSearchOptions()
                .then(options => {
                    options.practiceTypes = options.practiceTypes.map(ptn => ptn.name);
                    vm.searchOptions = options;
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
                criteria: { '2011': [], '2014': [], '2015': []},
                editionItems: [],
                statusItems: [],
            };
            vm.filterItems.acbItems = vm.searchOptions.acbs
                .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                .map(a => {
                    let ret = {
                        value: a.name,
                    };
                    if (a.retired) {
                        ret.display = 'Retired | ' + a.name;
                        ret.retired = true;
                        ret.selected = ((new Date()).getTime() - a.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4);
                    } else {
                        ret.selected = true;
                    }
                    return ret;
                });
            vm.filterItems.editionItems = vm.searchOptions.editions
                .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                .map(edition => {
                    let obj = {
                        value: edition.name,
                        selected: vm.defaultRefineModel.certificationEdition[edition.name],
                    }
                    if (edition.name === '2011' || (edition.name === '2014' && vm.isOn('effective-rule-date'))) {
                        obj.display = 'Retired | ' + obj.value;
                        obj.retired = true;
                    }
                    return obj;
                });
            vm.filterItems.statusItems = vm.searchOptions.certificationStatuses
                .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                .map(status => {
                    let obj = {
                        value: status.name,
                        selected: vm.defaultRefineModel.certificationStatus[status.name],
                    };
                    if (obj.value === 'Retired') {
                        obj.retired = true;
                    }
                    return obj;
                });
            vm.searchOptions.certificationCriteria
                .sort(utilService.sortCertActual)
                .forEach(crit => {
                    obj = {
                        value: crit.number,
                        selected: false,
                        display: (crit.removed ? 'Removed | ' : '') + crit.number + ': ' + crit.title,
                        removed: crit.removed,
                    };
                    if (crit.certificationEdition === '2011' || (crit.certificationEdition === '2014' && vm.isOn('effective-rule-date'))) {
                        obj.display = 'Retired | ' + obj.display;
                        obj.retired = true;
                    }
                    vm.filterItems.criteria[crit.certificationEdition].push(obj);
                });
            vm.searchOptions.cqms = $filter('orderBy')(vm.searchOptions.cqms, utilService.sortCqm);
            for (i = 0; i < vm.searchOptions.cqms.length; i++) {
                var cqm = vm.searchOptions.cqms[i];
                obj = {
                    selected: false,
                };
                if (cqm.name.substring(0,3) === 'CMS') {
                    obj.value = cqm.name;
                    obj.display = cqm.name + ': ' + cqm.title;
                    vm.filterItems.cqms.other.push(obj);
                } else {
                    obj.value = 'NQF-' + cqm.name;
                    obj.display = 'Retired | NQF-' + cqm.name + ': ' + cqm.title;
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
