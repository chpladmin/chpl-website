export const SurveillanceComplaintComponent = {
    templateUrl: 'chpl.components/surveillance/complaint/complaint.html',
    bindings: {
        complaint: '<',
        complainantTypes: '<',
        complaintStatusTypes: '<',
        certificationBodies: '<',
        criteria: '<',
        editions: '<',
        errorMessages: '<',
        listings: '<',
        surveillances: '<',
        onCancel: '&?',
        onSave: '&?',
        onDelete: '&?',
        onListingSelected: '&?',
    },
    controller: class SurveillanceComplaintComponent {
        constructor ($filter, $log, authService, featureFlags, toaster, utilService) {
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
            this.edition = {};
            this.isEditionDropdownOpen = false;
            this.toaster = toaster;
            this.utilService = utilService;
            this.sortCert = utilService.sortCert;
        }

        $onChanges (changes) {
            if (changes.complaint) {
                this.complaint = angular.copy(changes.complaint.currentValue);
                if (this.complaint && this.complaint.id) {
                    this.currentMode = this.modes.EDIT;
                } else {
                    this.currentMode = this.modes.ADD;
                }
                this.sortCertifications(this.complaint);
                this.$log.info(this.complaint.receivedDate);
                this.$log.info(this.complaint.closedDate);
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
            if (changes.editions) {
                this.editions = angular.copy(changes.editions.currentValue);
                this.edition = this.getDefaultEdition();
            }
            if (changes.criteria) {
                this.criteria = angular.copy(changes.criteria.currentValue);
                this.filterCriteriaBasedOnSelectedEdition();
            }
            if (changes.surveillances) {
                this.surveillances = angular.copy(changes.surveillances.currentValue);
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
            this.$log.info(this.complaint.formattedReceivedDate);
            this.$log.info(this.complaint.formattedClosedDate);
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
            if (!this.isListingAlreadyAssociatedToComplaint($item)) {
                this.complaint.listings.push({
                    listingId: $item.id,
                    chplProductNumber: $item.chplProductNumber,
                });
                if (this.onListingSelected) {
                    this.onListingSelected({ complaint: this.complaint });
                }
            } else {
                this.toaster.pop({
                    type: 'warning',
                    body: $item.chplProductNumber + ' already exists',
                });
            }
            this.listing = '';
        }

        isListingAlreadyAssociatedToComplaint (listing) {
            let found = this.complaint.listings.find(item => item.chplProductNumber === listing.chplProductNumber);
            return found !== undefined;
        }

        removeListing (listingToRemove) {
            this.complaint.listings = this.complaint.listings.filter(listing => listing.listingId !== listingToRemove.listingId);
        }

        disableListing (listing) {
            this.$log.info(listing);
            return true;
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

        getDefaultEdition () {
            return this.editions.find(item => item.name === '2015');
        }

        selectEdition (edition) {
            this.edition = edition;
            this.filterCriteriaBasedOnSelectedEdition();
        }

        filterCriteriaBasedOnSelectedEdition () {
            this.filteredCriteria = this.criteria.filter(item => item.certificationEditionId === this.edition.id);
        }

        selectCriteria () {
            if (!Array.isArray(this.complaint.criteria)) {
                this.complaint.criteria = [];
            }
            if (!this.isCriterionAlreadyAssociatedToComplaint(this.criterion)) {
                this.complaint.criteria.push({
                    complaintId: this.complaint.id,
                    certificationCriterion: this.criterion,
                });
                this.sortCertifications(this.complaint);
            } else {
                this.toaster.pop({
                    type: 'warning',
                    body: this.criterion.number + ' already exists',
                });
            }
            this.criterion = {};
        }

        isCriterionAlreadyAssociatedToComplaint (criterion) {
            let found = this.complaint.criteria.find(item => item.certificationCriterion.number === criterion.number);
            return found !== undefined;
        }

        removeCriterion (criterionToRemove) {
            this.complaint.criteria = this.complaint.criteria.filter(criterion => criterion.certificationCriterion.id !== criterionToRemove.certificationCriterion.id);
        }

        sortCertifications (complaint) {
            if (Array.isArray(complaint.criteria)) {
                complaint.criteria.sort((a, b) => {
                    return this.utilService.sortCertActual(a.certificationCriterion, b.certificationCriterion);
                });
            }
        }

        selectSurveillance () {
            if (!Array.isArray(this.complaint.surveillances)) {
                this.complaint.surveillances = [];
            }
            if (!this.isSurveillanceAlreadyAssociatedToComplaint(this.surveillance)) {
                this.complaint.surveillances.push({
                    complaintId: this.complaint.id,
                    surveillance: this.surveillance,
                });
            } else {
                this.toaster.pop({
                    type: 'warning',
                    body: this.surveillance.friendlyId + ' already exists',
                });
            }
            this.surveillance = {};
        }

        isSurveillanceAlreadyAssociatedToComplaint (surveillance) {
            let found = this.complaint.surveillances.find(item => item.surveillance.id === surveillance.id);
            return found !== undefined;
        }

        removeSurveillance (surveillanceToRemove) {
            this.complaint.surveillances = this.complaint.surveillances.filter(surveillance => surveillance.surveillanceId !== surveillanceToRemove.surveillanceId);
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceComplaint', SurveillanceComplaintComponent);
