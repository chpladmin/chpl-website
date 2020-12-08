export const ReportsApiKeysComponent = {
    templateUrl: 'chpl.reports/api-keys/api-keys.html',
    controller: class ReportsApiKeyComponent {
        constructor ($filter, $log, ReportService, authService, networkService, utilService) {
            'ngInject';
            this.$filter = $filter;
            this.$log = $log;
            this.ReportService = ReportService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.hasAnyRole = authService.hasAnyRole;

            this.results = [];
            this.displayed = [];
            this.clearFilterHs = [];
            this.restoreStateHs = [];
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
            this.filterText = '';
            this.tableController = {};
            this.loadProgress = {
                total: 0,
                complete: 0,
            };
            this.downloadProgress = { complete: 0 };
            this.pageSize = 50;
        }

        $onInit () {
            this.search();
        }

        $onDestroy () {
            this.isDestroyed = true;
        }

        onApplyFilter (filterObj) {
            let f = angular.fromJson(filterObj);
            this.doFilter(f);
        }

        onClearFilter () {
            let filterData = {};
            filterData.dataFilter = '';
            filterData.tableState = this.tableController.tableState();
            this.clearFilterHs.forEach(handler => handler());
            this.doFilter(filterData);
        }

        doFilter (filter) {
            let that = this;
            this.filterText = filter.dataFilter;
            if (filter.tableState.search.predicateObject.date) {
                this.tableController.search(filter.tableState.search.predicateObject.date, 'date');
            } else {
                this.tableController.search({}, 'date');
            }
            this.restoreStateHs.forEach(handler => handler(that.tableController.tableState()));
            this.tableController.sortBy(filter.tableState.sort.predicate, filter.tableState.sort.reverse);
        }

        registerClearFilter (handler) {
            this.clearFilterHs.push(handler);
        }

        registerRestoreState (handler) {
            this.restoreStateHs.push(handler);
        }

        createFilterDataObject () {
            let filterData = {};
            filterData.dataFilter = this.filterText;
            filterData.tableState = this.tableController.tableState();
            return filterData;
        }

        tableStateListener (tableController) {
            this.tableController = tableController;
        }

        prepare (item) {
            item.filterText = item.description;
            item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
            return item;
        }

        showLoadingBar () {
            let tableState = this.tableController.tableState && this.tableController.tableState();
            return this.ReportService.showLoadingBar(tableState, this.results, this.loadProgress);
        }

        search () {
            let that = this;
            this.networkService.getActivityMetadata('beta/api-keys')
                .then(results => {
                    that.results = results.activities
                        .map(item => that.prepare(item));
                    that.loadProgress.total = (Math.floor(results.resultSetSize / results.pageSize) + (results.resultSetSize % results.pageSize === 0 ? 0 : 1));
                    let filter = {};
                    filter.dataFilter = '';
                    filter.tableState = this.tableController.tableState();
                    filter.tableState.search = {
                        predicateObject: {
                            date: {
                                after: new Date('2016-04-01').getTime(),
                                before: this.ReportService.coerceToMidnight(new Date(), true).getTime(),
                            },
                        },
                    };
                    that.doFilter(filter);
                    that.addPageToData(1);
                });
        }

        addPageToData (page) {
            let that = this;
            if (this.isDestroyed) { return; }
            this.networkService.getActivityMetadata('beta/api-keys', {pageNum: page, ignoreLoadingBar: true}).then(results => {
                results.activities.forEach(item => {
                    that.results.push(that.prepare(item));
                });
                that.loadProgress.complete += 1;
                that.loadProgress.percentage = Math.floor(100 * ((that.loadProgress.complete + 1) / that.loadProgress.total));
                if (page < that.loadProgress.total) {
                    that.addPageToData(page + 1);
                }
            });
        }
    },
};

angular.module('chpl.reports')
    .component('chplReportsApiKeys', ReportsApiKeysComponent);
