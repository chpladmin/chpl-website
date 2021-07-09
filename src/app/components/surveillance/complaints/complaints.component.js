const SurveillanceComplaintsComponent = {
  templateUrl: 'chpl.components/surveillance/complaints/complaints.html',
  bindings: {
    complaintListType: '@?',
    displayAdd: '<',
    quarterlyReport: '<',
  },
  controller: class SurveillanceComplaintsComponent {
    constructor($log, $scope, DateUtil, authService, featureFlags, networkService, utilService) {
      'ngInject';

      this.$log = $log;
      this.$scope = $scope;
      this.DateUtil = DateUtil;
      this.authService = authService;
      this.networkService = networkService;
      this.utilService = utilService;
      this.isOn = featureFlags.isOn;
      this.clearFilterHs = [];
      this.filename = `Complaints_${new Date().getTime()}.csv`;
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
      this.networkService.getComplainantTypes().then((response) => {
        that.complainantTypes = response.data;
      });
      this.networkService.getAcbs(true).then((response) => { // get all acbs that the user has edit capability of
        that.certificationBodies = response.acbs;
      });
      this.networkService.getCollection('complaintListings').then((response) => {
        that.listings = response.results;
      });
      this.networkService.getCriteria().then((response) => {
        that.criteria = response.criteria;
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

    deleteComplaint(complaint) {
      const that = this;
      this.clearErrorMessages();
      this.networkService.deleteComplaint(complaint.id).then(() => {
        that.complaint = {};
        that.isEditing = false;
        that.refreshComplaints();
      });
    }

    handleDispatch(action, payload) {
      switch (action) {
        case 'add':
          this.selectComplaint({});
          this.$scope.$digest();
          break;
        case 'cancel':
        case 'close':
          this.isEditing = false;
          this.isViewing = false;
          this.complaint = undefined;
          this.$scope.$digest();
          break;
        case 'delete':
          this.deleteComplaint(payload);
          break;
        case 'edit':
          this.selectComplaint(payload);
          this.$scope.$digest();
          break;
        case 'save':
          this.saveComplaint(payload);
          break;
        case 'view':
          this.isViewing = true;
          this.complaint = payload;
          this.$scope.$digest();
          break;
          // no default
      }
    }

    selectComplaint(complaint) {
      this.clearErrorMessages();
      this.isEditing = true;
      this.complaint = complaint;
    }

    saveComplaint(complaint) {
      const that = this;
      this.clearErrorMessages();
      const toSave = {
        ...complaint,
      };
      const handleResponse = () => {
        that.refreshComplaints();
        that.isEditing = false;
      };
      const handleError = (error) => {
        if (error.status === 400) {
          that.errorMessages = error.data.errorMessages;
        }
      };
      if (complaint.id) {
        this.networkService.updateComplaint(toSave)
          .then(handleResponse)
          .catch(handleError);
      } else {
        this.networkService.createComplaint(complaint)
          .then(handleResponse)
          .catch(handleError);
      }
    }

    refreshComplaints() {
      const that = this;
      this.getComplaintsPromise().then((response) => {
        that.complaints = response.results
          .map((complaint) => {
            const updated = {
              ...complaint,
            };
            if (complaint.receivedDate) {
              updated.formattedReceivedDate = this.DateUtil.getDisplayDateFormat(complaint.receivedDate);
              updated.csvReceivedDate = complaint.receivedDate;
            } else {
              updated.formattedReceivedDate = null;
              updated.csvReceivedDate = null;
            }
            if (complaint.closedDate) {
              updated.formattedClosedDate = this.DateUtil.getDisplayDateFormat(complaint.closedDate);
              updated.csvClosedDate = complaint.closedDate;
            } else {
              updated.formattedClosedDate = null;
              updated.csvClosedDate = null;
            }
            updated.acbName = complaint.certificationBody.name;
            updated.complaintStatusTypeName = complaint.closedDate ? 'Closed' : 'Open';
            updated.complainantTypeName = complaint.complainantType.name;
            updated.filterText = `${complaint.oncComplaintId}|${complaint.acbComplaintId
            }|${complaint.listings.map((l) => l.chplProductNumber).join('|')
            }|${complaint.criteria.map((c) => c.certificationCriterion.number).join('|')}`;
            that.addFilterItems(updated);
            if (complaint.criteria) {
              updated.csvCriteria = complaint.criteria.map((c) => c.certificationCriterion.number + (that.utilService.isCures(c.certificationCriterion) ? ' (Cures Update)' : '')).join(',');
            }
            return updated;
          });
        that.expandCsvRows();
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

    expandCsvRows() {
      this.csvComplaints = this.complaints.flatMap((complaint) => {
        if (complaint.listings.length === 0) {
          return [complaint];
        }
        const complaints = complaint.listings.map((l) => ({
          ...complaint,
          csvListing: l.chplProductNumber,
          developerName: l.developerName,
          productName: l.productName,
          versionName: l.versionName,
          csvSurveillances: complaint.surveillances
            .filter((s) => s.surveillance.chplProductNumber === l.chplProductNumber)
            .map((s) => s.surveillance.friendlyId)
            .join(','),
        }));
        return complaints;
      });
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
