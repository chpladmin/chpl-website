(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('DecertifiedDevelopersController', DecertifiedDevelopersController);

    /** @ngInject */
    function DecertifiedDevelopersController ($filter, $localStorage, $log, $rootScope, $scope, $timeout, RELOAD_TIMEOUT, commonService) {
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
            vm.isPreLoading = true;
            vm.defaultRefineModel = {
                acb: [
                    'Drummond Group',
                    'ICSA Labs',
                    'InfoGard',
                ],
            };

            setFilterInfo();
            restoreResults();
            vm.loadResults();
        }

        function hasResults () {
            return angular.isDefined(vm.allDevelopers);
        }

        function isCategoryChanged (categories) {
            var ret = false;
            for (var i = 0; i < categories.length; i++) {
                ret = ret || vm.categoryChanged[categories[i]];
            }
            return ret;
        }

        function loadResults () {
            commonService.getDecertifiedDevelopers().then(function (response) {
                var results = response.decertifiedDeveloperResults;
                var dev;
                vm.allDevelopers = [];
                for (var i = 0; i < results.length; i++) {
                    dev = {
                        acb: [],
                        decertificationDate: results[i].decertificationDate,
                        developer: results[i].developer.name,
                        status: results[i].developer.status.status,
                    }
                    for (var j = 0; j < results[i].certifyingBody.length; j++) {
                        dev.acb.push(results[i].certifyingBody[j].name);
                    }
                    vm.allDevelopers.push(dev);
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
            if ($localStorage.bannedDevelopersTableState) {
                var state = angular.fromJson($localStorage.bannedDevelopersTableState);
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

        function restoreResults () {
            if ($localStorage.bannedDevelopersTableState) {
                $timeout(
                    function () {
                        vm.triggerRestoreState();
                    },
                    RELOAD_TIMEOUT
                );
            }
        }

        function setFilterInfo () {
            var i;
            vm.refineModel = angular.copy(vm.defaultRefineModel);
            vm.filterItems = {
                pageSize: '50',
                acbItems: [],
            };
            for (i = 0; i < vm.refineModel.acb.length; i++) {
                vm.filterItems.acbItems.push({value: vm.refineModel.acb[i], selected: true});
            }
        }
    }
})();
