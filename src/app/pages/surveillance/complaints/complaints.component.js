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
            }
            this.currentMode = this.modes.SELECT;
            this.complaints = [];
            this.complaint = {};
            this.complaintTypes = [];
        }

        $onInit () {
            this.refreshComplaints();
            this.refreshComplaintTypes();
            this.refreshComplaintStatusTypes();
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

        refreshComplaints () {
            this.networkService.getComplaints().then(response => {
                this.complaints = response.results;
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
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceComplaints', SurveillanceComplaintsComponent);
