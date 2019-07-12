export const SurveillanceReportRelevantListingsComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/relevant-listings.html',
    bindings: {
        listings: '<',
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

            //Find and replace the relevant listing
            let foundListing = this.listings.findIndex(item => item.id === relevantListing.id);
            if (foundListing !== -1) {
                this.listings[foundListing] = relevantListing;
            }
            this.listingBeingEdited = undefined;
            this.safeListings = angular.copy(this.listings);
        }

        undoExcludedListing (relevantListing) {
            let foundListing = this.listings.findIndex(item => item.id === relevantListing.id);
            if (foundListing !== -1) {
                this.listings[foundListing].excluded = false;
                this.listings[foundListing].reason = '';
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantListings', SurveillanceReportRelevantListingsComponent);
