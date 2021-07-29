(() => {
  /** @ngInject */
  function aiCollection() {
    return {
      bindToController: {
        callFunction: '&?',
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
      templateUrl: 'chpl.collections/collection.html',
      transclude: {
        aiBodyText: 'aiBodyText',
        aiErrorText: '?aiErrorText',
        aiFooterText: '?aiFooterText',
        aiTitle: 'aiTitle',
      },
    };
  }

  /** @ngInject */
  function CollectionController($analytics, $filter, $interval, $localStorage, $log, $scope, $timeout, CACHE_REFRESH_TIMEOUT, DateUtil, RELOAD_TIMEOUT, collectionsService, networkService) {
    const vm = this;

    vm.changeItemsPerPage = changeItemsPerPage;
    vm.hasError = hasError;
    vm.hasResults = hasResults;
    vm.isCategoryChanged = isCategoryChanged;
    vm.isFilterActive = isFilterActive;
    vm.loadResults = loadResults;
    vm.parseDataElement = parseDataElement;
    vm.refreshResults = refreshResults;
    vm.registerClearFilter = registerClearFilter;
    vm.registerSearch = registerSearch;
    vm.stopCacheRefresh = stopCacheRefresh;
    vm.trackEntry = trackEntry;
    vm.triggerClearFilters = triggerClearFilters;
    vm.triggerSearch = triggerSearch;

    this.$onInit = () => {
      vm.categoryChanged = {};
      vm.clearFilterHs = [];
      vm.isPreLoading = true;

      if (!vm.searchText) {
        vm.searchText = 'Search by Developer, Product, Version, or CHPL ID';
      }
      networkService.getSearchOptions().then((options) => {
        vm.options = options;
        vm.loadResults();
        setFilterInfo();
      });
    };

    function changeItemsPerPage() {
      $analytics.eventTrack('Change Results Per Page', { category: vm.analyticsCategory, label: vm.filterItems.pageSize });
    }

    function hasError() {
      return vm.hasResults() && vm.collectionKey === 'correctiveAction' && !vm.directReviewsAvailable;
    }

    function hasResults() {
      return angular.isDefined(vm.allCps);
    }

    function isCategoryChanged() {
      let ret = false;
      for (let i = 0; i < vm.filters.length; i += 1) {
        ret = ret || vm.categoryChanged[vm.filters[i]];
      }
      return ret;
    }

    function isFilterActive(key) {
      return vm.filters && vm.filters.length > 0 && vm.filters.indexOf(key) > -1;
    }

    function loadResults() {
      refreshResults();
      vm.stopCacheRefreshPromise = $interval(vm.refreshResults, CACHE_REFRESH_TIMEOUT * 1000);
    }

    function parseDataElement(cp, col) {
      let ret = cp[col.predicate];
      if (col.nullDisplay && (ret === null || angular.isUndefined(ret))) {
        ret = col.nullDisplay;
      }
      if (col.transformFn) {
        ret = col.transformFn(ret, cp, vm.analyticsCategory);
      }
      if (col.isDate) {
        ret = DateUtil.getDisplayDateFormat(ret);
      }
      if (col.isDeveloperLink) {
        const link = `<a ui-sref="organizations.developers.developer({developerId: ${cp.developerId}})" analytics-on="click" analytics-event="Go to Developer Page" analytics-properties="{ category: '${vm.analyticsCategory}' }">${ret}</a>`;
        ret = link;
      }
      if (col.isLink) {
        let link = `<a ui-sref="listing({id: ${cp.id}`;
        if (col.initialPanel) {
          link += `, panel: '${col.initialPanel}'`;
        }
        link += `})" analytics-on="click" analytics-event="Go to Listing Details Page" analytics-properties="{ category: '${vm.analyticsCategory}' }">${ret}</a>`;
        ret = link;
      }
      return ret;
    }

    function refreshResults() {
      networkService.getCollection(vm.collectionKey).then((response) => {
        response.certificationCriteria = vm.options.certificationCriteria;
        vm.allCps = collectionsService.translate(vm.collectionKey, response);
        vm.analyticsCategory = collectionsService.getAnalyticsCategory(vm.collectionKey);
        vm.isPreLoading = false;
        vm.directReviewsAvailable = response.directReviewsAvailable;
      }, (error) => {
        $log.debug(error);
      });
    }

    function registerClearFilter(handler) {
      vm.clearFilterHs.push(handler);
      const removeHandler = function () {
        vm.clearFilterHs = vm.clearFilterHs.filter((aHandler) => aHandler !== handler);
      };
      return removeHandler;
    }

    function registerSearch(handler) {
      vm.tableSearchHs = [handler];
      const removeHandler = function () {
        vm.tableSearchHs = vm.tableSearchHs.filter((aHandler) => aHandler !== handler);
      };
      return removeHandler;
    }

    function stopCacheRefresh() {
      if (angular.isDefined(vm.stopCacheRefreshPromise)) {
        $interval.cancel(vm.stopCacheRefreshPromise);
        vm.stopCacheRefreshPromise = undefined;
      }
    }

    function trackEntry(value) {
      if (!value) { return; }
      const event = 'Enter value into Search';
      $analytics.eventTrack(event, { category: vm.analyticsCategory, label: value });
    }

    function triggerClearFilters() {
      angular.forEach(vm.clearFilterHs, (handler) => {
        handler();
      });
      vm.triggerSearch();
    }

    function triggerSearch() {
      if (vm.tableSearchHs && vm.tableSearchHs[0]) {
        vm.tableSearchHs[0]();
      }
    }

    /// /////////////////////////////////////////////////////////////////

    function setFilterInfo() {
      vm.filterItems = {
        pageSize: '50',
      };
      if (vm.isFilterActive('acb')) {
        vm.filterItems.acbItems = vm.options.acbs
          .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
          .map((acb) => {
            const ret = {
              value: acb.name,
              retired: acb.retired,
            };
            if (acb.retired) {
              ret.display = `${ret.value} (Retired)`;
              ret.selected = ((new Date()).getTime() - acb.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4);
            } else {
              ret.selected = true;
            }
            return ret;
          });
      }
      if (vm.isFilterActive('certificationStatus')) {
        vm.filterItems.statusItems = angular.copy(vm.refineModel.certificationStatus);
      }
      if (vm.isFilterActive('edition')) {
        vm.filterItems.editionItemsCures = [
          { value: '2015', selected: true },
          { value: '2015 Cures Update', selected: true },
        ];
        vm.filterItems.editionItems = [
          { value: '2014', selected: true },
          { value: '2015', selected: true },
        ];
      }
    }

    $scope.$on('$destroy', () => {
      vm.stopCacheRefresh();
    });
  }

  angular.module('chpl.collections')
    .directive('aiCollection', aiCollection)
    .controller('CollectionController', CollectionController);
})();
