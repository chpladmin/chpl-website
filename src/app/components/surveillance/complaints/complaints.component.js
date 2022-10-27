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
      this.complaintListType = 'ALL';
      this.handleDispatch = this.handleDispatch.bind(this);
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

    getComplaintsPromise() {
      if (this.complaintListType === 'ALL') {
        return this.networkService.getComplaints();
      }
      return this.networkService.getRelevantComplaints(this.quarterlyReport);
    }
  },
};

angular.module('chpl.components')
  .component('chplSurveillanceComplaints', SurveillanceComplaintsComponent);

export default SurveillanceComplaintsComponent;
