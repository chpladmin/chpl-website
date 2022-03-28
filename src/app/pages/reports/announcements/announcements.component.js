export const ReportsAnnouncementsComponent = {
  templateUrl: 'chpl.reports/announcements/announcements.html',
  controller: class ReportsAnnouncementsComponent {
    constructor ($filter, $log, ReportService, networkService, utilService) {
      'ngInject';
      this.$filter = $filter;
      this.$log = $log;
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

      // to delete
      this.activityRange = {
        range: 30,
        startDate: new Date(),
        endDate: new Date(),
      };
      this.activityRange.startDate.setDate(this.activityRange.endDate.getDate() - this.activityRange.range + 1); // offset to account for inclusion of endDate in range
      this.filename = 'Reports_' + new Date().getTime() + '.csv';
      this.filterText = '';
      this.tableController = {};
    }

    $onInit () {
      this.search();
    }

    $onDestroy () {
      this.isDestroyed = true;
    }

    onApplyFilter (filterObj) {
      let f = angular.fromJson(filterObj);
      this.doFilter(f);
    }

    onClearFilter () {
      let filterData = {};
      filterData.dataFilter = '';
      filterData.tableState = this.tableController.tableState();
      this.clearFilterHs.forEach(handler => handler());
      this.doFilter(filterData);
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

    createFilterDataObject () {
      let filterData = {};
      filterData.startDate = this.ReportService.coerceToMidnight(this.activityRange.startDate);
      filterData.endDate = this.ReportService.coerceToMidnight(this.activityRange.endDate);
      filterData.dataFilter = this.filterText;
      filterData.tableState = {};
      filterData.tableState = this.tableController.tableState();
      return filterData;
    }

    tableStateListener (tableController) {
      this.tableController = tableController;
    }

    parse (meta) {
      return this.networkService.getActivityById(meta.id).then(item => {
        let action = '';
        if (this.isActivityDeletedAnnouncement(item)) {
          action = 'Announcement was deleted.';
        } else if (this.isActivityNewAnnouncement(item)) {
          action = 'Announcement was created.';
        } else if (item.originalData && item.newData) {
          action = 'Announcement was updated.';
          action += this.getUpdateActivity(item);
        }

        meta.action = action;
        meta.csvDetails = action;
      });
    }

    isActivityNewAnnouncement (detail) {
      return detail.originalData === null && detail.newData;
    }

    isActivityDeletedAnnouncement (detail) {
      return detail.originalData && detail.newData === null;
    }

    getUpdateActivity (detail) {
      let action = '<ul>';
      action += this.wrapAction(this.compareItem(detail, 'title', 'Title'));
      action += this.wrapAction(this.compareItem(detail, 'text', 'Text'));
      action += this.wrapAction(this.compareItem(detail, 'startDate', 'Start Date', 'date'));
      action += this.wrapAction(this.compareItem(detail, 'endDate', 'End Date', 'date'));
      action += this.wrapAction(this.compareBooleanItem(detail, 'isPublic', 'Public'));
      action += '</ul>';
      return action;
    }

    wrapAction (change) {
      if (change) {
        change = '<li>' + change + '</li>';
      } else {
        change = '';
      }
      return change;
    }

    compareItem (detailObject, key, display, filter) {
      return this.ReportService.compareItem(detailObject.originalData, detailObject.newData, key, display, filter);

    }

    compareBooleanItem (detailObject, key, display) {
      if (detailObject.originalData && detailObject.newData) {
        if (detailObject.originalData[key] && !detailObject.newData[key]) {
          //changed to false
          return display + ' changed from true to false';
        } else if (!detailObject.originalData[key] && detailObject.newData[key]) {
          //chnaged to true
          return display + ' changed from false to true';
        }
      }
      return '';
    }

    prepare (item) {
      item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
      item.responsibleUserFullName = item.responsibleUser.fullName;
      item.filterText = item.description + '|' + item.responsibleUserFullName;
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
      this.networkService.getActivityMetadata('announcements')
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
      this.networkService.getActivityMetadata('announcements', {pageNum: page, ignoreLoadingBar: true}).then(results => {
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
  .component('chplReportsAnnouncements', ReportsAnnouncementsComponent);
