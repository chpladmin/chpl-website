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
        constructor ($log, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
            this.hasAnyRole = authService.hasAnyRole;
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
                this.surveillances = this.listing.surveillances.map(s => this.calculateCompletion(s));
            }
        }

        cancelEdit () {
            this.activeSurveillance = undefined;
        }

        save (surveillance) {
            let that = this;
            this.networkService.updateRelevantSurveillance(this.quarterlyReport.id, surveillance).then(response => {
                that.surveillances = that.surveillances.filter(s => s.id !== response.id);
                that.surveillances.push(that.calculateCompletion(response));
                that.activeSurveillance = undefined;
            });
        }

        cancel () {
            this.activeSurveillance = undefined;
            this.onCancel();
        }

        calculateCompletion (surveillance) {
            surveillance.completed = Math.round((
                (surveillance.surveillanceOutcome ? 1 : 0 ) +
                    (surveillance.surveillanceProcessType ? 1 : 0 ) +
                    (surveillance.k1Reviewed ? 1 : 0 ) +
                    (surveillance.groundsForInitiating ? 1 : 0 ) +
                    (surveillance.nonconformityCauses ? 1 : 0 ) +
                    (surveillance.nonconformityNature ? 1 : 0 ) +
                    (surveillance.stepsToSurveil ? 1 : 0 ) +
                    (surveillance.stepsToEngage ? 1 : 0 ) +
                    (surveillance.additionalCostsEvaluation ? 1 : 0 ) +
                    (surveillance.limitationsEvaluation ? 1 : 0 ) +
                    (surveillance.nondisclosureEvaluation ? 1 : 0 ) +
                    (surveillance.directionDeveloperResolution ? 1 : 0 ) +
                    (surveillance.completedCapVerification ? 1 : 0)
            ) * 100 / 13);
            return surveillance;
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantListing', SurveillanceReportRelevantListingComponent);
