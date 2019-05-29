export const ReportsUserActionsComponent = {
    templateUrl: 'chpl.reports/userActions/userActions.html',
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
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
            this.filterText = '';
            this.tableController = {};
            this.userActivities = [];
            this.isUserTableVisible = [];
            this.userList = [];
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

        prepare (results) {
            this.displayed = results.map(item => {
                item.filterText = item.responsibleUser.fullName + '|' + item.description;
                item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
                item.responsibleUserFullName = item.responsibleUser.fullName;
                item.email = item.responsibleUser.email;
                return item;
            });
        }

        search () {
            this.initializeSearch();
            this.callActivityServiceForMetadata('listings');
            this.callActivityServiceForMetadata('products');
            this.callActivityServiceForMetadata('versions');
            this.callActivityServiceForMetadata('users');
            this.callActivityServiceForMetadata('announcements');
            this.callActivityServiceForMetadata('developers');
            this.callActivityServiceForMetadata('pending_listings');
            this.callActivityServiceForMetadata('corrective_action_plans');
            this.callActivityServiceForMetadata('pending_surveillances');
        }

        initializeSearch () {
            this.userList = [];
            this.userActivities = [];
            this.isUserTableVisible = []
        }

        callActivityServiceForMetadata (metadataType) {
            let that = this;
            this.networkService.getActivityMetadata(metadataType, this.dateAdjust(this.activityRange))
                .then(results => {
                    that.prepare(results);
                    that.updateUserList(results);
                    that.addActivitiesToList(results);
                    that.results = that.userActivities;
                });
        }

        updateUserList (activities) {
            activities.forEach(activity => {
                if (!this.userList.includes(activity.responsibleUserFullName)) {
                    this.userList.push(activity.responsibleUserFullName);
                }
            });
        }

        addActivitiesToList (activities) {
            this.userActivities = this.userActivities.concat(activities);
        }

        validDates () {
            return this.ReportService.validDates(this.activityRange.startDate, this.activityRange.endDate, this.activityRange.range, false);
        }
    },
}

angular.module('chpl.reports')
    .component('chplReportsUserActions', ReportsUserActionsComponent);
