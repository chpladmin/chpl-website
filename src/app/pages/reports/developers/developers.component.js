export const ReportsDevelopersComponent = {
    templateUrl: 'chpl.reports/developers/developers.html',
    controller: class ReportsDevelopersComponent {
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

        onClearFilter () {
            this.activityRange.endDate = new Date();
            this.activityRange.startDate = this.utilService.addDays(this.activityRange.endDate, (this.activityRange.range * -1) + 1)
            this.filterText = '';
            this.tableController.sortBy('date');
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

                if (item.originalData && !angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // both exist, both not arrays; update
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

                    //Old format where transp attest is just string vs. new format where it is an object
                    if (this.isTransparencyAttestationObjectFormat(item.newData.transparencyAttestationMappings)) {
                        let taChanges = this.compareTransparencyAttestations(item.originalData.transparencyAttestationMappings, item.newData.transparencyAttestationMappings);
                        if (taChanges && taChanges.length > 0) {
                            activity.details.push(taChanges.join(''));
                        }
                    } else {
                        var transKeys = [{ key: 'transparencyAttestation', display: 'Transparency Attestation' }];
                        var trans = this.ReportService.compareArray(item.originalData.transparencyAttestationMappings, item.newData.transparencyAttestationMappings, transKeys, 'acbName', true);
                        for (j = 0; j < trans.length; j++) {
                            activity.details.push('Transparency Attestation "' + trans[j].name + '" changes<ul>' + trans[j].changes.join('') + '</ul>');
                        }
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

                } else if (item.originalData && angular.isArray(item.originalData) && item.newData && !angular.isArray(item.newData)) { // merge
                    activity.action ='Developers ' + item.originalData.map(d => d.name).join(' and ') + ' merged to form ' + item.newData.name;
                    activity.details = [];
                } else if (item.originalData && !angular.isArray(item.originalData) && item.newData && angular.isArray(item.newData)) { // split
                    activity.action = 'Developer ' + item.originalData.name + ' split to become Developers ' + item.newData[0].name + ' and ' + item.newData[1].name;
                    activity.details = [];
                } else {
                    this.ReportService.interpretNonUpdate(activity, item, 'developer');
                    activity.action = activity.action[0];
                    activity.details = [];
                    activity.csvAction = activity.action.replace(',','","');
                }

                meta.action = activity.action;
                meta.details = activity.details;
                meta.csvDetails = activity.details.join('\n');
            });
        }

        prepare (results) {
            this.displayed = results.map(item => {
                item.filterText = item.developerName + '|' + item.developerCode + '|' + item.responsibleUser.fullName
                item.categoriesFilter = '|' + item.categories.join('|') + '|';
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
            this.networkService.getActivityMetadata('developers', this.dateAdjust(this.activityRange))
                .then(results => {
                    that.results = results;
                    that.prepare(that.results);
                });
        }

        validDates () {
            return this.ReportService.validDates(this.activityRange.startDate, this.activityRange.endDate, this.activityRange.range, false);
        }

        compareTransparencyAttestations (before, after) {
            let changes = [];
            //This will get all the changes, since these arrays should alweays have the same number of elements based
            //on the acbs
            before.forEach(beforeTA => {
                let afterTA = after.find(ta => ta.acbId === beforeTA.acbId);
                if (afterTA) {
                    changes.push(this.compareTransparencyAttestation(beforeTA, afterTA));
                }
            });
            return changes;
        }

        compareTransparencyAttestation (before, after) {
            if (!before.transparencyAttestation && !after.transparencyAttestation) {
                return '';
            } else if (!before.transparencyAttestation) {
                //Transparency attestation was added
                return '<li>Transparency Attestation "' + after.acbName + '" changes<ul><li>Transparency Attestation added: ' + after.transparencyAttestation.transparencyAttestation + '.</li></ul></li>';
            } else if (!after.transparencyAttestation) {
                //Transparency attestation was removed - not sure this is possible
                return '<li>Transparency Attestation "' + after.acbName + '" changes<ul><li>Transparency Attestation removed. Was: ' + before.transparencyAttestation.transparencyAttestation + '.</li></ul></li>';
            } else if (before.transparencyAttestation.transparencyAttestation !== after.transparencyAttestation.transparencyAttestation) {
                //Transparency attestation was changed
                return '<li>Transparency Attestation "' + after.acbName +'" changes<ul><li>Transparency Attestation changed: ' + after.transparencyAttestation.transparencyAttestation + '. Was: ' + before.transparencyAttestation.transparencyAttestation + '.</li></ul></li>';
            } else {
                return '';
            }
        }

        isTransparencyAttestationObjectFormat (attestationMappings) {
            return attestationMappings.reduce((acc, curr) => acc || (typeof curr.transparencyAttestation === 'object' && curr.transparencyAttestation !== null) , false);
        }
    },
}

angular.module('chpl.reports')
    .component('chplReportsDevelopers', ReportsDevelopersComponent);
