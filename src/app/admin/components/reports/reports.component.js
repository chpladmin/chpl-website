export const ReportsComponent = {
    templateUrl: 'chpl.admin/components/reports/reports.html',
    bindings: {
        workType: '<',
        productId: '<',
    },
    controller: class ReportsController {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onInit () {
            this.tab = 'cp';
        }

        $onChanges (changes) {
            if (!changes.workType.isFirstChange()) {
                if (changes.workType) {
                    this.workType = angular.copy(changes.workType.currentValue);
                }
                if (changes.productId) {
                    this.productId = angular.copy(changes.productId.currentValue);
                }
            }
        }
    },
}

angular.module('chpl.admin')
    .component('aiReports', ReportsComponent);
