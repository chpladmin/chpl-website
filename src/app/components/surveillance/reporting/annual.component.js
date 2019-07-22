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

        edit () {
            this.takeAction({report: this.report, action: 'edit'});
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
                });
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportAnnual', SurveillanceReportAnnualComponent);
