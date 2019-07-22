export const SurveillanceReportRelevantSurveillanceComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/relevant-surveillance.html',
    bindings: {
        surveillance: '<',
        onCancel: '&',
        onSave: '&',
    },
    controller: class SurveillanceReportRelevantSurveillanceComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.surveillance) {
                this.surveillance = angular.copy(changes.surveillance.currentValue);
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
