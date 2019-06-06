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
                this.acbs = angular.copy(changes.acbs.currentValue.acbs);
                this.newReportAcb = this.acbs && this.acbs.length === 1 ? this.acbs[0] : undefined;
            }
            if (changes.availableQuarters) {
                this.availableQuarters = angular.copy(changes.availableQuarters.currentValue);
            }
            if (changes.reports) {
                this.reports = angular.copy(changes.reports.currentValue);
                this.prepareReports();
            }
        }

        prepareReports () {
            this.activeAcbs = [];
            this.reports.forEach(report => {
                report.acbName = report.acb.name;
                if (this.activeAcbs.indexOf(report.acbName) === -1) {
                    this.activeAcbs.push(report.acbName);
                }
            });
            if (this.activeAcbs.length === 1) {
                this.display = {};
                this.display[this.activeAcbs[0]] = true;
            }
        }

        acbCount (acb) {
            return this.reports.reduce((acc, report) => report.acbName === acb ? acc + 1 : acc, 0);
        }

        initiateReporting () {
            this.activeReport = {
                acb: this.newReportAcb,
                quarter: this.newReportQuarter.name,
                year: this.newReportYear,
            };
            this.mode = 'initiate';
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
                        that.prepareReports();
                    });
                    that.cancel();
                });
            }
        }

        save (report) {
            let that = this;
            if (this.mode === 'initiate') {
                this.networkService.createQuarterlySurveillanceReport(report).then(() => {
                    that.networkService.getSurveillanceReporting().then(results => {
                        that.reports = results;
                        that.prepareReports();
                    });
                    that.cancel();
                });
            } else if (this.mode === 'edit') {
                this.networkService.updateQuarterlySurveillanceReport(report).then(() => {
                    that.networkService.getSurveillanceReporting().then(results => {
                        that.reports = results;
                        that.prepareReports();
                    });
                    that.cancel();
                });
            }
            this.mode = 'view';
        }

        cancel () {
            this.newReportAcb = this.acbs && this.acbs.length === 1 ? this.acbs[0] : undefined;
            this.newReportQuarter = undefined;
            this.newReportYear = undefined;
            this.mode = 'view';
            this.showFormErrors = false;
        }
    },
}

angular.module('chpl.surveillance')
    .component('chplSurveillanceReporting', SurveillanceReportingComponent);
