const SurveillanceComplaintsComponent = {
  templateUrl: 'chpl.components/surveillance/complaints/complaints.html',
  bindings: {
    complaintListType: '@?',
    displayAdd: '<',
    displayDelete: '<',
    displayEdit: '<',
    quarterlyReport: '<',
  },
  controller: class SurveillanceComplaintsComponent {
    constructor($log, DateUtil, authService, featureFlags, networkService, utilService) {
      'ngInject';

      this.$log = $log;
      this.DateUtil = DateUtil;
      this.authService = authService;
      this.networkService = networkService;
      this.utilService = utilService;
      this.isOn = featureFlags.isOn;
      this.clearFilterHs = [];
      this.filename = `Complaints_${new Date().getTime()}.csv`;
      this.restoreStateHs = [];
      this.complaintListType = 'ALL';
      this.pageSize = 50;
      this.filterItems = {
        acbItems: [],
        complaintStatusTypeItems: [],
        complainantTypeItems: [],
      };
      this.hasChanges = {};
    }

    $onInit() {
      this.refreshComplainantTypes();
      this.refreshCertificationBodies();
      this.refreshListings();
      this.refreshEditions();
      this.refreshCriteria();
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

    selectComplaint(complaint) {
      this.refreshSurveillances(complaint);
      this.clearErrorMessages();
      this.isEditing = true;
      this.complaint = complaint;
    }

    selectListing(complaint) {
      this.refreshSurveillances(complaint);
    }

    saveComplaint(complaint) {
      const toSave = {
        ...complaint,
      };
      if (complaint.id) {
        this.updateComplaint(toSave);
      } else {
        this.createComplaint(toSave);
      }
    }

    updateComplaint(complaint) {
      const that = this;
      this.clearErrorMessages();
      this.networkService.updateComplaint(complaint)
        .then(() => {
          that.refreshComplaints();
          that.isEditing = false;
        })
        .catch((error) => {
          if (error.status === 400) {
            that.errorMessages = error.data.errorMessages;
          }
        });
    }

    createComplaint(complaint) {
      const that = this;
      this.clearErrorMessages();
      this.networkService.createComplaint(complaint)
        .then(() => {
          that.refreshComplaints();
          that.isEditing = false;
        })
        .catch((error) => {
          if (error.status === 400) {
            that.errorMessages = error.data.errorMessages;
          }
        });
    }

    cancelEdit() {
      this.isEditing = false;
    }

    displayAddComplaint() {
      this.clearErrorMessages();
      this.complaint = {};
      this.isEditing = true;
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

    refreshComplainantTypes() {
      const that = this;
      this.networkService.getComplainantTypes().then((response) => {
        that.complainantTypes = response.data;
      });
    }

    refreshCertificationBodies() {
      const that = this;
      // get all acbs that the user has edit capability of
      this.networkService.getAcbs(true).then((response) => {
        that.certificationBodies = response.acbs;
      });
    }

    refreshListings() {
      const that = this;
      this.networkService.getCollection('complaintListings').then((response) => {
        that.listings = response.results;
      });
    }

    refreshEditions() {
      const that = this;
      this.networkService.getEditions().then((response) => {
        that.editions = response;
      });
    }

    refreshCriteria() {
      const that = this;
      this.networkService.getCriteria().then((response) => {
        that.criteria = response.criteria;
      });
    }

    refreshSurveillances(complaint) {
      const that = this;
      this.surveillances = [];
      if (complaint && Array.isArray(complaint.listings)) {
        complaint.listings.forEach((listing) => {
          this.networkService.getListingBasic(listing.listingId, true).then((response) => {
            if (Array.isArray(response.surveillance)) {
              response.surveillance.forEach((surv) => {
                that.surveillances.push({
                  id: surv.id,
                  friendlyId: surv.friendlyId,
                  listingId: response.id,
                  certifiedProductId: response.id,
                  chplProductNumber: response.chplProductNumber,
                });
                that.surveillances = angular.copy(that.surveillances);
              });
            }
          });
        });
      }
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
