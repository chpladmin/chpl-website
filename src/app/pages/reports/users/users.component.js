export const ReportsUsersComponent = {
  templateUrl: 'chpl.reports/users/users.html',
  controller: class ReportsUsersComponent {
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
        let action = '';
        if (this.isActivityRoleChange(item)) {
          action = item.description;
        } else if (this.isActivityDeletedUser(item)) {
          action = 'User ' + (item.originalData.subjectName || item.originalData.email) + ' was deleted';
          let changedOrgDescription = this.getOrganizationActionDescriptionIfChanged(item);
          if (changedOrgDescription !== null && changedOrgDescription !== '') {
            action += '<ul>' + changedOrgDescription + '</ul>';
          }
        } else if (this.isActivityNewUser(item)) {
          action = 'User ' + (item.newData.subjectName || item.newData.email) + ' was created.';
        } else if (this.isActivtyConfirmUser(item)) {
          action = 'User ' + (item.newData.subjectName || item.newData.email) + ' was confirmed.';
        } else if (item.originalData && item.newData) {
          action = 'User ' + (item.newData.subjectName || item.newData.email) + ' was updated.';
          action += this.getUpdateActivity(item);
        }

        meta.action = action;
        meta.csvDetails = action;
      });
    }

    isActivityRoleChange (detail) {
      return detail.description.includes(' role ');
    }

    isActivityNewUser (detail) {
      return detail.originalData === null && detail.newData;
    }

    isActivityDeletedUser (detail) {
      return detail.originalData && detail.newData === null;
    }

    isActivtyConfirmUser (detail) {
      return detail.originalData && detail.originalData.signatureDate === null
                && detail.newData && detail.newData.signatureDate !== null;
    }

    getUpdateActivity (detail) {
      let action = '<ul>';
      action += this.getActionDescriptionIfChanged(detail, 'subjectName', 'Subject Name');
      action += this.getActionDescriptionIfChanged(detail, 'fullName', 'Full Name');
      action += this.getActionDescriptionIfChanged(detail, 'friendlyName', 'Friendly Name');
      action += this.getActionDescriptionIfChanged(detail, 'email', 'Email');
      action += this.getActionDescriptionIfChanged(detail, 'phoneNumber', 'Phone Number');
      action += this.getActionDescriptionIfChanged(detail, 'title', 'Title');
      action += this.getActionDescriptionIfChanged(detail, 'signatureDate', 'Confirmation Date');
      action += this.getActionDescriptionIfChanged(detail, 'failedLoginCount', 'Failed Login Count');
      action += this.getActionDescriptionIfChanged(detail, 'accountExpired', 'Account Expired');
      action += this.getActionDescriptionIfChanged(detail, 'accountLocked', 'Account Locked');
      action += this.getActionDescriptionIfChanged(detail, 'credentialsExpired', 'Credentials Expired');
      action += this.getActionDescriptionIfChanged(detail, 'accountEnabled', 'Account Enabled');
      action += this.getActionDescriptionIfChanged(detail, 'passwordResetRequired', 'Password Reset Required');
      action += this.getActionDescriptionIfChanged(detail, 'enabled', 'Enabled');
      action += this.getActionDescriptionIfChanged(detail, 'userName', 'User Name');
      action += this.getOrganizationActionDescriptionIfChanged(detail);
      action += '</ul>';
      return action;
    }

    getActionDescriptionIfChanged (detailObject, key, display) {
      let change = this.ReportService.compareItem(detailObject.originalData, detailObject.newData, key, display);
      if (change) {
        change = '<li>' + change + '</li>';
      } else {
        change = '';
      }
      return change;
    }

    getOrganizationActionDescriptionIfChanged (detailObject) {
      let action = '';
      var orgKeys = [{key: 'organizations', display: 'Organizations'}];
      var origOrgs = (detailObject.originalData === null || detailObject.originalData === undefined
                            || detailObject.originalData.organizations === null || detailObject.originalData.organizations === undefined) ? [] : detailObject.originalData.organizations;
      var newOrgs = (detailObject.newData === null || detailObject.newData === undefined
                            || detailObject.newData.organizations === null || detailObject.newData.organizations === undefined) ? [] : detailObject.newData.organizations;
      var orgChanges = this.ReportService.compareArray(origOrgs, newOrgs, orgKeys, 'name');
      if (orgChanges !== null && orgChanges.length > 0) {
        for (let j = 0; j < orgChanges.length; j++) {
          if (orgChanges[j] !== null && orgChanges[j].changes !== null && orgChanges[j].changes.length > 0) {
            for (let k = 0; k < orgChanges[j].changes.length; k++) {
              action += orgChanges[j].changes[k];
            }
          }
        }
      }
      return action;
    }

    prepare (item) {
      item.filterText = item.email + '|' + item.subjectName + '|' + item.responsibleUser.fullName;
      item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
      item.responsibleUserFullName = item.responsibleUser.fullName;
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
      this.networkService.getActivityMetadata('users')
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
      this.networkService.getActivityMetadata('users', {pageNum: page, ignoreLoadingBar: true}).then(results => {
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
  .component('chplReportsUsers', ReportsUsersComponent);
