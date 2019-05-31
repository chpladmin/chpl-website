export const SurveillanceReportingComponent = {
    templateUrl: 'chpl.surveillance/reporting/reporting.html',
    bindings: {
        reports: '<',
    },
    controller: class SurveillanceReportingComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.reports) {
                this.reports = angular.copy(changes.reports.currentValue);
            }
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceReporting', SurveillanceReportingComponent);
