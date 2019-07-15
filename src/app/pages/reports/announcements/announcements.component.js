export const ReportsAnnouncementsComponent = {
    templateUrl: 'chpl.reports/announcements/announcements.html',
    bindings: { },
    controller: class ReportsAnnouncementsComponent {
        constructor ($filter, $log, ReportService, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
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
                let action = '';
                if (this.isActivityDeletedAnnouncement(item)) {
                    action = 'Announcement was deleted.';
                } else if (this.isActivityNewAnnouncement(item)) {
                    action = 'Announcement was created.';
                } else if (item.originalData && item.newData) {
                    action = 'Announcement was updated.'
                    action += this.getUpdateActivity(item);
                }

                meta.action = action;
                meta.csvDetails = action;
            });
        }

        isActivityNewAnnouncement (detail) {
            return detail.originalData === null && detail.newData;
        }

        isActivityDeletedAnnouncement (detail) {
            return detail.originalData && detail.newData === null;
        }

        getUpdateActivity (detail) {
            let action = '<ul>';
            action += this.getActionDescriptionIfChanged(detail, 'title', 'Title');
            action += this.getActionDescriptionIfChanged(detail, 'text', 'Text');
            action += this.getActionDescriptionIfChanged(detail, 'startDate', 'Start Date');
            action += this.getActionDescriptionIfChanged(detail, 'endDate', 'End Date');
            action += '</ul>';
            return action;
        }

        getActionDescriptionIfChanged (detailObject, key, display) {
            let change = this.ReportService.compareItem(detailObject.originalData, detailObject.newData, key, display);
            if (change) {
                change = '<li>' + change + '</li>';
            } else {
                change = '';
            }
            return change;
        }

        prepare (results) {
            this.displayed = results.map(item => {
                item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
                item.responsibleUserFullName = item.responsibleUser.fullName;
                item.filterText = item.description + '|' + item.responsibleUserFullName
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
            this.networkService.getActivityMetadata('announcements', this.dateAdjust(this.activityRange))
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
    .component('chplReportsAnnouncements', ReportsAnnouncementsComponent);
