(function () {
  angular.module('chpl.search')
    .controller('SearchController', SearchController);

  /** @ngInject */
  function SearchController($analytics, $filter, $interval, $localStorage, $location, $log, $rootScope, $scope, $timeout, $uibModal, CACHE_REFRESH_TIMEOUT, CACHE_TIMEOUT, DateUtil, RELOAD_TIMEOUT, SPLIT_PRIMARY, authService, networkService, utilService) {
    const vm = this;

    vm.DateUtil = DateUtil;
    vm.browseAll = browseAll;
    vm.changeItemsPerPage = changeItemsPerPage;
    vm.clear = clear;
    vm.clearPreviouslyCompared = clearPreviouslyCompared;
    vm.clearPreviouslyViewed = clearPreviouslyViewed;
    vm.hasAnyRole = authService.hasAnyRole;
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
    vm.trackEntry = trackEntry;
    vm.triggerAllowAll = triggerAllowAll;
    vm.triggerClearFilters = triggerClearFilters;
    vm.triggerRestoreState = triggerRestoreState;
    vm.triggerSearch = triggerSearch;
    vm.triggerShowRetired = triggerShowRetired;
    vm.viewCertificationStatusLegend = viewCertificationStatusLegend;
    vm.viewPreviouslyCompared = viewPreviouslyCompared;
    vm.viewPreviouslyViewed = viewPreviouslyViewed;

    activate();

    /// /////////////////////////////////////////////////////////////////

    function activate() {
      $scope.$on('ClearResults', () => {
        vm.clear();
      });

      vm.allowAllHs = [];
      vm.boxes = {};
      vm.categoryChanged = {};
      vm.clearFilterHs = [];
      vm.displayedCps = [];
      vm.isLoading = true;
      vm.isPreLoading = true;
      vm.previouslyIds = [];
      vm.restoreStateHs = [];
      vm.showRetiredHs = [];
      vm.SPLIT_PRIMARY = SPLIT_PRIMARY;
      vm.lookupData = {};
      vm.defaultRefineModel = {
        certificationEdition: {
          2011: false,
          2014: false,
          2015: true,
        },
        certificationStatus: {
          Active: true,
          Retired: false,
          'Suspended by ONC-ACB': true,
          'Withdrawn by Developer': false,
          'Withdrawn by Developer Under Surveillance/Review': false,
          'Withdrawn by ONC-ACB': false,
          'Suspended by ONC': true,
          'Terminated by ONC': false,
        },
      };

      vm.downloadResultsCategories = [
        { display: 'Edition', enabled: true, columns: [{ display: 'Edition', key: 'edition' }] },
        {
          display: 'Product data',
          enabled: true,
          columns: [
            { display: 'Developer', key: 'developer' },
            { display: 'Product', key: 'product' },
            { display: 'Version', key: 'version' },
          ],
        },
        { display: 'Certification Date', enabled: true, columns: [{ display: 'Certification Date', key: 'certificationDate', transform: (date) => $filter('date')(date, 'mediumDate', 'UTC') }] },
        { display: 'CHPL ID', enabled: true, columns: [{ display: 'CHPL ID', key: 'chplProductNumber' }] },
        { display: 'ONC-ACB', enabled: false, columns: [{ display: 'ONC-ACB', key: 'acb' }] },
        { display: 'Practice Type', enabled: false, columns: [{ display: 'Practice Type', key: 'practiceType' }] },
        { display: 'Status', enabled: true, columns: [{ display: 'Status', key: 'certificationStatus' }] },
        { display: 'Details', enabled: true, columns: [{ display: 'Details', key: 'id', transform: (id) => `https://chpl.healthit.gov/#/listing/${id}` }] },
        { display: 'Certification Criteria', enabled: false, columns: [{ display: 'Certification Criteria', key: 'criteriaMet', transform: getCriteriaForCsv }] },
        { display: 'Clinical Quality Measures', enabled: false, columns: [{ display: 'Clinical Quality Measures', key: 'cqmsMet', transform: (cqm) => (cqm ? cqm.split(SPLIT_PRIMARY).sort(utilService.sortCqmActual).join('\n') : '') }] },
        {
          display: 'Surveillance',
          enabled: false,
          columns: [
            { display: 'Total Surveillance', key: 'surveillanceCount' },
            { display: 'Open Surveillance Non-conformities', key: 'openSurveillanceNonConformityCount' },
            { display: 'Closed Surveillance Non-conformities', key: 'closedSurveillanceNonConformityCount' },
          ],
        },
        {
          display: 'Direct Review',
          enabled: false,
          columns: [
            { display: 'Total Direct Reviews', key: 'directReviewCount' },
            { display: 'Open Direct Review Non-conformities', key: 'openDirectReviewNonConformityCount' },
            { display: 'Closed Direct Review Non-conformities', key: 'closedDirectReviewNonConformityCount' },
          ],
        },
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

    function browseAll() {
      $analytics.eventTrack('Browse All', { category: 'Search' });
      vm.triggerClearFilters();
      vm.activeSearch = true;
      setTimestamp();
    }

    function changeItemsPerPage() {
      $analytics.eventTrack('Change Results Per Page', { category: 'Search', label: vm.filterItems.pageSize });
    }

    function clear() {
      delete $localStorage.clearResults;
      vm.triggerClearFilters();
      vm.activeSearch = false;
      if (vm.searchForm) {
        vm.searchForm.$setPristine();
      }
    }

    function clearPreviouslyCompared() {
      vm.previouslyCompared = [];
      vm.previouslyIds = [];
      vm.viewingPreviouslyCompared = false;
      $localStorage.previouslyCompared = [];
      delete $localStorage.viewingPreviouslyCompared;
    }

    function clearPreviouslyViewed() {
      vm.previouslyViewed = [];
      vm.previouslyIds = [];
      vm.viewingPreviouslyViewed = false;
      $localStorage.previouslyViewed = [];
      delete $localStorage.viewingPreviouslyViewed;
    }

    function hasResults() {
      return angular.isDefined(vm.allCps);
    }

    function isCategoryChanged(categories) {
      let ret = false;
      for (let i = 0; i < categories.length; i++) {
        ret = ret || vm.categoryChanged[categories[i]];
      }
      return ret;
    }

    function loadResults() {
      networkService.getAll().then((response) => {
        const results = angular.copy(response.results);
        vm.directReviewsAvailable = response.directReviewsAvailable;
        vm.allCps = [];
        incrementTable(parseAllResults(results));
      }, (error) => {
        $log.debug(error);
      });

      vm.stopCacheRefreshPromise = $interval(vm.refreshResults, CACHE_REFRESH_TIMEOUT * 1000);
    }

    function refreshResults() {
      networkService.getAll().then((response) => {
        const { results } = response;
        vm.allCps = parseAllResults(results);
      }, (error) => {
        $log.debug(error);
      });
    }

    function registerAllowAll(handler) {
      vm.allowAllHs.push(handler);
      const removeHandler = function () {
        vm.allowAllHs = vm.allowAllHs.filter((aHandler) => aHandler !== handler);
      };
      return removeHandler;
    }

    function registerClearFilter(handler) {
      vm.clearFilterHs.push(handler);
      const removeHandler = function () {
        vm.clearFilterHs = vm.clearFilterHs.filter((aHandler) => aHandler !== handler);
      };
      return removeHandler;
    }

    function registerRestoreComponents(handler) {
      vm.restoreComponents = [handler];
      const removeHandler = function () {
        vm.restoreComponents = vm.restoreComponents.filter((aHandler) => aHandler !== handler);
      };
      return removeHandler;
    }

    function registerRestoreState(handler) {
      vm.restoreStateHs.push(handler);
      const removeHandler = function () {
        vm.restoreStateHs = vm.restoreStateHs.filter((aHandler) => aHandler !== handler);
      };
      return removeHandler;
    }

    function registerSearch(handler) {
      vm.tableSearch = [handler];
      const removeHandler = function () {
        vm.tableSearch = vm.tableSearch.filter((aHandler) => aHandler !== handler);
      };
      return removeHandler;
    }

    function registerShowRetired(handler) {
      vm.showRetiredHs.push(handler);
      const removeHandler = function () {
        vm.showRetiredHs = vm.showRetiredHs.filter((aHandler) => aHandler !== handler);
      };
      return removeHandler;
    }

    function reloadResults() {
      vm.activeSearch = true;
      setTimestamp();
      restoreResults();
    }

    function stopCacheRefresh() {
      if (angular.isDefined(vm.stopCacheRefreshPromise)) {
        $interval.cancel(vm.stopCacheRefreshPromise);
        vm.stopCacheRefreshPromise = undefined;
      }
    }

    function trackEntry(type, value) {
      if (!value) { return; }
      const event = `Enter value into ${type} Search`;
      $analytics.eventTrack(event, { category: 'Search', label: value });
    }

    function triggerAllowAll() {
      vm.previouslyIds = [];
      vm.viewingPreviouslyCompared = false;
      delete $localStorage.viewingPreviouslyCompared;
      vm.viewingPreviouslyViewed = false;
      delete $localStorage.viewingPreviouslyViewed;
      angular.forEach(vm.allowAllHs, (handler) => {
        handler();
      });
    }

    function triggerClearFilters() {
      vm.previouslyIds = [];
      vm.viewingPreviouslyCompared = false;
      delete $localStorage.viewingPreviouslyCompared;
      vm.viewingPreviouslyViewed = false;
      delete $localStorage.viewingPreviouslyViewed;
      angular.forEach(vm.clearFilterHs, (handler) => {
        handler();
      });
      vm.triggerSearch();
    }

    function triggerRestoreState() {
      if ($localStorage.searchTableState) {
        const state = angular.fromJson($localStorage.searchTableState);
        angular.forEach(vm.restoreStateHs, (handler) => {
          handler(state);
        });
      }
    }

    function triggerSearch() {
      if (vm.tableSearch && vm.tableSearch[0]) {
        vm.tableSearch[0]();
      }
    }

    function triggerShowRetired() {
      vm.previouslyIds = [];
      vm.viewingPreviouslyCompared = false;
      delete $localStorage.viewingPreviouslyCompared;
      vm.viewingPreviouslyViewed = false;
      delete $localStorage.viewingPreviouslyViewed;
      angular.forEach(vm.showRetiredHs, (handler) => {
        handler();
      });
    }

    function viewCertificationStatusLegend() {
      $analytics.eventTrack('View Certification Status Icon Legend', { category: 'Search' });
      vm.viewCertificationStatusLegendInstance = $uibModal.open({
        templateUrl: 'chpl.components/certification-status/certification-status.html',
        controller: 'CertificationStatusController',
        controllerAs: 'vm',
        animation: false,
        backdrop: 'static',
        keyboard: false,
        size: 'lg',
      });
    }

    function viewPreviouslyCompared(doNotSearch) {
      if (!doNotSearch) {
        vm.triggerClearFilters();
        vm.triggerAllowAll();
      }
      $localStorage.viewingPreviouslyCompared = true;
      vm.viewingPreviouslyCompared = true;
      vm.previouslyIds = [{ value: -1, selected: false }];
      angular.forEach(vm.previouslyCompared, (id) => {
        vm.previouslyIds.push({ value: id, selected: true });
      });
      if (!doNotSearch) {
        $analytics.eventTrack('View Previously Compared', { category: 'Search' });
        vm.triggerSearch();
      }
    }

    function viewPreviouslyViewed(doNotSearch) {
      if (!doNotSearch) {
        vm.triggerClearFilters();
        vm.triggerAllowAll();
      }
      $localStorage.viewingPreviouslyViewed = true;
      vm.viewingPreviouslyViewed = true;
      vm.previouslyIds = [{ value: -1, selected: false }];
      angular.forEach(vm.previouslyViewed, (id) => {
        vm.previouslyIds.push({ value: id, selected: true });
      });
      if (!doNotSearch) {
        $analytics.eventTrack('View Previously Viewed', { category: 'Search' });
        vm.triggerSearch();
      }
    }

    /// /////////////////////////////////////////////////////////////////

    function getCriteriaForCsv(crit) {
      let ret = '';
      if (crit) {
        ret = crit.split(SPLIT_PRIMARY)
          .map((id) => vm.lookupData.certificationCriteria.find((cc) => cc.id === parseInt(id, 10)))
          .filter((id) => id !== undefined)
          .sort(utilService.sortCertActual)
          .map((cc) => `${cc.number}: ${cc.title}`)
          .join('\n');
      }
      return ret;
    }

    function incrementTable(results) {
      const delay = 100; const
        size = 500;
      if (results.length > 0) {
        vm.isPreLoading = false;
        vm.allCps = vm.allCps.concat(results.splice(0, size));
        $timeout(() => {
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

    function manageStorage() {
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

    function parseAllResults(results) {
      for (let i = 0; i < results.length; i++) {
        results[i].mainSearch = [results[i].developer, results[i].product, results[i].acbCertificationId, results[i].chplProductNumber].join('|');
        results[i].edition = results[i].edition + (results[i].curesUpdate ? ' Cures Update' : '');
        results[i].developerSearch = results[i].developer;
        if (results[i].previousDevelopers) {
          results[i].mainSearch += `|${results[i].previousDevelopers}`;
          results[i].developerSearch += `|${results[i].previousDevelopers}`;
        }
        results[i].compliance = angular.toJson({
          complianceCount: results[i].surveillanceCount + results[i].directReviewCount,
          openNonConformityCount: results[i].openSurveillanceNonConformityCount + results[i].openDirectReviewNonConformityCount,
          closedNonConformityCount: results[i].closedSurveillanceNonConformityCount + results[i].closedDirectReviewNonConformityCount,
        });
        results[i].criteriaMet = SPLIT_PRIMARY + results[i].criteriaMet + SPLIT_PRIMARY;
      }
      return results;
    }

    function populateSearchOptions() {
      networkService.getSearchOptions()
        .then((options) => {
          options.practiceTypes = options.practiceTypes.map((ptn) => ptn.name);
          vm.searchOptions = options;
          vm.lookupData.certificationCriteria = angular.copy(options.certificationCriteria);
          setFilterInfo(vm.defaultRefineModel);
        });
    }

    function restoreResults() {
      if ($localStorage.searchTableState && $localStorage.searchTimestamp) {
        const nowStamp = Math.floor((new Date()).getTime() / 1000 / 60);
        const difference = nowStamp - $localStorage.searchTimestamp;
        vm.hasTableState = true;

        if (difference > CACHE_TIMEOUT) {
          vm.activeSearch = false;
        } else {
          $timeout(
            () => {
              vm.triggerRestoreState();
            },
            RELOAD_TIMEOUT,
          );
          vm.activeSearch = true;
          setTimestamp();
        }
      } else {
        vm.hasTableState = false;
      }
    }

    function setFilterInfo(refineModel) {
      let i; let
        obj;
      vm.refineModel = angular.copy(refineModel);
      vm.filterItems = {
        pageSize: '50',
        acbItems: [],
        cqms: { 2011: [], other: [] },
        criteria: {
          2011: [], 2014: [], 2015: [], '2015Cures': [],
        },
        editionItems: [],
        statusItems: [],
      };
      vm.filterItems.acbItems = vm.searchOptions.acbs
        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
        .map((a) => {
          const ret = {
            value: a.name,
          };
          if (a.retired) {
            ret.display = `Retired | ${a.name}`;
            ret.retired = true;
            ret.selected = ((new Date()).getTime() - a.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4);
          } else {
            ret.selected = true;
          }
          return ret;
        });
      vm.filterItems.editionItems = vm.searchOptions.editions
        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
        .map((edition) => {
          const obj = {
            value: edition.name,
            selected: vm.defaultRefineModel.certificationEdition[edition.name],
          };
          if (edition.name === '2011' || edition.name === '2014') {
            obj.selected = false;
            obj.display = `Retired | ${obj.value}`;
            obj.retired = true;
          }
          return obj;
        });
      vm.filterItems.editionItems.push({
        value: '2015 Cures Update',
        selected: true,
      });
      vm.filterItems.statusItems = vm.searchOptions.certificationStatuses
        .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))
        .map((status) => {
          const obj = {
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
        .forEach((crit) => {
          obj = {
            analyticsLabel: crit.number + (utilService.isCures(crit) ? ' (Cures Update)' : ''),
            value: crit.id,
            selected: false,
            display: `${(crit.removed ? 'Removed | ' : '') + crit.number}: ${crit.title}`,
            removed: crit.removed,
          };
          if (crit.certificationEdition === '2011' || crit.certificationEdition === '2014') {
            obj.display = `Retired | ${obj.display}`;
            obj.retired = true;
          }
          if (utilService.isCures(crit)) {
            vm.filterItems.criteria['2015Cures'].push(angular.copy(obj));
          } else {
            vm.filterItems.criteria[crit.certificationEdition].push(obj);
          }
        });
      vm.searchOptions.cqms = $filter('orderBy')(vm.searchOptions.cqms, utilService.sortCqm);
      for (i = 0; i < vm.searchOptions.cqms.length; i++) {
        const cqm = vm.searchOptions.cqms[i];
        obj = {
          selected: false,
        };
        if (cqm.name.substring(0, 3) === 'CMS') {
          obj.value = cqm.name;
          obj.display = `${cqm.name}: ${cqm.title}`;
          vm.filterItems.cqms.other.push(obj);
        } else {
          obj.value = `NQF-${cqm.name}`;
          obj.display = `Retired | NQF-${cqm.name}: ${cqm.title}`;
          obj.retired = true;
          vm.filterItems.cqms[2011].push(obj);
        }
      }
    }

    function setTimestamp() {
      if (vm.activeSearch) {
        $localStorage.searchTimestamp = Math.floor((new Date()).getTime() / 1000 / 60);
      }
      if (vm.timestampPromise !== null) {
        $timeout.cancel(vm.timestampPromise);
      }
      vm.timestampPromise = $timeout(() => {
        setTimestamp();
      }, 60000); // set timestamp every minute while search is active
    }

    $scope.$on('$destroy', () => {
      vm.stopCacheRefresh();
    });
  }
}());
