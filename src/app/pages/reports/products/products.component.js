import { compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

const compareOwnerHistory = (before, after) => {
  if (before.length === 0 && after.length === 0) { return undefined; }
  let changes = 'Owner history changed. Was:<ul>';
  changes += (before.length === 0) ? '<li>No previous history</li>' : before
    .map((item) => `<li><strong>${item.developer.name}</strong> on ${getDisplayDateFormat(item.transferDay ? item.transferDay : item.transferDate)}</li>`)
    .join('');
  changes += '</ul>Now:<ul>';
  changes += (after.length === 0) ? '<li>No current history</li>' : after
    .map((item) => `<li><strong>${item.developer.name}</strong> on ${getDisplayDateFormat(item.transferDay ? item.transferDay : item.transferDate)}</li>`)
    .join('');
  changes += '</ul>';
  return changes;
};

const lookup = {
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

    onApplyFilter(filterObj) {
      const f = angular.fromJson(filterObj);
      this.doFilter(f);
    }

    onClearFilter() {
      const filterData = {};
      filterData.dataFilter = '';
      filterData.tableState = this.tableController.tableState();
      this.clearFilterHs.forEach((handler) => handler());
      this.doFilter(filterData);
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

    createFilterDataObject() {
      const filterData = {};
      filterData.dataFilter = this.filterText;
      filterData.tableState = this.tableController.tableState();
      return filterData;
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
          activity.details = compareObject(item.originalData, item.newData, lookup);
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
