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
            this.networkService.getApiUsers(true)
                .then(result => ctrl.apiKeys = result);
        }

        search (pageNumber) {
            this.apiKey.visiblePage = pageNumber;
            this.getData();
        }

        getData () {
            if (!this.apiKeys) {
                this.loadApiKeys();
            }
            let ctrl = this;
            this.apiKey.pageNumber = this.apiKey.visiblePage - 1;
            this.networkService.getApiActivity(this.dateAdjust(this.apiKey))
                .then(data => {
                    ctrl.searchedApi = data;
                    //We are calculating this since we don't know how many "total items" there really
                    //are.  This only doesn't work for the edge case where there would be a multiple
                    //of 100 for the actual total number of search results.  In that case, the system
                    //would allow the user to click 'next' and there would be no results on the page.
                    ctrl.apiKey.totalItems = (ctrl.apiKey.pageNumber * ctrl.apiKey.pageSize) + ctrl.searchedApi.length + 1;
                });
        }

        validDates () {
            return this.ReportService.validDates(this.apiKey.startDate, this.apiKey.endDate, this.apiKey.range, false);
        }

        onApplyFilter (filterObj) {
            let f = angular.fromJson(filterObj);
            this.apiKey.startDate = new Date(Date.parse(f.startDate));
            this.apiKey.endDate = new Date(Date.parse(f.endDate));
            this.apiKey.dateAscending = f.dateAscending;
            this.apiKey.filter = f.apiKeyFilter;
            this.apiKey.showOnly = f.showOnly;
            this.search(1);
        }

        createFilterDataObject () {
            let filterData = {};
            filterData.startDate = this.ReportService.coerceToMidnight(this.apiKey.startDate);
            filterData.endDate = this.ReportService.coerceToMidnight(this.apiKey.endDate);
            filterData.dateAscending = this.apiKey.dateAscending;
            filterData.apiKeyFilter = this.apiKey.filter;
            filterData.showOnly = this.apiKey.showOnly;
            return filterData;
        }

        onClearFilter () {
            this.apiKey.endDate = new Date();
            this.apiKey.startDate = this.utilService.addDays(this.apiKey.endDate, (this.apiKey.range * -1) + 1)
            this.filterText = '';
            this.tableController.sortBy('date');
            this.search(1);
        }

    },
}

angular.module('chpl.reports')
    .component('chplReportsApiKeyUsage', ReportsApiKeyUsageComponent);
