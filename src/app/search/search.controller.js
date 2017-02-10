(function () {
    'use strict';

    angular.module('chpl.search')
        .controller('SearchController', SearchController);

    /** @ngInject */
    function SearchController ($filter, $localStorage, $location, $log, $rootScope, $scope, $timeout, cfpLoadingBar, commonService, utilService, CACHE_TIMEOUT, RELOAD_TIMEOUT) {
        var vm = this;

        vm.browseAll = browseAll;
        vm.certificationStatusFilter = certificationStatusFilter;
        vm.clear = clear;
        vm.clearFilters = clearFilters;
        vm.clearPreviouslyCompared = clearPreviouslyCompared;
        vm.clearPreviouslyViewed = clearPreviouslyViewed;
        vm.compare = compare;
        vm.hasResults = hasResults;
        vm.isCategoryChanged = isCategoryChanged;
        vm.loadResults = loadResults;
        vm.registerClearFilter = registerClearFilter;
        vm.registerRestoreState = registerRestoreState;
        vm.registerSearch = registerSearch;
        vm.reloadResults = reloadResults;
        vm.statusFont = statusFont;
        vm.toggleCompare = toggleCompare;
        vm.triggerClearFilters = triggerClearFilters;
        vm.triggerRestoreState = triggerRestoreState;
        vm.triggerSearch = triggerSearch;
        vm.truncButton = truncButton;
        vm.viewProduct = viewProduct;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            $scope.$on('ClearResults', function () {
                vm.clear();
                delete $localStorage.clearResults;
            });
            if ($localStorage.clearResults) {
                vm.clear();
                delete $localStorage.clearResults;
            }

            vm.categoryChanged = {};
            vm.boxes = {};
            vm.clearFilterHs = [];
            vm.restoreStateHs = [];
            vm.query = {
                developer: undefined,
                product: undefined,
                version: undefined,
                term: undefined
            }

            manageStorage();
            restoreResults();
            populateSearchOptions();
            vm.loadResults();
        }

        function browseAll () {
            vm.clearFilters(true);
            vm.activeSearch = true;
        }

        function clear () {
            vm.compareCps = [];
            vm.clearFilters(true);
            vm.activeSearch = false;
            if (vm.searchForm) {
                vm.searchForm.$setPristine();
            }
        }

        function clearFilters (removeSearchTerm) {
            var term;
            if (!removeSearchTerm) {
                if (vm.query.term) {
                    term = vm.query.term;
                }
            }
            vm.query = {};
            vm.searchState = {
                predicateObject: {
                    certificationStatus: {
                        matchAny: {
                            items: ['Active','Suspended by ONC','Suspended by ONC-ACB'],
                            all: false
                        }
                    },
                    edition: {
                        matchAny: {
                            items: ['2014','2015'],
                            all: false
                        }
                    }
                }
            };
            setFilterInfo();
            if (!removeSearchTerm) {
                if (term) {
                    vm.query.term = term;
                }
            }
        }

        function clearPreviouslyCompared () {
            vm.previouslyCompared = [];
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

        function compare () {
            var comparePath = '/compare/';
            var i;
            if (angular.isUndefined(vm.compareCps)) {
                vm.compareCps = [];
            }
            for (i = 0; i < vm.compareCps.length; i++) {
                comparePath += vm.compareCps[i].id + '&';
            }
            comparePath = comparePath.substring(0, comparePath.length - 1);
            if (comparePath.indexOf('&') > 0) {
                var prev = $localStorage.previouslyCompared;
                var toAdd;
                for (i = 0; i < vm.compareCps.length; i++) {
                    toAdd = true;
                    for (var j = 0; j < prev.length; j++) {
                        if (prev[j].id === vm.compareCps[i].id) {
                            toAdd = false;
                        }
                    }
                    if (toAdd) {
                        prev.push(vm.compareCps[i]);
                    }
                }
                while (prev.length > 20) {
                    prev.shift();
                }
                $localStorage.previouslyCompared = prev;
                $location.url(comparePath);
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
            ret = ret || (vm.query.developer && vm.query.developer.length > 0);
            ret = ret || (vm.query.product && vm.query.product.length > 0);
            ret = ret || (vm.query.version && vm.query.version.length > 0);
            return ret;
        }

        function loadResults() {
            commonService.getAll().then(function (response) {
                vm.allCps = response.results;
                vm.displayedCps = [].concat(vm.allCps);
                for (var i = 0; i < vm.displayedCps.length; i++) {
                    vm.displayedCps[i].mainSearch = [vm.displayedCps[i].developer, vm.displayedCps[i].product, vm.displayedCps[i].acbCertificationId, vm.displayedCps[i].chplProductNumber, vm.displayedCps[i].previousDevelopers].join('|');
                    vm.displayedCps[i].surveillance = angular.toJson({
                        hasOpenSurveillance: vm.displayedCps[i].hasOpenSurveillance,
                        hasClosedSurveillance: vm.displayedCps[i].hasClosedSurveillance,
                        hasOpenNonconformities: vm.displayedCps[i].hasOpenNonconformities,
                        hasClosedNonconformities: vm.displayedCps[i].hasClosedNonconformities
                    });
                }
            }, function (error) {
                $log.debug(error);
            });
        }

        function registerClearFilter (handler) {
            $log.debug('registerClearFilter', handler);
            vm.clearFilterHs.push(handler);
            var removeHandler = function () {
                vm.clearFilterHs = vm.clearFilterHs.filter(function (aHandler) {
                    return aHandler !== handler;
                });
            };
            return removeHandler;
        }

        function registerRestoreState (handler) {
            $log.debug('registerRestoreState', handler);
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
            $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
            vm.activeSearch = true;
            restoreResults();
        }

        function statusFont (status) {
            var ret;
            switch (status) {
            case 'Active':
                ret = 'fa-check-circle status-good';
                break;
            case 'Retired':
                ret = 'fa-university status-neutral';
                break;
            case 'Suspended by ONC':
                ret = 'fa-minus-square status-warning';
                break;
            case 'Suspended by ONC-ACB':
                ret = 'fa-minus-circle status-warning';
                break;
            case 'Terminated by ONC':
                ret = 'fa-window-close status-bad';
                break;
            case 'Withdrawn by Developer Under Surveillance/Review':
                ret = 'fa-exclamation-circle status-bad';
                break;
            case 'Withdrawn by Developer':
                ret = 'fa-stop-circle status-neutral';
                break;
            case 'Withdrawn by ONC-ACB':
                ret = 'fa-times-circle status-bad';
                break;
            }
            return ret;
        }

        function toggleCompare (row) {
            var toAdd = true;
            if (angular.isUndefined(vm.compareCps)) {
                vm.compareCps = [];
            }
            for (var i = 0; i < vm.compareCps.length; i++) {
                if (vm.compareCps[i].id === row.id) {
                    vm.compareCps.splice(i,1);
                    toAdd = false;
                }
            }
            if (toAdd) {
                vm.compareCps.push(row);
            }
            vm.boxes.compare = true;
        }

        function triggerClearFilters () {
            $log.debug('triggerClearFilter', vm.clearFilterHs);
            vm.query.developer = '';
            vm.query.product = '';
            vm.query.version = '';
            vm.triggerSearch();
            angular.forEach(vm.clearFilterHs, function (handler) {
                handler();
            });
        }

        function triggerRestoreState () {
            if ($localStorage.searchTableState) {
                var state = angular.fromJson($localStorage.searchTableState);
                $log.debug('triggerRestoreState', state);
                // save changes to text fields
                vm.query.term = state.search.predicateObject.term;
                vm.query.developer = state.search.predicateObject.developer;
                vm.query.product = state.search.predicateObject.product;
                vm.query.version = state.search.predicateObject.version
                vm.triggerSearch();
                // restore pagination/sort
                angular.forEach(vm.restoreStateHs, function (handler) {
                    handler(state);
                });
            }
        }

        function triggerSearch () {
            vm.tableSearch[0]();
        }

        function truncButton (str) {
            var ret = str;
            if (str.length > 20) {
                ret = ret.substring(0,20) + '&#8230;';
            }
            ret +='<span class="pull-right"><i class="fa fa-close"></i></span><span class="sr-only">Remove ' + str + ' from compare</span>';
            return ret;
        }

        function viewProduct (cp) {
            var toAdd = true;
            for (var i = 0; i < vm.previouslyViewed.length; i++) {
                if (vm.previouslyViewed[i].id === cp.id) {
                    toAdd = false;
                }
            }
            if (toAdd) {
                vm.previouslyViewed.push(cp);
                if (vm.previouslyViewed.length > 20) {
                    vm.previouslyViewed.shift();
                }
                $localStorage.previouslyViewed = vm.previouslyViewed;
            }
            $location.url('/product/' + cp.id);
        }

        ////////////////////////////////////////////////////////////////////

        function manageStorage () {
            if (localStorage.previouslyCompared) {
                vm.previouslyCompared = $localStorage.previouslyCompared;
            }
            if ($localStorage.previouslyViewed) {
                vm.previouslyViewed = $localStorage.previouslyViewed;
            }
        }

        function populateSearchOptions () {
            vm.lookaheadSource = {all: [], developers: [], products: []};
            commonService.getSearchOptions()
                .then(function (options) {
                    vm.searchOptions = options;
                    var i;
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
    }
})();
