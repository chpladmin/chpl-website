const SurveillanceComplaintsComponent = {
  templateUrl: 'chpl.components/surveillance/complaints/complaints.html',
  bindings: {
    complaintListType: '@?',
    displayAdd: '<',
    quarterlyReport: '<',
  },
  controller: class SurveillanceComplaintsComponent {
    constructor($log, $scope, authService, networkService, utilService) {
      'ngInject';

      this.$log = $log;
      this.$scope = $scope;
      this.authService = authService;
      this.networkService = networkService;
      this.utilService = utilService;
      this.clearFilterHs = [];
      this.restoreStateHs = [];
      this.complaintListType = 'ALL';
      this.filterItems = {
        acbItems: [],
        complaintStatusTypeItems: [],
        complainantTypeItems: [],
      };
      this.hasChanges = {};
      this.handleDispatch = this.handleDispatch.bind(this);
    }

    $onInit() {
      const that = this;
      this.networkService.getCollection('complaintListings').then((response) => {
        that.listings = response.results;
      });
    }

    $onChanges(changes) {
      if (changes.complaintListType && changes.complaintListType.currentValue) {
        this.complaintListType = changes.complaintListType.currentValue;
      }
      if (changes.quarterlyReport && changes.quarterlyReport.currentValue) {
        this.quarterlyReport = angular.copy(changes.quarterlyReport.currentValue);
      }
      this.refreshComplaints();
    }

    handleDispatch(action, payload) {
      switch (action) {
        case 'add':
          this.clearErrorMessages();
          this.isEditing = true;
          this.complaint = {};
          this.$scope.$digest();
          break;
        case 'cancel':
          this.isEditing = false;
          this.isViewing = true;
          this.$scope.$digest();
          break;
        case 'close':
          this.isEditing = false;
          this.isViewing = false;
          this.complaint = {};
          this.$scope.$digest();
          break;
        case 'edit':
          this.clearErrorMessages();
          this.isViewing = false;
          this.isEditing = true;
          this.$scope.$digest();
          break;
        case 'refresh':
          this.clearErrorMessages();
          this.complaint = {};
          this.isViewing = false;
          this.isEditing = false;
          this.refreshComplaints();
          break;
        case 'view':
          this.isViewing = true;
          this.complaint = payload;
          this.$scope.$digest();
          break;
          // no default
      }
    }

    refreshComplaints() {
      const that = this;
      this.complaint = {};
      this.getComplaintsPromise().then((response) => {
        that.complaints = response.results
          .map((complaint) => {
            const updated = {
              ...complaint,
              acbName: complaint.certificationBody.name,
              complaintStatusTypeName: complaint.closedDate ? 'Closed' : 'Open',
              complainantTypeName: complaint.complainantType.name,
              filterText: `${complaint.oncComplaintId}|${complaint.acbComplaintId}|${complaint.listings.map((l) => l.chplProductNumber).join('|')}|${complaint.criteria.map((c) => c.certificationCriterion.number).join('|')}`,
            };
            that.addFilterItems(updated);
            return updated;
          });
        that.finalizeFilterItems();
      });
    }

    addFilterItems(complaint) {
      if (!this.filterItems.acbItems.find((item) => item.value === complaint.acbName)) {
        this.filterItems.acbItems.push({ value: complaint.acbName, selected: true });
      }
      if (!this.filterItems.complaintStatusTypeItems.find((item) => item.value === complaint.complaintStatusTypeName)) {
        this.filterItems.complaintStatusTypeItems.push({ value: complaint.complaintStatusTypeName, selected: true });
      }
      if (!this.filterItems.complainantTypeItems.find((item) => item.value === complaint.complainantTypeName)) {
        this.filterItems.complainantTypeItems.push({ value: complaint.complainantTypeName, selected: true });
      }
    }

    finalizeFilterItems() {
      this.filterItems.acbItems = this.filterItems.acbItems.sort((a, b) => (a.value < b.value ? -1 : 1));
      this.filterItems.complaintStatusTypeItems = this.filterItems.complaintStatusTypeItems.sort((a, b) => (a.value < b.value ? -1 : 1));
      this.filterItems.complainantTypeItems = this.filterItems.complainantTypeItems.sort((a, b) => (a.value < b.value ? -1 : 1));
    }

    getComplaintsPromise() {
      if (this.complaintListType === 'ALL') {
        return this.networkService.getComplaints();
      }
      return this.networkService.getRelevantComplaints(this.quarterlyReport);
    }

    clearErrorMessages() {
      this.errorMessages = [];
    }

    onApplyFilter(filter) {
      const f = angular.fromJson(filter);
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
      const filterItems = [
        'acbName',
        'complaintStatusTypeName',
        'receivedDate',
        'closedDate',
        'complainantTypeName',
        'complainantContacted',
        'developerContacted',
        'flagForOncReview',
        'oncAtlContacted',
      ];
      filterItems.forEach((predicate) => {
        if (filter.tableState.search.predicateObject[predicate]) {
          this.tableController.search(filter.tableState.search.predicateObject[predicate], predicate);
        } else {
          this.tableController.search({}, predicate);
        }
      });
      this.restoreStateHs.forEach((handler) => handler(that.tableController.tableState()));
      this.tableController.sortBy(filter.tableState.sort.predicate, filter.tableState.sort.reverse);
    }

    registerClearFilter(handler) {
      this.clearFilterHs.push(handler);
    }

    registerRestoreState(handler) {
      this.restoreStateHs.push(handler);
    }

    getFilterData() {
      const filterData = {};
      filterData.dataFilter = this.filterText;
      filterData.tableState = this.tableController.tableState();
      return filterData;
    }

    tableStateListener(tableController) {
      this.tableController = tableController;
    }
  },
};

angular.module('chpl.components')
  .component('chplSurveillanceComplaints', SurveillanceComplaintsComponent);

export default SurveillanceComplaintsComponent;
