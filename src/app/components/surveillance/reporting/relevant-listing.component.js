export const SurveillanceReportRelevantListingComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/relevant-listing.html',
    bindings: {
        listing: '<',
        onSave: '&',
        onCancel: '&',
    },
    controller: class SurveillanceReportRelevantListingComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
            }
        }

        cancelEdit () {
            this.activeSurveillance = undefined;
        }

        save (surveillance) {
            this.listing.surveillances = this.listing.surveillances.filter(s => s.id !== surveillance.id);
            this.listing.surveillances.push(surveillance);
            this.onSave({ listing: this.listing })
            this.activeSurveillance = undefined;
        }

        cancel () {
            this.activeSurveillance = undefined;
            this.onCancel();
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantListing', SurveillanceReportRelevantListingComponent);
