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
            this.complaintTypes = [];
            this.certificationBodies = [];
            this.errorMessages = [];
            this.listings = [];
        }

        $onInit () {
            this.refreshComplaints();
            this.refreshComplaintTypes();
            this.refreshComplaintStatusTypes();
            this.refreshCertificationBodies();
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
            this.clearErrorMessages();
            this.isEditing = true;
            this.complaint = complaint;
        }

        saveComplaint (complaint) {
            if (complaint.formattedReceivedDate) {
                complaint.receivedDate = complaint.formattedReceivedDate.valueOf();
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
                });
            });
        }

        refreshComplaintTypes () {
            let that = this;
            this.networkService.getComplaintTypes().then(response => {
                that.complaintTypes = response.data;
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
                that.refreshListings();
            });
        }

        refreshListings () {
            let that = this;
            this.networkService.getAll().then(response => {
                that.listings = response.results.filter(
                    item => that.certificationBodies.find(
                        acb => acb.name === item.acb && !acb.retired));
            });
        }

        clearErrorMessages () {
            this.errorMesssages = [];
        }

        getComplaintStatusType (name) {
            return this.complaintStatusTypes.find(cst => cst.name === name);
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceComplaints', SurveillanceComplaintsComponent);
