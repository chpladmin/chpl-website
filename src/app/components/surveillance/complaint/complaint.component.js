export const SurveillanceComplaintComponent = {
    templateUrl: 'chpl.components/surveillance/complaint/complaint.html',
    bindings: {
        complaint: '<',
        complaintTypes: '<',
        complaintStatusTypes: '<',
        certificationBodies: '<',
        errorMessages: '<',
        listings: '<',
        onCancel: '&?',
        onSave: '&?',
        onDelete: '&?',
    },
    controller: class SurveillanceComplaintComponent {
        constructor ($filter, $log, authService, featureFlags) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.featureFlags = featureFlags;
            this.hasAnyRole = authService.hasAnyRole;
            this.modes = {
                EDIT: 'edit',
                ADD: 'add',
            }
            this.currentMode = '';
            this.certifiedProduct;
        }

        $onChanges (changes) {
            if (changes.complaint) {
                this.complaint = angular.copy(changes.complaint.currentValue);
                if (this.complaint.id) {
                    this.currentMode = this.modes.EDIT;
                } else {
                    this.currentMode = this.modes.ADD;
                }
            }
            if (changes.complaintTypes) {
                this.complaintTypes = angular.copy(changes.complaintTypes.currentValue);
            }
            if (changes.complaintStatusTypes) {
                this.complaintStatusTypes = angular.copy(changes.complaintStatusTypes.currentValue);
            }
            if (changes.certificationBodies) {
                this.certificationBodies = angular.copy(changes.certificationBodies.currentValue);
            }
            if (changes.errorMessages) {
                this.errorMessages = angular.copy(changes.errorMessages.currentValue);
            }
            if (changes.listings) {
                this.listings = angular.copy(changes.listings.currentValue);
                this.$log.info(this.listings);
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

        selectListing ($item) {
            this.$log.info($item);
            if (!Array.isArray(this.complaint.listings)) {
                this.complaint.listings = [];
            }
            this.complaint.listings.push({
                id: $item.id,
                chplProductNumber: $item.chplProductNumber,
            });
            this.listing = '';
            this.$log.info(this.complaint.listings);
        }

        removeListing (chplProductNumber) {
            this.complaint.listings = this.complaint.listings.filter(listing => listing !== chplProductNumber);
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceComplaint', SurveillanceComplaintComponent);
