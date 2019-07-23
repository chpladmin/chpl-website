export const SurveillanceReportRelevantListingComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/relevant-listing.html',
    bindings: {
        listing: '<',
        quarterlyReport: '<',
        surveillanceOutcomes: '<',
        surveillanceProcessTypes: '<',
        onSave: '&',
        onCancel: '&',
    },
    controller: class SurveillanceReportRelevantListingComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
            }
            if (changes.quarterlyReport) {
                this.quarterlyReport = angular.copy(changes.quarterlyReport.currentValue);
            }
            if (changes.surveillanceOutcomes) {
                this.surveillanceOutcomes = angular.copy(changes.surveillanceOutcomes.currentValue);
            }
            if (changes.surveillanceProcessTypes) {
                this.surveillanceProcessTypes = angular.copy(changes.surveillanceProcessTypes.currentValue);
            }
        }

        cancelEdit () {
            this.activeSurveillance = undefined;
        }

        save (surveillance) {
            let that = this;
            this.networkService.updateRelevantSurveillance(this.quarterlyReport.id, surveillance).then(response => {
                that.listing.surveillances = that.listing.surveillances.filter(s => s.id !== response.id);
                that.listing.surveillances.push(response);
                that.onSave({ listing: that.listing })
                this.activeSurveillance = undefined;
            });
        }

        cancel () {
            this.activeSurveillance = undefined;
            this.onCancel();
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantListing', SurveillanceReportRelevantListingComponent);
