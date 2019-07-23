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
            if (this.report) {
                this.excludedListings = this.report.relevantListings.filter(() => true);
                this.relevantListings = this.report.relevantListings.map(l => {
                    l.surveillances = l.surveillances.filter(s => this.isRelevantSurveillance(s));
                    return l;
                }).filter(l => l.surveillances && l.surveillances.length > 0);
            }
        }

        save () {
            this.onSave({report: this.report});
        }

        cancel () {
            this.report = angular.copy(this.backup.report);
            this.excludedListings = this.report.relevantListings.filter(() => true);
            this.relevantListings = this.report.relevantListings.map(l => {
                l.surveillances = l.surveillances.filter(s => this.isRelevantSurveillance(s));
                return l;
            }).filter(l => l.surveillances && l.surveillances.length > 0);
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
                .then(results => {
                    let name = results.user.friendlyName ? results.user.friendlyName : results.user.fullName;
                    let email = results.user.email;
                    that.toaster.pop({
                        type: 'success',
                        title: 'Report is being generated',
                        body: `Quarterly Surveillance report is being generated, and will be emailed to ${name} at ${email} when ready.`,
                    });
                });
        }

        saveRelevantListing (listing) {
            this.takeAction({report: this.report, listing: listing, action: 'saveRelevantListing'});
        }

        isRelevantSurveillance (surveillance) {
            let reportStart = new Date(this.report.startDate);
            let reportEnd = new Date(this.report.endDate);
            let surveillanceStart = new Date(surveillance.startDate);
            let surveillanceEnd = surveillance.endDate ? new Date(surveillance.endDate) : false;
            return surveillanceStart <= reportEnd &&
                (!surveillanceEnd || surveillanceEnd >= reportStart);
        }
    },
}

angular.module('chpl.components')
    .component('chplSurveillanceReportQuarter', SurveillanceReportQuarterComponent);
