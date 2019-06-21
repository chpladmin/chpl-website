export const SurveillanceComplaintComponent = {
    templateUrl: 'chpl.components/surveillance/complaint/complaint.html',
    bindings: {
        complaint: '<',
        complainantTypes: '<',
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
            this.isOn = featureFlags.isOn;
            this.hasAnyRole = authService.hasAnyRole;
            this.modes = {
                EDIT: 'edit',
                ADD: 'add',
            }
            this.currentMode = '';
        }

        $onChanges (changes) {
            if (changes.complaint) {
                this.complaint = angular.copy(changes.complaint.currentValue);
                if (this.complaint && this.complaint.id) {
                    this.currentMode = this.modes.EDIT;
                } else {
                    this.currentMode = this.modes.ADD;
                }
            }
            if (changes.complainantTypes) {
                this.complainantTypes = angular.copy(changes.complainantTypes.currentValue);
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
                this.filterListingsBasedOnSelectedAcb();
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
            if (!Array.isArray(this.complaint.listings)) {
                this.complaint.listings = [];
            }
            this.complaint.listings.push({
                listingId: $item.id,
                chplProductNumber: $item.chplProductNumber,
            });
            this.listing = '';
        }

        removeListing (listingToRemove) {
            this.complaint.listings = this.complaint.listings.filter(listing => listing.listingId !== listingToRemove.listingId);
        }

        startsWith (valueToCheck, viewValue) {
            return valueToCheck.substr(0, viewValue.length).toLowerCase() === viewValue.toLowerCase();
        }

        changeAcb () {
            this.filterListingsBasedOnSelectedAcb();
        }

        filterListingsBasedOnSelectedAcb () {
            if (this.complaint.certificationBody && this.complaint.certificationBody.name) {
                // Filter the available listings based on the selected acb
                this.filteredListings = this.listings.filter(item => {
                    return item.acb === this.complaint.certificationBody.name;
                });
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceComplaint', SurveillanceComplaintComponent);
