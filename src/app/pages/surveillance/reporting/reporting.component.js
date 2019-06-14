export const SurveillanceReportingComponent = {
    templateUrl: 'chpl.surveillance/reporting/reporting.html',
    bindings: {
        acbs: '<',
        availableQuarters: '<',
        reports: '<',
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
            if (changes.reports) {
                this.reports = angular.copy(changes.reports.currentValue);
            }
        }

        findReport (acb, year, quarter) {
            let report = this.reports
                .find(report => report.acb.name === acb.name
                      && report.year === year
                      && report.quarter === quarter);
            return report;
        }

        actOnReport (acb, year, quarter) {
            let report = this.findReport(acb, year, quarter);
            if (report) {
                if (this.activeReport && report.id === this.activeReport.id) {
                    this.activeReport = undefined;
                } else {
                    this.activeReport = report;
                }
            } else {
                this.activeReport = {
                    acb: acb,
                    quarter: quarter,
                    year: year,
                };
                this.mode = 'initiate';
            }
        }

        takeAction (report, action) {
            if (action === 'edit') {
                this.activeReport = report;
                this.mode = 'edit';
            }
            if (action === 'delete') {
                let that = this;
                this.networkService.deleteQuarterlySurveillanceReport(report.id).then(() => {
                    that.networkService.getSurveillanceReporting().then(results => {
                        that.reports = results;
                    });
                    that.activeReport = undefined;
                    that.cancel();
                });
            }
        }

        save (report) {
            let that = this;
            if (this.mode === 'initiate') {
                this.networkService.createQuarterlySurveillanceReport(report).then(results => {
                    that.activeReport = results;
                    that.networkService.getSurveillanceReporting().then(results => {
                        that.reports = results;
                    });
                    that.cancel();
                });
            } else if (this.mode === 'edit') {
                this.networkService.updateQuarterlySurveillanceReport(report).then(results => {
                    that.activeReport = results;
                    that.networkService.getSurveillanceReporting().then(results => {
                        that.reports = results;
                    });
                    that.cancel();
                });
            }
            this.mode = 'view';
        }

        cancel () {
            if (this.mode === 'initiate') {
                this.activeReport = undefined;
            }
            this.mode = 'view';
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceReporting', SurveillanceReportingComponent);
