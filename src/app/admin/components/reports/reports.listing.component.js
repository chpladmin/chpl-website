export const ReportsListingsComponent = {
    templateUrl: 'chpl.admin/components/reports/reports.listing.html',
    bindings: {
        productId: '<?',
    },
    controller: class ReportsListings {
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
            this.categoriesFilter = '|LISTING|';
        }

        $onChanges (changes) {
            if (changes.productId && changes.productId.currentValue) {
                let that = this;
                this.activityRange.endDate = new Date();
                this.activityRange.startDate = new Date('4/1/2016');
                this.productId = angular.copy(changes.productId.currentValue);
                this.networkService.getSingleListingActivityMetadata(this.productId)
                    .then(results => {
                        that.results = results;
                        that.prepare(that.results, true);
                    });
            } else {
                this.search();
            }
        }

        search () {
            let that = this;
            this.networkService.getActivityMetadata('listings', this.dateAdjust(this.activityRange))
                .then(results => {
                    that.results = results;
                    that.prepare(that.results);
                });
        }

        prepare (results, full) {
            this.activeAcbs = [];
            this.displayed = results.map(item => {
                item.filterText = item.developerName + '|' + item.productName + '|' + item.chplProductNumber
                item.categoriesFilter = '|' + item.categories.join('|') + '|';
                item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
                item.friendlyCertificationDate = new Date(item.certificationDate).toISOString().substring(0, 10);
                if (this.activeAcbs.indexOf(item.acbName) === -1) {
                    this.activeAcbs.push(item.acbName);
                }
                if (full) {
                    this.parse(item);
                    item.showDetails = true;
                }
                return item;
            });
        }

        prepareDownload () {
            this.displayed
                .filter(item => !item.action)
                .forEach(item => this.parse(item));
            //todo, eventually: use the $q.all function as demonstrated in product history eye
        }

        downloadReady () {
            return this.displayed.reduce((acc, activity) => activity.action && acc, true);
        }

        acbCount (acb) {
            return this.displayed.reduce((acc, activity) => activity.acbName === acb ? acc + 1 : acc, 0);
        }

        parse (meta) {
            return this.networkService.getActivityById(meta.id).then(item => {
                var simpleCpFields = [
                    {key: 'acbCertificationId', display: 'ACB Certification ID'},
                    {key: 'accessibilityCertified', display: 'Accessibility Certified'},
                    {key: 'certificationDate', display: 'Certification Date', filter: 'date'},
                    {key: 'chplProductNumber', display: 'CHPL Product Number'},
                    {key: 'otherAcb', display: 'Other ONC-ACB'},
                    {key: 'productAdditionalSoftware', display: 'Product-wide Relied Upon Software'},
                    {key: 'reportFileLocation', display: 'ONC-ATL Test Report File Location'},
                    {key: 'sedIntendedUserDescription', display: 'SED Intended User Description'},
                    {key: 'sedReportFileLocation', display: 'SED Report File Location'},
                    {key: 'sedTesting', display: 'SED Tested'},
                    {key: 'sedTestingEndDate', display: 'SED Testing End Date', filter: 'date'},
                    {key: 'transparencyAttestationUrl', display: 'Mandatory Disclosures URL'},
                ];
                var nestedKeys = [
                    {key: 'certifyingBody', subkey: 'name', display: 'Certifying Body'},
                    {key: 'classificationType', subkey: 'name', display: 'Classification Type'},
                    {key: 'ics', subkey: 'inherits', display: 'ICS Status'},
                    {key: 'practiceType', subkey: 'name', display: 'Practice Type'},
                    {key: 'testingLab', subkey: 'name', display: 'Testing Lab'},
                ];
                var change;

                var certChanges, j, k, link;
                var activity = {
                    action: '',
                    details: [],
                };
                if (item.description === 'Created a certified product') {
                    activity.action = 'Created a certified product';
                } else if (item.description.startsWith('Updated certified')) {
                    activity.action = 'Updated a certified product';
                    if (item.newData.certificationStatus) {
                        change = this.nestedCompare(item.originalData, item.newData, 'certificationStatus', 'name', 'Certification Status');
                        if (change) {
                            activity.details.push(change);
                        }
                    } else {
                        change = this._compareCertificationEvents(item.originalData.certificationEvents, item.newData.certificationEvents);
                        if (change && change.length > 0) {
                            activity.details.push(change);
                        }
                    }

                    for (j = 0; j < simpleCpFields.length; j++) {
                        change = this.compareItem(item.originalData, item.newData, simpleCpFields[j].key, simpleCpFields[j].display, simpleCpFields[j].filter);
                        if (change) {
                            activity.details.push(change);
                        }
                    }
                    for (j = 0; j < nestedKeys.length; j++) {
                        change = this.nestedCompare(item.originalData, item.newData, nestedKeys[j].key, nestedKeys[j].subkey, nestedKeys[j].display, nestedKeys[j].filter);
                        if (change) {
                            activity.details.push(change);
                        }
                    }
                    var accessibilityStandardsKeys = [];
                    var accessibilityStandards = this.compareArray(item.originalData.accessibilityStandards, item.newData.accessibilityStandards, accessibilityStandardsKeys, 'accessibilityStandardName');
                    for (j = 0; j < accessibilityStandards.length; j++) {
                        activity.details.push('Accessibility Standard "' + accessibilityStandards[j].name + '" changes<ul>' + accessibilityStandards[j].changes.join('') + '</ul>');
                    }
                    certChanges = this.compareCerts(item.originalData.certificationResults, item.newData.certificationResults);
                    for (j = 0; j < certChanges.length; j++) {
                        activity.details.push('Certification "' + certChanges[j].number + '" changes<ul>' + certChanges[j].changes.join('') + '</ul>');
                    }
                    var cqmChanges = this.compareCqms(item.originalData.cqmResults, item.newData.cqmResults);
                    for (j = 0; j < cqmChanges.length; j++) {
                        activity.details.push('CQM "' + cqmChanges[j].cmsId + '" changes<ul>' + cqmChanges[j].changes.join('') + '</ul>');
                    }
                    if (typeof(item.originalData.ics) === 'object' &&
                        typeof(item.newData.ics) === 'object' &&
                        item.originalData.ics &&
                        item.newData.ics) {
                        if (item.originalData.ics.parents) {
                            var icsParentsKeys = [];
                            var icsParents = this.compareArray(item.originalData.ics.parents, item.newData.ics.parents, icsParentsKeys, 'chplProductNumber');
                            for (j = 0; j < icsParents.length; j++) {
                                activity.details.push('ICS Parent "' + icsParents[j].name + '" changes<ul>' + icsParents[j].changes.join('') + '</ul>');
                            }
                        }
                        if (item.originalData.ics.children) {
                            var icsChildrenKeys = [];
                            var icsChildren = this.compareArray(item.originalData.ics.children, item.newData.ics.children, icsChildrenKeys, 'chplProductNumber');
                            for (j = 0; j < icsChildren.length; j++) {
                                activity.details.push('ICS Child "' + icsChildren[j].name + '" changes<ul>' + icsChildren[j].changes.join('') + '</ul>');
                            }
                        }
                    }
                    if (item.originalData.meaningfulUseUserHistory) {
                        var meaningfulUseUserHistory = this.ReportService.compare(item.originalData.meaningfulUseUserHistory, item.newData.meaningfulUseUserHistory, 'meaningfulUseUserHistory');
                        if (meaningfulUseUserHistory.length > 0) {
                            activity.details.push('Meaningful use user history changes<ul>' + meaningfulUseUserHistory.join('') + '</ul>');
                        }
                    }
                    if (item.originalData.testingLabs) {
                        var testingLabsKeys = [];
                        var testingLabs = this.compareArray(item.originalData.testingLabs, item.newData.testingLabs, testingLabsKeys, 'testingLabName');
                        for (j = 0; j < testingLabs.length; j++) {
                            activity.details.push('Testing Lab "' + testingLabs[j].name + '" changes<ul>' + testingLabs[j].changes.join('') + '</ul>');
                        }
                    }
                    var qmsStandards = this.ReportService.compare(item.originalData.qmsStandards, item.newData.qmsStandards, 'qmsStandards');
                    if (qmsStandards.length > 0) {
                        activity.details.push('QMS Standards changes<ul>' + qmsStandards.join('') + '</ul>');
                    }
                    if (item.originalData.sed && item.newData.sed) {
                        var sedChanges = this._compareSed(item.originalData.sed, item.newData.sed);
                        if (sedChanges && sedChanges.length > 0) {
                            activity.details.push('SED Changes<ul>' + sedChanges.join('') + '</ul>');
                        }
                    }
                    var targetedUsers = this.ReportService.compare(item.originalData.targetedUsers, item.newData.targetedUsers, 'targetedUsers');
                    if (targetedUsers.length > 0) {
                        activity.details.push('Targeted Users changes:<ul>' + targetedUsers.join('') + '</ul>');
                    }
                } else if (item.description.startsWith('Surveillance')) {
                    if (item.description.startsWith('Surveillance was delete')) {
                        activity.action = 'Surveillance was deleted';
                    } else if (item.description.startsWith('Surveillance upload')) {
                        activity.action = 'Surveillance was uploaded';
                    } else if (item.description.startsWith('Surveillance was added')) {
                        activity.action = 'Surveillance was added';
                    } else if (item.description.startsWith('Surveillance was updated')) {
                        activity.action = 'Surveillance was updated';
                        for (j = 0; j < item.originalData.surveillance.length; j++) {
                            var action = [item.originalData.surveillance[j].friendlyId + '<ul><li>'];
                            var actions = [];
                            var simpleFields = [
                                {key: 'endDate', display: 'End Date', filter: 'date'},
                                {key: 'friendlyId', display: 'Surveillance ID'},
                                {key: 'randomizedSitesUsed', display: 'Number of sites surveilled'},
                                {key: 'startDate', display: 'Start Date', filter: 'date'},
                            ];
                            nestedKeys = [
                                {key: 'type', subkey: 'name', display: 'Certification Type'},
                            ];
                            for (k = 0; k < simpleFields.length; k++) {
                                change = this.compareItem(item.originalData.surveillance[j], item.newData.surveillance[j], simpleFields[k].key, simpleFields[k].display, simpleFields[k].filter);
                                if (change) { actions.push(change); }
                            }
                            for (k = 0; k < nestedKeys.length; k++) {
                                change = this.nestedCompare(item.originalData.surveillance[j], item.newData.surveillance[j], nestedKeys[k].key, nestedKeys[k].subkey, nestedKeys[k].display, nestedKeys[k].filter);
                                if (change) {
                                    actions.push(change);
                                }
                            }
                            if (actions.length === 0) {
                                meta.source = {
                                    oldS: item.originalData,
                                    newS: item.newData,
                                }
                            } else {
                                action += actions.join('</li><li>');
                                action += '</li></ul>';
                                activity.details.push(action);
                            }
                        }
                    } else {
                        activity.action = item.description + '<br />' + link;
                    }
                } else if (item.description.startsWith('Documentation')) {
                    activity.action = 'Documentation was added to a nonconformity';
                } else if (item.description.startsWith('A document was removed')) {
                    activity.action = 'Documentation was removed from a nonconformity';
                } else {
                    activity.action = item.description;
                }
                meta.action = activity.action;
                meta.details = activity.details;
                meta.csvDetails = activity.details.join('\n');
            });
        }

        compareSurveillances (oldS, newS) {
            this.modalInstance = this.$uibModal.open({
                templateUrl: 'chpl.admin/components/reports/compareSurveillanceRequirements.html',
                controller: 'CompareSurveillanceRequirementsController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    newSurveillance: function () { return newS; },
                    oldSurveillance: function () { return oldS; },
                },
                size: 'lg',
            });
        }

        validDates () {
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
        }

        compareCerts (prev, curr) {
            var ret = [];
            var change;
            var certKeys = [
                {key: 'apiDocumentation', display: 'API Documentation'},
                {key: 'g1Success', display: 'Certified to G1'},
                {key: 'g2Success', display: 'Certified to G2'},
                {key: 'gap', display: 'GAP Tested'},
                {key: 'privacySecurityFramework', display: 'Privacy &amp; Security Framework'},
                {key: 'sed', display: 'SED tested'},
                {key: 'success', display: 'Successful'},
            ];
            var i, j;
            prev.sort(function (a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
            curr.sort(function (a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
            for (i = 0; i < prev.length; i++) {
                var obj = { number: curr[i].number, changes: [] };
                for (j = 0; j < certKeys.length; j++) {
                    change = this.compareItem(prev[i], curr[i], certKeys[j].key, certKeys[j].display, certKeys[j].filter);
                    if (change) {
                        obj.changes.push('<li>' + change + '</li>');
                    }
                }
                var measures = this.utilService.arrayCompare(prev[i].g1MacraMeasures,curr[i].g1MacraMeasures);
                if (measures.added.length > 0) {
                    obj.changes.push('<li>Added G1 MACRA Measure' + (measures.added.length > 1 ? 's' : '') + ':<ul>');
                    for (j = 0; j < measures.added.length; j++) {
                        obj.changes.push('<li>' + measures.added[j].abbreviation + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                }
                if (measures.removed.length > 0) {
                    obj.changes.push('<li>Removed G1 MACRA Measure' + (measures.removed.length > 1 ? 's' : '') + ':<ul>');
                    for (j = 0; j < measures.removed.length; j++) {
                        obj.changes.push('<li>' + measures.removed[j].abbreviation + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                }
                measures = this.utilService.arrayCompare(prev[i].g2MacraMeasures,curr[i].g2MacraMeasures);
                if (measures.added.length > 0) {
                    obj.changes.push('<li>Added G2 MACRA Measure' + (measures.added.length > 1 ? 's' : '') + ':<ul>');
                    for (j = 0; j < measures.added.length; j++) {
                        obj.changes.push('<li>' + measures.added[j].abbreviation + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                }
                if (measures.removed.length > 0) {
                    obj.changes.push('<li>Removed G2 MACRA Measure' + (measures.removed.length > 1 ? 's' : '') + ':<ul>');
                    for (j = 0; j < measures.removed.length; j++) {
                        obj.changes.push('<li>' + measures.removed[j].abbreviation + '</li>');
                    }
                    obj.changes.push('</ul></li>');
                }
                var addlSw = this.ReportService.compare(prev[i].additionalSoftware, curr[i].additionalSoftware, 'additionalSoftware');
                if (addlSw.length > 0) {
                    obj.changes.push('<li>Relied Upon Software changes<ul>' + addlSw.join('') + '</li>');
                }
                var testChanges = this._compareTestStuff(prev[i], curr[i]);
                if (testChanges) {
                    obj.changes = obj.changes.concat(testChanges);
                }
                var testFunctionality = this.ReportService.compare(prev[i].testFunctionality, curr[i].testFunctionality, 'testFunctionality');
                if (testFunctionality.length > 0) {
                    obj.changes.push('<li>Test Functionality changes<ul>' + testFunctionality.join('') + '</li>');
                }
                var testToolsUsedKeys = [{key: 'testToolVersion', display: 'Test Tool Version'}];
                var testToolsUsed = this.compareArray(prev[i].testToolsUsed, curr[i].testToolsUsed, testToolsUsedKeys, 'testToolName');
                for (j = 0; j < testToolsUsed.length; j++) {
                    obj.changes.push('<li>Test Tool Name "' + testToolsUsed[j].name + '" changes<ul>' + testToolsUsed[j].changes.join('') + '</ul></li>');
                }
                var testStandardsKeys = [{key: 'testStandardName', display: 'Test Standard Name'}];
                var testStandards = this.compareArray(prev[i].testStandards, curr[i].testStandards, testStandardsKeys, 'testStandardName');
                for (j = 0; j < testStandards.length; j++) {
                    obj.changes.push('<li>Test Standard Description "' + testStandards[j].name + '" changes<ul>' + testStandards[j].changes.join('') + '</ul></li>');
                }
                if (prev[i].ucdProcesses) {
                    var ucdProcessesKeys = [{key: 'ucdProcessDetails', display: 'UCD Process Details'}];
                    var ucdProcesses = this.compareArray(prev[i].ucdProcesses, curr[i].ucdProcesses, ucdProcessesKeys, 'ucdProcessName');
                    for (j = 0; j < ucdProcesses.length; j++) {
                        obj.changes.push('<li>UCD Process Name "' + ucdProcesses[j].name + '" changes<ul>' + ucdProcesses[j].changes.join('') + '</ul></li>');
                    }
                }
                if (prev[i].testTasks) {
                    var testTasks = this.compareSedTasks(prev[i].testTasks, curr[i].testTasks);
                    for (j = 0; j < testTasks.length; j++) {
                        obj.changes.push('<li>SED Test Task "' + testTasks[j].name + '" changes<ul>' + testTasks[j].changes.join('') + '</ul></li>');
                    }
                }
                if (obj.changes.length > 0) {
                    ret.push(obj);
                }
            }
            return ret;
        }

        _compareCertificationEvents (prev, curr) {
            var c = 0, item, p = 0, ret = [];
            prev = this.$filter('orderBy')(prev.map(function (e) { if (!e.certificationStatusName) { e.certificationStatusName = e.status.name; } return e; }), 'eventDate');
            curr = this.$filter('orderBy')(curr.map(function (e) { if (!e.certificationStatusName) { e.certificationStatusName = e.status.name; } return e; }), 'eventDate');

            while (p < prev.length && c < curr.length) {
                item = '';
                if (prev[p].eventDate < curr[c].eventDate) {
                    if (prev[p].certificationStatusName === curr[c].certificationStatusName) {
                        item = '"' + prev[p].certificationStatusName + '" status changed effective date to ' + this.$filter('date')(curr[c].eventDate,'mediumDate','UTC');
                        if (curr[c].reason) {
                            item += ' with reason: "' + curr[c].reason + '"';
                        }
                        p += 1;
                        c += 1;
                    } else {
                        item = 'Removed "' + prev[p].certificationStatusName + '" status at ' + this.$filter('date')(prev[p].eventDate,'mediumDate','UTC');
                        if (prev[p].reason) {
                            item += ' with reason: "' + prev[p].reason + '"';
                        }
                        p += 1;
                    }
                } else if (prev[p].eventDate > curr[c].eventDate) {
                    if (prev[p].certificationStatusName === curr[c].certificationStatusName) {
                        item = '"' + prev[p].certificationStatusName + '" status changed effective date to ' + this.$filter('date')(curr[c].eventDate,'mediumDate','UTC');
                        if (curr[c].reason) {
                            item += ' with reason: "' + curr[c].reason + '"';
                        }
                        p += 1;
                        c += 1;
                    } else {
                        item = 'Added "' + curr[c].certificationStatusName + '" status at ' + this.$filter('date')(curr[c].eventDate,'mediumDate','UTC');
                        if (curr[c].reason) {
                            item += ' with reason: "' + curr[c].reason + '"';
                        }
                        c += 1;
                    }
                } else if (prev[p].certificationStatusName !== curr[c].certificationStatusName) {
                    item = '"' + prev[p].certificationStatusName + '" status became "' + curr[c].certificationStatusName + '" at ' + this.$filter('date')(curr[c].eventDate,'mediumDate','UTC');
                    if (curr[c].reason) {
                        item += ' with reason: "' + curr[c].reason + '"';
                    }
                    p += 1;
                    c += 1;
                } else {
                    p += 1;
                    c += 1;
                }
                if (item) {
                    ret.push(item);
                }
            }
            while (p < prev.length) {
                item = 'Removed "' + prev[p].certificationStatusName + '" status at ' + this.$filter('date')(prev[p].eventDate,'mediumDate','UTC');
                if (prev[p].reason) {
                    item += ' with reason: "' + prev[p].reason + '"';
                }
                ret.push(item);
                p += 1;
            }
            while (c < curr.length) {
                item = 'Added "' + curr[c].certificationStatusName + '" status at ' + this.$filter('date')(curr[c].eventDate,'mediumDate','UTC');
                if (curr[c].reason) {
                    item += ' with reason: "' + curr[c].reason + '"';
                }
                ret.push(item);
                c += 1;
            }
            return ret;
        }

        _compareSed (prev, curr) {
            var i, j, k, ret = [];

            var ucdProcessesKeys = [{key: 'details', display: 'UCD Process Details'}];
            var ucdProcessesNested = [
                {key: 'criteria', display: 'Certification Criteria', value: 'number', compareId: 'number'},
            ];
            var ucdProcesses = this.compareArray(prev.ucdProcesses, curr.ucdProcesses, ucdProcessesKeys, 'name', ucdProcessesNested);
            for (i = 0; i < ucdProcesses.length; i++) {
                ret.push('<li>UCD Process Name "' + ucdProcesses[i].name + '" changes<ul>' + ucdProcesses[i].changes.join('') + '</ul></li>');
            }

            var taskKeys = [
                {key: 'description', display: 'Description'},
                {key: 'taskErrors', display: 'Task Errors'},
                {key: 'taskErrorsStddev', display: 'Task Errors Standard Deviation'},
                {key: 'taskPathDeviationObserved', display: 'Task Path Deviation Observed'},
                {key: 'taskPathDeviationOptimal', display: 'Task Path Deviation Optimal'},
                {key: 'taskRating', display: 'Task Rating'},
                {key: 'taskRatingScale', display: 'Task Rating Scale'},
                {key: 'taskRatingStddev', display: 'Task Rating Standard Deviation'},
                {key: 'taskSuccessAverage', display: 'Task Success Average'},
                {key: 'taskSuccessStddev', display: 'Task Success Standard Deviation'},
                {key: 'taskTimeAvg', display: 'Task Time Average'},
                {key: 'taskTimeDeviationObservedAvg', display: 'Task Time Deviation Observed Average'},
                {key: 'taskTimeDeviationOptimalAvg', display: 'Task Time Deviation Optimal Average'},
                {key: 'taskTimeStddev', display: 'Task Time Standard Deviation'},
            ];
            var taskNested = [
                {key: 'criteria', display: 'Certification Criteria', value: 'number', compareId: 'number'},
                {key: 'testParticipants', display: 'Test Participant', value: 'id', compareId: 'id', countOnly: true},
            ];
            var tasks = this.compareArray(prev.testTasks, curr.testTasks, taskKeys, 'id', taskNested, 'description');
            for (i = 0; i < tasks.length; i++) {
                ret.push('<li>Task Description "' + tasks[i].name + '" changes<ul>' + tasks[i].changes.join('') + '</ul></li>');
            }

            var found, part, task;
            prev.allParticipants = [];
            for (i = 0; i < prev.testTasks.length; i++) {
                task = prev.testTasks[i];
                for (j = 0; j < task.testParticipants.length; j++) {
                    part = task.testParticipants[j];
                    found = false;
                    for (k = 0; k < prev.allParticipants.length; k++) {
                        if (part.id === prev.allParticipants[k].id) {
                            found = true;
                        }
                    }
                    if (!found) {
                        prev.allParticipants.push(part);
                    }
                }
            }
            curr.allParticipants = [];
            for (i = 0; i < curr.testTasks.length; i++) {
                task = curr.testTasks[i];
                for (j = 0; j < task.testParticipants.length; j++) {
                    part = task.testParticipants[j];
                    found = false;
                    for (k = 0; k < curr.allParticipants.length; k++) {
                        if (part.id === curr.allParticipants[k].id) {
                            found = true;
                        }
                    }
                    if (!found) {
                        curr.allParticipants.push(part);
                    }
                }
            }

            var testParticipantKeys = [
                {key: 'ageRange', display: 'Age Range'},
                {key: 'assistiveTechnologyNeeds', display: 'Assistive Technology Needs'},
                {key: 'computerExperienceMonths', display: 'Computer Experience Months'},
                {key: 'educationTypeName', display: 'Education Type'},
                {key: 'gender', display: 'Gender'},
                {key: 'occupation', display: 'Occupation'},
                {key: 'productExperienceMonths', display: 'Product Experience (Months)'},
                {key: 'professionalExperienceMonths', display: 'Professional Experience (Months)'},
            ];
            var participants = this.compareArray(prev.allParticipants, curr.allParticipants, testParticipantKeys, 'id');
            for (i = 0; i < participants.length; i++) {
                ret.push('<li>Participant changes<ul>' + participants[i].changes.join('') + '</ul></li>');
            }
            return ret;
        }

        _compareTestStuff (prev, curr) {
            var ret = [];
            if (prev.testProcedures && curr.testProcedures) {
                prev.testProcedures.forEach(function (pre) {
                    if (pre.testProcedure) {
                        curr.testProcedures.forEach(function (cur) {
                            if (!cur.found && !pre.found &&
                                pre.testProcedure.name === cur.testProcedure.name &&
                                pre.testProcedureVersion === cur.testProcedureVersion ) {
                                pre.found = true;
                                cur.found = true;
                            }
                        });
                    }
                });
                prev.testProcedures.forEach(function (pre) {
                    if (pre.testProcedure) {
                        curr.testProcedures.forEach(function (cur) {
                            if (!cur.found && !pre.found && pre.testProcedure.name === cur.testProcedure.name ) {
                                pre.found = true;
                                cur.found = true;
                                ret.push('<li>Test Procedure "' + pre.testProcedure.name + '" version changed from "' + pre.testProcedureVersion + '" to "' + cur.testProcedureVersion + '"</li>');
                            }
                        })
                        if (!pre.found) {
                            ret.push('<li>Test Procedure "' + pre.testProcedure.name + '" was removed</li>');
                        }
                    }
                });
                curr.testProcedures.forEach(function (cur) {
                    if (cur.testProcedure) {
                        if (!cur.found) {
                            ret.push('<li>Test Procedure "' + cur.testProcedure.name + '" was added</li>');
                        }
                    }
                });
            }
            if (prev.testDataUsed && curr.testDataUsed) {
                prev.testDataUsed.forEach(function (pre) {
                    if (pre.testData) {
                        curr.testDataUsed.forEach(function (cur) {
                            if (!cur.found && !pre.found &&
                                pre.testData.name === cur.testData.name &&
                                pre.version === cur.version &&
                                pre.alteration === cur.alteration) {
                                pre.found = true;
                                cur.found = true;
                            }
                        });
                    }
                });
                prev.testDataUsed.forEach(function (pre) {
                    if (pre.testData) {
                        curr.testDataUsed.forEach(function (cur) {
                            if (!cur.found && !pre.found &&
                                pre.testData.name === cur.testData.name) {
                                pre.found = true;
                                cur.found = true;
                                if (pre.version !== cur.version) {
                                    ret.push('<li>Test Data "' + pre.testData.name + '" version changed from "' + pre.version + '" to "' + cur.version + '"</li>');
                                }
                                if (pre.alteration !== cur.alteration) {
                                    ret.push('<li>Test Data "' + pre.testData.name + '" alteration changed from "' + pre.alteration + '" to "' + cur.alteration + '"</li>');
                                }
                            }
                        })
                        if (!pre.found) {
                            ret.push('<li>Test Data "' + pre.testData.name + '" was removed</li>');
                        }
                    }
                });
                curr.testDataUsed.forEach(function (cur) {
                    if (cur.testData) {
                        if (!cur.found) {
                            ret.push('<li>Test Data "' + cur.testData.name + '" was added</li>');
                        }
                    }
                });
            }
            return ret;
        }

        compareSedTasks (prev, curr) {
            var ret = [];
            var change;
            var keys = [
                {key: 'taskPathDeviationObserved', display: 'Path Deviation Observed'},
                {key: 'taskPathDeviationOptimal', display: 'Path Deviation Optimal'},
                {key: 'taskRating', display: 'Task Rating'},
                {key: 'taskRatingStddev', display: 'Task Rating Standard Deviation'},
                {key: 'taskRatingScale', display: 'Rating Scale'},
                {key: 'taskTimeAvg', display: 'Time Average'},
                {key: 'taskTimeDeviationObservedAvg', display: 'Time Deviation Observed Average'},
                {key: 'taskTimeDeviationOptimalAvg', display: 'Time Deviation Optimal Average'},
                {key: 'taskTimeStddev', display: 'Time Standard Deviation'},
            ];
            var i, j, k;
            if (prev !== null) {
                prev.sort(function (a,b) {return (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0);} );
                curr.sort(function (a,b) {return (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0);} );
                for (i = 0; i < prev.length; i++) {
                    for (j = 0; j < curr.length; j++) {
                        if (prev[i].description === curr[j].description) {
                            var obj = { name: curr[j].description, changes: [] };
                            for (k = 0; k < keys.length; k++) {
                                change = this.compareItem(prev[i], curr[j], keys[k].key, keys[k].display, keys[k].filter);
                                if (change) { obj.changes.push('<li>' + change + '</li>'); }
                            }
                            var testParticipantKeys = [
                                {key: 'ageRange', display: 'Age'},
                                {key: 'assistiveTechnologyNeeds', display: 'Assistive Technology Needs'},
                                {key: 'computerExperienceMonths', display: 'Computer Experience Months'},
                                {key: 'educationTypeName', display: 'Education Type'},
                                {key: 'gender', display: 'Gender'},
                                {key: 'occupation', display: 'Occupation'},
                                {key: 'productExperienceMonths', display: 'Product Experience (Months)'},
                                {key: 'professionalExperienceMonths', display: 'Professional Experience (Months)'},
                            ];
                            var testParticipants = this.compareArray(prev[i].testParticipants, curr[j].testParticipants, testParticipantKeys, 'testParticipantId');
                            for (k = 0; k < testParticipants.length; k++) {
                                obj.changes.push('<li>Test Participant "' + testParticipants[k].name + '" changes<ul>' + testParticipants[k].changes.join('') + '</ul></li>');
                            }
                            if (obj.changes.length > 0) {
                                ret.push(obj);
                            }
                            prev[i].evaluated = true;
                            curr[j].evaluated = true;
                        }
                    }
                    if (!prev[i].evaluated) {
                        ret.push({ name: prev[i].description, changes: ['<li>Task removed</li>'] });
                    }
                }
                for (i = 0; i < curr.length; i++) {
                    if (!curr[i].evaluated) {
                        ret.push({ name: curr[i].description, changes: ['<li>Task added</li>'] });
                    }
                }
            }
            return ret;
        }

        compareCqms (prev, curr) {
            var ret = [];
            var change;
            prev.sort(function (a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
            curr.sort(function (a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
            var i, j;
            for (i = 0; i < prev.length; i++) {
                var obj = { cmsId: curr[i].cmsId, changes: [] };
                change = this.compareItem(prev[i], curr[i], 'success', 'Success');
                if (change) {
                    obj.changes.push('<li>' + change + '</li>');
                }
                for (j = 0; j < prev[i].allVersions.length; j++) {
                    if (prev[i].successVersions.indexOf(prev[i].allVersions[j]) < 0 && curr[i].successVersions.indexOf(prev[i].allVersions[j]) >= 0) {
                        obj.changes.push('<li>' + prev[i].allVersions[j] + ' added</li>');
                    }
                    if (prev[i].successVersions.indexOf(prev[i].allVersions[j]) >= 0 && curr[i].successVersions.indexOf(prev[i].allVersions[j]) < 0) {
                        obj.changes.push('<li>' + prev[i].allVersions[j] + ' removed</li>');
                    }
                }
                var criteriaKeys = [];
                var criteria = this.compareArray(prev[i].criteria, curr[i].criteria, criteriaKeys, 'certificationNumber');
                for (j = 0; j < criteria.length; j++) {
                    obj.changes.push('<li>Certification Criteria "' + criteria[j].name + '" changes<ul>' + criteria[j].changes.join('') + '</ul></li>');
                }
                if (obj.changes.length > 0) {
                    ret.push(obj);
                }
            }
            return ret;
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
    },
}

angular.module('chpl.admin')
    .component('chplReportsListings', ReportsListingsComponent);
