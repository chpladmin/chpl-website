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
        constructor ($log, $state, $uibModal, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.$uibModal = $uibModal;
            this.networkService = networkService;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onInit () {
            this.surveillanceTypes = this.networkService.getSurveillanceLookups();
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

        editSurveillance (relevantSurveillance) {
            let that = this;
            this._fixRequirementOptions();
            this.networkService.getListing(this.listing.id, true).then(listing => {
                let surveillance = listing.surveillance.find(s => s.id === relevantSurveillance.id);
                that.uibModalInstance = that.$uibModal.open({
                    component: 'aiSurveillanceEdit',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: {
                        surveillance: () => { return surveillance; },
                        surveillanceTypes: () => { return that.surveillanceTypes; },
                        workType: () => { return 'edit'; },
                    },
                });
                that.uibModalInstance.result.then(() => {
                    that.$state.reload();
                });
            });
        }

        _fixRequirementOptions () {
            if (this.listing.edition === '2015') {
                this.surveillanceTypes.surveillanceRequirements.criteriaOptions = this.surveillanceTypes.surveillanceRequirements.criteriaOptions2015;
            } else if (this.listing.edition === '2014') {
                this.surveillanceTypes.surveillanceRequirements.criteriaOptions = this.surveillanceTypes.surveillanceRequirements.criteriaOptions2014;
            }
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
