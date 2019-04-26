export const ReportsProductsComponent = {
    templateUrl: 'chpl.reports/products.html',
    controller: class ReportsProductsComponent {
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
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
            this.filterText = '';
            this.tableController = {};
        }

        $onChanges () {
            this.search();
        }

        dateAdjust (obj) {
            var ret = angular.copy(obj);
            ret.startDate = this.ReportService.coerceToMidnight(ret.startDate);
            ret.endDate = this.ReportService.coerceToMidnight(ret.endDate, true);
            return ret;
        }

        downloadReady () {
            if (this.displayed) {
                return this.displayed.reduce((acc, activity) => activity.action && acc, true);
            } else {
                return false;
            }
        }

        onApplyFilter (filterObj) {
            let f = angular.fromJson(filterObj);
            this.activityRange.startDate = new Date(Date.parse(f.startDate));
            this.activityRange.endDate = new Date(Date.parse(f.endDate));
            this.filterText = f.dataFilter;
            this.tableController.sortBy(f.tableState.sort.predicate, f.tableState.sort.reverse);
            this.search();
        }

        createFilterDataObject () {
            let filterData = {};
            filterData.startDate = this.ReportService.coerceToMidnight(this.activityRange.startDate);
            filterData.endDate = this.ReportService.coerceToMidnight(this.activityRange.endDate);
            filterData.dataFilter = this.filterText;
            filterData.tableState = {};
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
                    activity.action = 'Update:<ul>';
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
                        var action = '<li>Owner history changed. Was:<ul>';
                        if (item.originalData.ownerHistory.length === 0) {
                            action += '<li>No previous history</li>';
                        } else {
                            for (j = 0; j < item.originalData.ownerHistory.length; j++) {
                                action += '<li><strong>' + item.originalData.ownerHistory[j].developer.name + '</strong> on ' + this.$filter('date')(item.originalData.ownerHistory[j].transferDate,'mediumDate','UTC') + '</li>';
                            }
                        }
                        action += '</ul>Now:<ul>';
                        if (item.newData.ownerHistory.length === 0) {
                            action += '<li>No new history</li>';
                        } else {
                            for (j = 0; j < item.newData.ownerHistory.length; j++) {
                                action += '<li><strong>' + item.newData.ownerHistory[j].developer.name + '</strong> on ' + this.$filter('date')(item.newData.ownerHistory[j].transferDate,'mediumDate','UTC') + '</li>';
                            }
                        }
                        action += '</ul></li>';
                        activity.action += action;
                    }
                    activity.action += '</ul>';
                } else {
                    this.ReportService.interpretNonUpdate(activity, item, 'product');
                    activity.action = activity.action[0];
                }
                meta.action = activity.action;
                //meta.details = activity.details;
                //meta.csvDetails = activity.details.join('\n');
            });
        }

        prepare (results) {
            this.displayed = results.map(item => {
                item.filterText = item.developerName + '|' + item.productName + '|' + item.responsibleUser.fullName
                item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
                item.fullName = item.responsibleUser.fullName;
                return item;
            });
        }

        prepareDownload () {
            this.displayed
                .filter(item => !item.action)
                .forEach(item => this.parse(item));
            //todo, eventually: use the $q.all function as demonstrated in product history eye
        }

        search () {
            let that = this;
            this.networkService.getActivityMetadata('products', this.dateAdjust(this.activityRange))
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
    .component('chplReportsProducts', ReportsProductsComponent);
