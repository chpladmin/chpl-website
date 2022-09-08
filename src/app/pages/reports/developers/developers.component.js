import { compareObject, comparePrimitive } from 'pages/reports/reports.v2.service';
import { getDisplayDateFormat } from 'services/date-util';

let lookup;

const compareAttestationData = (before, after) => {
  if (!before || !after || (before.length === 0 && after.length === 0)) {
    return undefined;
  }
  if (before.length === 0 && after.length === 1) {
    return `Attestation changes<ul><li>Attestations submitted for Attestation Period ending on ${after[0].attestationPeriod.periodEnd}</li></ul>`;
  }
  if (before.length === after.length) {
    const sortedBefore = before.sort((a, b) => (a.attestationPeriod.periodStart < b.attestationPeriod.periodStart ? -1 : 1));
    const sortedAfter = after.sort((a, b) => (a.attestationPeriod.periodStart < b.attestationPeriod.periodStart ? -1 : 1));
    const changes = sortedBefore
      .map((val, idx) => compareObject(val, sortedAfter[idx], lookup, 'attestations'))
      .filter((msgs) => msgs.length > 0)
      .map((msg) => `<li>${msg}</li>`);
    if (changes && changes.length > 0) {
      return `Attestation changes<ul>${changes.join('')}</ul>`;
    }
  }
  return undefined;
};

const compareStatusEvents = (initialBefore, initialAfter) => {
  const changes = [];
  let b = 0;
  let a = 0;
  const before = initialBefore.sort((x, y) => x.statusDate - y.statusDate);
  const after = initialAfter.sort((x, y) => x.statusDate - y.statusDate);
  while (b < before.length || a < after.length) {
    if (before[b]?.statusDate === after[a]?.statusDate) {
      const diffs = compareObject(before[b], after[a], lookup)
        .filter((msgs) => msgs.length > 0)
        .map((msg) => `<li>${msg}</li>`);
      if (diffs && diffs.length > 0) {
        changes.push(...diffs);
      }
      b += 1;
      a += 1;
    } else if ((before[b]?.statusDate < after[a]?.statusDate) || (before[b] && !after[a])) {
      changes.push(`<li>Status ${before[b].status.statusName} on ${getDisplayDateFormat(before[b].statusDate)} was removed${before[b].reason ? (` with reason ${before[b].reason}`) : ''}</>`);
      b += 1;
    } else if ((before[b]?.statusDate > after[a]?.statusDate) || (!before[b] && after[a])) {
      changes.push(`<li>Status ${after[a].status.statusName} on ${getDisplayDateFormat(after[a].statusDate)} was added${after[a].reason ? (` with reason ${after[a].reason}`) : ''}</li>`);
      a += 1;
    }
  }
  if (changes && changes.length > 0) {
    return `Status Event history changes<ul>${changes.join('')}</ul>`;
  }
  return undefined;
};

const compareTransparencyAttestations = (before, after) => {
  const changes = [];
  before.forEach((beforeTA) => {
    const afterTA = after.find((ta) => ta.acbId === beforeTA.acbId);
    const diffs = compareObject(beforeTA, afterTA, lookup)
      .filter((msgs) => msgs.length > 0)
      .map((msg) => `<li>${msg}</li>`);
    if (diffs && diffs.length > 0) {
      changes.push(...diffs);
    }
  });
  if (changes && changes.length > 0) {
    return `Transparency Attestation changes<ul>${changes.join('')}</ul>`;
  }
  return undefined;
};

lookup = {
  'attestations.id': {
    message: (before, after) => {
      if (before.status === after.status) {
        return `Attestations re-submitted for Attestation Period ending on ${after.attestationPeriod.periodEnd}`;
      }
      return undefined;
    },
  },
  'attestations.status': {
    message: (before, after) => `Attestations submitted for Attestation Period ending on ${after.attestationPeriod.periodEnd}`,
  },
  'attestations.statusText': {
    message: () => undefined,
  },
  'root.acbName': {
    message: (before, after) => comparePrimitive(before, after, 'acbName', 'ONC-ACB'),
  },
  'root.address': {
    message: () => 'Address changes:',
  },
  'root.address.addressId': {
    message: () => undefined,
  },
  'root.address.city': {
    message: (before, after) => comparePrimitive(before, after, 'city', 'City'),
  },
  'root.address.country': {
    message: (before, after) => comparePrimitive(before, after, 'country', 'Country'),
  },
  'root.address.creationDate': {
    message: () => undefined,
  },
  'root.address.deleted': {
    message: () => undefined,
  },
  'root.address.id': {
    message: () => undefined,
  },
  'root.address.lastModifiedDate': {
    message: () => undefined,
  },
  'root.address.lastModifiedUser': {
    message: () => undefined,
  },
  'root.address.line1': {
    message: (before, after) => comparePrimitive(before, after, 'line1', 'Street Line 1'),
  },
  'root.address.line2': {
    message: (before, after) => comparePrimitive(before, after, 'line2', 'Street Line 2'),
  },
  'root.address.state': {
    message: (before, after) => comparePrimitive(before, after, 'state', 'State'),
  },
  'root.address.streetLineOne': {
    message: (before, after) => comparePrimitive(before, after, 'streetLineOne', 'Street Line 1'),
  },
  'root.address.streetLineTwo': {
    message: (before, after) => comparePrimitive(before, after, 'streetLineTwo', 'Street Line 2'),
  },
  'root.address.zipcode': {
    message: (before, after) => comparePrimitive(before, after, 'zipcode', 'Zipcode'),
  },
  'root.attestations': {
    message: compareAttestationData,
  },
  'root.contact': {
    message: () => 'Contact changes:',
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
  'root.contact.friendlyName': {
    message: (before, after) => comparePrimitive(before, after, 'friendlyName', 'Friendly Name'),
  },
  'root.contact.fullName': {
    message: (before, after) => comparePrimitive(before, after, 'fullName', 'Full Name'),
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
  'root.deleted': {
    message: (before, after) => comparePrimitive(before, after, 'deleted', 'Deleted'),
  },
  'root.developerCode': {
    message: (before, after) => comparePrimitive(before, after, 'developerCode', 'Developer Code'),
  },
  'root.id': {
    message: () => undefined,
  },
  'root.lastModifiedDate': {
    message: () => undefined,
  },
  'root.lastModifiedUser': {
    message: () => undefined,
  },
  'root.name': {
    message: (before, after) => comparePrimitive(before, after, 'name', 'Name'),
  },
  'root.selfDeveloper': {
    message: (before, after) => comparePrimitive(before, after, 'selfDeveloper', 'Self-developer'),
  },
  'root.status': {
    message: () => 'Current status changes:',
  },
  'root.status.id': {
    message: () => undefined,
  },
  'root.status.status': {
    message: () => 'Current status:',
  },
  'root.status.status.id': {
    message: () => undefined,
  },
  'root.status.status.statusName': {
    message: (before, after) => comparePrimitive(before, after, 'statusName', 'Status'),
  },
  'root.status.statusDate': {
    message: (before, after) => comparePrimitive(before, after, 'statusDate', 'Effective Date', getDisplayDateFormat),
  },
  'root.status.reason': {
    message: (before, after) => comparePrimitive(before, after, 'reason', 'Reason'),
  },
  'root.statusEvents': {
    message: compareStatusEvents,
  },
  'root.transparencyAttestation': {
    message: (before, after) => comparePrimitive(before, after, 'transparencyAttestation', 'Transparency Attestation'),
  },
  'root.transparencyAttestation.removed': {
    message: () => undefined,
  },
  'root.transparencyAttestation.transparencyAttestation': {
    message: (before, after) => comparePrimitive(before, after, 'transparencyAttestation', 'Transparency Attestation'),
  },
  'root.transparencyAttestationMappings': {
    message: compareTransparencyAttestations,
  },
  'root.website': {
    message: (before, after) => comparePrimitive(before, after, 'website', 'Website'),
  },
};

const ReportsDevelopersComponent = {
  templateUrl: 'chpl.reports/developers/developers.html',
  controller: class ReportsDevelopersComponent {
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
        };
        if (item.originalData && !angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // both exist, both not arrays; update
          activity.action = `Updated developer "${item.newData.name}"`;
          activity.details = compareObject(item.originalData, item.newData, lookup);
        } else if (item.originalData && angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // merge
          activity.action = `Developers ${item.originalData.map((d) => d.name).join(' and ')} merged to form ${item.newData.name}`;
          activity.details = [];
        } else if (item.originalData && !angular.isArray(item.originalData) && item.newData && angular.isArray(item.newData)) { // split
          activity.action = `Developer ${item.originalData.name} split to become Developers ${item.newData[0].name} and ${item.newData[1].name}`;
          activity.details = [];
        } else {
          this.ReportService.interpretNonUpdate(activity, item, 'developer');
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
        filterText: `${item.developerName}|${item.developerCode}|${item.responsibleUser.fullName}`,
        categoriesFilter: `|${item.categories.join('|')}|`,
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
      this.networkService.getActivityMetadata('developers')
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
      this.networkService.getActivityMetadata('developers', { pageNum: page, ignoreLoadingBar: true }).then((results) => {
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
  .component('chplReportsDevelopers', ReportsDevelopersComponent);

export default ReportsDevelopersComponent;
