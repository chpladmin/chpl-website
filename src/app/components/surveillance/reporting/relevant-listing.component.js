export const SurveillanceReportRelevantListingComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/relevant-listing.html',
    bindings: {
        listing: '<',
        onSave: '&',
    },
    controller: class SurveillanceReportRelevantListingComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.backup = {};
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
                this.backup.listing = angular.copy(this.listing);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
        }

        save () {
            if (!this.listing.excluded) {
                this.listing.exclusionReason = undefined;
            }
            this.onSave({listing: this.listing});
        }

        cancel () {
            this.listing = angular.copy(this.backup.listing);
            this.isEditing = false;
        }

        edit () {
            this.isEditing = true;
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantListing', SurveillanceReportRelevantListingComponent);
