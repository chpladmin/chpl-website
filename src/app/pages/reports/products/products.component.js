import { compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

const compareOwnerHistory = (before, after) => {
  var ownerHistoryActionDetails = 'Owner history changed. Was:<ul>';
  let j;
  if (before.length === 0 && after.length === 0) { return undefined; }
  if (before.length === 0) {
    ownerHistoryActionDetails += '<li>No previous history</li>';
  } else {
    for (j = 0; j < before.length; j++) {
      ownerHistoryActionDetails += '<li><strong>' + before[j].developer.name + '</strong> on ' + getDisplayDateFormat(before[j].transferDate) + '</li>';
      ownerHistoryActionDetails += '<li><strong>' + before[j].developer.name + '</strong> on ' + getDisplayDateFormat(before[j].transferDay) + '</li>';
    }
  }
  ownerHistoryActionDetails += '</ul>Now:<ul>';
  if (after.length === 0) {
    ownerHistoryActionDetails += '<li>No new history</li>';
  } else {
    for (j = 0; j < after.length; j++) {
      ownerHistoryActionDetails += '<li><strong>' + after[j].developer.name + '</strong> on ' + getDisplayDateFormat(after[j].transferDate) + '</li>';
      ownerHistoryActionDetails += '<li><strong>' + after[j].developer.name + '</strong> on ' + getDisplayDateFormat(after[j].transferDay) + '</li>';
    }
  }
  ownerHistoryActionDetails += '</ul>';
  return ownerHistoryActionDetails;
};

lookup = {
  shortCircuit: ['root.owner.address', 'root.owner.contact'],
  'root.contact': {
    message: () => 'Contact changes',
  },
  'root.contact.contactId': {
    message: () => undefined,
  },
  'root.contact.email': {
    message: (before, after) => comparePrimitive(before, after, 'email', 'Email'),
  },
  'root.contact.firstName': {
    message: (before, after) => comparePrimitive(before, after, 'firstName', 'First Name'),
  },
  'root.contact.fullName': {
    message: (before, after) => comparePrimitive(before, after, 'fullName', 'Full Name'),
  },
  'root.contact.friendlyName': {
    message: (before, after) => comparePrimitive(before, after, 'friendlyName', 'Friendly Name'),
  },
  'root.contact.id': {
    message: () => undefined,
  },
  'root.contact.lastName': {
    message: (before, after) => comparePrimitive(before, after, 'lastName', 'Last Name'),
  },
  'root.contact.phoneNumber': {
    message: (before, after) => comparePrimitive(before, after, 'phoneNumber', 'Phone Number'),
  },
  'root.contact.title': {
    message: (before, after) => comparePrimitive(before, after, 'title', 'Title'),
  },
  'root.developerCode': {
    message: () => undefined,
  },
  'root.developerId': {
    message: () => undefined,
  },
  'root.developerName': {
    message: (before, after) => comparePrimitive(before, after, 'developerName', 'Developer'),
  },
  'root.lastModifiedDate': {
    message: () => undefined,
  },
  'root.lastModifiedUser': {
    message: () => undefined,
  },
  'root.name': {
    message: (before, after) => comparePrimitive(before, after, 'name', 'Product Name'),
  },
  'root.owner': {
    message: () => 'Developer changes',
  },
  'root.owner.attestations': {
    message: () => undefined,
  },
  'root.owner.developerCode': {
    message: () => undefined,
  },
  'root.owner.developerId': {
    message: () => undefined,
  },
  'root.owner.id': {
    message: () => undefined,
  },
  'root.owner.lastModifiedDate': {
    message: () => undefined,
  },
  'root.owner.name': {
    message: (before, after) => comparePrimitive(before, after, 'name', 'Developer'),
  },
  'root.owner.statusEvents': {
    message: () => undefined,
  },
  'root.owner.transparencyAttestationMappings': {
    message: () => undefined,
  },
  'root.owner.website': {
    message: () => undefined,
  },
  'root.ownerHistory': {
    message: compareOwnerHistory,
  },
  'root.productVersions': {
    message: () => undefined,
  },
};

const ReportsProductsComponent = {
  templateUrl: 'chpl.reports/products/products.html',
  controller: class ReportsProductsComponent {
    constructor ($filter, $log, $scope, ReportService, networkService, utilService) {
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
      filterData.dataFilter = this.filterText;
      filterData.tableState = this.tableController.tableState();
      return filterData;
    }

    tableStateListener (tableController) {
      this.tableController = tableController;
    }

    parse (meta) {
      return this.networkService.getActivityById(meta.id).then(item => {
        const activity = {
          action: '',
          details: [],
          developer: item.developer ? item.developer.name : '',
          date: item.activityDate,
          id: item.id,
        };
        if (item.originalData && !angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // both exist, both not arrays; update
          activity.action = 'Updated product "' + item.newData.name + '"';
          activity.details = compareObject(item.originalData, item.newData, lookup);
        } else if (item.originalData && angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // merge
          activity.action = 'Products ' + item.originalData.map(d => d.name).join(' and ') + ' merged to form ' + item.newData.name;
          activity.details = [];
        } else if (item.originalData && !angular.isArray(item.originalData) && item.newData && angular.isArray(item.newData)) { // split
          activity.action = 'Products ' + item.originalData.name + ' split to become Products ' + item.newData[0].name + ' and ' + item.newData[1].name;
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

    prepare (item) {
      return {
        ...item,
        filterText: item.developerName + '|' + item.productName + '|' + item.responsibleUser.fullName,
        friendlyActivityDate: new Date(item.date).toISOString().substring(0, 10),
        fullName: item.responsibleUser.fullName,
      };
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
      this.networkService.getActivityMetadata('products')
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
      this.networkService.getActivityMetadata('products', {pageNum: page, ignoreLoadingBar: true}).then(results => {
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
  .component('chplReportsProducts', ReportsProductsComponent);

export default ReportsProductsComponent;
