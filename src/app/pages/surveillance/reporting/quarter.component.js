export const SurveillanceReportQuarterComponent = {
    templateUrl: 'chpl.surveillance/reporting/quarter.html',
    bindings: {
        report: '<',
        relevantListings: '<',
        surveillanceOutcomes: '<',
        surveillanceProcessTypes: '<',
        onCancel: '&',
        onSave: '&',
        takeAction: '&',
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
            if (changes.relevantListings) {
                this.relevantListings = angular.copy(changes.relevantListings.currentValue);
                this.backup.relevantListings = angular.copy(this.relevantListings);
            }
            if (this.relevantListings) {
                this.excludedListings = this.relevantListings.filter(() => true);
                this.relevantListings = this.relevantListings.map(l => {
                    l.surveillances = l.surveillances.filter(s => this.isRelevantSurveillance(s));
                    return l;
                }).filter(l => l.surveillances && l.surveillances.length > 0);
            }
            if (changes.surveillanceOutcomes) {
                this.surveillanceOutcomes = angular.copy(changes.surveillanceOutcomes.currentValue);
            }
            if (changes.surveillanceProcessTypes) {
                this.surveillanceProcessTypes = angular.copy(changes.surveillanceProcessTypes.currentValue);
            }
        }

        save () {
            this.onSave({report: this.report});
        }

        cancel () {
            this.report = angular.copy(this.backup.report);
            this.excludedListings = this.backup.relevantListings.filter(() => true);
            this.relevantListings = this.backup.relevantListings.map(l => {
                l.surveillances = l.surveillances.filter(s => this.isRelevantSurveillance(s));
                return l;
            }).filter(l => l.surveillances && l.surveillances.length > 0);
            this.onCancel();
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

angular.module('chpl.surveillance')
    .component('chplSurveillanceReportQuarter', SurveillanceReportQuarterComponent);
