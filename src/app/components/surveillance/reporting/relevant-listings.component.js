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
        }

        undoExcludedListing (relevantListing) {
            relevantListing.excluded = false;
            relevantListing.reason = '';
            if (this.onSave) {
                this.onSave({ listing: relevantListing })
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantListings', SurveillanceReportRelevantListingsComponent);
