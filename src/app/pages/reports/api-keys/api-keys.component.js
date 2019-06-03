export const ReportsApiKeysComponent = {
    templateUrl: 'chpl.reports/api-keys/api-keys.html',
    bindings: { },
    controller: class ReportsApiKeyComponent {
        constructor ($log, ReportService, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.ReportService = ReportService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.activityRange = {
                range: 30,
                startDate: new Date(),
                endDate: new Date(),
            };
            this.activityRange.startDate.setDate(this.activityRange.endDate.getDate() - this.activityRange.range + 1); // offset to account for inclusion of endDate in range
        }

        $onInit () {
            this.search();
        }

        dateAdjust (obj) {
            var ret = angular.copy(obj);
            ret.startDate = this.ReportService.coerceToMidnight(ret.startDate);
            ret.endDate = this.ReportService.coerceToMidnight(ret.endDate, true);
            return ret;
        }

        prepare (results) {
            this.displayed = results.map(item => item);
        }

        search () {
            let that = this;
            this.networkService.getApiUserActivity(this.dateAdjust(this.activityRange))
                .then(results => {
                    that.results = results;
                    that.prepare(that.results);
                });
        }

        validDates () {
            return this.ReportService.validDates(this.activityRange.startDate, this.activityRange.endDate, this.activityRange.range, false);
        }
    },
}

angular.module('chpl.reports')
    .component('chplReportsApiKeys', ReportsApiKeysComponent);
