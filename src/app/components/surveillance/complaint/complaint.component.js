export const SurveillanceComplaintComponent = {
    templateUrl: 'chpl.components/surveillance/complaint/complaint.html',
    bindings: {
        complaint: '<',
        complaints: '<',
        mode: '<',
        complaintTypes: '<',
        complaintStatusTypes: '<',
        certificationBodies: '<',
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
                ADD: 'add',
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

        saveComplaint (complaint) {
            if (this.onSave) {
                this.onSave({complaint: complaint});
            }
        }

        cancelEdit () {
            if (this.onCancel) {
                this.onCancel();
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceComplaint', SurveillanceComplaintComponent);
