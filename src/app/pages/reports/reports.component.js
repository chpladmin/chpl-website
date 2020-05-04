export const ReportsComponent = {
    templateUrl: 'chpl.reports/reports.html',
    bindings: {
    },
    controller: class ReportsComponent {
        constructor ($log, authService, featureFlags) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.isOn = featureFlags.isOn;
        }
    },
}

angular.module('chpl.reports')
    .component('chplReports', ReportsComponent);
