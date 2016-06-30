;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('ReportController', ['$log', '$filter', 'commonService', 'authService', function($log, $filter, commonService, authService) {
            var vm = this;
            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.isChplAdmin = authService.isChplAdmin();
            vm.tab = 'cp';
            vm.activityRange = 60;
            vm.questionableRange = 0;

            vm.refreshActivity = refreshActivity;
            vm.changeTab = changeTab;
            vm.refreshCp = refreshCp;
            vm.refreshDeveloper = refreshDeveloper;
            vm.refreshProduct = refreshProduct;
            vm.refreshAcb = refreshAcb;
            vm.refreshAtl = refreshAtl;
            vm.refreshAnnouncement = refreshAnnouncement;
            vm.refreshUser = refreshUser;
            vm.refreshApi = refreshApi;
            vm.refreshVisitors = refreshVisitors;
            vm.singleCp = singleCp;

            activate();

            ////////////////////////////////////////////////////////////////////
            // Functions

            function activate () {
                vm.visibleApiPage = 1;
                vm.apiKeyPageSize = 100;
                vm.refreshActivity();
                vm.refreshVisitors();
            }

            function refreshActivity () {
                if (vm.productId) {
                    vm.singleCp();
                } else {
                    vm.refreshCp();
                }
                vm.refreshDeveloper();
                vm.refreshProduct();
                vm.refreshAcb();
                vm.refreshAtl();
                vm.refreshAnnouncement();
                vm.refreshUser();
                vm.refreshApi();
            }

            function refreshCp () {
                commonService.getCertifiedProductActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedCertifiedProducts = interpretCps(data);
                        vm.displayedCertifiedProducts = [].concat(vm.searchedCertifiedProducts);
                    });
            }

            function refreshDeveloper () {
                commonService.getDeveloperActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedDevelopers = interpretDevelopers(data);
                        vm.displayedDevelopers = [].concat(vm.searchedDevelopers);
                    });
            }

            function refreshProduct () {
                commonService.getProductActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedProducts = vm.interpretProducts(data);
                        vm.displayedProducts = [].concat(vm.searchedProducts);
                    });
                commonService.getVersionActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedVersions = vm.interpretVersions(data);
                        vm.displayedVersions = [].concat(vm.searchedVersions);
                    });
            }

            function refreshAcb () {
                commonService.getAcbActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedACBs = vm.interpretAcbs(data);
                        vm.displayedACBs = [].concat(vm.searchedACBs);
                    });
            }

            function refreshAtl () {
                commonService.getAtlActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedATLs = vm.interpretAtls(data);
                        vm.displayedATLs = [].concat(vm.searchedATLs);
                    });
            }

            function refreshAnnouncement () {
                commonService.getAnnouncementActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedAnnouncements = vm.interpretAnnouncements(data);
                        vm.displayedAnnouncements = [].concat(vm.searchedAnnouncements);
                    });
            }

            function refreshUser () {
                if (vm.isChplAdmin) {
                    commonService.getUserActivity(vm.activityRange)
                        .then(function (data) {
                            vm.searchedUsers = vm.interpretUsers(data);
                            vm.displayedUsers = [].concat(vm.searchedUsers);
                        });
                    commonService.getUserActivities(vm.activityRange)
                        .then(function (data) {
                            vm.searchedUserActivities = vm.interpretUserActivities(data);
                            vm.displayedUserActivities = [].concat(vm.searchedUserActivities);
                        });
                }
            }

            function refreshApi () {
                if (vm.isChplAdmin) {
                    commonService.getApiUserActivity(vm.activityRange)
                        .then(function (data) {
                            vm.searchedApiActivity = data;
                            vm.displayedApiActivity = [].concat(vm.searchedApiActivity);
                        });
                    vm.apiKeyPageNum = vm.visibleApiPage - 1;
                    commonService.getApiActivity(vm.apiKeyPageNum,vm.apiKeyPageSize)
                        .then(function (data) {
                            vm.searchedApi = data;
                        });
                }
            }

            function refreshVisitors () {
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAvKGCCgw&format=data-table','')
                    .then(function (data) {
                        vm.browserVariety.data = data;
                    });
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA2uOGCgw&format=data-table','')
                    .then(function (data) {
                        vm.country.data = data;
                        vm.map.data = data;
                    });
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICAmdKFCgw&format=data-table','')
                    .then(function (data) {
                        vm.cities.data = data;
                        vm.cityMap.data = data;
                    });
                commonService.externalApiCall('https://openchpl.appspot.com/query?id=agpzfm9wZW5jaHBschULEghBcGlRdWVyeRiAgICA7bGDCgw&format=data-table','')
                    .then(function (data) {
                        data.cols[0].type = 'date';
                        var date;
                        for (var i = 0; i < data.rows.length; i++) {
                            date = data.rows[i].c[0].v;
                            data.rows[i].c[0].v = new Date(date.substring(0,4),
                                                           parseInt(date.substring(4,6)) - 1,
                                                           date.substring(6,8));
                        }
                        vm.traffic.data = data;
                    });
            }

            function singleCp () {
                commonService.getSingleCertifiedProductActivity(vm.productId)
                    .then(function (data) {
                        vm.searchedCertifiedProducts = interpretCps(data);
                        vm.displayedCertifiedProducts = [].concat(vm.searchedCertifiedProducts);
                    });
            }

            function changeTab(newTab) {
                switch (newTab) {
                case 'cp':
                    vm.refreshCp();
                    break;
                case 'dev':
                    vm.refreshDeveloper();
                    break;
                case 'prod':
                    vm.refreshProduct();
                    break;
                case 'acb':
                    vm.refreshAcb();
                    break;
                case 'users':
                    vm.refreshUser();
                    break;
                case 'visitors':
                    vm.refreshVisitors();
                    break;
                }
                vm.tab = newTab;
            }

            ////////////////////////////////////////////////////////////////////
            // Chart options

            vm.browserVariety = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by browser (last 7 days)'
                }
            };
            vm.cities = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by city (last 7 days)'
                }
            };
            vm.country = {
                type: 'PieChart',
                options: {
                    is3D: true,
                    title: 'Visitors by country (last 7 days)'
                }
            };
            vm.traffic = {
                type: 'LineChart',
                options: {
                    legend: { position: 'none' },
                    hAxis: {
                        slantedText: true
                    },
                    title: 'Visitors for the last 14 days'
                }
            };
            vm.map = {
                type: 'GeoChart',
                options: {
                }
            };
            vm.cityMap = {
                type: 'GeoChart',
                options: {
                    region: 'US',
                    displayMode: 'markers'
                }
            };

            ////////////////////////////////////////////////////////////////////
            // Helper functions

            function interpretCps (data) {
                var simpleCpFields = [
                    {key: 'acbCertificationId', display: 'ACB Certification ID'},
                    {key: 'accessibilityCertified', display: 'Accessibility Certified'},
                    {key: 'certificationDate', display: 'Certification Date', filter: 'date'},
                    {key: 'chplProductNumber', display: 'CHPL Product Number'},
                    {key: 'ics', display: 'ICS Status'},
                    {key: 'lastModifiedDate', display: 'Last Modified Date', filter: 'date'},
                    {key: 'otherAcb', display: 'Other ONC-ACB'},
                    {key: 'productAdditionalSoftware', display: 'Product-wide Additional Software'},
                    {key: 'reportFileLocation', display: 'ATL Test Report File Location'},
                    {key: 'sedIntendedUserDescription', display: 'SED Intended User Description'},
                    {key: 'sedReportFileLocation', display: 'SED Report File Location'},
                    {key: 'sedTesting', display: 'SED Tested'},
                    {key: 'sedTestingEnd', display: 'SED Testing End Date', filter: 'date'},
                    {key: 'termsOfUse', display: 'Terms Of Use'},
                    {key: 'transparencyAttestationUrl', display: 'Mandatory Disclosures URL'},
                    {key: 'visibleOnChpl', display: 'Visible on CHPL'}
                ];
                var nestedKeys = [
                    {key: 'certificationStatus', subkey: 'name', display: 'Certification Status', questionable: true},
                    {key: 'certifyingBody', subkey: 'name', display: 'Certifying Body'},
                    {key: 'classificationType', subkey: 'name', display: 'Classification Type'},
                    {key: 'practiceType', subkey: 'name', display: 'Practice Type'},
                    {key: 'testingLab', subkey: 'name', display: 'Testing Lab'}
                ];
                var ret = [];
                var change;
                var questionable;

                if (!String.prototype.startsWith) {
                    String.prototype.startsWith = function(searchString, position){
                        position = position || 0;
                        return this.substr(position, searchString.length) === searchString;
                    };
                }
                for (var i = 0; i < data.length; i++) {
                    var activity = {
                        date: data[i].activityDate,
                        newId: data[i].id,
                        acb: ''
                    };
                    if (data[i].description === 'Created a certified product') {
                        activity.action = 'Created certified product <a href="#/product/' + data[i].newData.id + '">' + data[i].newData.chplProductNumber + '</a>';
                        activity.acb = data[i].newData.certifyingBody.name;
                    } else if (data[i].description.startsWith('Updated certified')) {
                        questionable = data[i].activityDate > data[i].newData.certificationDate + (vm.questionableRange * 24 * 60 * 60 * 1000);
                        activity.action = 'Updated certified product <a href="#/product/' + data[i].newData.id + '">' + data[i].newData.chplProductNumber + '</a>';
                        activity.acb = data[i].newData.certifyingBody.name;
                        if (data[i].newData.certificationEdition.name === '2011')
                            activity.action = '<span class="bg-danger">' + activity.action + '</span>';
                        activity.details = [];
                        for (var j = 0; j < simpleCpFields.length; j++) {
                            change = compareItem(data[i].originalData, data[i].newData, simpleCpFields[j].key, simpleCpFields[j].display, simpleCpFields[j].filter);
                            if (change) activity.details.push(change);
                        }
                        for (var j = 0; j < nestedKeys.length; j++) {
                            change = nestedCompare(data[i].originalData, data[i].newData, nestedKeys[j].key, nestedKeys[j].subkey, nestedKeys[j].display, nestedKeys[j].filter);
                            if (change)
                                if (nestedKeys[j].questionable && questionable) {
                                    activity.details.push('<span class="bg-danger"><strong>' + change + '</strong></span>');
                                } else {
                                    activity.details.push(change);
                                }
                        }
                        var certChanges = compareCerts(data[i].originalData.certificationResults, data[i].newData.certificationResults, questionable);
                        for (var j = 0; j < certChanges.length; j++) {
                            activity.details.push('Certification "' + certChanges[j].number + '" changes<ul>' + certChanges[j].changes.join('') + '</ul>');
                        }
                        var cqmChanges = compareCqms(data[i].originalData.cqmResults, data[i].newData.cqmResults, questionable);
                        for (var j = 0; j < cqmChanges.length; j++) {
                            activity.details.push('CQM "' + cqmChanges[j].cmsId + '" changes<ul>' + cqmChanges[j].changes.join('') + '</ul>');
                        }
                        var qmsStandardsKeys = [{key: 'qmsModification', display: 'QMS Modification'}, {key: 'applicableCriteria', display: 'Applicable Criteria'}];
                        var qmsStandards = compareArray(data[i].originalData.qmsStandards, data[i].newData.qmsStandards, qmsStandardsKeys, 'qmsStandardName');
                        for (var j = 0; j < qmsStandards.length; j++) {
                            activity.details.push('QMS Standard "' + qmsStandards[j].name + '" changes<ul>' + qmsStandards[j].changes.join('') + '</ul>');
                        }
                        var targetedUsersKeys = [];
                        var targetedUsers = compareArray(data[i].originalData.targetedUsers, data[i].newData.targetedUsers, targetedUsersKeys, 'targetedUserName');
                        for (var j = 0; j < targetedUsers.length; j++) {
                            activity.details.push('Targeted User "' + targetedUsers[j].name + '" changes<ul>' + targetedUsers[j].changes.join('') + '</ul>');
                        }
                        if (activity.details.length === 0) delete activity.details;
                    } else if (data[i].description.startsWith('A corrective action plan for')) {
                        var cpNum = data[i].description.split(' ')[7];
                        if (data[i].description.endsWith('created.')) {
                            cpNum = data[i].description.split(' ')[5];
                            activity.action = 'Created corrective action plan for certified product <a href="#/product/' + data[i].newData.certifiedProductId + '">' + cpNum + '</a>';
                            activity.acb = data[i].newData.acbName;
                        } else if (data[i].description.endsWith('deleted.')) {
                            activity.action = 'Deleted corrective action plan for certified product <a href="#/product/' + data[i].originalData.certifiedProductId + '">' + cpNum + '</a>';
                            activity.acb = data[i].originalData.acbName;
                        } else if (data[i].description.endsWith('updated.')) {
                            activity.action = 'Updated corrective action plan for certified product <a href="#/product/' + data[i].newData.certifiedProductId + '">' + cpNum + '</a>';
                            activity.acb = data[i].newData.acbName;
                            var capFields = [
                                {key: 'actualCompletionDate', display: 'Was Completed', filter: 'date'},
                                {key: 'approvalDate', display: 'Plan Approved', filter: 'date'},
                                {key: 'developerExplanation', display: 'Developer Explanation'},
                                {key: 'nonComplianceDeterminationDate', display: 'Date of Determination', filter: 'date'},
                                {key: 'requiredCompletionDate', display: 'Must Be Completed', filter: 'date'},
                                {key: 'resolution', display: 'Description of Resolution'},
                                {key: 'startDate', display: 'Action Began', filter: 'date'},
                                {key: 'summary', display: 'Summary of Non-conformity'},
                                {key: 'surveillanceEndDate', display: 'Surveillance Ended', filter: 'date'},
                                {key: 'surveillanceResult', display: 'Result of Randomized Surveillance'},
                                {key: 'surveillanceStartDate', display: 'Surveillance Began', filter: 'date'}
                            ];
                            activity.details = [];
                            for (var j = 0; j < capFields.length; j++) {
                                change = compareItem(data[i].originalData, data[i].newData, capFields[j].key, capFields[j].display, capFields[j].filter);
                                if (change) activity.details.push(change);
                            }
                            var certChanges = compareCapCerts(data[i].originalData.certifications, data[i].newData.certifications);
                            for (var j = 0; j < certChanges.length; j++) {
                                activity.details.push('Certification "' + certChanges[j].number + '" changes<ul>' + certChanges[j].changes.join('') + '</ul>');
                            }
                        } else {
                            activity.action = data[i].description;
                        }
                    } else if (data[i].description.startsWith('Documentation was added to ')) {
                        var cpNum = data[i].description.split(' ');
                        cpNum[cpNum.length - 1] = '<a href="#/product/' + data[i].newData.certifiedProductId + '">' + cpNum[cpNum.length - 1] + '</a>';
                        activity.action = cpNum.join(' ');
                        activity.acb = data[i].newData.acbName;
                    } else if (data[i].description.startsWith('Documentation was removed from ')) {
                        var cpNum = data[i].description.split(' ');
                        cpNum[cpNum.length - 1] = '<a href="#/product/' + data[i].newData.certifiedProductId + '">' + cpNum[cpNum.length - 1] + '</a>';
                        activity.action = cpNum.join(' ');
                        activity.acb = data[i].newData.acbName;
                    } else if (data[i].description.startsWith('Updated information for certification')) {
                        activity.action = data[i].description;
                        var capFields = [
                            {key: 'developerExplanation', display: 'Developer Explanation'},
                            {key: 'numSitesPassed', display: 'Number of sites passed'},
                            {key: 'numSitesTotal', display: 'Total number of sites'},
                            {key: 'resolution', display: 'Description of Resolution'},
                            {key: 'summary', display: 'Summary of Non-conformity'}
                        ];
                        activity.details = [];
                        for (var j = 0; j < capFields.length; j++) {
                            change = compareItem(data[i].originalData, data[i].newData, capFields[j].key, capFields[j].display, capFields[j].filter);
                            if (change) activity.details.push(change);
                        }
                    } else {
                        activity.action = data[i].description;
                    }
                    ret.push(activity);
                }
                return ret;
            }

            function compareCerts (prev, curr, questionable) {
                var ret = [];
                var change;
                var certKeys = [
                    {key: 'apiDocumentation', display: 'API Documentation'},
                    {key: 'g1Success', display: 'Certified to G1', questionable: true},
                    {key: 'g2Success', display: 'Certified to G2', questionable: true},
                    {key: 'gap', display: 'GAP Tested', questionable: true},
                    {key: 'privacySecurityFramework', display: 'Privacy &amp; Security Framework'},
                    {key: 'sed', display: 'SED tested'},
                    {key: 'success', display: 'Successful', questionable: true}
                ];
                prev.sort(function(a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
                curr.sort(function(a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
                for (var i = 0; i < prev.length; i++) {
                    var obj = { number: curr[i].number, changes: [] };
                    for (var j = 0; j < certKeys.length; j++) {
                        change = compareItem(prev[i], curr[i], certKeys[j].key, certKeys[j].display, certKeys[j].filter);
                        if (change)
                            if (certKeys[j].questionable && questionable) {
                                obj.changes.push('<li class="bg-danger"><strong>' + change + '</strong></li>');
                            } else {
                                obj.changes.push('<li>' + change + '</li>');
                            }
                    }
                    var addlSwKeys = [
                        {key: 'version', display: 'Version'},
                        {key: 'grouping', display: 'Grouping'},
                        {key: 'certifiedProductNumber', display: 'CHPL Product Number'},
                        {key: 'justification', display: 'Justification'}
                    ];
                    var addlSw = compareArray(prev[i].additionalSoftware, curr[i].additionalSoftware, addlSwKeys, 'name');
                    for (var j = 0; j < addlSw.length; j++) {
                        obj.changes.push('<li>Additional software "' + addlSw[j].name + '" changes<ul>' + addlSw[j].changes.join('') + '</ul></li>');
                    }
                    var testProceduresKeys = [];
                    var testProcedures = compareArray(prev[i].testProcedures, curr[i].testProcedures, testProceduresKeys, 'testProcedureVersion');
                    for (var j = 0; j < testProcedures.length; j++) {
                        obj.changes.push('<li>Test Procedure Version "' + testProcedures[j].name + '" changes<ul>' + testProcedures[j].changes.join('') + '</ul></li>');
                    }
                    var testDataUsedKeys = [{key: 'alteration', display: 'Data Alteration'}];
                    var testDataUsed = compareArray(prev[i].testDataUsed, curr[i].testDataUsed, testDataUsedKeys, 'version');
                    for (var j = 0; j < testDataUsed.length; j++) {
                        obj.changes.push('<li>Test Data Version "' + testDataUsed[j].name + '" changes<ul>' + testDataUsed[j].changes.join('') + '</ul></li>');
                    }
                    var testFunctionalityKeys = [];
                    var testFunctionality = compareArray(prev[i].testFunctionality, curr[i].testFunctionality, testFunctionalityKeys, 'number');
                    for (var j = 0; j < testFunctionality.length; j++) {
                        obj.changes.push('<li>Test Functionality Number "' + testFunctionality[j].name + '" changes<ul>' + testFunctionality[j].changes.join('') + '</ul></li>');
                    }
                    var testToolsUsedKeys = [{key: 'testToolVersion', display: 'Test Tool Version'}];
                    var testToolsUsed = compareArray(prev[i].testToolsUsed, curr[i].testToolsUsed, testToolsUsedKeys, 'testToolName');
                    for (var j = 0; j < testToolsUsed.length; j++) {
                        obj.changes.push('<li>Test Tool Name "' + testToolsUsed[j].name + '" changes<ul>' + testToolsUsed[j].changes.join('') + '</ul></li>');
                    }
                    var testStandardsKeys = [{key: 'testStandardName', display: 'Test Standard Name'}];
                    var testStandards = compareArray(prev[i].testStandards, curr[i].testStandards, testStandardsKeys, 'testStandardName');
                    for (var j = 0; j < testStandards.length; j++) {
                        obj.changes.push('<li>Test Standard Description "' + testStandards[j].name + '" changes<ul>' + testStandards[j].changes.join('') + '</ul></li>');
                    }
                    var ucdProcessesKeys = [{key: 'ucdProcessDetails', display: 'UCD Process Details'}];
                    var ucdProcesses = compareArray(prev[i].ucdProcesses, curr[i].ucdProcesses, ucdProcessesKeys, 'ucdProcessName');
                    for (var j = 0; j < ucdProcesses.length; j++) {
                        obj.changes.push('<li>UCD Process Name "' + ucdProcesses[j].name + '" changes<ul>' + ucdProcesses[j].changes.join('') + '</ul></li>');
                    }
                    var testTasks = compareSedTasks(prev[i].testTasks, curr[i].testTasks);
                    for (var j = 0; j < testTasks.length; j++) {
                        obj.changes.push('<li>SED Test Task "' + testTasks[j].name + '" changes<ul>' + testTasks[j].changes.join('') + '</ul></li>');
                    }
                    if (obj.changes.length > 0)
                        ret.push(obj);
                }
                return ret;
            }

            function compareCapCerts (prev, curr) {
                var ret = [];
                var change;
                var certKeys = [
                    {key: 'acbSummary', display: 'ONC-ACB Summary'},
                    {key: 'developerSummary', display: 'Developer Summary'},
                    {key: 'resolution', display: 'Resolution'},
                    {key: 'surveillancePassRate', display: 'Pass Rate'},
                    {key: 'surveillanceSitesSurveilled', display: 'Sites Surveilled'}
                ];
                prev.sort(function(a,b) {return (a.certificationCriterionNumber > b.certificationCriterionNumber) ? 1 : ((b.certificationCriterionNumber > a.certificationCriterionNumber) ? -1 : 0);} );
                curr.sort(function(a,b) {return (a.certificationCriterionNumber > b.certificationCriterionNumber) ? 1 : ((b.certificationCriterionNumber > a.certificationCriterionNumber) ? -1 : 0);} );
                for (var i = 0; i < prev.length; i++) {
                    var obj = { number: curr[i].certificationCriterionNumber, changes: [] };
                    for (var j = 0; j < certKeys.length; j++) {
                        change = compareItem(prev[i], curr[i], certKeys[j].key, certKeys[j].display, certKeys[j].filter);
                        if (change) {
                            obj.changes.push('<li>' + change + '</li>');
                        }
                    }
                    if (obj.changes.length > 0)
                        ret.push(obj);
                }
                return ret;
            }

            function compareSedTasks (prev, curr) {
                var ret = [];
                var change;
                var keys = [
                    {key: 'taskPathDeviationObserved', display: 'Path Deviation Observed'},
                    {key: 'taskPathDeviationOptimal', display: 'Path Deviation Optimal'},
                    {key: 'taskRatingScale', display: 'Rating Scale'},
                    {key: 'taskTimeAvg', display: 'Time Average'},
                    {key: 'taskTimeDeviationObservedAvg', display: 'Time Deviation Observed Average'},
                    {key: 'taskTimeDeviationOptimalAvg', display: 'Time Deviation Optimal Average'},
                    {key: 'taskTimeStddev', display: 'Time Standard Deviation'}
                ];
                if (prev !== null) {
                    prev.sort(function(a,b) {return (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0);} );
                    curr.sort(function(a,b) {return (a.description > b.description) ? 1 : ((b.description > a.description) ? -1 : 0);} );
                    for (var i = 0; i < prev.length; i++) {
                        for (var j = 0; j < curr.length; j++) {
                            if (prev[i].description === curr[j].description) {
                                var obj = { name: curr[j].description, changes: [] };
                                for (var k = 0; k < keys.length; k++) {
                                    change = compareItem(prev[i], curr[j], keys[k].key, keys[k].display, keys[k].filter);
                                    if (change) obj.changes.push('<li>' + change + '</li>');
                                }
                                var testParticipantKeys = [
                                    {key: 'age', display: 'Age'},
                                    {key: 'assistiveTechnologyNeeds', display: 'Assistive Technology Needs'},
                                    {key: 'computerExperienceMonths', display: 'Computer Experience Months'},
                                    {key: 'educationTypeName', display: 'Education Type'},
                                    {key: 'gender', display: 'Gender'},
                                    {key: 'occupation', display: 'Occupation'},
                                    {key: 'productExperienceMonths', display: 'Product Experience (Months)'},
                                    {key: 'professionalExperienceMonths', display: 'Professional Experience (Months)'}
                                ];
                                var testParticipants = compareArray(prev[i].testParticipants, curr[j].testParticipants, testParticipantKeys, 'testParticipantId');
                                for (var k = 0; k < testParticipants.length; k++) {
                                    obj.changes.push('<li>Test Participant "' + testParticipants[k].name + '" changes<ul>' + testParticipants[k].changes.join('') + '</ul></li>');
                                }
                                if (obj.changes.length > 0)
                                    ret.push(obj);
                                prev[i].evaluated = true;
                                curr[j].evaluated = true;
                            }
                        }
                        if (!prev[i].evaluated) {
                            ret.push({ name: prev[i].description, changes: ['<li>Task removed</li>'] });
                        }
                    }
                    for (var i = 0; i < curr.length; i++) {
                        if (!curr[i].evaluated) {
                            ret.push({ name: curr[i].description, changes: ['<li>Task added</li>'] });
                        }
                    }
                }
                return ret;
            }

            function compareCqms (prev, curr, questionable) {
                var ret = [];
                var change;
                prev.sort(function(a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
                curr.sort(function(a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
                for (var i = 0; i < prev.length; i++) {
                    var obj = { cmsId: curr[i].cmsId, changes: [] };
                    change = compareItem(prev[i], curr[i], 'success', 'Success');
                    if (change)
                        if (questionable) {
                            obj.changes.push('<li class="bg-danger"><strong>' + change + '</strong></li>');
                        } else {
                            obj.changes.push('<li>' + change + '</li>');
                        }
                    for (var j = 0; j < prev[i].allVersions.length; j++) {
                        if (prev[i].successVersions.indexOf(prev[i].allVersions[j]) < 0 && curr[i].successVersions.indexOf(prev[i].allVersions[j]) >= 0)
                            obj.changes.push('<li>' + prev[i].allVersions[j] + ' added</li>');
                        if (prev[i].successVersions.indexOf(prev[i].allVersions[j]) >= 0 && curr[i].successVersions.indexOf(prev[i].allVersions[j]) < 0)
                            obj.changes.push('<li>' + prev[i].allVersions[j] + ' removed</li>');
                    }
                    if (obj.changes.length > 0)
                        ret.push(obj);
                }
                return ret;
            }

            function interpretDevelopers (data) {
                var simpleFields = [
                    {key: 'deleted', display: 'Deleted'},
                    {key: 'developerCode', display: 'Developer Code'},
                    {key: 'lastModifiedDate', display: 'Last Modified Date', filter: 'date'},
                    {key: 'name', display: 'Name'},
                    {key: 'website', display: 'Website'}
                ];
                var ret = [];
                var change;
                var questionable = true;

                for (var i = 0; i < data.length; i++) {
                    var activity = {
                        date: data[i].activityDate,
                        newId: data[i].id
                    };
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.action = 'Updated developer "' + data[i].newData.name + '"';
                        activity.details = [];
                        for (var j = 0; j < simpleFields.length; j++) {
                            change = compareItem(data[i].originalData, data[i].newData, simpleFields[j].key, simpleFields[j].display, simpleFields[j].filter);
                            if (change) activity.details.push(change);
                        }
                        var addressChanges = compareAddress(data[i].originalData.address, data[i].newData.address);
                        if (addressChanges && addressChanges.length > 0) {
                            activity.details.push('Address changes<ul>' + addressChanges.join('') + '</ul>');
                        }
                        var contactChanges = compareContact(data[i].originalData.contact, data[i].newData.contact);
                        if (contactChanges && contactChanges.length > 0) {
                            activity.details.push('Contact changes<ul>' + contactChanges.join('') + '</ul>');
                        }
                        var transKeys = [{key: 'transparencyAttestation', display: 'Transparency Attestation'}];
                        var trans = compareArray(data[i].originalData.transparencyAttestationMappings, data[i].newData.transparencyAttestationMappings, transKeys, 'acbName');
                        for (var j = 0; j < trans.length; j++) {
                            activity.details.push('Transparency Attestation "' + trans[j].name + '" changes<ul>' + trans[j].changes.join('') + '</ul>');
                        }
                        if (activity.details.length === 0) delete activity.details;
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'developer');
                    }
                    ret.push(activity);
                }
                return ret;
            }

            vm.interpretProducts = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        activity.action = 'Update:<ul>';
                        change = compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                        if (change) activity.action += '<li>' + change + '</li>';
                        change = compareItem(data[i].originalData, data[i].newData, 'developerName', 'Developer');
                        if (change) activity.action += '<li>' + change + '</li>';
                        activity.action += '</ul>';
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'product');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretVersions = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.productName;
                        activity.action = 'Update:<ul>';
                        change = compareItem(data[i].originalData, data[i].newData, 'version', 'Version');
                        if (change) activity.action += '<li>' + change + '</li>';
                        activity.action += '</ul>';
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'version', 'version');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretAcbs = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        if (data[i].originalData.deleted !== data[i].newData.deleted) {
                            activity.action = data[i].newData.deleted ? 'ACB was deleted' : 'ACB was restored';
                        } else {
                            activity.action = 'Update:<ul>';
                            change = compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                            if (change) activity.action += '<li>' + change + '</li>';
                            change = compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                            if (change) activity.action += '<li>' + change + '</li>';
                            change = compareAddress(data[i].originalData.address, data[i].newData.address);
                            if (change && change.length > 0) {
                                activity.action += '<li>Address changes<ul>' + change.join('') + '</ul></li>';
                            }
                            activity.action += '</ul>';
                        }
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'ACB');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretAtls = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        if (data[i].originalData.deleted !== data[i].newData.deleted) {
                            activity.action = data[i].newData.deleted ? 'ATL was deleted' : 'ATL was restored';
                        } else {
                            activity.action = 'Update:<ul>';
                            change = compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                            if (change) activity.action += '<li>' + change + '</li>';
                            change = compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                            if (change) activity.action += '<li>' + change + '</li>';
                             change = compareAddress(data[i].originalData.address, data[i].newData.address);
                            if (change && change.length > 0) {
                                activity.action += '<li>Address changes<ul>' + change.join('') + '</ul></li>';
                            }
                            activity.action += '</ul>';
                        }
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'ATL');
                    }
                    ret.push(activity);
                }
                return ret;
            };

            vm.interpretAnnouncements = function (data) {
                var ret = data;
                return ret;
            };

            vm.interpretUsers = function (data) {
                var ret = data;
                return ret;
            };

            vm.interpretUserActivities = function (data) {
                var ret = data;
                return ret;
            };

            vm.interpretNonUpdate = function (activity, data, text, key) {
                if (!key) key = 'name';
                if (data.originalData && !data.newData) { // no new data: deleted
                    activity.name = data.originalData[key];
                    activity.action = [activity.name + ' has been deleted'];
                }
                if (!data.originalData && data.newData) { // no old data: created
                    activity.name = data.newData[key];
                    activity.action = [activity.name + ' has been created'];
                }
                if (data.originalData && data.originalData.length > 1 && data.newData) { // both exist, more than one originalData: merge
                    activity.name = data.newData[key];
                    activity.action = ['Merged ' + data.originalData.length + ' ' + text + 's to form ' + text + ': ' + activity.name];
                }
            };

            function compareAddress (prev, curr) {
                var simpleFields = [
                    {key: 'streetLineOne', display: 'Street Line 1'},
                    {key: 'streetLineTwo', display: 'Street Line 2'},
                    {key: 'city', display: 'City'},
                    {key: 'state', display: 'State'},
                    {key: 'zipcode', display: 'Zipcode'},
                    {key: 'country', display: 'Country'}
                ];
                return compareObject(prev, curr, simpleFields);
            }

            function compareContact (prev, curr) {
                var simpleFields = [
                    {key: 'firstName', display: 'First Name'},
                    {key: 'lastName', display: 'Last Name'},
                    {key: 'phoneNumber', display: 'Phone Number'},
                    {key: 'title', display: 'Title'},
                    {key: 'email', display: 'Email'}
                ];
                return compareObject(prev, curr, simpleFields);
            }

            function compareObject (prev, curr, fields) {
                var ret = [];
                var change;

                for (var i = 0; i < fields.length; i++) {
                    change = compareItem(prev, curr, fields[i].key, fields[i].display, fields[i].filter);
                    if (change) ret.push('<li>' + change + '</li>');
                }
                return ret;
            }

            vm.analyzeAddress = function (activity, data) {
                if (data.originalData.address !== data.newData.address) {
                    var change;
                    activity.action += '<li>Address changes<ul>';
                    change = compareAddress(data.originalData.address, data.newData.address);
                    if (change && change.length > 0) {
                        activity.action += change.join('');
                    }
                    activity.action += '</ul></li>';
                }
            };

            function compareArray (prev, curr, keys, root) {
                var ret = [];
                var change;
                if (prev !== null) {
                    for (var i = 0; i < prev.length; i++) {
                        for (var j = 0; j < curr.length; j++) {
                            var obj = { name: curr[j][root], changes: [] };
                            if (prev[i][root] === curr[j][root]) {
                                for (var k = 0; k < keys.length; k++) {
                                    change = compareItem(prev[i], curr[j], keys[k].key, keys[k].display);
                                    if (change) obj.changes.push('<li>' + change + '</li>');
                                }
                                prev[i].evaluated = true;
                                curr[j].evaluated = true;
                            }
                            if (obj.changes.length > 0)
                                ret.push(obj);
                        }
                        if (!prev[i].evaluated) {
                            ret.push({ name: prev[i][root], changes: ['<li>' + prev[i][root] + ' removed</li>']});
                        }
                    }
                    for (var i = 0; i < curr.length; i++) {
                        if (!curr[i].evaluated) {
                            ret.push({ name: curr[i][root], changes: ['<li>' + curr[i][root] + ' added</li>']});
                        }
                    }
                }
                return ret;
            }

            function compareItem (oldData, newData, key, display, filter) {
                if (oldData && oldData[key] && newData && newData[key] && oldData[key] !== newData[key]) {
                    if (filter)
                        return display + ' changed from ' + $filter(filter)(oldData[key],'mediumDate','UTC') + ' to ' + $filter(filter)(newData[key],'mediumDate','UTC');
                    else
                        return display + ' changed from ' + oldData[key] + ' to ' + newData[key];
                }
                if ((!oldData || !oldData[key]) && newData && newData[key]) {
                    if (filter)
                        return display + ' added: ' + $filter(filter)(newData[key],'mediumDate','UTC');
                    else
                        return display + ' added: ' + newData[key];
                }
                if (oldData && oldData[key] && (!newData || !newData[key])) {
                    if (filter)
                        return display + ' removed. Was: ' + $filter(filter)(oldData[key],'mediumDate','UTC');
                    else
                        return display + ' removed. Was: ' + oldData[key];
                }
            }

            function nestedCompare (oldData, newData, key, subkey, display, filter) {
                return compareItem(oldData[key], newData[key], subkey, display, filter);
            }

        }])
        .directive('aiReports', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/reports.html',
                bindToController: { workType: '=',
                                    productId: '='},
                scope: {triggerRefresh: '&'},
                controllerAs: 'vm',
                controller: 'ReportController',
                link: function (scope, element, attr, ctrl) {
                    var handler = scope.triggerRefresh({
                        handler: function () {
                            ctrl.refreshActivity();
                        }
                    });
                    scope.$on('$destroy', handler);
                }
            };
        });
})();
