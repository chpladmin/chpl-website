export const SurveillanceReportingComponent = {
    templateUrl: 'chpl.surveillance/reporting/reporting.html',
    bindings: { },
    controller: class SurveillanceReportingComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceReporting', SurveillanceReportingComponent);
