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
        constructor ($log, $state, authService, networkService) {
            'ngInject'
            this.$log = $log;
            this.$state = $state;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
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

        actOnAnnual (acb, year) {
            let report = this.findAnnualReport(acb, year);
            if (report) {
                this.$state.go('.annual', {
                    reportId: report.id,
                });
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
                this.$state.go('.quarterly', {
                    reportId: report.id,
                });
                /*
                  let that = this;
                  this.networkService.getRelevantListings(report)
                  .then(results => {
                  report.relevantListings = results;
                  that.activeQuarterReport = report;
                  });
                */
            } else {
                let report = {
                    acb: acb,
                    quarter: quarter,
                    year: year,
                };
                this.createQuarter(report);
            }
        }

        takeAction (report, action) {
            switch (this.$state.current.name) {
            case 'surveillance.reporting.annual':
                this.takeAnnualAction(report, action);
                break;
            case 'surveillance.reporting.quarterly':
                this.takeQuarterAction(report, action);
                break;
                //no default
            }
        }

        takeAnnualAction (report, action) {
            if (action === 'delete') {
                let that = this;
                this.networkService.deleteAnnualSurveillanceReport(report.id).then(() => {
                    that.networkService.getAnnualSurveillanceReports().then(results => {
                        that.annual = results;
                    });
                    that.cancel();
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
                    that.cancel();
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

        save (report) {
            switch (this.$state.current.name) {
            case 'surveillance.reporting.annual':
                this.saveAnnual(report);
                break;
            case 'surveillance.reporting.quarterly':
                this.saveQuarter(report);
                break;
                //no default
            }
        }

        saveAnnual (report) {
            let that = this;
            this.networkService.updateAnnualSurveillanceReport(report).then(() => {
                that.networkService.getAnnualSurveillanceReports().then(results => {
                    that.annual = results;
                });
                that.cancel();
            });
        }

        saveQuarter (report) {
            let that = this;
            this.networkService.updateQuarterlySurveillanceReport(report).then(() => {
                that.networkService.getQuarterlySurveillanceReports().then(results => {
                    that.quarters = results;
                });
                that.cancel();
            });
        }

        createAnnual (report) {
            let that = this;
            this.networkService.createAnnualSurveillanceReport(report).then(createdReport => {
                that.networkService.getAnnualSurveillanceReports().then(results => {
                    that.annual = results;
                    that.$state.go('.annual', {
                        reportId: createdReport.id,
                    });
                });
            });
        }

        createQuarter (report) {
            let that = this;
            this.networkService.createQuarterlySurveillanceReport(report).then(createdReport => {
                that.networkService.getQuarterlySurveillanceReports().then(results => {
                    that.quarters = results;
                    this.$state.go('.quarterly', {
                        reportId: createdReport.id,
                    });
                });
            });
        }

        cancel () {
            this.$state.go('surveillance.reporting', {}, {
                reload: true,
            });
        }

        /*cancelQuarter () {
          this.activeQuarterReport = undefined;
          this.mode = 'view';
          }*/
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceReporting', SurveillanceReportingComponent);
