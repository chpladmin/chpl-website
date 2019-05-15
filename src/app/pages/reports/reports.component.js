export const ReportsComponent = {
    templateUrl: 'chpl.reports/reports.html',
    bindings: {
    },
    controller: class ReportsComponent {
        constructor ($log, authService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }
    },
}

angular.module('chpl.reports')
    .component('chplReports', ReportsComponent);
