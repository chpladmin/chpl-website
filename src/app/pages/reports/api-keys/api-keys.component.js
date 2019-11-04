export const ReportsApiKeysComponent = {
    templateUrl: 'chpl.reports/api-keys/api-keys.html',
    bindings: { },
    controller: class ReportsApiKeyComponent {
        constructor ($filter, $log, ReportService, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.ReportService = ReportService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
            this.activityRange = {
                range: 30,
                startDate: new Date(),
                endDate: new Date(),
            };
            this.activityRange.startDate.setDate(this.activityRange.endDate.getDate() - this.activityRange.range + 1); // offset to account for inclusion of endDate in range
        }

        $onInit () {
            this.clearApiKeyFilter();
            this.search();
        }

        clearApiKeyFilter () {
            this.activityRange = {
                range: 30,
                startDate: new Date(),
                endDate: new Date(),
            };
            this.activityRange.startDate.setDate(this.activityRange.endDate.getDate() - this.activityRange.range + 1); // offset to account for inclusion of endDate in range
        }

        createFilterDataObject () {
            let filterData = {};
            filterData.startDate = this.ReportService.coerceToMidnight(this.activityRange.startDate);
            filterData.endDate = this.ReportService.coerceToMidnight(this.activityRange.endDate);
            filterData.dateAscending = this.activityRange.dateAscending;
            filterData.apiKeyFilter = this.filter;
            return filterData;
        }

        dateAdjust (obj) {
            var ret = angular.copy(obj);
            ret.startDate = this.ReportService.coerceToMidnight(ret.startDate);
            ret.endDate = this.ReportService.coerceToMidnight(ret.endDate, true);
            return ret;
        }

        search () {
            this.networkService.getApiUserActivity(this.dateAdjust(this.activityRange))
                .then(results => {
                    this.apiResponse = results.map(item => {
                        item.friendlyCreationDate = this.$filter('date')(item.date, 'MMM d, y H:mm:ss');
                        return item;
                    });
                });
        }

        validDates () {
            return this.ReportService.validDates(this.activityRange.startDate, this.activityRange.endDate, this.activityRange.range, false);
        }

        onApplyFilter (filterObj) {
            let f = angular.fromJson(filterObj);
            this.activityRange.startDate = new Date(Date.parse(f.startDate));
            this.activityRange.endDate = new Date(Date.parse(f.endDate));
            this.filter = f.apiKeyFilter;
            this.search();
        }

        onClearFilter () {
            this.activityRange.endDate = new Date();
            this.activityRange.startDate = this.utilService.addDays(this.activityRange.endDate, (this.activityRange.range * -1) + 1)
            this.search();
        }
    },
}

angular.module('chpl.reports')
    .component('chplReportsApiKeys', ReportsApiKeysComponent);
