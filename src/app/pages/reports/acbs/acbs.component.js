export const ReportsAcbsComponent = {
    templateUrl: 'chpl.reports/acbs/acbs.html',
    controller: class ReportsAcbsComponent {
        constructor ($log, $scope, ReportService, authService, networkService, utilService) {
            'ngInject'
            this.$log = $log;
            this.$scope = $scope;
            this.ReportService = ReportService;
            this.authService = authService;
            this.networkService = networkService;
            this.utilService = utilService;

            this.results = [];
            this.displayed = [];
            this.clearFilterHs = [];
            this.restoreStateHs = [];
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
            this.tableController = {};
            this.loadProgress = {
                total: 0,
                complete: 0,
            };
            this.downloadProgress = { complete: 0 };
            this.pageSize = 50;
        }

        $onInit () {
            let that = this;
            let user = this.authService.getCurrentUser();
            this.networkService.getSearchOptions()
                .then(options => {
                    that.acbItems = options.acbs
                        .filter(a => that.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
                                || user.organizations.filter(o => o.name === a.name).length > 0)
                        .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                        .map(a => {
                            let ret = {
                                value: a.name,
                                selected: true,
                            };
                            if (a.retired) {
                                ret.display = a.name + ' (Retired)';
                                ret.retired = true;
                                ret.selected = ((new Date()).getTime() - a.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4);
                            }
                            return ret;
                        });
                });
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
            if (filter.tableState.search.predicateObject.acbName) {
                this.tableController.search(filter.tableState.search.predicateObject.acbName, 'acbName');
            } else {
                this.tableController.search({}, 'acbName');
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

        parse (meta) {
            return this.networkService.getActivityById(meta.id).then(item => {
                const simpleFields = [
                    {key: 'name', display: 'Name'},
                    {key: 'retired', display: 'Retired'},
                    {key: 'retirementDate', display: 'Retirement Date', filter: 'date'},
                    {key: 'website', display: 'Website'},
                ];

                let activity = {
                    action: '',
                    details: [],
                    date: item.activityDate,
                };

                if (item.originalData && !angular.isArray(item.originalData) && item.newData) { // both exist, originalData not an array: update
                    if (item.originalData.deleted !== item.newData.deleted) {
                        activity.action = item.newData.deleted ? 'ONC-ACB was deleted' : 'ONC-ACB was restored';
                    } else if (item.originalData.retired !== item.newData.retired) {
                        activity.action = item.newData.retired ? 'ONC-ACB was retired' : 'ONC-ACB was un-retired';
                    } else {
                        activity.action = 'ONC-ACB was updated';
                        simpleFields.forEach(field => {
                            let change = this.ReportService.compareItem(item.originalData, item.newData, field.key, field.display, field.filter);
                            if (change) {
                                activity.details.push(change);
                            }
                        });
                        let addressChanges = this.ReportService.compareAddress(item.originalData.address, item.newData.address);
                        if (addressChanges && addressChanges.length > 0) {
                            activity.details.push('Address changes<ul>' + addressChanges.join('') + '</ul>');
                        }
                    }
                } else {
                    this.ReportService.interpretNonUpdate(activity, item, 'ACB');
                }

                meta.action = activity.action;
                meta.details = activity.details;
                meta.csvDetails = activity.details.join('\n');
            });
        }

        prepare (item) {
            item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
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
            this.networkService.getActivityMetadata('beta/acbs')
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
            this.networkService.getActivityMetadata('beta/acbs', {pageNum: page, ignoreLoadingBar: true}).then(results => {
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
    .component('chplReportsAcbs', ReportsAcbsComponent);
