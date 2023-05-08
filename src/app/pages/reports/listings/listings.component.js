import { compareListing } from './listings.service';

const ReportsListingsComponent = {
  templateUrl: 'chpl.reports/listings/listings.html',
  controller: class ReportsListingsComponent {
    constructor($filter, $log, $state, $stateParams, $uibModal, DateUtil, ReportService, authService, networkService, utilService) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.$uibModal = $uibModal;
      this.DateUtil = DateUtil;
      this.ReportService = ReportService;
      this.authService = authService;
      this.networkService = networkService;
      this.utilService = utilService;

      this.results = [];
      this.displayed = [];
      this.categoriesFilter = '|LISTING|';
      this.clearFilterHs = [];
      this.restoreStateHs = [];
      this.filename = `Reports_${new Date().getTime()}.csv`;
      this.filterText = '';
      this.tableController = {};
      this.loadProgress = {
        total: 0,
        complete: 0,
      };
      this.downloadProgress = 0;
      this.pageSize = 50;
      this.defaultDateRangeOffset = 60 * 24 * 60 * 60 * 1000; // 60 days
    }

    $onInit() {
      const that = this;
      const user = this.authService.getCurrentUser();
      this.networkService.getSearchOptions()
        .then((options) => {
          that.acbItems = options.acbs
            .sort((a, b) => (a.name < b.name ? -1 : 1))
            .map((a) => {
              const ret = {
                value: a.id,
                display: a.name,
              };
              if (a.retired) {
                ret.display = `${a.name} (Retired)`;
                ret.retired = true;
                ret.selected = true;
              } else {
                ret.selected = that.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
                  || user.organizations.filter((o) => o.name === a.name).length > 0;
              }
              return ret;
            });
        });
      if (this.$stateParams.listingId) {
        this.listingId = this.$stateParams.listingId;
      }
      this.search();
    }

    $onDestroy() {
      this.isDestroyed = true;
    }

    doFilter(filter) {
      const that = this;
      this.filterText = filter.dataFilter;
      if (filter.tableState.search.predicateObject.categoriesFilter) {
        this.tableController.search(filter.tableState.search.predicateObject.categoriesFilter, 'categoriesFilter');
      } else {
        this.tableController.search('|LISTING|', 'categoriesFilter');
      }
      if (filter.tableState.search.predicateObject.acbName) {
        this.tableController.search(filter.tableState.search.predicateObject.acbName, 'acbName');
      } else {
        this.tableController.search({}, 'acbName');
      }
      if (filter.tableState.search.predicateObject.date) {
        this.tableController.search(filter.tableState.search.predicateObject.date, 'date');
      } else {
        this.tableController.search({}, 'date');
      }
      this.restoreStateHs.forEach((handler) => handler(that.tableController.tableState()));
      this.tableController.sortBy(filter.tableState.sort.predicate, filter.tableState.sort.reverse);
    }

    registerClearFilter(handler) {
      this.clearFilterHs.push(handler);
    }

    registerRestoreState(handler) {
      this.restoreStateHs.push(handler);
    }

    downloadReady() {
      return this.displayed.reduce((acc, activity) => activity.action && acc, true);
    }

    tableStateListener(tableController) {
      this.tableController = tableController;
    }

    parse(meta) {
      return this.networkService.getActivityById(meta.id, { ignoreLoadingBar: true }).then((item) => {
        const activity = {
          action: '',
          details: [],
        };
        if (item.description === 'Created a certified product') {
          activity.action = 'Created a certified product';
        } else if (item.description.startsWith('Updated certified')) {
          activity.action = 'Updated a certified product';
          activity.details = compareListing(item.originalData, item.newData);
        } else if (item.description.startsWith('Changed ACB ownership')) {
          const changes = ['Changed ONC-ACB ownership'];
          if (item.originalData.chplProductNumber !== item.newData.chplProductNumber) {
            changes.push(`<ul><li>CHPL Product Number changed from ${item.originalData.chplProductNumber} to ${item.newData.chplProductNumber}</li></ul>`);
          }
          activity.action = changes.join('');
        } else if (item.description.startsWith('Surveillance')) {
          if (item.description.startsWith('Surveillance was delete')) {
            activity.action = 'Surveillance was deleted';
          } else if (item.description.startsWith('Surveillance upload')) {
            activity.action = 'Surveillance was uploaded';
          } else if (item.description.startsWith('Surveillance was added')) {
            activity.action = 'Surveillance was added';
          } else if (item.description.startsWith('Surveillance was updated')) {
            activity.action = 'Surveillance was updated';
            activity.details = compareListing(item.originalData, item.newData);
          } else {
            activity.action = `${item.description}`;
          }
        } else if (item.description.startsWith('Documentation')) {
          activity.action = 'Documentation was added to a nonconformity';
          activity.details = compareListing(item.originalData, item.newData);
        } else if (item.description.startsWith('A document was removed')) {
          activity.action = 'Documentation was removed from a nonconformity';
          activity.details = compareListing(item.originalData, item.newData);
        } else {
          activity.action = item.description;
        }
        meta.action = activity.action;
        meta.details = activity.details;
        meta.csvDetails = activity.details.join('\n').substring(0, 32000);
      });
    }

    prepare(item, full) {
      const ret = {
        ...item,
        filterText: `${item.developerName}|${item.productName}|${item.chplProductNumber}`,
        categoriesFilter: `|${item.categories.join('|')}|`,
        friendlyActivityDate: new Date(item.date).toISOString().substring(0, 10),
        friendlyCertificationDate: new Date(item.certificationDate).toISOString().substring(0, 10),
        edition: item.edition + (item.curesUpdate ? ' Cures Update' : ''),
      };
      if (full) {
        this.parse(ret);
        ret.showDetails = true;
      }
      return ret;
    }

    canDownload() {
      return this.displayed
        .filter((item) => !item.action).length <= 1000;
    }

    prepareDownload() {
      const total = this.displayed
        .filter((item) => !item.action).length;
      let progress = 0;
      this.displayed
        .filter((item) => !item.action)
        .forEach((item) => {
          this.parse(item).then(() => {
            progress += 1;
            this.downloadProgress = Math.floor(100 * ((progress + 1) / total));
          });
        });
      // todo, eventually: use the $q.all function as demonstrated in product history eye
    }

    showLoadingBar() {
      const tableState = this.tableController.tableState && this.tableController.tableState();
      let earlyDate = 0;
      const startDate = new Date().getTime();
      if (tableState && tableState.search.predicateObject.date) {
        earlyDate = tableState.search.predicateObject.date.after;
      }
      const earliestDateOfData = this.results
        .map((evt) => evt.date)
        .reduce((acc, cur) => (cur < acc ? cur : acc), startDate);
      const shouldShow = (this.loadProgress.total > 0) && (this.loadProgress.percentage < 100) && (!earlyDate || earliestDateOfData > earlyDate);
      return shouldShow;
    }

    searchAllListings() {
      const that = this;
      this.networkService.getActivityMetadata('listings')
        .then((results) => {
          that.results = results.activities
            .map((item) => that.prepare(item));
          that.loadProgress.total = (Math.floor(results.resultSetSize / results.pageSize) + (results.resultSetSize % results.pageSize === 0 ? 0 : 1));
          const filter = {};
          filter.dataFilter = '';
          filter.tableState = this.tableController.tableState();
          filter.tableState.search.predicateObject.categoriesFilter = '|LISTING|';
          filter.tableState.search.predicateObject.date = {
            after: this.ReportService.coerceToMidnight(new Date()).getTime() - this.defaultDateRangeOffset,
            before: this.ReportService.coerceToMidnight(new Date(), true).getTime(),
          };
          that.doFilter(filter);
          that.addPageToData(1);
        });
    }

    addPageToData(page) {
      const that = this;
      if (this.isDestroyed) { return; }
      this.networkService.getActivityMetadata('listings', { pageNum: page, ignoreLoadingBar: true }).then((results) => {
        results.activities.forEach((item) => {
          that.results.push(that.prepare(item));
        });
        that.loadProgress.complete += 1;
        that.loadProgress.percentage = Math.floor(100 * ((that.loadProgress.complete + 1) / that.loadProgress.total));
        if (page < that.loadProgress.total) {
          that.addPageToData(page + 1);
        }
      });
    }

    searchSingleListingId() {
      const that = this;
      this.networkService.getSingleListingActivityMetadata(this.listingId)
        .then((results) => {
          that.results = results
            .map((item) => that.prepare(item, true));
        });
    }

    search() {
      if (this.listingId) {
        this.searchSingleListingId();
      } else {
        this.searchAllListings();
      }
    }
  },
};

angular.module('chpl.reports')
  .component('chplReportsListings', ReportsListingsComponent);

export default ReportsListingsComponent;
