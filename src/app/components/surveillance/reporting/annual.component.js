export const SurveillanceReportAnnualComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/annual.html',
    bindings: {
        report: '<',
        isEditing: '<',
        onCancel: '&?',
        onSave: '&?',
        takeAction: '&?',
    },
    controller: class SurveillanceReportAnnualComponent {
        constructor ($log, API, authService) {
            'ngInject'
            this.$log = $log;
            this.API = API;
            this.backup = {};
            this.hasAnyRole = authService.hasAnyRole;
            this.API_KEY = authService.getApiKey();
            this.getToken = authService.getToken;
        }

        $onChanges (changes) {
            if (changes.report) {
                this.report = angular.copy(changes.report.currentValue);
                this.backup.report = angular.copy(this.report);
            }
            if (changes.isEditing) {
                this.isEditing = angular.copy(changes.isEditing.currentValue);
            }
            if (this.report) {
                this.downloadUrl = this.API + '/surveillance-report/export/annual/' + this.report.id + '?api_key=' + this.API_KEY + '&authorization=Bearer%20' + this.getToken();
            }
        }

        save () {
            this.onSave({report: this.report});
        }

        cancel () {
            this.report = angular.copy(this.backup.report);
            this.onCancel();
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
    .component('chplSurveillanceReportAnnual', SurveillanceReportAnnualComponent);
