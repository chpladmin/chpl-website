export const ReportsComponent = {
    templateUrl: 'chpl.admin/components/reports/reports.html',
    bindings: {
        workType: '<',
        productId: '<',
    },
    controller: class ReportsController {
        constructor ($filter, $log, $uibModal, ReportService, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.$uibModal = $uibModal;
            this.ReportService = ReportService;
            this.networkService = networkService;
            this.utilService = utilService;
        }

        $onInit () {
            this.tab = 'cp';
            this.activityRange = { range: 30 };
            var start = new Date();
            var end = new Date();
            start.setDate(end.getDate() - this.activityRange.range + 1); // offset to account for inclusion of endDate in range
            this.activityRange.userActivity = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            this.refreshActivity();
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
        }

        $onChanges (changes) {
            if (!changes.workType.isFirstChange()) {
                if (changes.workType) {
                    this.workType = angular.copy(changes.workType.currentValue);
                    this.refreshActivity();
                }
                if (changes.productId) {
                    this.productId = angular.copy(changes.productId.currentValue);
                }
            }
        }

        ////////////////////////////////////////////////////////////////////
        // Functions

        refreshActivity () {
            switch (this.workType) {

                break;
                // no default
            }
        }

        validDates (key) {
            var utcEnd = Date.UTC(
                this.activityRange[key].endDate.getFullYear(),
                this.activityRange[key].endDate.getMonth(),
                this.activityRange[key].endDate.getDate()
            );
            var utcStart = Date.UTC(
                this.activityRange[key].startDate.getFullYear(),
                this.activityRange[key].startDate.getMonth(),
                this.activityRange[key].startDate.getDate()
            );
            var diffDays = Math.floor((utcEnd - utcStart) / (1000 * 60 * 60 * 24));
            if (key === 'listing' && this.productId) {
                return (utcStart < utcEnd);
            }
            return (0 <= diffDays && diffDays < this.activityRange.range);
        }

        ////////////////////////////////////////////////////////////////////
        // Helper functions

        interpretNonUpdate (activity, data, text, key) {
            if (!key) { key = 'name'; }
            if (data.originalData && !data.newData) { // no new data: deleted
                activity.name = data.originalData[key];
                activity.action = ['"' + activity.name + '" has been deleted'];
            }
            if (!data.originalData && data.newData) { // no old data: created
                activity.name = data.newData[key];
                activity.action = ['"' + activity.name + '" has been created'];
            }
            if (data.originalData && data.originalData.length > 1 && data.newData) { // both exist, more than one originalData: merge
                activity.name = data.newData[key];
                activity.action = ['Merged ' + data.originalData.length + ' ' + text + 's to form ' + text + ': "' + activity.name + '"'];
            }
        }

        compareAddress (prev, curr) {
            var simpleFields = [
                {key: 'streetLineOne', display: 'Street Line 1'},
                {key: 'streetLineTwo', display: 'Street Line 2'},
                {key: 'city', display: 'City'},
                {key: 'state', display: 'State'},
                {key: 'zipcode', display: 'Zipcode'},
                {key: 'country', display: 'Country'},
            ];
            return this.compareObject(prev, curr, simpleFields);
        }

        compareContact (prev, curr) {
            var simpleFields = [
                {key: 'fullName', display: 'Full Name'},
                {key: 'friendlyName', display: 'Friendly Name'},
                {key: 'phoneNumber', display: 'Phone Number'},
                {key: 'title', display: 'Title'},
                {key: 'email', display: 'Email'},
            ];
            return this.compareObject(prev, curr, simpleFields);
        }

        compareObject (prev, curr, fields) {
            var ret = [];
            var change;

            for (var i = 0; i < fields.length; i++) {
                change = this.compareItem(prev, curr, fields[i].key, fields[i].display, fields[i].filter);
                if (change) { ret.push('<li>' + change + '</li>'); }
            }
            return ret;
        }

        analyzeAddress (activity, data) {
            if (data.originalData.address !== data.newData.address) {
                var change;
                activity.action += '<li>Address changes<ul>';
                change = this.compareAddress(data.originalData.address, data.newData.address);
                if (change && change.length > 0) {
                    activity.action += change.join('');
                }
                activity.action += '</ul></li>';
            }
        }

        compareArray (prev, curr, keys, root, nested, altRoot) {
            var ret = [];
            var change, i, j, k, l;
            if (prev !== null) {
                for (i = 0; i < prev.length; i++) {
                    for (j = 0; j < curr.length; j++) {
                        var obj = { name: curr[j][altRoot ? altRoot : root], changes: [] };
                        if (prev[i][root] === curr[j][root]) {
                            for (k = 0; k < keys.length; k++) {
                                change = this.compareItem(prev[i], curr[j], keys[k].key, keys[k].display);
                                if (change) { obj.changes.push('<li>' + change + '</li>'); }
                            }
                            if (nested) {
                                for (k = 0; k < nested.length; k++) {
                                    nested[k].changes = this.utilService.arrayCompare(prev[i][nested[k].key],curr[j][nested[k].key],nested[k].compareId);
                                    if (nested[k].changes.added.length > 0) {
                                        if (nested[k].countOnly) { obj.changes.push('<li>Added ' + nested[k].changes.added.length + ' ' + nested[k].display + (nested[k].changes.added.length !== 1 ? 's' : '') + '</li>') }
                                        else {
                                            obj.changes.push('<li>Added ' + nested[k].display + ':<ul>');
                                            for (l = 0; l < nested[k].changes.added.length; l++) {
                                                obj.changes.push('<li>' + nested[k].changes.added[l][nested[k].value] + '</li>');
                                            }
                                            obj.changes.push('</ul></li>');
                                        }
                                    }
                                    if (nested[k].changes.removed.length > 0) {
                                        if (nested[k].countOnly) { obj.changes.push('<li>Removed ' + nested[k].changes.removed.length + ' ' + nested[k].display + (nested[k].changes.removed.length !== 1 ? 's' : '') + '</li>') }
                                        else {
                                            obj.changes.push('<li>Removed ' + nested[k].display + ':<ul>');
                                            for (l = 0; l < nested[k].changes.removed.length; l++) {
                                                obj.changes.push('<li>' + nested[k].changes.removed[l][nested[k].value] + '</li>');
                                            }
                                            obj.changes.push('</ul></li>');
                                        }
                                    }
                                }
                            }
                            prev[i].evaluated = true;
                            curr[j].evaluated = true;
                        }
                        if (obj.changes.length > 0) {
                            ret.push(obj);
                        }
                    }
                    if (!prev[i].evaluated) {
                        ret.push({ name: prev[i][altRoot ? altRoot : root], changes: ['<li>' + prev[i][altRoot ? altRoot : root] + ' removed</li>']});
                    }
                }
                for (i = 0; i < curr.length; i++) {
                    if (!curr[i].evaluated) {
                        ret.push({ name: curr[i][altRoot ? altRoot : root], changes: ['<li>' + curr[i][altRoot ? altRoot : root] + ' added</li>']});
                    }
                }
            }
            return ret;
        }

        compareItem (oldData, newData, key, display, filter) {
            if (oldData && oldData[key] && newData && newData[key] && oldData[key] !== newData[key]) {
                if (filter) {
                    return display + ' changed from ' + this.$filter(filter)(oldData[key],'mediumDate','UTC') + ' to ' + this.$filter(filter)(newData[key],'mediumDate','UTC');
                } else {
                    return display + ' changed from ' + oldData[key] + ' to ' + newData[key];
                }
            }
            if ((!oldData || !oldData[key]) && newData && newData[key]) {
                if (filter) {
                    return display + ' added: ' + this.$filter(filter)(newData[key],'mediumDate','UTC');
                } else {
                    return display + ' added: ' + newData[key];
                }
            }
            if (oldData && oldData[key] && (!newData || !newData[key])) {
                if (filter) {
                    return display + ' removed. Was: ' + this.$filter(filter)(oldData[key],'mediumDate','UTC');
                } else {
                    return display + ' removed. Was: ' + oldData[key];
                }
            }
        }

        nestedCompare (oldData, newData, key, subkey, display, filter) {
            return this.compareItem(oldData[key], newData[key], subkey, display, filter);
        }

        dateAdjust (obj) {
            var ret = angular.copy(obj);
            ret.startDate = this.coerceToMidnight(ret.startDate);
            ret.endDate = this.coerceToMidnight(ret.endDate, true);
            return ret;
        }

        coerceToMidnight (date, roundUp) {
            if (date) {
                date.setHours(0,0,0,0);
                if (roundUp) {
                    date.setDate(date.getDate() + 1);
                }
                return date;
            }
        }

        getResponsibleUser (user) {
            return user.fullName;
        }
    },
}

angular.module('chpl.admin')
    .component('aiReports', ReportsComponent);
