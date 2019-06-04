export const SurveillanceComplaintsComponent = {
    templateUrl: 'chpl.surveillance/complaints/complaints.html',
    bindings: { },
    controller: class SurveillanceComplaintsComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
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
        }

        $onInit () {
            this.refreshComplaints();
            this.refreshComplaintTypes();
            this.refreshComplaintStatusTypes();
            this.refreshCertificationBodies();
        }

        deleteComplaint (complaint) {
            this.networkService.deleteComplaint(complaint.id).then(() => {
                this.complaint = {};
                this.currentMode = this.modes.SELECT;
                this.refreshComplaints();
            });
        }

        selectComplaint (complaint) {
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
            this.networkService.updateComplaint(complaint).then(() => {
                this.refreshComplaints();
                this.currentMode = this.modes.SELECT;
            });
        }

        createComplaint (complaint) {
            this.networkService.createComplaint(complaint).then(() => {
                this.refreshComplaints();
                this.currentMode = this.modes.SELECT;
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
                    complaint.formattedReceivedDate = new Date(complaint.receivedDate);
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
            this.networkService.getCertBodies().then(response => {
                this.certificationBodies = response;
            });
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceComplaints', SurveillanceComplaintsComponent);
