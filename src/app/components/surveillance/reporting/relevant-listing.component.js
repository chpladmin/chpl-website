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
            //this.backup = {};
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
                //this.backup.listing = angular.copy(this.listing);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
        }

        save () {
            this.listing.excluded = true;
            this.onSave({listing: this.listing});
        }

        cancel () {
            if (this.onCancel) {
                this.onCancel();
            }
        }

        edit () {
            this.isEditing = true;
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantListing', SurveillanceReportRelevantListingComponent);
