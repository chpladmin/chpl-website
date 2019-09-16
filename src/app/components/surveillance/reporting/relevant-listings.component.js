export const SurveillanceReportRelevantListingsComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/relevant-listings.html',
    bindings: {
        listings: '<',
        quarterlyReport: '<',
        relevantListing: '<',
        surveillanceOutcomes: '<',
        surveillanceProcessTypes: '<',
        onSave: '&',
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
                        listing.surveillanceCount = listing.surveillances.length;
                    });
                }
            }
            if (changes.quarterlyReport) {
                this.quarterlyReport = angular.copy(changes.quarterlyReport.currentValue);
            }
            if (changes.relevantListing) {
                this.relevantListing = angular.copy(changes.relevantListing.currentValue);
            }
            if (changes.surveillanceOutcomes) {
                this.surveillanceOutcomes = angular.copy(changes.surveillanceOutcomes.currentValue);
            }
            if (changes.surveillanceProcessTypes) {
                this.surveillanceProcessTypes = angular.copy(changes.surveillanceProcessTypes.currentValue);
            }
            if (this.listings && this.relevantListing) {
                this.activeListing = this.listings.find(l => l.id === this.relevantListing.id);
            }
        }

        cancelEdit () {
            this.activeListing = undefined;
        }

        save (listing) {
            this.onSave({ listing: listing })
            this.activeListing = undefined;
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantListings', SurveillanceReportRelevantListingsComponent);
