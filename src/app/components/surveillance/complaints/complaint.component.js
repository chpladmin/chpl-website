export const SurveillanceComplaintComponent = {
    templateUrl: 'chpl.components/surveillance/complaints/complaint.html',
    bindings: {
        complaint: '<',
        complainantTypes: '<',
        certificationBodies: '<',
        criteria: '<',
        displayHeader: '<',
        editions: '<',
        errorMessages: '<',
        listings: '<',
        onCancel: '&?',
        onDelete: '&?',
        onListingSelected: '&?',
        onSave: '&?',
        surveillances: '<',
    },
    controller: class SurveillanceComplaintComponent {
        constructor ($anchorScroll, $filter, $log, authService, featureFlags, toaster, utilService) {
            'ngInject';
            this.$anchorScroll = $anchorScroll;
            this.$filter = $filter;
            this.$log = $log;
            this.isOn = featureFlags.isOn;
            this.hasAnyRole = authService.hasAnyRole;
            this.modes = {
                EDIT: 'edit',
                ADD: 'add',
            };
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
                this.$anchorScroll();
            }
            if (changes.complainantTypes) {
                this.complainantTypes = angular.copy(changes.complainantTypes.currentValue);
            }
            if (changes.certificationBodies) {
                this.certificationBodies = angular.copy(changes.certificationBodies.currentValue);
                this.certificationBodies.forEach(acb => {
                    acb.displayValue = acb.name + (acb.retired ? ' (Retired)' : '');
                });
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
            //Remove any surveillances related to the removed listing
            let friendlyIds = [];
            let surveillances = angular.copy(this.complaint.surveillances);
            surveillances.forEach(surveillance => {
                if (surveillance.surveillance.certifiedProductId === listingToRemove.listingId) {
                    friendlyIds.push(surveillance.surveillance.friendlyId);
                    this.removeSurveillance(surveillance);
                }
            });
            //If there were any surveillances remove, show them
            if (friendlyIds.length > 0) {
                let surveillancesString = friendlyIds.join(', ');
                this.toaster.pop({
                    type: 'success',
                    body: 'The following surveillances are associated with the listing and have been removed: ' + surveillancesString,
                });
            }

            this.onListingSelected({ complaint: this.complaint });
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
                    body: 'Certification Criterion :"' + this.criterion.number + ': ' + this.criterion.title + '" is already associated with this complaint',
                });
            }
            this.criterion = {};
        }

        isCriterionAlreadyAssociatedToComplaint (criterion) {
            return this.complaint.criteria
                .find(item => item.certificationCriterion.number === criterion.number
                      && item.certificationCriterion.title === criterion.title);
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
            this.complaint.surveillances = this.complaint.surveillances.filter(surveillance => surveillance.surveillance.id !== surveillanceToRemove.surveillance.id);
        }
    },
};

angular.module('chpl.components')
    .component('chplSurveillanceComplaint', SurveillanceComplaintComponent);
