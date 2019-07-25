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
                this.parseRelevantListings(this.relevantListings);
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
            this.parseRelevantListings(this.backup.relevantListings);
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
            let that = this;
            this.networkService.updateRelevantListing(this.report.id, listing).then(() => {
                that.networkService.getRelevantListings(that.report.id).then(results => {
                    that.relevantListings = results;
                    that.backup.relevantListings = angular.copy(results);
                    that.parseRelevantListings(that.relevantListings);
                });
            }, () => {
                that.networkService.getRelevantListings(that.report.id).then(results => {
                    that.relevantListings = results;
                    that.backup.relevantListings = angular.copy(results);
                    that.parseRelevantListings(that.relevantListings);
                });
            });
        }

        isRelevantSurveillance (surveillance) {
            let reportStart = new Date(this.report.startDate);
            let reportEnd = new Date(this.report.endDate);
            let surveillanceStart = new Date(surveillance.startDate);
            let surveillanceEnd = surveillance.endDate ? new Date(surveillance.endDate) : false;
            return surveillanceStart <= reportEnd &&
                (!surveillanceEnd || surveillanceEnd >= reportStart);
        }

        parseRelevantListings (listings) {
            this.excludedListings = angular.copy(listings);
            this.relevantListings = listings.map(l => {
                l.surveillances = l.surveillances.filter(s => this.isRelevantSurveillance(s));
                return l;
            }).filter(l => l.surveillances && l.surveillances.length > 0);
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceReportQuarter', SurveillanceReportQuarterComponent);
