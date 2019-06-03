export const SurveillanceReportComponent = {
    templateUrl: 'chpl.components/surveillance/report/report.html',
    bindings: {
        report: '<',
        isEditing: '<',
        onCancel: '&?',
        onSave: '&?',
        takeAction: '&?',
    },
    controller: class SurveillanceReportComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
            this.backup = {};
        }

        $onChanges (changes) {
            if (changes.report) {
                this.report = angular.copy(changes.report.currentValue);
                this.backup.report = angular.copy(this.report);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
        }

        save () {
            this.onSave({report: this.report});
        }

        cancel () {
            this.report = angular.copy(this.backup.report);
            this.onCancel();
        }

        download () {
            this.networkService.downloadQuarterlySurveillanceReport(this.report.id);
        }

        edit () {
            this.takeAction({report: this.report, action: 'edit'});
        }

        delete () {
            this.takeAction({report: this.report, action: 'delete'});
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReport', SurveillanceReportComponent);
