export const SurveillanceComplaintsComponent = {
    templateUrl: 'chpl.surveillance/complaints/complaints.html',
    bindings: {
        complaintListType: '@?',
        displayAdd: '<',
        displayDelete: '<',
        displayHeader: '<',
        quarterlyReport: '<',
    },
    controller: class SurveillanceComplaintsComponent {
        constructor ($log, authService, featureFlags, networkService) {
            'ngInject'
            this.$log = $log;
            this.authService = authService;
            this.isOn = featureFlags.isOn;
            this.networkService = networkService;
            this.isEditing = false;
            this.complaints = [];
            this.complaint = {};
            this.complainantTypes = [];
            this.certificationBodies = [];
            this.criteria = [];
            this.editions = [];
            this.errorMessages = [];
            this.listings = [];
            this.surveillances = [];
        }

        $onInit () {
            this.refreshComplainantTypes();
            this.refreshComplaintStatusTypes();
            this.refreshCertificationBodies();
            this.refreshListings();
            this.refreshEditions();
            this.refreshCriteria();
        }

        $onChanges (changes) {
            if (changes.complaintListType !== undefined && changes.complaintListType.currentValue === '') {
                this.complaintListType = 'ALL';
            }
            if (changes.displayAdd !== undefined && changes.displayAdd.currentValue === undefined) {
                this.displayAdd = true;
            }
            if (changes.displayDelete !== undefined && changes.displayDelete.currentValue === undefined) {
                this.displayDelete = true;
            }
            if (changes.displayHeader !== undefined && changes.displayHeader.currentValue === undefined) {
                this.displayHeader = true;
            }
            if (changes.quarterlyReport !== undefined && changes.quarterlyReport.currentValue) {
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
            // default the status to Open
            complaint.complaintStatusType = this.getComplaintStatusType('Open');
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
                that.complaints = response.results;
                that.complaints.forEach(complaint => {
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
                    complaint.complaintStatusTypeName = complaint.complaintStatusType.name;
                    complaint.acbName = complaint.certificationBody.name;
                    complaint.complainantTypeName = complaint.complainantType.name;
                });
            });
        }

        getComplaintsPromise () {
            if (this.complaintListType === 'ALL') {
                return this.networkService.getComplaints();
            } else if (this.complaintListType === 'RELEVANT') {
                return this.networkService.getRelevantComplaints(this.quarterlyReport);
            }
        }

        toUTCDate (date) {
            let _utc = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
            return _utc;
        }

        refreshComplainantTypes () {
            let that = this;
            this.networkService.getComplainantTypes().then(response => {
                that.complainantTypes = response.data;
            });
        }

        refreshComplaintStatusTypes () {
            let that = this;
            this.networkService.getComplaintStatusTypes().then(response => {
                that.complaintStatusTypes = response.data;
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

        getComplaintStatusType (name) {
            return this.complaintStatusTypes.find(cst => cst.name === name);
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceComplaints', SurveillanceComplaintsComponent);
