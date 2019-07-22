export const SurveillanceReportExcludedListingsComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/excluded-listings.html',
    bindings: {
        listings: '<',
        onSave: '&',
    },
    controller: class SurveillanceReportExcludedListingComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
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
                        if (listing.excluded) {
                            this.excludedListings.push(listing);
                        }
                    });
                }
            }
        }

        cancelEdit () {
            this.listingBeingEdited = undefined;
        }

        excludeListing () {
            this.listing.excluded = true;
            this.onSave({ listing: this.listing });
            this.listing = undefined;
        }

        undoExcludedListing (excludedListing) {
            excludedListing.excluded = false;
            excludedListing.reason = undefined;
            this.onSave({ listing: excludedListing });
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportExcludedListings', SurveillanceReportExcludedListingsComponent);
