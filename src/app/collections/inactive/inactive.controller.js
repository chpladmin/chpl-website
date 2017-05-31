(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('InactiveCertificatesController', InactiveCertificatesController);

    /** @ngInject */
    function InactiveCertificatesController ($filter, $localStorage, $log, $rootScope, $scope, $timeout, CACHE_TIMEOUT, RELOAD_TIMEOUT, commonService) {
        var vm = this;

        vm.getMeaningfulUseUsersAccurateAsOfDate = getMeaningfulUseUsersAccurateAsOfDate;
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
            vm.isPreLoading = true;

            populateSearchOptions();
            restoreResults();
            vm.loadResults();
            vm.getMeaningfulUseUsersAccurateAsOfDate();
        }

        vm.defaultRefineModel = {
            acb: {
                'Drummond Group': true,
                'ICSA Labs': true,
                'InfoGard': true,
            },
            certificationEdition: {
                '2014': true,
                '2015': true,
            },
            certificationStatus: [
                'Withdrawn by Developer',
            ],
        };

        function getMeaningfulUseUsersAccurateAsOfDate () {
            commonService.getMeaningfulUseUsersAccurateAsOfDate()
                .then(function (response) {
                    vm.muuAccurateAsOf = response.accurateAsOfDate;
                });
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
            commonService.getCollection('inactiveCertificates').then(function (response) {
                var results = response.results;
                vm.allCps = [];
                for (var i = 0; i < results.length; i++) {
                    if (results[i].edition !== '2011' &&
                        vm.defaultRefineModel.certificationStatus.indexOf(results[i].certificationStatus) > -1) {
                        results[i].mainSearch = [results[i].developer, results[i].product, results[i].version, results[i].chplProductNumber].join('|');
                        vm.allCps.push(results[i]);
                    }
                }
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
            if ($localStorage.inactiveCertificatesTableState) {
                var state = angular.fromJson($localStorage.inactiveCertificatesTableState);
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
            commonService.getSearchOptions()
                .then(function (options) {
                    vm.searchOptions = options;
                    setFilterInfo(vm.defaultRefineModel);
                });
        }

        function restoreResults () {
            if ($localStorage.inactiveCertificatesTableState) {
                $timeout(
                    function () {
                        vm.triggerRestoreState();
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
                editionItems: [],
                statusItems: [],
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
            for (i = 0; i < refineModel.certificationStatus.length; i++) {
                vm.filterItems.statusItems.push({value: refineModel.certificationStatus[i], selected: true});
            }
        }
    }
})();
