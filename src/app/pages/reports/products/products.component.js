import { compareProduct } from './products.service';

const ReportsProductsComponent = {
  templateUrl: 'chpl.reports/products/products.html',
  controller: class ReportsProductsComponent {
    constructor($filter, $log, $scope, ReportService, networkService, utilService) {
      'ngInject';

      this.$filter = $filter;
      this.$log = $log;
      this.$scope = $scope;
      this.ReportService = ReportService;
      this.networkService = networkService;
      this.utilService = utilService;

      this.results = [];
      this.displayed = [];
      this.clearFilterHs = [];
      this.restoreStateHs = [];
      this.filename = `Reports_${new Date().getTime()}.csv`;
      this.filterText = '';
      this.tableController = {};
      this.loadProgress = {
        total: 0,
        complete: 0,
      };
      this.downloadProgress = { complete: 0 };
      this.pageSize = 50;
    }

    $onInit() {
      this.search();
    }

    $onDestroy() {
      this.isDestroyed = true;
    }

    doFilter(filter) {
      const that = this;

      this.filterText = filter.dataFilter;
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

    tableStateListener(tableController) {
      this.tableController = tableController;
    }

    parse(meta) {
      return this.networkService.getActivityById(meta.id).then((item) => {
        const activity = {
          action: '',
          details: [],
          developer: item.developer ? item.developer.name : '',
          date: item.activityDate,
          id: item.id,
        };
        if (item.originalData && !angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // both exist, both not arrays; update
          activity.action = `Updated product "${item.newData.name}"`;
          activity.details = compareProduct(item.originalData, item.newData);
        } else if (item.originalData && angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // merge
          activity.action = `Products ${item.originalData.map((d) => d.name).join(' and ')} merged to form ${item.newData.name}`;
          activity.details = [];
        } else if (item.originalData && !angular.isArray(item.originalData) && item.newData && angular.isArray(item.newData)) { // split
          activity.action = `Products ${item.originalData.name} split to become Products ${item.newData[0].name} and ${item.newData[1].name}`;
          activity.details = [];
        } else {
          this.ReportService.interpretNonUpdate(activity, item, 'product');
          activity.action = activity.action[0];
          activity.details = [];
        }
        meta.action = activity.action;
        meta.details = activity.details;
        meta.csvDetails = activity.details.join('\n');
      });
    }

    prepare(item) {
      return {
        ...item,
        filterText: `${item.developerName}|${item.productName}|${item.responsibleUser.fullName}`,
        friendlyActivityDate: new Date(item.date).toISOString().substring(0, 10),
        fullName: item.responsibleUser.fullName,
      };
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
            this.downloadProgress.complete = Math.floor(100 * ((progress + 1) / total));
          });
        });
      // todo, eventually: use the $q.all function as demonstrated in product history eye
    }

    showLoadingBar() {
      const tableState = this.tableController.tableState && this.tableController.tableState();
      return this.ReportService.showLoadingBar(tableState, this.results, this.loadProgress);
    }

    search() {
      const that = this;
      this.networkService.getActivityMetadata('products')
        .then((results) => {
          that.results = results.activities
            .map((item) => that.prepare(item));
          that.loadProgress.total = (Math.floor(results.resultSetSize / results.pageSize) + (results.resultSetSize % results.pageSize === 0 ? 0 : 1));
          const filter = {};
          filter.dataFilter = '';
          filter.tableState = this.tableController.tableState();
          filter.tableState.search = {
            predicateObject: {
              date: {
                after: new Date('2016-04-01').getTime(),
                before: this.ReportService.coerceToMidnight(new Date(), true).getTime(),
              },
            },
          };
          that.doFilter(filter);
          that.addPageToData(1);
        });
    }

    addPageToData(page) {
      const that = this;
      if (this.isDestroyed) { return; }
      this.networkService.getActivityMetadata('products', { pageNum: page, ignoreLoadingBar: true }).then((results) => {
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
  },
};

angular.module('chpl.reports')
  .component('chplReportsProducts', ReportsProductsComponent);

export default ReportsProductsComponent;
