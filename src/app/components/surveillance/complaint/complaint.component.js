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
    },
    controller: class SurveillanceComplaintComponent {
        constructor ($filter, $log, authService, featureFlags, utilService) {
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
            this.sortCertActual = utilService.sortCertActual;
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
                this.filteredListings = this.listings.filter(item => item.acb === this.complaint.certificationBody.name);
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
            this.complaint.criteria.push({
                complaintId: this.complaint.id,
                certificationCriterion: this.criterion,
            });
            this.sortCertifications(this.complaint);
            this.criterion = {};
        }

        removeCriterion (criterionToRemove) {
            this.complaint.criteria = this.complaint.criteria.filter(criterion => criterion.certificationCriterionId !== criterionToRemove.certificationCriterionId);
        }

        sortCertifications (complaint) {
            if (Array.isArray(complaint.criteria)) {
                complaint.criteria.sort((a, b) => {
                    return this.sortCertActual(a.certificationCriterion, b.certificationCriterion);
                });
            }
        }

        selectSurveillance () {
            if (!Array.isArray(this.complaint.surveillances)) {
                this.complaint.surveillances = [];
            }
            this.complaint.surveillances.push({
                complaintId: this.complaint.id,
                surveillance: this.surveillance,
            });
            this.surveillance = {};
        }

        removeSurveillance (surveillanceToRemove) {
            this.complaint.surveillances = this.complaint.surveillances.filter(surveillance => surveillance.surveillanceId !== surveillanceToRemove.surveillanceId);
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceComplaint', SurveillanceComplaintComponent);
