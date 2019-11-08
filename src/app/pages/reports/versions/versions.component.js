export const ReportsVersionsComponent = {
    templateUrl: 'chpl.reports/versions/versions.html',
    bindings: {},
    controller: class ReportsVersionsComponent {
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

        $onInit () {
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

        onClearFilter () {
            this.activityRange.endDate = new Date();
            this.activityRange.startDate = this.utilService.addDays(this.activityRange.endDate, (this.activityRange.range * -1) + 1)
            this.filterText = '';
            this.tableController.sortBy('date');
            this.search();
        }

        tableStateListener (tableController) {
            this.tableController = tableController;
        }

        parse (meta) {
            return this.networkService.getActivityById(meta.id).then(item => {
                var change;

                if (item.originalData && !angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // both exist, neither an array: update
                    meta.product = item.newData.productName;
                    meta.name = item.newData.version;
                    meta.activityType= 'Version has been updated.';
                    meta.action = 'Update:<ul>';
                    change = this.ReportService.compareItem(item.originalData, item.newData, 'version', 'Version');
                    if (change) { meta.action += '<li>' + change + '</li>'; }
                    change = this.ReportService.compareItem(item.originalData, item.newData, 'productName', 'Associated Product');
                    if (change) { meta.action += '<li>' + change + '</li>'; }
                    meta.action += '</ul>';
                    meta.detailsCSV = meta.action;
                } else if (item.originalData && angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // both exist, original array, final object: merge
                    meta.product = item.newData.productName;
                    meta.name = item.newData.version;
                    meta.activityType = 'Versions were merged.';
                    meta.action = 'Versions ' + item.originalData.map(ver => ver.version).join(' and ') + ' merged to form ' + item.newData.version;
                    meta.detailsCSV = meta.action;
                } else if (item.originalData && !angular.isArray(item.originalData) && item.newData && angular.isArray(item.newData)) { // both exist, original object, final array: split
                    meta.product = item.originalData.productName;
                    meta.name = item.originalData.version;
                    meta.activityType = 'Versions were split.';
                    meta.action = 'Version ' + item.originalData.version + ' split to become ' + item.newData.map(ver => ver.version).join(' and ');
                    meta.detailsCSV = meta.action;
                } else {
                    if (item.newData) {
                        meta.product = item.newData.productName;
                    } else if (item.originalData) {
                        meta.product = item.originalData.productName;
                    }
                    let activity = {};
                    this.ReportService.interpretNonUpdate(activity, item, 'version', 'version');
                    meta.action = activity.action[0];
                    meta.activityType = meta.action;
                }
            });
        }

        prepare (results) {
            this.displayed = results.map(item => {
                item.filterText = item.productName + '|' + item.version + '|' + item.responsibleUser.fullName
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
            this.networkService.getActivityMetadata('versions', this.dateAdjust(this.activityRange))
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
    .component('chplReportsVersions', ReportsVersionsComponent);
