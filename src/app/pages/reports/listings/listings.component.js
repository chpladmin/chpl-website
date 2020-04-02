export const ReportsListingsComponent = {
    templateUrl: 'chpl.reports/listings/listings.html',
    bindings: {
        productId: '<',
    },
    controller: class ReportsListings {
        constructor ($filter, $log, $state, $uibModal, ReportService, authService, networkService, utilService) {
            'ngInject'
            this.$filter = $filter;
            this.$log = $log;
            this.$state = $state;
            this.$uibModal = $uibModal;
            this.ReportService = ReportService;
            this.authService = authService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.displayed = [];
            this.categoriesFilter = '|LISTING|';
            this.clearFilterHs = [];
            this.restoreStateHs = [];
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
            this.filterText = '';
            this.tableController = {};
            this.loadProgress = {
                total: 0,
                complete: 0,
            };
            this.downloadProgress = 0;
            this.results = [];
            this.pageSize = 50;
        }

        $onInit () {
            let that = this;
            let user = this.authService.getCurrentUser();
            this.networkService.getSearchOptions()
                .then(options => {
                    that.acbItems = options.acbs
                        .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0)
                        .map(a => {
                            let ret = {
                                value: a.name,
                            };
                            if (a.retired) {
                                ret.display = a.name + ' (Retired)';
                                ret.retired = true;
                                ret.selected = ((new Date()).getTime() - a.retirementDate) < (1000 * 60 * 60 * 24 * 30 * 4);
                            } else {
                                ret.selected = that.authService.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])
                                    || user.organizations.filter(o => o.name === a.name).length > 0;
                            }
                            return ret;
                        });
                });
        }

        $onChanges (changes) {
            if (changes.productId && changes.productId.currentValue) {
                this.productId = angular.copy(changes.productId.currentValue);
            }
            this.search();
        }

        $onDestroy () {
            this.isDestroyed = true;
        }

        onApplyFilter (filter) {
            let f = angular.fromJson(filter);
            if (f.productId) {
                this.productId = f.productId;
            } else {
                this.productId = undefined;
            }
            this.doFilter(f);
        }

        onClearFilter () {
            let filterData = {};
            if (this.productId) {
                filterData.productId = this.productId;
            }
            filterData.dataFilter = '';
            filterData.tableState = this.tableController.tableState();
            filterData.tableState.search.predicateObject.categoriesFilter = '|LISTING|';
            this.clearFilterHs.forEach(handler => handler());
            this.doFilter(filterData);
        }

        doFilter (filter) {
            let that = this;
            this.filterText = filter.dataFilter;
            if (filter.tableState.search.predicateObject.categoriesFilter) {
                this.tableController.search(filter.tableState.search.predicateObject.categoriesFilter, 'categoriesFilter');
            } else {
                this.tableController.search('|LISTING|', 'categoriesFilter');
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
            if (this.productId) {
                filterData.productId = this.productId;
            }
            filterData.dataFilter = this.filterText;
            filterData.tableState = this.tableController.tableState();
            return filterData;
        }

        tableStateListener (tableController) {
            this.tableController = tableController;
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
                var obj = { number: curr[i].number, title: curr[i].title, changes: [] };
                for (j = 0; j < certKeys.length; j++) {
                    change = this.ReportService.compareItem(prev[i], curr[i], certKeys[j].key, certKeys[j].display, certKeys[j].filter);
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
                var testChanges = this.compareTestStuff(prev[i], curr[i]);
                if (testChanges) {
                    obj.changes = obj.changes.concat(testChanges);
                }
                var testFunctionality = this.ReportService.compare(prev[i].testFunctionality, curr[i].testFunctionality, 'testFunctionality');
                if (testFunctionality.length > 0) {
                    obj.changes.push('<li>Test Functionality changes<ul>' + testFunctionality.join('') + '</li>');
                }
                var testToolsUsedKeys = [{key: 'testToolVersion', display: 'Test Tool Version'}];
                var testToolsUsed = this.ReportService.compareArray(prev[i].testToolsUsed, curr[i].testToolsUsed, testToolsUsedKeys, 'testToolName');
                for (j = 0; j < testToolsUsed.length; j++) {
                    obj.changes.push('<li>Test Tool Name "' + testToolsUsed[j].name + '" changes<ul>' + testToolsUsed[j].changes.join('') + '</ul></li>');
                }
                var testStandardsKeys = [{key: 'testStandardName', display: 'Test Standard Name'}];
                var testStandards = this.ReportService.compareArray(prev[i].testStandards, curr[i].testStandards, testStandardsKeys, 'testStandardName');
                for (j = 0; j < testStandards.length; j++) {
                    obj.changes.push('<li>Test Standard Description "' + testStandards[j].name + '" changes<ul>' + testStandards[j].changes.join('') + '</ul></li>');
                }
                if (prev[i].ucdProcesses) {
                    var ucdProcessesKeys = [{key: 'ucdProcessDetails', display: 'UCD Process Details'}];
                    var ucdProcesses = this.ReportService.compareArray(prev[i].ucdProcesses, curr[i].ucdProcesses, ucdProcessesKeys, 'ucdProcessName');
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

        compareCertificationEvents (prev, curr) {
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

        compareCqms (prev, curr) {
            var ret = [];
            var change;
            prev.sort(function (a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
            curr.sort(function (a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
            var i, j;
            for (i = 0; i < prev.length; i++) {
                var obj = { cmsId: curr[i].cmsId, changes: [] };
                change = this.ReportService.compareItem(prev[i], curr[i], 'success', 'Success');
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
                var criteria = this.ReportService.compareArray(prev[i].criteria, curr[i].criteria, criteriaKeys, 'certificationNumber');
                for (j = 0; j < criteria.length; j++) {
                    let name = criteria[j].name;
                    if (criteria[j].title && criteria[j].title.indexOf('Cures Update') > 0) {
                        name += ' (Cures Update)';
                    }
                    obj.changes.push('<li>Certification Criteria "' + name + '" changes<ul>' + criteria[j].changes.join('') + '</ul></li>');
                }
                if (obj.changes.length > 0) {
                    ret.push(obj);
                }
            }
            return ret;
        }

        compareSed (prev, curr) {
            var i, j, k, ret = [];

            var ucdProcessesKeys = [{key: 'details', display: 'UCD Process Details'}];
            var ucdProcessesNested = [
                {key: 'criteria', display: 'Certification Criteria', value: 'number', compareId: 'number'},
            ];
            var ucdProcesses = this.ReportService.compareArray(prev.ucdProcesses, curr.ucdProcesses, ucdProcessesKeys, 'name', ucdProcessesNested);
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
            var tasks = this.ReportService.compareArray(prev.testTasks, curr.testTasks, taskKeys, 'id', taskNested, 'description');
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
            var participants = this.ReportService.compareArray(prev.allParticipants, curr.allParticipants, testParticipantKeys, 'id');
            for (i = 0; i < participants.length; i++) {
                ret.push('<li>Participant changes<ul>' + participants[i].changes.join('') + '</ul></li>');
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
                                change = this.ReportService.compareItem(prev[i], curr[j], keys[k].key, keys[k].display, keys[k].filter);
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
                            var testParticipants = this.ReportService.compareArray(prev[i].testParticipants, curr[j].testParticipants, testParticipantKeys, 'testParticipantId');
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

        compareSurveillances (oldS, newS) {
            this.$uibModal.open({
                component: 'chplCompareSurveillances',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    oldSurveillance: () => oldS,
                    newSurveillance: () => newS,
                },
            });
        }

        compareTestStuff (prev, curr) {
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

        downloadReady () {
            return this.displayed.reduce((acc, activity) => activity.action && acc, true);
        }

        parse (meta) {
            return this.networkService.getActivityById(meta.id, {ignoreLoadingBar: true}).then(item => {
                var simpleCpFields = [
                    {key: 'acbCertificationId', display: 'ACB Certification ID'},
                    {key: 'accessibilityCertified', display: 'Accessibility Certified'},
                    {key: 'certificationDate', display: 'Certification Date', filter: 'date'},
                    {key: 'chplProductNumber', display: 'CHPL Product Number'},
                    {key: 'curesUpdate', display: '2015 Edition Cures Update status'},
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
                        change = this.ReportService.nestedCompare(item.originalData, item.newData, 'certificationStatus', 'name', 'Certification Status');
                        if (change) {
                            activity.details.push(change);
                        }
                    } else {
                        change = this.compareCertificationEvents(item.originalData.certificationEvents, item.newData.certificationEvents);
                        if (change && change.length > 0) {
                            activity.details.push(change);
                        }
                    }

                    for (j = 0; j < simpleCpFields.length; j++) {
                        change = this.ReportService.compareItem(item.originalData, item.newData, simpleCpFields[j].key, simpleCpFields[j].display, simpleCpFields[j].filter);
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
                    var accessibilityStandardsKeys = [];
                    var accessibilityStandards = this.ReportService.compareArray(item.originalData.accessibilityStandards, item.newData.accessibilityStandards, accessibilityStandardsKeys, 'accessibilityStandardName');
                    for (j = 0; j < accessibilityStandards.length; j++) {
                        activity.details.push('Accessibility Standard "' + accessibilityStandards[j].name + '" changes<ul>' + accessibilityStandards[j].changes.join('') + '</ul>');
                    }
                    certChanges = this.compareCerts(item.originalData.certificationResults, item.newData.certificationResults);
                    for (j = 0; j < certChanges.length; j++) {
                        activity.details.push('Certification "' + certChanges[j].number + (certChanges[j].title.indexOf('Cures Update') > 0 ? ' (Cures Update)' : '') + '" changes<ul>' + certChanges[j].changes.join('') + '</ul>');
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
                            var icsParents = this.ReportService.compareArray(item.originalData.ics.parents, item.newData.ics.parents, icsParentsKeys, 'chplProductNumber');
                            for (j = 0; j < icsParents.length; j++) {
                                activity.details.push('ICS Parent "' + icsParents[j].name + '" changes<ul>' + icsParents[j].changes.join('') + '</ul>');
                            }
                        }
                        if (item.originalData.ics.children) {
                            var icsChildrenKeys = [];
                            var icsChildren = this.ReportService.compareArray(item.originalData.ics.children, item.newData.ics.children, icsChildrenKeys, 'chplProductNumber');
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
                        var testingLabs = this.ReportService.compareArray(item.originalData.testingLabs, item.newData.testingLabs, testingLabsKeys, 'testingLabName');
                        for (j = 0; j < testingLabs.length; j++) {
                            activity.details.push('Testing Lab "' + testingLabs[j].name + '" changes<ul>' + testingLabs[j].changes.join('') + '</ul>');
                        }
                    }
                    var qmsStandards = this.ReportService.compare(item.originalData.qmsStandards, item.newData.qmsStandards, 'qmsStandards');
                    if (qmsStandards.length > 0) {
                        activity.details.push('QMS Standards changes<ul>' + qmsStandards.join('') + '</ul>');
                    }
                    if (item.originalData.sed && item.newData.sed) {
                        var sedChanges = this.compareSed(item.originalData.sed, item.newData.sed);
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
                                change = this.ReportService.compareItem(item.originalData.surveillance[j], item.newData.surveillance[j], simpleFields[k].key, simpleFields[k].display, simpleFields[k].filter);
                                if (change) { actions.push(change); }
                            }
                            for (k = 0; k < nestedKeys.length; k++) {
                                change = this.ReportService.nestedCompare(item.originalData.surveillance[j], item.newData.surveillance[j], nestedKeys[k].key, nestedKeys[k].subkey, nestedKeys[k].display, nestedKeys[k].filter);
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

        prepare (item, full) {
            item.filterText = item.developerName + '|' + item.productName + '|' + item.chplProductNumber
            item.categoriesFilter = '|' + item.categories.join('|') + '|';
            item.friendlyActivityDate = new Date(item.date).toISOString().substring(0, 10);
            item.friendlyCertificationDate = new Date(item.certificationDate).toISOString().substring(0, 10);
            if (full) {
                this.parse(item);
                item.showDetails = true;
            }
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
                        this.downloadProgress = Math.floor(100 * ((progress + 1) / total));
                    });
                });
            //todo, eventually: use the $q.all function as demonstrated in product history eye
        }

        showLoadingBar () {
            let tableState = this.tableController.tableState && this.tableController.tableState();
            let earlyDate = 0;
            let startDate = new Date().getTime();
            if (tableState && tableState.search.predicateObject.date) {
                earlyDate = tableState.search.predicateObject.date.after;
            }
            let earliestDateOfData = this.results
                .map(evt => evt.date)
                .reduce((acc, cur) => cur < acc ? cur : acc, startDate);
            let shouldShow = (this.loadProgress.total > 0) && (this.loadProgress.percentage < 100) && (!earlyDate || earliestDateOfData > earlyDate);
            return shouldShow;
        }

        searchAllListings () {
            let that = this;
            this.networkService.getActivityMetadata('beta/listings')
                .then(results => {
                    that.results = results.activities
                        .map(item => that.prepare(item));
                    that.loadProgress.total = (Math.floor(results.resultSetSize / results.pageSize) + (results.resultSetSize % results.pageSize === 0 ? 0 : 1))
                    let filter = {};
                    filter.dataFilter = '';
                    filter.tableState = this.tableController.tableState();
                    filter.tableState.search.predicateObject.categoriesFilter = '|LISTING|';
                    filter.tableState.search.predicateObject.date = {
                        after: new Date().getTime() - 60 * 24 * 60 * 60 * 1000,
                        before: new Date().getTime(),
                    };
                    that.doFilter(filter);
                    that.addPageToData(1);
                });
        }

        addPageToData (page) {
            let that = this;
            if (this.isDestroyed) { return }
            this.networkService.getActivityMetadata('beta/listings', {pageNum: page, ignoreLoadingBar: true}).then(results => {
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

        searchSingleProductId () {
            let that = this;
            this.networkService.getSingleListingActivityMetadata(this.productId)
                .then(results => {
                    that.results = results
                        .map(item => that.prepare(item, true));
                });
        }

        search () {
            if (this.productId) {
                this.searchSingleProductId();
            } else {
                this.searchAllListings();
            }
        }
    },
}

angular.module('chpl.reports')
    .component('chplReportsListings', ReportsListingsComponent);
