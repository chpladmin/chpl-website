export const SurveillanceComplaintsComponent = {
    templateUrl: 'chpl.components/surveillance/complaints/complaints.html',
    bindings: {
        complaintListType: '@?',
        displayAdd: '<',
        displayDelete: '<',
        quarterlyReport: '<',
    },
    controller: class SurveillanceComplaintsComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
            this.complaint = {};
            this.complainantTypes = [];
            this.certificationBodies = [];
            this.criteria = [];
            this.editions = [];
            this.errorMessages = [];
            this.listings = [];
            this.surveillances = [];
            this.complaintListType = 'ALL';
            this.pageSize = 50;
            this.filterItems = {
                acbItems: [],
                complaintStatusTypeItems: [],
                complainantTypeItems: [],
            }
        }

        $onInit () {
            this.refreshComplainantTypes();
            this.refreshCertificationBodies();
            this.refreshListings();
            this.refreshEditions();
            this.refreshCriteria();
        }

        $onChanges (changes) {
            if (changes.complaintListType && changes.complaintListType.currentValue) {
                this.complaintListType = changes.complaintListType.currentValue;
            }
            if (changes.displayAdd) {
                this.displayAdd = changes.displayAdd.currentValue;
            }
            if (changes.displayDelete) {
                this.displayDelete = changes.displayDelete.currentValue;
            }
            if (changes.quarterlyReport && changes.quarterlyReport.currentValue) {
                this.quarterlyReport = angular.copy(changes.quarterlyReport.currentValue);
            }
            this.refreshComplaints();
        }

        deleteComplaint (complaint) {
            let that = this;
            this.clearErrorMessages();
            this.networkService.deleteComplaint(complaint.id).then(() => {
                that.complaint = {};
                that.isEditing = false;
                that.refreshComplaints();
            });
        }

        selectComplaint (complaint) {
            this.refreshSurveillances(complaint);
            this.clearErrorMessages();
            this.isEditing = true;
            this.complaint = complaint;
        }

        selectListing (complaint) {
            this.refreshSurveillances(complaint);
        }

        saveComplaint (complaint) {
            complaint.receivedDate = complaint.formattedReceivedDate.getTime();
            if (complaint.formattedClosedDate) {
                complaint.closedDate = complaint.formattedClosedDate.getTime();
            } else {
                complaint.closedDate = null;
            }
            if (complaint.id) {
                this.updateComplaint(complaint);
            } else {
                this.createComplaint(complaint);
            }
        }

        updateComplaint (complaint) {
            let that = this;
            this.clearErrorMessages();
            this.networkService.updateComplaint(complaint)
                .then(() => {
                    that.refreshComplaints();
                    that.isEditing = false;
                })
                .catch(error => {
                    if (error.status === 400) {
                        that.errorMessages = error.data.errorMessages;
                    }
                });
        }

        createComplaint (complaint) {
            let that = this;
            this.clearErrorMessages();
            this.networkService.createComplaint(complaint)
                .then(() => {
                    that.refreshComplaints();
                    that.isEditing = false;
                })
                .catch(error => {
                    if (error.status === 400) {
                        that.errorMessages = error.data.errorMessages;
                    }
                });
        }

        cancelEdit () {
            this.isEditing = false;
        }

        displayAddComplaint () {
            this.clearErrorMessages();
            this.complaint = {};
            this.isEditing = true;
        }

        refreshComplaints () {
            let that = this;
            this.getComplaintsPromise().then(response => {
                that.complaints = response.results
                    .map(complaint => {
                        if (complaint.receivedDate) {
                            complaint.formattedReceivedDate = new Date(complaint.receivedDate);
                        } else {
                            complaint.formattedReceivedDate = null;
                        }
                        if (complaint.closedDate) {
                            complaint.formattedClosedDate = new Date(complaint.closedDate);
                        } else {
                            complaint.formattedClosedDate = null;
                        }
                        complaint.acbName = complaint.certificationBody.name;
                        complaint.complaintStatusTypeName = complaint.closedDate ? 'Closed' : 'Open';
                        complaint.complainantTypeName = complaint.complainantType.name;
                        complaint.filterText = complaint.oncComplaintId + '|' + complaint.acbComplaintId
                            + '|' + complaint.listings.map(l => l.chplProductNumber).join('|')
                            + '|' + complaint.criteria.map(c => c.certificationCriterion.number).join('|');
                        that.addFilterItems(complaint);
                        return complaint;
                    });
            });
        }

        addFilterItems (complaint) {
            if (!this.filterItems.acbItems.find(item => item.value === complaint.acbName)) {
                this.filterItems.acbItems.push({value: complaint.acbName, selected: true});
            }
            if (!this.filterItems.complaintStatusTypeItems.find(item => item.value === complaint.complaintStatusTypeName)) {
                this.filterItems.complaintStatusTypeItems.push({value: complaint.complaintStatusTypeName, selected: true});
            }
            if (!this.filterItems.complainantTypeItems.find(item => item.value === complaint.complainantTypeName)) {
                this.filterItems.complainantTypeItems.push({value: complaint.complainantTypeName, selected: true});
            }
        }

        getComplaintsPromise () {
            if (this.complaintListType === 'ALL') {
                return this.networkService.getComplaints();
            } else if (this.complaintListType === 'RELEVANT') {
                return this.networkService.getRelevantComplaints(this.quarterlyReport);
            }
        }

        refreshComplainantTypes () {
            let that = this;
            this.networkService.getComplainantTypes().then(response => {
                that.complainantTypes = response.data;
            });
        }

        refreshCertificationBodies () {
            let that = this;
            //get all acbs that the user has edit capability of
            this.networkService.getAcbs(true).then(response => {
                that.certificationBodies = response.acbs;
            });
        }

        refreshListings () {
            let that = this;
            this.networkService.getCollection('complaintListings').then(response => {
                that.listings = response.results;
            });
        }

        refreshEditions () {
            let that = this;
            this.networkService.getEditions().then(response => {
                that.editions = response;
            });
        }

        refreshCriteria () {
            let that = this;
            this.networkService.getCriteria().then(response => {
                that.criteria = response.criteria;
            });
        }

        refreshSurveillances (complaint) {
            let that = this;
            this.surveillances = [];
            if (complaint && Array.isArray(complaint.listings)) {
                complaint.listings.forEach(listing => {
                    this.networkService.getListingBasic(listing.listingId, true).then(response => {
                        if (Array.isArray(response.surveillance)) {
                            response.surveillance.forEach(surv => {
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

        clearErrorMessages () {
            this.errorMessages = [];
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceComplaints', SurveillanceComplaintsComponent);
