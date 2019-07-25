export const SurveillanceReportRelevantSurveillanceComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/relevant-surveillance.html',
    bindings: {
        surveillance: '<',
        surveillanceOutcomes: '<',
        surveillanceProcessTypes: '<',
        onCancel: '&',
        onSave: '&',
    },
    controller: class SurveillanceReportRelevantSurveillanceComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onChanges (changes) {
            if (changes.surveillance) {
                this.surveillance = angular.copy(changes.surveillance.currentValue);
            }
            if (changes.surveillanceOutcomes) {
                this.surveillanceOutcomes = angular.copy(changes.surveillanceOutcomes.currentValue);
            }
            if (changes.surveillanceProcessTypes) {
                this.surveillanceProcessTypes = angular.copy(changes.surveillanceProcessTypes.currentValue);
            }
            if (this.surveillanceOutcomes) {
                this.surveillanceOutcomes.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
            }
            if (this.surveillanceProcessTypes) {
                this.surveillanceProcessTypes.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
            }
        }

        save () {
            this.onSave({surveillance: this.surveillance});
        }

        cancel () {
            this.onCancel();
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportRelevantSurveillance', SurveillanceReportRelevantSurveillanceComponent);
