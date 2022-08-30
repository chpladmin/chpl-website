const lookup = {
  'attestations.id': {
    message: (before, after) => `Attestations re-submitted for Attestation Period ending on ${after.attestationPeriod.periodEnd}`,
  }
};

const getMessage = (before, after, root, key) => {
  if (lookup[`${root}.${key}`]) {
    return lookup[`${root}.${key}`].message(before, after);
  }
  return `${root}.${key}: ${before[key]} => ${after[key]}`;
};

const compareObject = (before, after, root = 'root') => {
  if (before === null || after === null) { return []; }
  const keys = Object.keys(before);
  const diffs = keys.map((key) => {
    switch (typeof before[key]) {
      case 'string':
        return before[key] !== after[key] ? getMessage(before, after, root, key) : '';
      case 'number':
        return before[key] !== after[key] ? getMessage(before, after, root, key) : '';
      case 'object':
        const messages = compareObject(before[key], after[key], `${root}.${key}`).map((msg) => `<li>${msg}</li>`)
        return messages.length > 0 ? `object - ${root}.${key}: <ul>${messages.join('')}</ul>` : '';
      default:
        return `${typeof before[key]} - ${getMessage(before, after, root, key)}`;
    }
  });
  return diffs.filter((msg) => !!msg);
};

const parseAttestationData = (before, after) => {
  if (!before || !after || (before.length === 0 && after.length === 0)) {
    return [];
  }
  if (before.length < after.length) {
    return [`<li>Attestations submitted for Attestation Period ending on ${after[0].attestationPeriod.periodEnd}</li>`];
  }
  return compareObject(before[0], after[0], 'attestations').map((msg) => `<li>${msg}</li>`);
};

export const ReportsDevelopersComponent = {
  templateUrl: 'chpl.reports/developers/developers.html',
  controller: class ReportsDevelopersComponent {
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
        var simpleFields = [
          {key: 'deleted', display: 'Deleted'},
          {key: 'developerCode', display: 'Developer Code'},
          {key: 'name', display: 'Name'},
          {key: 'website', display: 'Website'},
          {key: 'selfDeveloper', display: 'Self-developer'},
        ];
        var nestedKeys = [
          {key: 'status', subkey: 'statusName', display: 'Developer Status'},
        ];

        var change;
        var j;

        var activity = {
          action: '',
          details: [],
        };

        if (item.originalData && !angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // both exist, both not arrays; update
          activity.action = 'Updated developer "' + item.newData.name + '"';
          activity.details = [];
          for (j = 0; j < simpleFields.length; j++) {
            change = this.ReportService.compareItem(item.originalData, item.newData, simpleFields[j].key, simpleFields[j].display, simpleFields[j].filter);
            if (change) {
              activity.details.push(change);
            }
          }

          for (j = 0; j < nestedKeys.length; j++) {
            change = this.ReportService.nestedCompare(item.originalData, item.newData, nestedKeys[j].key, nestedKeys[j].subkey, nestedKeys[j].display, nestedKeys[j].filter);
            if (change) {
              activity.details.push(change);
            }
          }

          var addressChanges = this.ReportService.compareAddress(item.originalData.address, item.newData.address);
          if (addressChanges && addressChanges.length > 0) {
            activity.details.push('Address changes<ul>' + addressChanges.join('') + '</ul>');
          }
          var contactChanges = this.ReportService.compareContact(item.originalData.contact, item.newData.contact);
          if (contactChanges && contactChanges.length > 0) {
            activity.details.push('Contact changes<ul>' + contactChanges.join('') + '</ul>');
          }

          // post OCD-3824 where Transparency Attestation is gone
          if (item.newData.transparencyAttestationMappings) {
            //Old format where transp attest is just string vs. new format where it is an object
            if (this.isTransparencyAttestationObjectFormat(item.newData.transparencyAttestationMappings)) {
              let taChanges = this.compareTransparencyAttestations(item.originalData.transparencyAttestationMappings, item.newData.transparencyAttestationMappings);
              if (taChanges && taChanges.length > 0) {
                activity.details.push(taChanges.join(''));
              }
            } else {
              var transKeys = [{ key: 'transparencyAttestation', display: 'Transparency Attestation' }];
              var trans = this.ReportService.compareArray(item.originalData.transparencyAttestationMappings, item.newData.transparencyAttestationMappings, transKeys, 'acbName', true);
              for (j = 0; j < trans.length; j++) {
                activity.details.push('Transparency Attestation "' + trans[j].name + '" changes<ul>' + trans[j].changes.join('') + '</ul>');
              }
            }
          }

          const attestationChanges = parseAttestationData(item.originalData.attestations, item.newData.attestations);
          if (attestationChanges && attestationChanges.length > 0) {
            activity.details.push('Attestation changes<ul>' + attestationChanges.join('') + '</ul>');
          }

          var foundEvents = false;
          var statusEvents = this.utilService.arrayCompare(item.originalData.statusEvents,item.newData.statusEvents);
          var sortedEvents, translatedEvents;
          translatedEvents = '<table class="table table-condensed"><thead><tr>';
          if (statusEvents.added.length > 0) {
            foundEvents = true;
            translatedEvents += '<th>Added Status Event' + (statusEvents.added.length > 1 ? 's' : '') + '</th>';
          }
          if (statusEvents.edited.length > 0) {
            foundEvents = true;
            translatedEvents += '<th>Edited Status Event' + (statusEvents.edited.length > 1 ? 's' : '') + '</th>';
          }
          if (statusEvents.removed.length > 0) {
            foundEvents = true;
            translatedEvents += '<th>Removed Status Event' + (statusEvents.removed.length > 1 ? 's' : '') + '</th>';
          }
          translatedEvents += '</tr></thead><tbody><tr>';
          if (statusEvents.added.length > 0) {
            translatedEvents += '<td><ul>';

            sortedEvents = this.$filter('orderBy')(statusEvents.added,'statusDate',true);
            for (j = 0; j < sortedEvents.length; j++) {
              translatedEvents += '<li><strong>' + (sortedEvents[j].status.statusName || sortedEvents[j].status.status) + '</strong> (' + this.$filter('date')(sortedEvents[j].statusDate,'mediumDate','UTC') + ')</li>';
            }
            translatedEvents += '</ul></td>';
          }
          if (statusEvents.edited.length > 0) {
            translatedEvents += '<td><ul>';

            sortedEvents = this.$filter('orderBy')(statusEvents.edited,'before.statusDate',true);
            for (j = 0; j < sortedEvents.length; j++) {
              translatedEvents += '<li><strong>' + (sortedEvents[j].status.statusName || sortedEvents[j].status.status) + '</strong> (' + this.$filter('date')(sortedEvents[j].before.statusDate,'mediumDate','UTC') + ') became: <strong>' + (sortedEvents[j].status.statusName || sortedEvents[j].status.status) + '</strong> (' + this.$filter('date')(sortedEvents[j].after.statusDate,'mediumDate','UTC') + ')</li>';
            }
            translatedEvents += '</ul></td>';
          }
          if (statusEvents.removed.length > 0) {
            translatedEvents += '<td><ul>';

            sortedEvents = this.$filter('orderBy')(statusEvents.removed,'statusDate',true);
            for (j = 0; j < sortedEvents.length; j++) {
              translatedEvents += '<li><strong>' + (sortedEvents[j].status.statusName || sortedEvents[j].status.status) + '</strong> (' + this.$filter('date')(sortedEvents[j].statusDate,'mediumDate','UTC') + ')</li>';
            }
            translatedEvents += '</ul></td>';
          }
          translatedEvents += '</tr></tbody><table>';
          if (foundEvents) {
            activity.details.push(translatedEvents);
          }
        } else if (item.originalData && angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // merge
          activity.action = 'Developers ' + item.originalData.map(d => d.name).join(' and ') + ' merged to form ' + item.newData.name;
          activity.details = [];
        } else if (item.originalData && !angular.isArray(item.originalData) && item.newData && angular.isArray(item.newData)) { // split
          activity.action = 'Developer ' + item.originalData.name + ' split to become Developers ' + item.newData[0].name + ' and ' + item.newData[1].name;
          activity.details = [];
        } else {
          this.ReportService.interpretNonUpdate(activity, item, 'developer');
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
      item.filterText = item.developerName + '|' + item.developerCode + '|' + item.responsibleUser.fullName;
      if (item.categories.length > 1 || item.categories[0] !== 'DEVELOPER') {
        this.$log.info(item.categories);
      }
      item.categoriesFilter = '|' + item.categories.join('|') + '|';
      item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
      item.fullName = item.responsibleUser.fullName;
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
      this.networkService.getActivityMetadata('developers')
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
      this.networkService.getActivityMetadata('developers', {pageNum: page, ignoreLoadingBar: true}).then(results => {
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

    compareTransparencyAttestations (before, after) {
      let changes = [];
      //This will get all the changes, since these arrays should alweays have the same number of elements based
      //on the acbs
      before.forEach(beforeTA => {
        let afterTA = after.find(ta => ta.acbId === beforeTA.acbId);
        let change = this.compareTransparencyAttestation(beforeTA, afterTA);
        if (change) {
          changes.push(change);
        }
      });
      return changes;
    }

    compareTransparencyAttestation (before, after) {
      if (!before.transparencyAttestation && after.transparencyAttestation) {
        //Transparency attestation was added
        return '<li>Transparency Attestation "' + after.acbName + '" changes<ul><li>Transparency Attestation added: ' + after.transparencyAttestation.transparencyAttestation + '.</li></ul></li>';
      }
      if (before.transparencyAttestation && !after.transparencyAttestation) {
        //Transparency attestation was removed - not sure this is possible
        return '<li>Transparency Attestation "' + after.acbName + '" changes<ul><li>Transparency Attestation removed. Was: ' + before.transparencyAttestation.transparencyAttestation + '.</li></ul></li>';
      }
      if (before.transparencyAttestation && after.transparencyAttestation && before.transparencyAttestation.transparencyAttestation !== after.transparencyAttestation.transparencyAttestation) {
        //Transparency attestation was changed
        return '<li>Transparency Attestation "' + after.acbName + '" changes<ul><li>Transparency Attestation changed: ' + after.transparencyAttestation.transparencyAttestation + '. Was: ' + before.transparencyAttestation.transparencyAttestation + '.</li></ul></li>';
      }
    }

    isTransparencyAttestationObjectFormat (attestationMappings) {
      return attestationMappings.reduce((acc, curr) => acc || (typeof curr.transparencyAttestation === 'object' && curr.transparencyAttestation !== null) , false);
    }
  },
};

angular.module('chpl.reports')
  .component('chplReportsDevelopers', ReportsDevelopersComponent);
