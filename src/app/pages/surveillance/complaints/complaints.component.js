export const SurveillanceComplaintsComponent = {
    templateUrl: 'chpl.surveillance/complaints/complaints.html',
    bindings: { },
    controller: class SurveillanceComplaintsComponent {
        constructor ($log, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.authService = authService;
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
            this.refreshComplaints();
            this.refreshComplainantTypes();
            this.refreshComplaintStatusTypes();
            this.refreshCertificationBodies();
            this.refreshListings();
            this.refreshEditions();
            this.refreshCriteria();
            this.refreshSurveillances();
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
            if (complaint.formattedReceivedDate) {
                let utcReceievedDate = this.toUTCDate(complaint.formattedReceivedDate);
                complaint.receivedDate = utcReceievedDate.getTime();

                if (complaint.formattedClosedDate) {
                    let utcClosedDate = this.toUTCDate(complaint.formattedClosedDate);
                    complaint.closedDate = utcClosedDate.getTime();
                } else {
                    complaint.closedDate = null;
                }
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
            this.networkService.getComplaints().then(response => {
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
                });
            });
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
                    this.networkService.getListingBasic(listing.listingId).then(response => {
                        if (Array.isArray(response.surveillance)) {
                            response.surveillance.forEach(surv => {
                                that.surveillances.push({
                                    id: surv.id,
                                    friendlyId: surv.friendlyId,
                                    listingId: response.id,
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
