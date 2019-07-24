export const SurveillanceReportingComponent = {
    templateUrl: 'chpl.surveillance/reporting/reporting.html',
    bindings: {
        acbs: '<',
        annual: '<',
        availableQuarters: '<',
        quarters: '<',
        surveillanceOutcomes: '<',
        surveillanceProcessTypes: '<',
    },
    controller: class SurveillanceReportingComponent {
        constructor ($log, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.mode = 'view';
        }

        $onInit () {
            let now = new Date();
            let currentYear = now.getYear() + 1900;
            this.availableYears = [];
            for (let i = 2019; i <= currentYear + 1; i++) {
                this.availableYears.push(i);
            }
        }

        $onChanges (changes) {
            if (changes.acbs) {
                this.acbs = angular.copy(changes.acbs.currentValue.acbs.filter(a => !a.retired));
                if (this.acbs.length === 1) {
                    this.display = {};
                    this.display[this.acbs[0].name] = true;
                }
            }
            if (changes.annual) {
                this.annuals = angular.copy(changes.annual.currentValue);
            }
            if (changes.availableQuarters) {
                this.availableQuarters = angular.copy(changes.availableQuarters.currentValue);
            }
            if (changes.quarters) {
                this.quarters = angular.copy(changes.quarters.currentValue);
            }
            if (changes.surveillanceOutcomes) {
                this.surveillanceOutcomes = angular.copy(changes.surveillanceOutcomes.currentValue);
            }
            if (changes.surveillanceProcessTypes) {
                this.surveillanceProcessTypes = angular.copy(changes.surveillanceProcessTypes.currentValue);
            }
        }

        findAnnualReport (acb, year) {
            let report = this.annual
                .find(report => report.acb.name === acb.name
                      && report.year === year);
            return report;
        }

        findQuarterReport (acb, year, quarter) {
            let report = this.quarters
                .find(report => report.acb.name === acb.name
                      && report.year === year
                      && report.quarter === quarter);
            return report;
        }

        isAnnualOpen (acb, year) {
            let report = this.findAnnualReport(acb, year);
            return this.activeAnnualReport && report && this.activeAnnualReport.id === report.id;
        }

        isQuarterOpen (acb, year, quarter) {
            let report = this.findQuarterReport(acb, year, quarter);
            return this.activeQuarterReport && report && this.activeQuarterReport.id === report.id;
        }

        actOnAnnual (acb, year) {
            let report = this.findAnnualReport(acb, year);
            if (report) {
                if (this.isAnnualOpen(acb, year)) {
                    this.activeAnnualReport = undefined;
                } else {
                    this.activeAnnualReport = report;
                }
            } else {
                let report = {
                    acb: acb,
                    year: year,
                };
                this.createAnnual(report);
            }
        }

        actOnQuarter (acb, year, quarter) {
            let report = this.findQuarterReport(acb, year, quarter);
            if (report) {
                if (this.isQuarterOpen(acb, year, quarter)) {
                    this.activeQuarterReport = undefined;
                } else {
                    let that = this;
                    this.networkService.getRelevantListings(report)
                        .then(results => {
                            report.relevantListings = results;
                            that.activeQuarterReport = report;
                        });
                }
            } else {
                let report = {
                    acb: acb,
                    quarter: quarter,
                    year: year,
                };
                this.createQuarter(report);
            }
        }

        takeAnnualAction (report, action) {
            if (action === 'edit') {
                this.activeAnnualReport = report;
                this.mode = 'editAnnual';
            }
            if (action === 'delete') {
                let that = this;
                this.networkService.deleteAnnualSurveillanceReport(report.id).then(() => {
                    that.networkService.getAnnualSurveillanceReports().then(results => {
                        that.annual = results;
                    });
                    that.activeAnnualReport = undefined;
                    that.cancelAnnual();
                });
            }
        }

        takeQuarterAction (report, action, listing) {
            if (action === 'delete') {
                let that = this;
                this.networkService.deleteQuarterlySurveillanceReport(report.id).then(() => {
                    that.networkService.getQuarterlySurveillanceReports().then(results => {
                        that.quarters = results;
                    });
                    that.activeQuarterReport = undefined;
                    that.cancelQuarter();
                });
            }
            if (action === 'saveRelevantListing') {
                let that = this;
                this.networkService.updateRelevantListing(report.id, listing).then(() => {
                    that.networkService.getRelevantListings(report).then(results => {
                        that.quarters.forEach(q => {
                            if (q.id === report.id) {
                                report.relevantListings = results;
                            }
                        });
                    });
                });
            }
        }

        createAnnual (report) {
            let that = this;
            this.networkService.createAnnualSurveillanceReport(report).then(results => {
                that.activeAnnualReport = results;
                that.networkService.getAnnualSurveillanceReports().then(results => {
                    that.annual = results;
                });
            });
        }

        saveAnnual (report) {
            let that = this;
            this.networkService.updateAnnualSurveillanceReport(report).then(results => {
                that.activeAnnualReport = results;
                that.networkService.getAnnualSurveillanceReports().then(results => {
                    that.annual = results;
                });
                that.cancelAnnual();
            });
        }

        createQuarter (report) {
            let that = this;
            this.networkService.createQuarterlySurveillanceReport(report).then(results => {
                that.networkService.getRelevantListings(results)
                    .then(listings => {
                        results.relevantListings = listings;
                        that.activeQuarterReport = results;
                    });
                that.networkService.getQuarterlySurveillanceReports().then(results => {
                    that.quarters = results;
                });
            });
        }

        saveQuarter (report) {
            let that = this;
            this.networkService.updateQuarterlySurveillanceReport(report).then(results => {
                that.networkService.getRelevantListings(results)
                    .then(listings => {
                        results.relevantListings = listings;
                        that.activeQuarterReport = results;
                    });
                that.networkService.getQuarterlySurveillanceReports().then(results => {
                    that.quarters = results;
                });
            });
        }

        cancelAnnual () {
            this.activeAnnualReport = undefined;
            this.mode = 'view';
        }

        cancelQuarter () {
            this.activeQuarterReport = undefined;
            this.mode = 'view';
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceReporting', SurveillanceReportingComponent);
