(function () {
    'use strict';

    angular.module('chpl.collections')
        .directive('aiCollection', aiCollection)
        .controller('CollectionController', CollectionController);

    /** @ngInject */
    function aiCollection () {
        return {
            bindToController: {
                collection: '@',
                columns: '=',
                dataStore: '@',
                filter: '&',
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
    function CollectionController ($filter, $localStorage, $log, $timeout, RELOAD_TIMEOUT, commonService) {
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

            setFilterInfo();
            restoreResults();
            vm.loadResults();
        }

        /*
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
        */

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
            $log.debug('loadResults');
            commonService.getCollection(vm.collection).then(function (response) {
                var results = response.results;
                vm.allCps = $filter('apiCriteriaFilter')(results, {edition: '2015'});
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
            if ($localStorage[vm.dataStore]) {
                var state = angular.fromJson($localStorage[vm.dataStore]);
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
            if ($localStorage[vm.dataStore]) {
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
            vm.filterItems = {
                pageSize: '50',
            };
        }
    }
})();
