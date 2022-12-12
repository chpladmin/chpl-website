export const ReportsVersionsComponent = {
  templateUrl: 'chpl.reports/versions/versions.html',
  controller: class ReportsVersionsComponent {
    constructor ($log, $scope, ReportService, networkService, utilService) {
      'ngInject';
      this.$log = $log;
      this.$scope = $scope;
      this.ReportService = ReportService;
      this.networkService = networkService;
      this.utilService = utilService;

      this.results = [];
      this.displayed = [];
      this.clearFilterHs = [];
      this.restoreStateHs = [];
      this.filename = 'Reports_' + new Date().getTime() + '.csv';
      this.filterText = '';
      this.tableController = {};
      this.loadProgress = {
        total: 0,
        complete: 0,
      };
      this.downloadProgress = { complete: 0 };
      this.pageSize = 50;
    }

    $onInit () {
      this.search();
    }

    $onDestroy () {
      this.isDestroyed = true;
    }

    doFilter (filter) {
      let that = this;
      this.filterText = filter.dataFilter;
      if (filter.tableState.search.predicateObject.date) {
        this.tableController.search(filter.tableState.search.predicateObject.date, 'date');
      } else {
        this.tableController.search({}, 'date');
      }
      this.restoreStateHs.forEach(handler => handler(that.tableController.tableState()));
      this.tableController.sortBy(filter.tableState.sort.predicate, filter.tableState.sort.reverse);
    }

    registerClearFilter (handler) {
      this.clearFilterHs.push(handler);
    }

    registerRestoreState (handler) {
      this.restoreStateHs.push(handler);
    }

    tableStateListener (tableController) {
      this.tableController = tableController;
    }

    parse (meta) {
      return this.networkService.getActivityById(meta.id).then(item => {
        var activity = {
          id: item.id,
          date: item.activityDate,
        };

        var change;
        if (item.originalData && !angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // both exist, neither an array: update
          activity.action = 'Updated version "' + item.newData.version + '"';
          activity.details = [];
          change = this.ReportService.compareItem(item.originalData, item.newData, 'version', 'Version');
          if (change) {
            activity.details.push(change);
          }
          change = this.ReportService.compareItem(item.originalData, item.newData, 'productName', 'Associated Product');
          if (change) {
            activity.details.push(change);
          }
        } else if (item.originalData && angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // both exist, original array, final object: merge
          activity.action = 'Versions ' + item.originalData.map(d => d.version).join(' and ') + ' merged to form ' + item.newData.version;
          activity.details = [];
        } else if (item.originalData && !angular.isArray(item.originalData) && item.newData && angular.isArray(item.newData)) { // both exist, original object, final array: split
          activity.action = 'Versions ' + item.originalData.version + ' split to become Versions ' + item.newData[0].version + ' and ' + item.newData[1].version;
          activity.details = [];
        } else {
          this.ReportService.interpretNonUpdate(activity, item, 'Version', 'version');
          activity.action = activity.action[0];
          activity.details = [];
          activity.csvAction = activity.action.replace(',','","');
        }
        meta.action = activity.action;
        meta.details = activity.details;
        meta.csvDetails = activity.details.join('\n');
      });
    }

    prepare (item) {
      item.filterText = item.developerName + '|' + item.productName + '|' + item.version + '|' + item.responsibleUser.fullName;
      item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
      item.fullName = item.responsibleUser.fullName;
      if (!item.productName) {
        item.productName = 'Undetermined';
      }
      if (!item.developerName) {
        item.developerName = 'Undetermined';
      }
      return item;
    }

    canDownload () {
      return this.displayed
        .filter(item => !item.action).length <= 1000;
    }

    prepareDownload () {
      let total = this.displayed
        .filter(item => !item.action).length;
      let progress = 0;
      this.displayed
        .filter(item => !item.action)
        .forEach(item => {
          this.parse(item).then(() => {
            progress += 1;
            this.downloadProgress.complete = Math.floor(100 * ((progress + 1) / total));
          });
        });
      //todo, eventually: use the $q.all function as demonstrated in product history eye
    }

    showLoadingBar () {
      let tableState = this.tableController.tableState && this.tableController.tableState();
      return this.ReportService.showLoadingBar(tableState, this.results, this.loadProgress);
    }

    search () {
      let that = this;
      this.networkService.getActivityMetadata('versions')
        .then(results => {
          that.results = results.activities
            .map(item => that.prepare(item));
          that.loadProgress.total = (Math.floor(results.resultSetSize / results.pageSize) + (results.resultSetSize % results.pageSize === 0 ? 0 : 1));
          let filter = {};
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

    addPageToData (page) {
      let that = this;
      if (this.isDestroyed) { return; }
      this.networkService.getActivityMetadata('versions', {pageNum: page, ignoreLoadingBar: true}).then(results => {
        results.activities.forEach(item => {
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
  .component('chplReportsVersions', ReportsVersionsComponent);
