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
            this.search(1);
        }

        clearApiKeyFilter () {
            this.apiKeyReport = {
                range: 30,
                visiblePage: 1,
                pageSize: 100,
                startDate: new Date(),
                endDate: new Date(),
            };
            this.apiKeyReport.startDate.setDate(this.apiKeyReport.endDate.getDate() - this.apiKeyReport.range + 1); // offset to account for inclusion of endDate in range
        }

        dateAdjust (obj) {
            var ret = angular.copy(obj);
            ret.startDate = this.ReportService.coerceToMidnight(ret.startDate);
            ret.endDate = this.ReportService.coerceToMidnight(ret.endDate, true);
            return ret;
        }

        loadApiKeys () {
            let ctrl = this;
            this.networkService.getApiUsers(true)
                .then(result => ctrl.apiKeys = result);
        }

        search (pageNumber) {
            this.apiKeyReport.visiblePage = pageNumber;
            this.getData();
        }

        getData () {
            if (!this.apiKeys) {
                this.loadApiKeys();
            }
            let ctrl = this;
            this.apiKeyReport.pageNumber = this.apiKeyReport.visiblePage - 1;
            this.networkService.getApiActivity(this.dateAdjust(this.apiKeyReport))
                .then(data => {
                    ctrl.searchedApi = data;
                    //We are calculating this since we don't know how many "total items" there really
                    //are.  This only doesn't work for the edge case where there would be a multiple
                    //of 100 for the actual total number of search results.  In that case, the system
                    //would allow the user to click 'next' and there would be no results on the page.
                    ctrl.apiKeyReport.totalItems = (ctrl.apiKeyReport.pageNumber * ctrl.apiKeyReport.pageSize) + ctrl.searchedApi.length + 1;
                });
        }

        validDates () {
            return this.ReportService.validDates(this.apiKeyReport.startDate, this.apiKeyReport.endDate, this.apiKeyReport.range, false);
        }

        onApplyFilter (filterObj) {
            let f = angular.fromJson(filterObj);
            this.apiKeyReport.startDate = new Date(Date.parse(f.startDate));
            this.apiKeyReport.endDate = new Date(Date.parse(f.endDate));
            this.apiKeyReport.dateAscending = f.dateAscending;
            this.apiKeyReport.filter = f.apiKeyFilter;
            this.apiKeyReport.showOnly = f.showOnly;
            this.search(1);
        }

        createFilterDataObject () {
            let filterData = {};
            filterData.startDate = this.ReportService.coerceToMidnight(this.apiKeyReport.startDate);
            filterData.endDate = this.ReportService.coerceToMidnight(this.apiKeyReport.endDate);
            filterData.dateAscending = this.apiKeyReport.dateAscending;
            filterData.apiKeyFilter = this.apiKeyReport.filter;
            filterData.showOnly = this.apiKeyReport.showOnly;
            return filterData;
        }

        onClearFilter () {
            this.apiKeyReport.endDate = new Date();
            this.apiKeyReport.startDate = this.utilService.addDays(this.apiKeyReport.endDate, (this.apiKeyReport.range * -1) + 1)
            this.apiKeyReport.filter = undefined;
            this.search(1);
        }

    },
}

angular.module('chpl.reports')
    .component('chplReportsApiKeyUsage', ReportsApiKeyUsageComponent);
