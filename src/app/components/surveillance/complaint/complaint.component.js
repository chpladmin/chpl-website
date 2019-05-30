export const SurveillanceComplaintComponent = {
    templateUrl: 'chpl.components/surveillance/complaint/complaint.html',
    bindings: {
        complaint: '<',
        complaints: '<',
        mode: '<',
        complaintTypes: '<',
        complaintStatusTypes: '<',
        onCancel: '&?',
        onSave: '&?',
        onDelete: '&?',
        onSelect: '&?',
    },
    controller: class SurveillanceComplaintComponent {
        constructor ($filter, $log, authService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.modes = {
                SELECT: 'select',
                EDIT: 'edit',
            }
        }

        deleteComplaint (complaint) {
            if (this.onDelete) {
                this.onDelete({complaint: complaint});
            }
        }

        selectComplaint (complaint) {
            if (this.onSelect) {
                this.onSelect({complaint: complaint});
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceComplaint', SurveillanceComplaintComponent);
