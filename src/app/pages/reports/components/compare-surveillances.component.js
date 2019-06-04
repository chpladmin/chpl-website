export const CompareSurveillancesComponent = {
    templateUrl: 'chpl.reports/components/compare-surveillances.html',
    bindings: {
        resolve: '<',
        close: '&',
        dismiss: '&',
    },
    controller: class CompareSurveillancesComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onInit () {
            this.oldSurveillance = angular.copy(this.resolve.oldSurveillance);
            this.newSurveillance = angular.copy(this.resolve.newSurveillance);
        }

        cancel () {
            this.dismiss();
        }
    },
}

angular
    .module('chpl.reports')
    .component('chplCompareSurveillances', CompareSurveillancesComponent);
