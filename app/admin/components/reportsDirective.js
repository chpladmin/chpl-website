;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('ReportController', ['$log', '$filter', 'commonService', 'authService', function($log, $filter, commonService, authService) {
            var vm = this;
            vm.isAcbAdmin = authService.isAcbAdmin();
            vm.isChplAdmin = authService.isChplAdmin();
            vm.tab = 'cp';
            vm.activityRange = 7;

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

            activate();

            ////////////////////////////////////////////////////////////////////
            // Functions

            function activate () {
                vm.visibleApiPage = 1;
                vm.apiKeyPageSize = 100;
                vm.refreshCp();
                vm.refreshVisitors();
            }

            function refreshActivity () {
                vm.refreshCp();
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
                        vm.searchedDevelopers = vm.interpretDevelopers(data);
                        vm.displayedDevelopers = [].concat(vm.searchedDevelopers);
                    });
            }

            function refreshProduct () {
                commonService.getProductActivity(vm.activityRange)
                    .then(function (data) {
                        vm.searchedProducts = vm.interpretProducts(data);
                        vm.displayedProducts = [].concat(vm.searchedProducts);
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
                    {key: 'transparencyAttestationUrl', display: 'Transparency Attestation URL'},
                    {key: 'visibleOnChpl', display: 'Visible on CHPL'}
                ];
                var nestedKeys = [
                    {key: 'certificationStatus', subkey: 'name', display: 'Certification Status'},
                    {key: 'certifyingBody', subkey: 'name', display: 'Certifying Body'},
                    {key: 'classificationType', subkey: 'name', display: 'Classification Type'},
                    {key: 'practiceType', subkey: 'name', display: 'Practice Type'},
                    {key: 'testingLab', subkey: 'name', display: 'Testing Lab'}
                ];
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {
                        date: data[i].activityDate,
                        newId: data[i].id
                    };
                    if (data[i].description === 'Created a certified product') {
                        activity.action = 'Created certified product <a href="#/product/' + data[i].newData.id + '">' + data[i].newData.chplProductNumber + '</a>';
                    } else if (data[i].description.substring(0,7) === 'Updated') {
                        activity.action = 'Updated certified product <a href="#/product/' + data[i].newData.id + '">' + data[i].newData.chplProductNumber + '</a>';
                        activity.details = [];
                        for (var j = 0; j < simpleCpFields.length; j++) {
                            change = compareItem(data[i].originalData, data[i].newData, simpleCpFields[j].key, simpleCpFields[j].display, simpleCpFields[j].filter);
                            if (change) activity.details.push(change);
                        }
                        for (var j = 0; j < nestedKeys.length; j++) {
                            change = nestedCompare(data[i].originalData, data[i].newData, nestedKeys[j].key, nestedKeys[j].subkey, nestedKeys[j].display, nestedKeys[j].filter);
                            if (change) activity.details.push(change);
                        }
                        var certChanges = compareCerts(data[i].originalData.certificationResults, data[i].newData.certificationResults);
                        for (var j = 0; j < certChanges.length; j++) {
                            activity.details.push('Certification "' + certChanges[j].number + '" changes<ul>' + certChanges[j].changes.join('') + '</ul>');
                        }
                        var cqmChanges = compareCqms(data[i].originalData.cqmResults, data[i].newData.cqmResults);
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
                    } else {
                        activity.action = data[i].description;
                    }
                    ret.push(activity);
                }
                return ret;
            }

            function compareCerts (prev, curr) {
                var ret = [];
                var change;
                var certKeys = [
                    {key: 'apiDocumentation', display: 'API Documentation'},
                    {key: 'g1Success', display: 'Certified to G1'},
                    {key: 'g2Success', display: 'Certified to G2'},
                    {key: 'gap', display: 'GAP Tested'},
                    {key: 'privacySecurityFramework', display: 'Privacy &amp; Security Framework'},
                    {key: 'sed', display: 'SED tested'},
                    {key: 'success', display: 'Successful'}
                ];
                prev.sort(function(a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
                curr.sort(function(a,b) {return (a.number > b.number) ? 1 : ((b.number > a.number) ? -1 : 0);} );
                for (var i = 0; i < prev.length; i++) {
                    var obj = { number: curr[i].number, changes: [] };
                    for (var j = 0; j < certKeys.length; j++) {
                        change = compareItem(prev[i], curr[i], certKeys[j].key, certKeys[j].display, certKeys[j].filter);
                        if (change) obj.changes.push('<li>' + change + '</li>');
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
                    var testStandards = compareArray(prev[i].testStandards, curr[i].testStandards, testStandardsKeys, 'testStandardNumber');
                    for (var j = 0; j < testStandards.length; j++) {
                        obj.changes.push('<li>Test Standard Number "' + testStandards[j].name + '" changes<ul>' + testStandards[j].changes.join('') + '</ul></li>');
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

            function compareCqms (prev, curr) {
                var ret = [];
                var change;
                prev.sort(function(a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
                curr.sort(function(a,b) {return (a.cmsId > b.cmsId) ? 1 : ((b.cmsId > a.cmsId) ? -1 : 0);} );
                for (var i = 0; i < prev.length; i++) {
                    var obj = { cmsId: curr[i].cmsId, changes: [] };
                    change = compareItem(prev[i], curr[i], 'success', 'Success');
                    if (change) obj.changes.push('<li>' + change + '</li>');
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

            vm.interpretDevelopers = function (data) {
                var ret = [];
                var change;

                for (var i = 0; i < data.length; i++) {
                    var activity = {date: data[i].activityDate};
                    if (data[i].originalData && !Array.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                        activity.name = data[i].newData.name;
                        activity.action = 'Update:<ul>';
                        change = compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                        if (change) activity.action += '<li>' + change + '</li>';
                        change = compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                        if (change) activity.action += '<li>' + change + '</li>';
                        vm.analyzeAddress(activity, data[i]);
                        activity.action += '</ul>';
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'developer');
                    }
                    ret.push(activity);
                }
                return ret;
            };

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
                        // check on developerId change
                        activity.action += '</ul>';
                    } else {
                        vm.interpretNonUpdate(activity, data[i], 'product');
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
                            vm.analyzeAddress(activity, data[i]);
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
                            vm.analyzeAddress(activity, data[i]);
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
                return data;
            };

            vm.interpretNonUpdate = function (activity, data, text) {
                if (data.originalData && !data.newData) { // no new data: deleted
                    activity.name = data.originalData.name;
                    activity.action = [activity.name + ' has been deleted'];
                }
                if (!data.originalData && data.newData) { // no old data: created
                    activity.name = data.newData.name;
                    activity.action = [activity.name + ' has been created'];
                }
                if (data.originalData && data.originalData.length > 1 && data.newData) { // both exist, more than one originalData: merge
                    activity.name = data.newData.name;
                    activity.action = ['Merged ' + data.originalData.length + ' ' + text + 's to form ' + text + ': ' + activity.name];
                }
            };

            vm.analyzeAddress = function (activity, data) {
                if (data.originalData.address !== data.newData.address) {
                    var change;
                    activity.action += '<li>Address changed:<ul>';
                    change = compareItem(data.originalData.address, data.newData.address, 'streetLineOne', 'Street Line 1');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'streetLineTwo', 'Street Line 2');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'city', 'City');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'state', 'State');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'zipcode', 'Zipcode');
                    if (change) activity.action += '<li>' + change + '</li>';
                    change = compareItem(data.originalData.address, data.newData.address, 'country', 'Country');
                    if (change) activity.action += '<li>' + change + '</li>';
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
                        return display + ' changed from ' + $filter(filter)(oldData[key]) + ' to ' + $filter(filter)(newData[key]);
                    else
                        return display + ' changed from ' + oldData[key] + ' to ' + newData[key];
                }
                if ((!oldData || !oldData[key]) && newData && newData[key]) {
                    if (filter)
                        return display + ' added: ' + $filter(filter)(newData[key]);
                    else
                        return display + ' added: ' + newData[key];
                }
                if (oldData && oldData[key] && (!newData || !newData[key])) {
                    if (filter)
                        return display + ' removed. Was: ' + $filter(filter)(oldData[key]);
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
                bindToController: { workType: '='},
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
