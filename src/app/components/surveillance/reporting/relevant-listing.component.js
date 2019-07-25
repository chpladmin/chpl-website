export const SurveillanceReportRelevantListingComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/relevant-listing.html',
    bindings: {
        listing: '<',
        quarterlyReport: '<',
        surveillanceOutcomes: '<',
        surveillanceProcessTypes: '<',
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
            if (this.listing.surveillances) {
                this.surveillances = angular.copy(this.listing.surveillances);
            }
        }

        cancelEdit () {
            this.activeSurveillance = undefined;
        }

        save (surveillance) {
            let that = this;
            this.networkService.updateRelevantSurveillance(this.quarterlyReport.id, surveillance).then(response => {
                that.surveillances = that.surveillances.filter(s => s.id !== response.id);
                that.surveillances.push(response);
                that.activeSurveillance = undefined;
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
