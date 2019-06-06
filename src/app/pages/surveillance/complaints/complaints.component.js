export const SurveillanceComplaintsComponent = {
    templateUrl: 'chpl.surveillance/complaints/complaints.html',
    bindings: { },
    controller: class SurveillanceComplaintsComponent {
        constructor ($log, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.authService = authService;
            this.networkService = networkService;
            this.modes = {
                SELECT: 'select',
                EDIT: 'edit',
                ADD: 'add',
            }
            this.currentMode = this.modes.SELECT;
            this.complaints = [];
            this.complaint = {};
            this.complaintTypes = [];
            this.certificationBodies = [];
            this.errorMessages = [];
        }

        $onInit () {
            this.refreshComplaints();
            this.refreshComplaintTypes();
            this.refreshComplaintStatusTypes();
            this.refreshCertificationBodies();
        }

        deleteComplaint (complaint) {
            this.clearErrorMessages();
            this.networkService.deleteComplaint(complaint.id).then(() => {
                this.complaint = {};
                this.currentMode = this.modes.SELECT;
                this.refreshComplaints();
            });
        }

        selectComplaint (complaint) {
            this.clearErrorMessages();
            this.currentMode = this.modes.EDIT;
            this.complaint = complaint;
        }

        saveComplaint (complaint) {
            if (complaint.formattedReceivedDate) {
                complaint.receivedDate = complaint.formattedReceivedDate.valueOf();
            }
            if (this.currentMode === this.modes.EDIT) {
                this.updateComplaint(complaint);
            } if (this.currentMode === this.modes.ADD) {
                this.createComplaint(complaint);
            }
        }

        updateComplaint (complaint) {
            this.clearErrorMessages();
            this.networkService.updateComplaint(complaint)
                .then(() => {
                    this.refreshComplaints();
                    this.currentMode = this.modes.SELECT;
                })
                .catch(error => {
                    if (error.status === 400) {
                        this.errorMessages = error.data.errorMessages;
                    }
                });
        }

        createComplaint (complaint) {
            this.clearErrorMessages();
            // default the status to Open
            complaint.complaintStatusType = this.getComplaintStatusType('Open');
            this.networkService.createComplaint(complaint)
                .then(() => {
                    this.refreshComplaints();
                    this.currentMode = this.modes.SELECT;
                })
                .catch(error => {
                    if (error.status === 400) {
                        this.errorMessages = error.data.errorMessages;
                    }
                });
        }

        cancelEdit () {
            this.currentMode = this.modes.SELECT;
        }

        displayAddComplaint () {
            this.complaint = {};
            this.currentMode = this.modes.ADD;
        }

        refreshComplaints () {
            this.networkService.getComplaints().then(response => {
                this.complaints = response.results;
                this.complaints.forEach(complaint => {
                    if (complaint.receivedDate) {
                        complaint.formattedReceivedDate = new Date(complaint.receivedDate);
                    } else {
                        complaint.formattedReceivedDate = null;
                    }
                });
            });
        }

        refreshComplaintTypes () {
            this.networkService.getComplaintTypes().then(response => {
                this.complaintTypes = response.data;
            });
        }

        refreshComplaintStatusTypes () {
            this.networkService.getComplaintStatusTypes().then(response => {
                this.complaintStatusTypes = response.data;
            });
        }

        refreshCertificationBodies () {
            //get all acbs
            this.networkService.getCertBodies().then(response => {
                this.certificationBodies = response;
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
