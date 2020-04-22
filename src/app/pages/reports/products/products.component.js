export const ReportsProductsComponent = {
    templateUrl: 'chpl.reports/products/products.html',
    controller: class ReportsProductsComponent {
        constructor ($filter, $log, $scope, ReportService, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.$scope = $scope;
            this.ReportService = ReportService;
            this.networkService = networkService;
            this.utilService = utilService;

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
            this.doFilter(f)
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

        parse (meta) {
            return this.networkService.getActivityById(meta.id).then(item => {
                var activity = {
                    id: item.id,
                    date: item.activityDate,
                };
                if (item.developer) {
                    activity.developer = item.developer.name;
                } else {
                    activity.developer = '';
                }

                var j;
                var change;
                if (item.originalData && !angular.isArray(item.originalData) && item.newData) { // both exist, originalData not an array: update
                    activity.name = item.newData.name;
                    activity.type = 'Product has been updated';
                    activity.action = 'Product has been updated:<ul>';
                    change = this.ReportService.compareItem(item.originalData, item.newData, 'name', 'Name');
                    if (change) {
                        activity.action += '<li>' + change + '</li>';
                    }
                    change = this.ReportService.compareItem(item.originalData, item.newData, 'developerName', 'Developer');
                    if (change) {
                        activity.action += '<li>' + change + '</li>';
                    }
                    var contactChanges = this.ReportService.compareContact(item.originalData.contact, item.newData.contact);
                    if (contactChanges && contactChanges.length > 0) {
                        activity.action += '<li>Contact changes<ul>' + contactChanges.join('') + '</ul></li>';
                    }
                    if (!angular.equals(item.originalData.ownerHistory, item.newData.ownerHistory)) {
                        var ownerHistoryActionDetails = '<li>Owner history changed. Was:<ul>';
                        if (item.originalData.ownerHistory.length === 0) {
                            ownerHistoryActionDetails += '<li>No previous history</li>';
                        } else {
                            for (j = 0; j < item.originalData.ownerHistory.length; j++) {
                                ownerHistoryActionDetails += '<li><strong>' + item.originalData.ownerHistory[j].developer.name + '</strong> on ' + this.$filter('date')(item.originalData.ownerHistory[j].transferDate,'mediumDate','UTC') + '</li>';
                            }
                        }
                        ownerHistoryActionDetails += '</ul>Now:<ul>';
                        if (item.newData.ownerHistory.length === 0) {
                            ownerHistoryActionDetails += '<li>No new history</li>';
                        } else {
                            for (j = 0; j < item.newData.ownerHistory.length; j++) {
                                ownerHistoryActionDetails += '<li><strong>' + item.newData.ownerHistory[j].developer.name + '</strong> on ' + this.$filter('date')(item.newData.ownerHistory[j].transferDate,'mediumDate','UTC') + '</li>';
                            }
                        }
                        ownerHistoryActionDetails += '</ul></li>';
                        activity.action += ownerHistoryActionDetails;
                    }
                    activity.action += '</ul>';
                    activity.detailsCSV = activity.action;
                } else {
                    this.ReportService.interpretNonUpdate(activity, item, 'product');
                    activity.action = activity.action[0];
                    activity.type = activity.action;
                }
                meta.action = activity.action;
                meta.activityType = activity.type;
                meta.detailsCSV = activity.detailsCSV;
            });
        }

        prepare (item) {
            item.filterText = item.developerName + '|' + item.productName + '|' + item.responsibleUser.fullName
            item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
            item.fullName = item.responsibleUser.fullName;
            return item;
        }

        canDownload () {
            return this.displayed
                .filter(item => !item.action).length <= 1000;
        }

        prepareDownload () {
            let total = this.displayed
                .filter(item => !item.action).length;
            let progress = 0;
            this.displayed
                .filter(item => !item.action)
                .forEach(item => {
                    this.parse(item).then(() => {
                        progress += 1;
                        this.downloadProgress.complete = Math.floor(100 * ((progress + 1) / total));
                    });
                });
            //todo, eventually: use the $q.all function as demonstrated in product history eye
        }

        showLoadingBar () {
            let tableState = this.tableController.tableState && this.tableController.tableState();
            return this.ReportService.showLoadingBar(tableState, this.results, this.loadProgress);
        }

        search () {
            let that = this;
            this.networkService.getActivityMetadata('beta/products')
                .then(results => {
                    that.results = results.activities
                        .map(item => that.prepare(item));
                    that.loadProgress.total = (Math.floor(results.resultSetSize / results.pageSize) + (results.resultSetSize % results.pageSize === 0 ? 0 : 1))
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
            if (this.isDestroyed) { return }
            this.networkService.getActivityMetadata('beta/products', {pageNum: page, ignoreLoadingBar: true}).then(results => {
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
}

angular.module('chpl.reports')
    .component('chplReportsProducts', ReportsProductsComponent);
