export const ReportsUserActionsComponent = {
    templateUrl: 'chpl.reports/user-actions/user-actions.html',
    controller: class ReportsUserActionsComponent {
        constructor ($filter, $log, $scope, ReportService, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.$scope = $scope;
            this.ReportService = ReportService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.activityRange = {
                range: 30,
                startDate: new Date(),
                endDate: new Date(),
            };
            this.activityRange.startDate.setDate(this.activityRange.endDate.getDate() - this.activityRange.range + 1); // offset to account for inclusion of endDate in range

            this.results = [];
            this.displayed = [];
            this.categoriesFilter = '|All|';
            this.clearFilterHs = [];
            this.restoreStateHs = [];
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
            this.filterText = '';
            this.tableController = {};
            this.loadProgress = {
                total: 0,
                complete: 0,
            };
            this.pageSize = 50;
            this.isUserTableVisible = [];
            this.userList = [];
        }

        $onInit () {
            this.search();
        }

        $onDestroy () {
            this.isDestroyed = true;
        }

        onApplyFilter (filterObj) {
            let f = angular.fromJson(filterObj);
            this.doFilter(f)
        }

        onClearFilter () {
            let filterData = {};
            filterData.dataFilter = '';
            filterData.tableState = this.tableController.tableState();
            filterData.tableState.search.predicateObject.categoriesFilter = '|All|';
            this.clearFilterHs.forEach(handler => handler());
            this.doFilter(filterData);
        }

        doFilter (filter) {
            let that = this;
            this.filterText = filter.dataFilter;
            if (filter.tableState.search.predicateObject.categoriesFilter) {
                this.tableController.search(filter.tableState.search.predicateObject.categoriesFilter, 'categoriesFilter');
            } else {
                this.tableController.search('|All|', 'categoriesFilter');
            }
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

        prepare (item, type) {
            item.filterText = item.responsibleUser.fullName + '|' + item.description;
            item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
            item.responsibleUserFullName = item.responsibleUser.fullName;
            item.email = item.responsibleUser.email;
            item.categoriesFilter = '|All|' + type + '|';
            if (!this.userList.includes(item.responsibleUserFullName)) {
                this.userList.push(item.responsibleUserFullName);
            }
            return item;
        }

        showLoadingBar () {
            let tableState = this.tableController.tableState && this.tableController.tableState();
            return this.ReportService.showLoadingBar(tableState, this.results, this.loadProgress);
        }

        search () {
            this.initializeSearch();
            this.callActivityServiceForMetadata('beta/listings');
            this.callActivityServiceForMetadata('beta/products');
            this.callActivityServiceForMetadata('beta/versions');
            this.callActivityServiceForMetadata('beta/users');
            this.callActivityServiceForMetadataOld('announcements');
            this.callActivityServiceForMetadata('beta/developers');
            this.callActivityServiceForMetadataOld('pending_listings');
            this.callActivityServiceForMetadataOld('corrective_action_plans');
            this.callActivityServiceForMetadataOld('pending_surveillances');
        }

        initializeSearch () {
            this.userList = [];
            this.userActivities = [];
            this.isUserTableVisible = [];
        }

        callActivityServiceForMetadataOld (metadataType) {
            let that = this;
            this.networkService.getActivityMetadata(metadataType, this.activityRange)
                .then(results => {
                    that.results = that.results
                        .concat(results.map(item => that.prepare(item, metadataType)));
                });
        }

        callActivityServiceForMetadata (metadataType) {
            let that = this;
            this.networkService.getActivityMetadata(metadataType)
                .then(results => {
                    results.activities.forEach(item => {
                        that.results.push(that.prepare(item, metadataType));
                    });
                    that.loadProgress.complete += 1;
                    that.loadProgress.total += (Math.floor(results.resultSetSize / results.pageSize) + (results.resultSetSize % results.pageSize === 0 ? 0 : 1))
                    that.addPageToData(1, metadataType);
                    let filter = {};
                    filter.dataFilter = '';
                    filter.tableState = this.tableController.tableState();
                    filter.tableState.search.predicateObject.categoriesFilter = '|All|';
                    filter.tableState.search.predicateObject.date = {
                        after: new Date('2016-04-01').getTime(),
                        before: this.ReportService.coerceToMidnight(new Date(), true).getTime(),
                    };
                    that.doFilter(filter);
                });
        }

        addPageToData (page, metadataType) {
            let that = this;
            if (this.isDestroyed) { return }
            this.networkService.getActivityMetadata(metadataType, {pageNum: page, ignoreLoadingBar: true}).then(results => {
                results.activities.forEach(item => {
                    that.results.push(that.prepare(item, metadataType));
                });
                that.loadProgress.complete += 1;
                that.loadProgress.percentage = Math.floor(100 * ((that.loadProgress.complete) / that.loadProgress.total));
                if (page < (Math.floor(results.resultSetSize / results.pageSize) + (results.resultSetSize % results.pageSize === 0 ? 0 : 1))) {
                    that.addPageToData(page + 1, metadataType);
                }
            });
        }

        showUser (user) {
            return this.displayed.filter(item => item.responsibleUserFullName === user).length > 0;
        }
    },
}

angular.module('chpl.reports')
    .component('chplReportsUserActions', ReportsUserActionsComponent);
