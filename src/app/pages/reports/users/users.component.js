export const ReportsUsersComponent = {
    templateUrl: 'chpl.reports/users/users.html',
    controller: class ReportsUsersComponent {
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
                let action = '';
                if (this.isActivityRoleChange(item)) {
                    action = item.description;
                } else if (this.isActivityDeletedUser(item)) {
                    action = 'User ' + item.originalData.subjectName + ' was deleted';
                    let changedOrgDescription = this.getOrganizationActionDescriptionIfChanged(item);
                    if (changedOrgDescription !== null && changedOrgDescription !== '') {
                        action += '<ul>' + changedOrgDescription + '</ul>';
                    }
                } else if (this.isActivityNewUser(item)) {
                    action = 'User ' + item.newData.subjectName + ' was created.';
                } else if (this.isActivtyConfirmUser(item)) {
                    action = 'User ' + item.newData.subjectName + ' was confirmed.';
                } else if (item.originalData && item.newData) {
                    action = 'User ' + item.newData.subjectName + ' was updated.'
                    action += this.getUpdateActivity(item);
                }

                meta.action = action;
                meta.csvDetails = action;
            });
        }

        isActivityRoleChange (detail) {
            return detail.description.includes(' role ');
        }

        isActivityNewUser (detail) {
            return detail.originalData === null && detail.newData;
        }

        isActivityDeletedUser (detail) {
            return detail.originalData && detail.newData === null;
        }

        isActivtyConfirmUser (detail) {
            return detail.originalData && detail.originalData.signatureDate === null
                && detail.newData && detail.newData.signatureDate !== null;
        }

        getUpdateActivity (detail) {
            let action = '<ul>';
            action += this.getActionDescriptionIfChanged(detail, 'subjectName', 'Subject Name');
            action += this.getActionDescriptionIfChanged(detail, 'fullName', 'Full Name');
            action += this.getActionDescriptionIfChanged(detail, 'friendlyName', 'Friendly Name');
            action += this.getActionDescriptionIfChanged(detail, 'email', 'Email');
            action += this.getActionDescriptionIfChanged(detail, 'phoneNumber', 'Phone Number');
            action += this.getActionDescriptionIfChanged(detail, 'title', 'Title');
            action += this.getActionDescriptionIfChanged(detail, 'signatureDate', 'Confirmation Date');
            action += this.getActionDescriptionIfChanged(detail, 'failedLoginCount', 'Failed Login Count');
            action += this.getActionDescriptionIfChanged(detail, 'accountExpired', 'Account Expired');
            action += this.getActionDescriptionIfChanged(detail, 'accountLocked', 'Account Locked');
            action += this.getActionDescriptionIfChanged(detail, 'credentialsExpired', 'Credentials Expired');
            action += this.getActionDescriptionIfChanged(detail, 'accountEnabled', 'Account Enabled');
            action += this.getActionDescriptionIfChanged(detail, 'passwordResetRequired', 'Password Reset Required');
            action += this.getActionDescriptionIfChanged(detail, 'enabled', 'Enabled');
            action += this.getActionDescriptionIfChanged(detail, 'userName', 'User Name');
            action += this.getOrganizationActionDescriptionIfChanged(detail);
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

        getOrganizationActionDescriptionIfChanged (detailObject) {
            let action = '';
            var orgKeys = [{key: 'organizations', display: 'Organizations'}];
            var origOrgs = (detailObject.originalData === null || detailObject.originalData === undefined
                            || detailObject.originalData.organizations === null || detailObject.originalData.organizations === undefined) ? [] : detailObject.originalData.organizations;
            var newOrgs = (detailObject.newData === null || detailObject.newData === undefined
                            || detailObject.newData.organizations === null || detailObject.newData.organizations === undefined) ? [] : detailObject.newData.organizations;
            var orgChanges = this.ReportService.compareArray(origOrgs, newOrgs, orgKeys, 'name');
            if (orgChanges !== null && orgChanges.length > 0) {
                for (let j = 0; j < orgChanges.length; j++) {
                    if (orgChanges[j] !== null && orgChanges[j].changes !== null && orgChanges[j].changes.length > 0) {
                        for (let k = 0; k < orgChanges[j].changes.length; k++) {
                            action += orgChanges[j].changes[k];
                        }
                    }
                }
            }
            return action;
        }

        prepare (results) {
            this.displayed = results.map(item => {
                item.filterText = item.email + '|' + item.subjectName
                item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
                item.responsibleUserFullName = item.responsibleUser.fullName;
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
            this.networkService.getActivityMetadata('users', this.dateAdjust(this.activityRange))
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
    .component('chplReportsUsers', ReportsUsersComponent);
