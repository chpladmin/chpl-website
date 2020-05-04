export const SurveillanceReportExcludedListingsComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/excluded-listings.html',
    bindings: {
        listings: '<',
        onSave: '&',
    },
    controller: class SurveillanceReportExcludedListingComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.backup = {};
        }

        $onChanges (changes) {
            if (changes.listings) {
                this.listings = angular.copy(changes.listings.currentValue);
                if (Array.isArray(this.listings)) {
                    this.excludedListings = [];
                    this.listings.forEach(listing => {
                        listing.formattedCertificationDate = new Date(listing.certificationDate);
                        listing.lastModifiedDate = parseInt(listing.lastModifiedDate, 10);
                        listing.formattedLastModifiedDate = new Date(listing.lastModifiedDate);
                        listing.edition = listing.edition + (listing.curesUpdate ? ' Cures Update' : '');
                        if (listing.excluded) {
                            this.excludedListings.push(listing);
                        }
                    });
                    this.backup.excludedListings = angular.copy(this.excludedListings);
                }
            }
        }

        excludeListing () {
            this.listing.excluded = true;
            this.onSave({ listing: angular.copy(this.listing) });
            this.listing = undefined;
            this.restoreForm();
        }

        undoExcludedListing (excludedListing) {
            excludedListing.excluded = false;
            excludedListing.reason = undefined;
            this.onSave({ listing: excludedListing });
        }

        edit (listing) {
            this.listing = angular.copy(listing);
        }

        cancelEdit () {
            this.excludedListings = angular.copy(this.backup.excludedListings);
            this.listing = undefined;
            this.restoreForm();
        }

        restoreForm () {
            this.form.$setPristine();
            this.form.$setUntouched();
            this.showFormErrors = false;
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportExcludedListings', SurveillanceReportExcludedListingsComponent);
