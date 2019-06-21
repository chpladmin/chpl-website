export const SurveillanceReportQuarterComponent = {
    templateUrl: 'chpl.components/surveillance/reporting/quarter.html',
    bindings: {
        report: '<',
        isEditing: '<',
        onCancel: '&?',
        onSave: '&?',
        takeAction: '&?',
    },
    controller: class SurveillanceReportQuarterComponent {
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
            this.networkService.generateQuarterlySurveillanceReport(this.report.id)
                .then(() => that.toaster.pop({
                    type: 'success',
                    title: 'Report is being generated',
                    body: 'QuarterlySurveillance report is being generated, and will be emailed when ready.',
                }));
        }

        saveRelevantListing (listing) {
            this.takeAction({report: this.report, listing: listing, action: 'saveRelevantListing'});
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportQuarter', SurveillanceReportQuarterComponent);
