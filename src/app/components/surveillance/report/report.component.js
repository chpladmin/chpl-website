export const SurveillanceReportComponent = {
    templateUrl: 'chpl.components/surveillance/report/report.html',
    bindings: {
        report: '<',
        isEditing: '<',
        onCancel: '&?',
        onSave: '&?',
    },
    controller: class SurveillanceReportComponent {
        constructor ($filter, $log, authService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReport', SurveillanceReportComponent);
