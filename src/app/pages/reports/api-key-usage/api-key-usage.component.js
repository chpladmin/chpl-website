export const ReportsApiKeyUsageComponent = {
    templateUrl: 'chpl.reports/api-key-usage/api-key-usage.html',
    bindings: { },
    controller: class ReportsApiKeyUsageComponent {
        constructor ($log, ReportService, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.ReportService = ReportService;
            this.networkService = networkService;
            this.utilService = utilService;
        }

        $onInit () {
            this.clearApiKeyFilter();
            this.search();
        }

        clearApiKeyFilter () {
            this.apiKey = {
                range: 30,
                visiblePage: 1,
                pageSize: 100,
                startDate: new Date(),
                endDate: new Date(),
            };
            this.apiKey.startDate.setDate(this.apiKey.endDate.getDate() - this.apiKey.range + 1); // offset to account for inclusion of endDate in range
        }

        dateAdjust (obj) {
            var ret = angular.copy(obj);
            ret.startDate = this.ReportService.coerceToMidnight(ret.startDate);
            ret.endDate = this.ReportService.coerceToMidnight(ret.endDate, true);
            return ret;
        }

        loadApiKeys () {
            let ctrl = this;
            this.networkService.getApiUsers()
                .then(result => ctrl.apiKeys = result);
        }

        search () {
            if (!this.apiKeys) {
                this.loadApiKeys();
            }
            let ctrl = this;
            this.apiKey.pageNumber = this.apiKey.visiblePage - 1;
            this.networkService.getApiActivity(this.dateAdjust(this.apiKey))
                .then(data => {
                    ctrl.searchedApi = data;
                });
        }

        validDates () {
            return this.ReportService.validDates(this.activityRange.startDate, this.activityRange.endDate, this.activityRange.range, false);
        }
    },
}

angular.module('chpl.reports')
    .component('chplReportsApiKeyUsage', ReportsApiKeyUsageComponent);
