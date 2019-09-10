export const SurveillanceReportAnnualComponent = {
    templateUrl: 'chpl.surveillance/reporting/annual.html',
    bindings: {
        report: '<',
        onCancel: '&',
        onSave: '&',
        takeAction: '&',
    },
    controller: class SurveillanceReportAnnualComponent {
        constructor ($log, authService, networkService, toaster) {
            'ngInject'
            this.$log = $log;
            this.backup = {};
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.toaster = toaster;
        }

        $onChanges (changes) {
            if (changes.report) {
                this.report = angular.copy(changes.report.currentValue);
                this.backup.report = angular.copy(this.report);
            }
        }

        save () {
            this.onSave({report: this.report});
        }

        cancel () {
            this.report = angular.copy(this.backup.report);
            this.onCancel();
        }

        delete () {
            this.takeAction({report: this.report, action: 'delete'});
        }

        generateReport () {
            let that = this;
            this.networkService.generateAnnualSurveillanceReport(this.report.id)
                .then(results => {
                    let name = results.user.friendlyName ? results.user.friendlyName : results.user.fullName;
                    let email = results.user.email;
                    that.toaster.pop({
                        type: 'success',
                        title: 'Report is being generated',
                        body: `Annual Surveillance report is being generated, and will be emailed to ${name} at ${email} when ready.`,
                    });
                }, error => {
                    let message = error.data.error;
                    that.toaster.pop({
                        type: 'error',
                        title: 'Report could not be generated',
                        body: message,
                    });
                });
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceReportAnnual', SurveillanceReportAnnualComponent);
