export const ReportsDevelopersComponent = {
    templateUrl: 'chpl.admin/components/reports/reports.developer.html',
    controller: class ReportsDevelopers {
        constructor ($filter, $log, $uibModal, ReportService, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.$uibModal = $uibModal;
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
        }

        $onChanges () {
            this.search();
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
                                change = this.ReportService.compareItem(prev[i], curr[j], keys[k].key, keys[k].display);
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

        isValidDate (d) {
            return d instanceof Date && !isNaN(d);
        }

        parse (meta) {
            return this.networkService.getActivityById(meta.id).then(item => {
                var simpleFields = [
                    {key: 'deleted', display: 'Deleted'},
                    {key: 'developerCode', display: 'Developer Code'},
                    {key: 'name', display: 'Name'},
                    {key: 'website', display: 'Website'},
                ];
                var nestedKeys = [
                    {key: 'status', subkey: 'statusName', display: 'Developer Status'},
                ];

                var change;
                var j;

                var activity = {
                    action: '',
                    details: [],
                };

                if (item.originalData && !angular.isArray(item.originalData) && item.newData) { // both exist, originalData not an array: update
                    activity.action = 'Updated developer "' + item.newData.name + '"';
                    activity.details = [];
                    for (j = 0; j < simpleFields.length; j++) {
                        change = this.ReportService.compareItem(item.originalData, item.newData, simpleFields[j].key, simpleFields[j].display, simpleFields[j].filter);
                        if (change) {
                            activity.details.push(change);
                        }
                    }

                    for (j = 0; j < nestedKeys.length; j++) {
                        change = this.ReportService.nestedCompare(item.originalData, item.newData, nestedKeys[j].key, nestedKeys[j].subkey, nestedKeys[j].display, nestedKeys[j].filter);
                        if (change) {
                            activity.details.push(change);
                        }
                    }

                    var addressChanges = this.ReportService.compareAddress(item.originalData.address, item.newData.address);
                    if (addressChanges && addressChanges.length > 0) {
                        activity.details.push('Address changes<ul>' + addressChanges.join('') + '</ul>');
                    }
                    var contactChanges = this.ReportService.compareContact(item.originalData.contact, item.newData.contact);
                    if (contactChanges && contactChanges.length > 0) {
                        activity.details.push('Contact changes<ul>' + contactChanges.join('') + '</ul>');
                    }

                    var transKeys = [{key: 'transparencyAttestation', display: 'Transparency Attestation'}];
                    var trans = this.compareArray(item.originalData.transparencyAttestationMappings, item.newData.transparencyAttestationMappings, transKeys, 'acbName');
                    for (j = 0; j < trans.length; j++) {
                        activity.details.push('Transparency Attestation "' + trans[j].name + '" changes<ul>' + trans[j].changes.join('') + '</ul>');
                    }

                    var foundEvents = false;
                    var statusEvents = this.utilService.arrayCompare(item.originalData.statusEvents,item.newData.statusEvents);
                    var sortedEvents, translatedEvents;
                    translatedEvents = '<table class="table table-condensed"><thead><tr>';
                    if (statusEvents.added.length > 0) {
                        foundEvents = true;
                        translatedEvents += '<th>Added Status Event' + (statusEvents.added.length > 1 ? 's' : '') + '</th>';
                    }
                    if (statusEvents.edited.length > 0) {
                        foundEvents = true;
                        translatedEvents += '<th>Edited Status Event' + (statusEvents.edited.length > 1 ? 's' : '') + '</th>';
                    }
                    if (statusEvents.removed.length > 0) {
                        foundEvents = true;
                        translatedEvents += '<th>Removed Status Event' + (statusEvents.removed.length > 1 ? 's' : '') + '</th>';
                    }
                    translatedEvents += '</tr></thead><tbody><tr>';
                    if (statusEvents.added.length > 0) {
                        translatedEvents += '<td><ul>';

                        sortedEvents = this.$filter('orderBy')(statusEvents.added,'statusDate',true);
                        for (j = 0; j < sortedEvents.length; j++) {
                            translatedEvents += '<li><strong>' + sortedEvents[j].status.statusName + '</strong> (' + this.$filter('date')(sortedEvents[j].statusDate,'mediumDate','UTC') + ')</li>';
                        }
                        translatedEvents += '</ul></td>';
                    }
                    if (statusEvents.edited.length > 0) {
                        translatedEvents += '<td><ul>';

                        sortedEvents = this.$filter('orderBy')(statusEvents.edited,'before.statusDate',true);
                        for (j = 0; j < sortedEvents.length; j++) {
                            translatedEvents += '<li><strong>' + sortedEvents[j].before.status.statusName + '</strong> (' + this.$filter('date')(sortedEvents[j].before.statusDate,'mediumDate','UTC') + ') became: <strong>' + sortedEvents[j].after.status.statusName + '</strong> (' + this.$filter('date')(sortedEvents[j].after.statusDate,'mediumDate','UTC') + ')</li>';
                        }
                        translatedEvents += '</ul></td>';
                    }
                    if (statusEvents.removed.length > 0) {
                        translatedEvents += '<td><ul>';

                        sortedEvents = this.$filter('orderBy')(statusEvents.removed,'statusDate',true);
                        for (j = 0; j < sortedEvents.length; j++) {
                            translatedEvents += '<li><strong>' + sortedEvents[j].status.statusName + '</strong> (' + this.$filter('date')(sortedEvents[j].statusDate,'mediumDate','UTC') + ')</li>';
                        }
                        translatedEvents += '</ul></td>';
                    }
                    translatedEvents += '</tr></tbody><table>';
                    if (foundEvents) {
                        activity.details.push(translatedEvents);
                    }

                } else {
                    this.ReportService.interpretNonUpdate(activity, item, 'developer');
                    activity.csvAction = activity.action[0].replace(',','","');
                }

                meta.action = activity.action;
                meta.details = activity.details;
                meta.csvDetails = activity.details.join('\n');
            });
        }

        prepare (results) {
            this.activeAcbs = [];
            this.displayed = results.map(item => {
                item.filterText = item.developerName + '|' + item.developerCode + '|' + item.responsibleUser.fullName
                item.categoriesFilter = '|' + item.categories.join('|') + '|';
                item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
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
            this.networkService.getActivityMetadata('developers', this.dateAdjust(this.activityRange))
                .then(results => {
                    that.results = results;
                    that.prepare(that.results);
                });
        }

        validDates () {
            if (this.isValidDate(this.activityRange.endDate) && this.isValidDate(this.activityRange.startDate)) {
                var utcEnd = Date.UTC(
                    this.activityRange.endDate.getFullYear(),
                    this.activityRange.endDate.getMonth(),
                    this.activityRange.endDate.getDate()
                );
                var utcStart = Date.UTC(
                    this.activityRange.startDate.getFullYear(),
                    this.activityRange.startDate.getMonth(),
                    this.activityRange.startDate.getDate()
                );
                var diffDays = Math.floor((utcEnd - utcStart) / (1000 * 60 * 60 * 24));
                if (this.productId) {
                    return (utcStart < utcEnd);
                }
                return (0 <= diffDays && diffDays < this.activityRange.range);
            } else {
                return false;
            }
        }
    },
}

angular.module('chpl.admin')
    .component('chplReportsDevelopers', ReportsDevelopersComponent);
