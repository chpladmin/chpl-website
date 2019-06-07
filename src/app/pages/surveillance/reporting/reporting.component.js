export const SurveillanceReportingComponent = {
    templateUrl: 'chpl.surveillance/reporting/reporting.html',
    bindings: {
        acbs: '<',
        availableQuarters: '<',
        quarters: '<',
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
            if (changes.availableQuarters) {
                this.availableQuarters = angular.copy(changes.availableQuarters.currentValue);
            }
            if (changes.quarters) {
                this.quarters = angular.copy(changes.quarters.currentValue);
            }
        }

        findQuarterReport (acb, year, quarter) {
            let report = this.quarters
                .find(report => report.acb.name === acb.name
                      && report.year === year
                      && report.quarter === quarter);
            return report;
        }

        actOnQuarter (acb, year, quarter) {
            let report = this.findQuarterReport(acb, year, quarter);
            if (report) {
                if (this.activeQuarterReport && report.id === this.activeQuarterReport.id) {
                    this.activeQuarterReport = undefined;
                } else {
                    this.activeQuarterReport = report;
                }
            } else {
                this.activeQuarterReport = {
                    acb: acb,
                    quarter: quarter,
                    year: year,
                };
                this.mode = 'initiate';
            }
        }

        takeQuarterAction (report, action) {
            if (action === 'edit') {
                this.activeQuarterReport = report;
                this.mode = 'edit';
            }
            if (action === 'delete') {
                let that = this;
                this.networkService.deleteQuarterlySurveillanceReport(report.id).then(() => {
                    that.networkService.getSurveillanceReporting().then(results => {
                        that.reports = results;
                    });
                    that.activeQuarterReport = undefined;
                    that.cancelQuarter();
                });
            }
        }

        saveQuarter (report) {
            let that = this;
            if (this.mode === 'initiate') {
                this.networkService.createQuarterlySurveillanceReport(report).then(results => {
                    that.activeQuarterReport = results;
                    that.networkService.getSurveillanceReporting().then(results => {
                        that.reports = results;
                    });
                    that.cancelQuarter();
                });
            } else if (this.mode === 'edit') {
                this.networkService.updateQuarterlySurveillanceReport(report).then(results => {
                    that.activeQuarterReport = results;
                    that.networkService.getSurveillanceReporting().then(results => {
                        that.reports = results;
                    });
                    that.cancelQuarter();
                });
            }
            this.mode = 'view';
        }

        cancelQuarter () {
            if (this.mode === 'initiate') {
                this.activeQuarterReport = undefined;
            }
            this.mode = 'view';
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceReporting', SurveillanceReportingComponent);
