export const SurveillanceReportRelevantListingsComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/relevant-listings.html',
    bindings: {
        listings: '<',
        onSave: '&?',
    },
    controller: class SurveillanceReportRelevantListingComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
            this.safeListings = [];
        }

        $onChanges (changes) {
            if (changes.listings) {
                this.listings = angular.copy(changes.listings.currentValue);
                if (Array.isArray(this.listings)) {
                    this.listings.forEach(listing => {
                        listing.formattedCertificationDate = new Date(listing.certificationDate);
                        listing.lastModifiedDate = parseInt(listing.lastModifiedDate, 10);
                        listing.formattedLastModifiedDate = new Date(listing.lastModifiedDate);
                    })
                }
                this.safeListings = angular.copy(this.listings);
            }
        }

        cancelEdit () {
            this.listingBeingEdited = undefined;
        }

        excludeRelevantListing (relevantListing) {
            if (this.onSave) {
                this.onSave({ listing: relevantListing })
            }
            this.listingBeingEdited = undefined;
            this.safeListings = angular.copy(this.listings);
        }

        undoExcludedListing (relevantListing) {
            relevantListing.excluded = false;
            relevantListing.reason = '';
            if (this.onSave) {
                this.onSave({ listing: relevantListing })
            }
            this.safeListings = angular.copy(this.listings);
        }

        save (listing) {
            if (this.onSave) {
                this.onSave({listing: listing});
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantListings', SurveillanceReportRelevantListingsComponent);
