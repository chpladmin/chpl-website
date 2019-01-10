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
            this.activityRange.listing = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            if (this.productId) {
                this.activityRange.listing.startDate = new Date('4/1/2016');
            }
            this.activityRange.developer = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            this.activityRange.product = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            this.activityRange.cap = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            this.activityRange.acb = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            this.activityRange.atl = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            this.activityRange.announcement = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            this.activityRange.userActivity = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            this.activityRange.api_key = {
                startDate: angular.copy(start),
                endDate: angular.copy(end),
            };
            this.apiKey = {
                visiblePage: 1,
                pageSize: 100,
                startDate: angular.copy(this.activityRange.startDate),
                endDate: angular.copy(this.activityRange.endDate),
            };
            this.refreshActivity();
            this.filename = 'Reports_' + new Date().getTime() + '.csv';
        }

        $onChanges (changes) {
            if (!changes.workType.isFirstChange()) {
                let causeRefresh = false;
                if (changes.workType) {
                    this.workType = angular.copy(changes.workType.currentValue);
                    causeRefresh = true;
                }
                if (changes.productId) {
                    this.productId = angular.copy(changes.productId.currentValue);
                    causeRefresh = true;
                }
                if (causeRefresh) {
                    this.refreshActivity();
                }
            }
        }

        ////////////////////////////////////////////////////////////////////
        // Functions

        refreshActivity () {
            switch (this.workType) {
            case '':
            case 'cp-upload':
            case 'cp-status':
            case 'cp-surveillance':
            case 'cp-other':
                if (this.productId) {
                    this.singleCp();
                } else {
                    this.refreshCp();
                }
                break;
            case 'dev':
                this.refreshDeveloper();
                break;
            case 'prod':
                this.refreshProduct();
                break;
            case 'cap':
                this.refreshCap();
                break;
            case 'acb':
                this.refreshAcb();
                break;
            case 'atl':
                this.refreshAtl();
                break;
            case 'announcement':
                this.refreshAnnouncement();
                break;
            case 'users':
                this.refreshUser();
                break;
            case 'api_key_management':
                this.refreshApi();
                break;
            case 'api_key_usage':
                this.refreshApiKeyUsage();
                break;
                // no default
            }
        }

        refreshCp () {
            let ctrl = this;
            this.networkService.getCertifiedProductActivity(this.dateAdjust(this.activityRange.listing))
                .then(function (data) {
                    ctrl._interpretCps(data);
                    ctrl.displayedCertifiedProductsUpload = [].concat(ctrl.searchedCertifiedProductsUpload);
                    ctrl.displayedCertifiedProductsStatus = [].concat(ctrl.searchedCertifiedProductsStatus);
                    ctrl.displayedCertifiedProductsSurveillance = [].concat(ctrl.searchedCertifiedProductsSurveillance);
                    ctrl.displayedCertifiedProducts = [].concat(ctrl.searchedCertifiedProducts);
                });
        }

        refreshCap () {
            let ctrl = this;
            this.networkService.getCorrectiveActionPlanActivity(this.dateAdjust(this.activityRange.cap))
                .then(function (data) {
                    ctrl.searchedCertifiedProductsCAP = ctrl.interpretCaps(data);
                    ctrl.displayedCertifiedProductsCAP = [].concat(ctrl.searchedCertifiedProductsCAP);
                });
        }

        refreshDeveloper () {
            let ctrl = this;
            this.networkService.getDeveloperActivity(this.dateAdjust(this.activityRange.developer))
                .then(function (data) {
                    ctrl.searchedDevelopers = ctrl.interpretDevelopers(data);
                    ctrl.displayedDevelopers = [].concat(ctrl.searchedDevelopers);
                });
        }

        refreshProduct () {
            let ctrl = this;
            this.networkService.getProductActivity(this.dateAdjust(this.activityRange.product))
                .then(function (data) {
                    ctrl.searchedProducts = ctrl.interpretProducts(data);
                    ctrl.displayedProducts = [].concat(ctrl.searchedProducts);
                });
            this.networkService.getVersionActivity(this.dateAdjust(this.activityRange.product))
                .then(function (data) {
                    ctrl.searchedVersions = ctrl.interpretVersions(data);
                    ctrl.displayedVersions = [].concat(ctrl.searchedVersions);
                });
        }

        refreshAcb () {
            let ctrl = this;
            this.networkService.getAcbActivity(this.dateAdjust(this.activityRange.acb))
                .then(function (data) {
                    ctrl.searchedACBs = ctrl.interpretAcbs(data);
                    ctrl.displayedACBs = [].concat(ctrl.searchedACBs);
                });
        }

        refreshAtl () {
            let ctrl = this;
            this.networkService.getAtlActivity(this.dateAdjust(this.activityRange.atl))
                .then(function (data) {
                    ctrl.searchedATLs = ctrl.interpretAtls(data);
                    ctrl.displayedATLs = [].concat(ctrl.searchedATLs);
                });
        }

        refreshAnnouncement () {
            let ctrl = this;
            this.networkService.getAnnouncementActivity(this.dateAdjust(this.activityRange.announcement))
                .then(function (data) {
                    ctrl.searchedAnnouncements = ctrl.interpretAnnouncements(data);
                    ctrl.displayedAnnouncements = [].concat(ctrl.searchedAnnouncements);
                });
        }

        refreshUser () {
            let ctrl = this;
            this.networkService.getUserActivity(this.dateAdjust(this.activityRange.userActivity))
                .then(function (data) {
                    ctrl.searchedUsers = ctrl.interpretUsers(data);
                    ctrl.displayedUsers = [].concat(ctrl.searchedUsers);
                });
            this.networkService.getUserActivities(this.dateAdjust(this.activityRange.userActivity))
                .then(function (data) {
                    ctrl.searchedUserActivities = ctrl.interpretUserActivities(data);
                    ctrl.displayedUserActivities = [].concat(ctrl.searchedUserActivities);
                });
        }

        refreshApi () {
            let ctrl = this;
            this.networkService.getApiUserActivity(this.dateAdjust(this.activityRange.api_key))
                .then(function (data) {
                    ctrl.searchedApiActivity = data;
                    ctrl.displayedApiActivity = [].concat(ctrl.searchedApiActivity);
                });
        }

        refreshApiKeyUsage () {
            if (!this.apiKeys) {
                this.loadApiKeys();
            }
            let ctrl = this;
            this.apiKey.pageNumber = this.apiKey.visiblePage - 1;
            this.networkService.getApiActivity(this.dateAdjust(this.apiKey))
                .then(function (data) {
                    ctrl.searchedApi = data;
                });
        }

        clearApiKeyFilter () {
            this.apiKey = {
                visiblePage: 1,
                pageSize: 100,
                startDate: angular.copy(this.activityRange.startDate),
                endDate: angular.copy(this.activityRange.endDate),
            };
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

        loadApiKeys () {
            let ctrl = this;
            this.networkService.getApiUsers()
                .then(result => ctrl.apiKeys = result);
        }

        singleCp () {
            let ctrl = this;
            this.networkService.getSingleCertifiedProductActivity(this.productId)
                .then(function (data) {
                    ctrl._interpretCps(data);
                    ctrl.displayedCertifiedProductsUpload = [].concat(ctrl.searchedCertifiedProductsUpload);
                    ctrl.displayedCertifiedProductsStatus = [].concat(ctrl.searchedCertifiedProductsStatus);
                    ctrl.displayedCertifiedProductsSurveillance = [].concat(ctrl.searchedCertifiedProductsSurveillance);
                    ctrl.displayedCertifiedProducts = [].concat(ctrl.searchedCertifiedProducts);
                });
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

        /*
        if (!String.prototype.startsWith) {
            String.prototype.startsWith = function (searchString, position){
                var vm = this;
                position = position || 0;
                return this.substr(position, searchString.length) === searchString;
            };
        }

        if (!String.prototype.endsWith) {
            String.prototype.endsWith = function (searchString, position){
                var vm = this;
                position = position || 0;
                return this.substr(position) === searchString;
            };
        }
        */

        _interpretCps (data) {
            this.loadedCpActivity = data;
            var simpleCpFields = [
                {key: 'acbCertificationId', display: 'ACB Certification ID'},
                {key: 'accessibilityCertified', display: 'Accessibility Certified'},
                {key: 'certificationDate', display: 'Certification Date', filter: 'date'},
                {key: 'chplProductNumber', display: 'CHPL Product Number'},
                ///{key: 'lastModifiedDate', display: 'Last Modified Date', filter: 'date'},
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
                //{key: 'certificationStatus', subkey: 'name', display: 'Certification Status', questionable: true},
                {key: 'certifyingBody', subkey: 'name', display: 'Certifying Body'},
                {key: 'classificationType', subkey: 'name', display: 'Classification Type'},
                {key: 'ics', subkey: 'inherits', display: 'ICS Status'},
                {key: 'practiceType', subkey: 'name', display: 'Practice Type'},
                {key: 'testingLab', subkey: 'name', display: 'Testing Lab'},
            ];
            var output = {
                upload: [],
                status: [],
                surveillance: [],
                cap: [],
                other: [],
            };
            var change;

            var certChanges, chplNum, cpId, i, j, k, link;
            for (i = 0; i < data.length; i++) {
                var activity = {
                    date: data[i].activityDate,
                    newId: data[i].id,
                    acb: '',
                };
                activity.friendlyActivityDate = new Date(activity.date).toISOString().substring(0, 10);
                if (data[i].description === 'Created a certified product') {
                    activity.id = data[i].newData.id;
                    activity.chplProductNumber = data[i].newData.chplProductNumber;
                    activity.acb = data[i].newData.certifyingBody.name;
                    activity.developer = data[i].newData.developer.name;
                    activity.product = data[i].newData.product.name;
                    activity.certificationEdition = data[i].newData.certificationEdition.name;
                    activity.certificationDate = data[i].newData.certificationDate;
                    activity.friendlyCertificationDate = new Date(activity.certificationDate).toISOString().substring(0, 10);
                    output.upload.push(activity);
                } else if (data[i].description.startsWith('Updated certified')) {
                    activity.id = data[i].newData.id;
                    activity.chplProductNumber = data[i].newData.chplProductNumber;
                    activity.acb = data[i].newData.certifyingBody.name;
                    activity.developer = data[i].newData.developer.name;
                    activity.product = data[i].newData.product.name;
                    activity.certificationEdition = data[i].newData.certificationEdition.name;
                    activity.certificationDate = data[i].newData.certificationDate;
                    activity.friendlyCertificationDate = new Date(activity.certificationDate).toISOString().substring(0, 10);
                    activity.details = [];
                    var statusActivity, statusChange;
                    if (data[i].newData.certificationStatus) {
                        statusChange = this.nestedCompare(data[i].originalData, data[i].newData, 'certificationStatus', 'name', 'Certification Status');
                        if (statusChange) {
                            statusActivity = angular.copy(activity);
                            statusActivity.details = statusChange;
                            output.status.push(statusActivity);
                            activity.details.push(statusChange);
                        }
                    } else {
                        statusChange = this._compareCertificationEvents(data[i].originalData.certificationEvents, data[i].newData.certificationEvents);
                        if (statusChange && statusChange.length > 0) {
                            statusActivity = angular.copy(activity);
                            statusActivity.details = ('<ul>' + statusChange.map(function (s) { return '<li>' + s + '</li>';}).join('') + '</ul>');
                            output.status.push(statusActivity);
                            //activity.details.push(statusChange);
                        }
                    }

                    for (j = 0; j < simpleCpFields.length; j++) {
                        change = this.compareItem(data[i].originalData, data[i].newData, simpleCpFields[j].key, simpleCpFields[j].display, simpleCpFields[j].filter);
                        if (change) { activity.details.push(change); }
                    }
                    for (j = 0; j < nestedKeys.length; j++) {
                        change = this.nestedCompare(data[i].originalData, data[i].newData, nestedKeys[j].key, nestedKeys[j].subkey, nestedKeys[j].display, nestedKeys[j].filter);
                        if (change) {
                            activity.details.push(change);
                        }
                    }
                    var accessibilityStandardsKeys = [];
                    var accessibilityStandards = this.compareArray(data[i].originalData.accessibilityStandards, data[i].newData.accessibilityStandards, accessibilityStandardsKeys, 'accessibilityStandardName');
                    for (j = 0; j < accessibilityStandards.length; j++) {
                        activity.details.push('Accessibility Standard "' + accessibilityStandards[j].name + '" changes<ul>' + accessibilityStandards[j].changes.join('') + '</ul>');
                    }
                    certChanges = this.compareCerts(data[i].originalData.certificationResults, data[i].newData.certificationResults);
                    for (j = 0; j < certChanges.length; j++) {
                        activity.details.push('Certification "' + certChanges[j].number + '" changes<ul>' + certChanges[j].changes.join('') + '</ul>');
                    }
                    var cqmChanges = this.compareCqms(data[i].originalData.cqmResults, data[i].newData.cqmResults);
                    for (j = 0; j < cqmChanges.length; j++) {
                        activity.details.push('CQM "' + cqmChanges[j].cmsId + '" changes<ul>' + cqmChanges[j].changes.join('') + '</ul>');
                    }
                    if (typeof(data[i].originalData.ics) === 'object' &&
                        typeof(data[i].newData.ics) === 'object' &&
                        data[i].originalData.ics &&
                        data[i].newData.ics) {
                        if (data[i].originalData.ics.parents) {
                            var icsParentsKeys = [];
                            var icsParents = this.compareArray(data[i].originalData.ics.parents, data[i].newData.ics.parents, icsParentsKeys, 'chplProductNumber');
                            for (j = 0; j < icsParents.length; j++) {
                                activity.details.push('ICS Parent "' + icsParents[j].name + '" changes<ul>' + icsParents[j].changes.join('') + '</ul>');
                            }
                        }
                        if (data[i].originalData.ics.children) {
                            var icsChildrenKeys = [];
                            var icsChildren = this.compareArray(data[i].originalData.ics.children, data[i].newData.ics.children, icsChildrenKeys, 'chplProductNumber');
                            for (j = 0; j < icsChildren.length; j++) {
                                activity.details.push('ICS Child "' + icsChildren[j].name + '" changes<ul>' + icsChildren[j].changes.join('') + '</ul>');
                            }
                        }
                    }
                    if (data[i].originalData.meaningfulUseUserHistory) {
                        var meaningfulUseUserHistory = this.ReportService.compare(data[i].originalData.meaningfulUseUserHistory, data[i].newData.meaningfulUseUserHistory, 'meaningfulUseUserHistory');
                        if (meaningfulUseUserHistory.length > 0) {
                            activity.details.push('Meaningful use user history changes<ul>' + meaningfulUseUserHistory.join('') + '</ul>');
                        }
                    }
                    if (data[i].originalData.testingLabs) {
                        var testingLabsKeys = [];
                        var testingLabs = this.compareArray(data[i].originalData.testingLabs, data[i].newData.testingLabs, testingLabsKeys, 'testingLabName');
                        for (j = 0; j < testingLabs.length; j++) {
                            activity.details.push('Testing Lab "' + testingLabs[j].name + '" changes<ul>' + testingLabs[j].changes.join('') + '</ul>');
                        }
                    }
                    var qmsStandards = this.ReportService.compare(data[i].originalData.qmsStandards, data[i].newData.qmsStandards, 'qmsStandards');
                    if (qmsStandards.length > 0) {
                        activity.details.push('QMS Standards changes<ul>' + qmsStandards.join('') + '</ul>');
                    }
                    if (data[i].originalData.sed &&
                        data[i].newData.sed) {
                        var sedChanges = this._compareSed(data[i].originalData.sed, data[i].newData.sed);
                        if (sedChanges && sedChanges.length > 0) {
                            activity.details.push('SED Changes<ul>' + sedChanges.join('') + '</ul>');
                        }
                    }
                    var targetedUsers = this.ReportService.compare(data[i].originalData.targetedUsers, data[i].newData.targetedUsers, 'targetedUsers');
                    if (targetedUsers.length > 0) {
                        activity.details.push('Targeted Users changes:<ul>' + targetedUsers.join('') + '</ul>');
                    }
                    if (activity.details.length === 0) {
                        delete activity.details;
                    } else if (!statusChange || statusChange.length === 0 || (statusChange && activity.details.length > 1)) {
                        activity.csvDetails = activity.details.join('\n');
                        output.other.push(activity);
                    }
                } else if (data[i].description.startsWith('Surveillance')) {
                    cpId = data[i].newData.id;
                    chplNum = data[i].newData.chplProductNumber;
                    link = '<a href="#/product/' + cpId + '">' + chplNum + '</a>';
                    activity.acb = data[i].newData.certifyingBody.name;
                    activity.details = ['N/A'];
                    if (data[i].description.startsWith('Surveillance was delete')) {
                        activity.action = 'Surveillance was deleted from CHPL Product ' + link;
                    } else if (data[i].description.startsWith('Surveillance upload')) {
                        activity.action = 'Surveillance was uploaded for CHPL Product ' + link;
                    } else if (data[i].description.startsWith('Surveillance was added')) {
                        activity.action = 'Surveillance was added for CHPL Product ' + link;
                    } else if (data[i].description.startsWith('Surveillance was updated')) {
                        activity.action = 'Surveillance was updated for CHPL Product ' + link;
                        activity.details = [];
                        for (j = 0; j < data[i].originalData.surveillance.length; j++) {
                            var action = [data[i].originalData.surveillance[j].friendlyId + '<ul><li>'];
                            var actions = [];
                            var simpleFields = [
                                {key: 'endDate', display: 'End Date', filter: 'date'},
                                {key: 'friendlyId', display: 'Surveillance ID'},
                                {key: 'randomizedSitesUsed', display: 'Number of sites surveilled'},
                                {key: 'startDate', display: 'Start Date', filter: 'date'},
                            ];
                            nestedKeys = [
                                //{key: 'certificationStatus', subkey: 'name', display: 'Certification Status', questionable: true},
                                {key: 'type', subkey: 'name', display: 'Certification Type'},
                            ];
                            for (k = 0; k < simpleFields.length; k++) {
                                change = this.compareItem(data[i].originalData.surveillance[j], data[i].newData.surveillance[j], simpleFields[k].key, simpleFields[k].display, simpleFields[k].filter);
                                if (change) { actions.push(change); }
                            }
                            for (k = 0; k < nestedKeys.length; k++) {
                                change = this.nestedCompare(data[i].originalData.surveillance[j], data[i].newData.surveillance[j], nestedKeys[k].key, nestedKeys[k].subkey, nestedKeys[k].display, nestedKeys[k].filter);
                                if (change) {
                                    actions.push(change);
                                }
                            }
                            /*
                              if (!angular.equals(data[i].originalData.surveillance[j].requirements, data[i].newData.surveillance[j].requirements)) {
                              actions.push('Requirements changed');
                              }
                            */
                            if (actions.length === 0) {
                                activity.source = {
                                    oldS: data[i].originalData,
                                    newS: data[i].newData,
                                }
                            } else {
                                action += actions.join('</li><li>');
                                action += '</li></ul>';
                                activity.details.push(action);
                            }
                        }
                    } else {
                        activity.action = data[i].description + '<br />' + link;
                    }
                    output.surveillance.push(activity);
                } else if (data[i].description.startsWith('Documentation')) {
                    cpId = data[i].newData.id;
                    chplNum = data[i].newData.chplProductNumber;
                    link = '<a href="#/product/' + cpId + '">' + chplNum + '</a>';
                    activity.acb = data[i].newData.certifyingBody.name;
                    activity.details = ['N/A'];
                    activity.action = 'Documentation was added to a nonconformity for ' + link;
                    output.surveillance.push(activity);
                } else if (data[i].description.startsWith('A document was removed')) {
                    cpId = data[i].newData.id;
                    chplNum = data[i].newData.chplProductNumber;
                    link = '<a href="#/product/' + cpId + '">' + chplNum + '</a>';
                    activity.acb = data[i].newData.certifyingBody.name;
                    activity.details = ['N/A'];
                    activity.action = 'Documentation was removed from a nonconformity for ' + link;
                    output.surveillance.push(activity);
                } else {
                    activity.action = data[i].description;
                    output.other.push(activity);
                }
            }
            this.searchedCertifiedProductsUpload = output.upload;
            this.searchedCertifiedProductsStatus = output.status;
            this.searchedCertifiedProductsSurveillance = output.surveillance;
            this.searchedCertifiedProductsCAP = output.cap;
            this.searchedCertifiedProducts = output.other;
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

        compareCapCerts (prev, curr) {
            var ret = [];
            var change;
            var certKeys = [
                {key: 'acbSummary', display: 'ONC-ACB Summary'},
                {key: 'developerSummary', display: 'Developer Summary'},
                {key: 'resolution', display: 'Resolution'},
                {key: 'surveillancePassRate', display: 'Pass Rate'},
                {key: 'surveillanceSitesSurveilled', display: 'Sites Surveilled'},
            ];
            prev.sort(function (a,b) {return (a.certificationCriterionNumber > b.certificationCriterionNumber) ? 1 : ((b.certificationCriterionNumber > a.certificationCriterionNumber) ? -1 : 0);} );
            curr.sort(function (a,b) {return (a.certificationCriterionNumber > b.certificationCriterionNumber) ? 1 : ((b.certificationCriterionNumber > a.certificationCriterionNumber) ? -1 : 0);} );
            for (var i = 0; i < prev.length; i++) {
                var obj = { number: curr[i].certificationCriterionNumber, changes: [] };
                for (var j = 0; j < certKeys.length; j++) {
                    change = this.compareItem(prev[i], curr[i], certKeys[j].key, certKeys[j].display, certKeys[j].filter);
                    if (change) {
                        obj.changes.push('<li>' + change + '</li>');
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

        interpretCaps (data) {
            this.loadedCapActivity = data;
            var ret = [];
            var change;

            var certChanges, cpNum, i, j;
            for (i = 0; i < data.length; i++) {
                var activity = {
                    date: data[i].activityDate,
                    newId: data[i].id,
                    acb: '',
                };
                activity.friendlyActivityDate = new Date(activity.date).toISOString().substring(0, 10);
                if (data[i].description.startsWith('A corrective action plan for')) {
                    cpNum = data[i].description.split(' ')[7];
                    if (data[i].description.endsWith('created.')) {
                        activity.action = 'Created corrective action plan for certified product <a href="#/product/' + data[i].newData.certifiedProductId + '">' + cpNum + '</a>';
                        activity.id = data[i].newData.id;
                        activity.acb = data[i].newData.acbName;
                    } else if (data[i].description.endsWith('deleted.')) {
                        activity.action = 'Deleted corrective action plan for certified product <a href="#/product/' + data[i].originalData.certifiedProductId + '">' + cpNum + '</a>';
                        activity.id = data[i].originalData.id;
                        activity.acb = data[i].originalData.acbName;
                    } else if (data[i].description.endsWith('updated.')) {
                        activity.action = 'Updated corrective action plan for certified product <a href="#/product/' + data[i].newData.certifiedProductId + '">' + cpNum + '</a>';
                        activity.id = data[i].newData.id;
                        activity.acb = data[i].newData.acbName;
                        var capFields = [
                            {key: 'acbSummary', display: 'ONC/ACB Summary'},
                            {key: 'actualCompletionDate', display: 'Was Completed', filter: 'date'},
                            {key: 'approvalDate', display: 'Plan Approved', filter: 'date'},
                            {key: 'developerSummary', display: 'Developer Explanation'},
                            {key: 'effectiveDate', display: 'Effective Date', filter: 'date'},
                            {key: 'estimatedCompleteionDate', display: 'Estimated Complete Date', filter: 'date'},
                            {key: 'noncomplianceDate', display: 'Date of Determination', filter: 'date'},
                            {key: 'randomizedSurveillance', display: 'Result of Randomized Surveillance'},
                            {key: 'resolution', display: 'Description of Resolution'},
                            {key: 'surveillanceEndDate', display: 'Surveillance Ended', filter: 'date'},
                            {key: 'surveillanceStartDate', display: 'Surveillance Began', filter: 'date'},
                        ];
                        activity.details = [];
                        for (j = 0; j < capFields.length; j++) {
                            change = this.compareItem(data[i].originalData, data[i].newData, capFields[j].key, capFields[j].display, capFields[j].filter);
                            if (change) { activity.details.push(change); }
                        }
                        certChanges = this.compareCapCerts(data[i].originalData.certifications, data[i].newData.certifications);
                        for (j = 0; j < certChanges.length; j++) {
                            activity.details.push('Certification "' + certChanges[j].number + '" changes<ul>' + certChanges[j].changes.join('') + '</ul>');
                        }
                        activity.csvDetails = activity.details.join('\n');
                    } else {
                        activity.action = data[i].description;
                    }
                    ret.push(activity);
                } else if (data[i].description.startsWith('Documentation was added to ')) {
                    cpNum = data[i].description.split(' ');
                    cpNum[cpNum.length - 1] = '<a href="#/product/' + data[i].newData.certifiedProductId + '">' + cpNum[cpNum.length - 1] + '</a>';
                    activity.action = cpNum.join(' ');
                    activity.acb = data[i].newData.acbName;
                    ret.push(activity);
                } else if (data[i].description.startsWith('Documentation was removed from ')) {
                    cpNum = data[i].description.split(' ');
                    cpNum[cpNum.length - 1] = '<a href="#/product/' + data[i].newData.certifiedProductId + '">' + cpNum[cpNum.length - 1] + '</a>';
                    activity.action = cpNum.join(' ');
                    activity.acb = data[i].newData.acbName;
                    ret.push(activity);
                }
            }
            return ret;
        }

        interpretDevelopers (data) {
            var simpleFields = [
                {key: 'deleted', display: 'Deleted'},
                {key: 'developerCode', display: 'Developer Code'},
                //{key: 'lastModifiedDate', display: 'Last Modified Date', filter: 'date'},
                {key: 'name', display: 'Name'},
                {key: 'website', display: 'Website'},
            ];
            var nestedKeys = [
                {key: 'status', subkey: 'statusName', display: 'Developer Status'},
            ];
            var ret = [];
            var change;
            var i, j;

            for (i = 0; i < data.length; i++) {
                var activity = {
                    id: data[i].id,
                    developer: data[i].newData.name,
                    developerCode: data[i].newData.developerCode,
                    responsibleUser: this.getResponsibleUser(data[i].responsibleUser),
                    date: data[i].activityDate,
                };
                activity.friendlyActivityDate = new Date(activity.date).toISOString().substring(0, 10)
                if (data[i].description.startsWith('Merged')) {
                    activity.developerCode = data[i].originalData.map(function (elem){
                        return elem.developerCode;
                    }).join(',');
                } else if (!activity.developerCode) {
                    activity.developerCode = 'N/A';
                }
                if (data[i].originalData && !angular.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                    activity.action = 'Updated developer "' + data[i].newData.name + '"';
                    activity.details = [];
                    for (j = 0; j < simpleFields.length; j++) {
                        change = this.compareItem(data[i].originalData, data[i].newData, simpleFields[j].key, simpleFields[j].display, simpleFields[j].filter);
                        if (change) {
                            activity.details.push(change);
                        }
                    }
                    for (j = 0; j < nestedKeys.length; j++) {
                        change = this.nestedCompare(data[i].originalData, data[i].newData, nestedKeys[j].key, nestedKeys[j].subkey, nestedKeys[j].display, nestedKeys[j].filter);
                        if (change) {
                            activity.details.push(change);
                        }
                    }
                    var addressChanges = this.compareAddress(data[i].originalData.address, data[i].newData.address);
                    if (addressChanges && addressChanges.length > 0) {
                        activity.details.push('Address changes<ul>' + addressChanges.join('') + '</ul>');
                    }
                    var contactChanges = this.compareContact(data[i].originalData.contact, data[i].newData.contact);
                    if (contactChanges && contactChanges.length > 0) {
                        activity.details.push('Contact changes<ul>' + contactChanges.join('') + '</ul>');
                    }
                    var transKeys = [{key: 'transparencyAttestation', display: 'Transparency Attestation'}];
                    var trans = this.compareArray(data[i].originalData.transparencyAttestationMappings, data[i].newData.transparencyAttestationMappings, transKeys, 'acbName');
                    for (j = 0; j < trans.length; j++) {
                        activity.details.push('Transparency Attestation "' + trans[j].name + '" changes<ul>' + trans[j].changes.join('') + '</ul>');
                    }

                    var foundEvents = false;
                    var statusEvents = this.utilService.arrayCompare(data[i].originalData.statusEvents,data[i].newData.statusEvents);
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

                    if (activity.details.length === 0 && !foundEvents) {
                        delete activity.details;
                    } else {
                        activity.csvDetails = activity.details.join('\n');
                    }
                    activity.csvAction = activity.action;
                } else {
                    this.interpretNonUpdate(activity, data[i], 'developer');
                    activity.csvAction = activity.action[0].replace(',','","');
                }
                ret.push(activity);
            }
            return ret;
        }

        interpretProducts (data) {
            var ret = [];
            var change;

            var i, j;
            for (i = 0; i < data.length; i++) {
                var activity = {
                    id: data[i].id,
                    product: data[i].newData.name,
                    responsibleUser: this.getResponsibleUser(data[i].responsibleUser),
                    date: data[i].activityDate,
                };
                if (data[i].developer) {
                    activity.developer = data[i].developer.name;
                } else {
                    activity.developer = '';
                }
                activity.friendlyActivityDate = new Date(activity.date).toISOString().substring(0, 10)
                var wasChanged = false;
                if (data[i].originalData && !angular.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                    activity.name = data[i].newData.name;
                    activity.action = 'Update:<ul>';
                    change = this.compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                    if (change) {
                        activity.action += '<li>' + change + '</li>';
                        wasChanged = true;
                    }
                    change = this.compareItem(data[i].originalData, data[i].newData, 'developerName', 'Developer');
                    if (change) {
                        activity.action += '<li>' + change + '</li>';
                        wasChanged = true;
                    }
                    var contactChanges = this.compareContact(data[i].originalData.contact, data[i].newData.contact);
                    if (contactChanges && contactChanges.length > 0) {
                        activity.action += '<li>Contact changes<ul>' + contactChanges.join('') + '</ul></li>';
                        wasChanged = true;
                    }
                    if (!angular.equals(data[i].originalData.ownerHistory, data[i].newData.ownerHistory)) {
                        var action = '<li>Owner history changed. Was:<ul>';
                        if (data[i].originalData.ownerHistory.length === 0) {
                            action += '<li>No previous history</li>';
                        } else {
                            for (j = 0; j < data[i].originalData.ownerHistory.length; j++) {
                                action += '<li><strong>' + data[i].originalData.ownerHistory[j].developer.name + '</strong> on ' + this.$filter('date')(data[i].originalData.ownerHistory[j].transferDate,'mediumDate','UTC') + '</li>';
                            }
                        }
                        action += '</ul>Now:<ul>';
                        if (data[i].newData.ownerHistory.length === 0) {
                            action += '<li>No new history</li>';
                        } else {
                            for (j = 0; j < data[i].newData.ownerHistory.length; j++) {
                                action += '<li><strong>' + data[i].newData.ownerHistory[j].developer.name + '</strong> on ' + this.$filter('date')(data[i].newData.ownerHistory[j].transferDate,'mediumDate','UTC') + '</li>';
                            }
                        }
                        action += '</ul></li>';
                        activity.action += action;
                        wasChanged = true;
                    }
                    activity.action += '</ul>';
                } else {
                    this.interpretNonUpdate(activity, data[i], 'product');
                    wasChanged = true;
                }
                if (wasChanged) {
                    ret.push(activity);
                }
            }
            return ret;
        }

        interpretVersions (data) {
            var ret = [];
            var change;

            for (var i = 0; i < data.length; i++) {
                var activity = {date: data[i].activityDate};
                if (data[i].originalData && !angular.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                    activity.product = data[i].newData.productName;
                    activity.name = data[i].newData.version;
                    activity.action = 'Update:<ul>';
                    change = this.compareItem(data[i].originalData, data[i].newData, 'version', 'Version');
                    if (change) { activity.action += '<li>' + change + '</li>'; }
                    change = this.compareItem(data[i].originalData, data[i].newData, 'productName', 'Associated Product');
                    if (change) { activity.action += '<li>' + change + '</li>'; }
                    activity.action += '</ul>';
                } else {
                    if (data[i].newData) {
                        activity.product = data[i].newData.productName;
                    } else if (data[i].originalData) {
                        activity.product = data[i].originalData.productName;
                    }
                    this.interpretNonUpdate(activity, data[i], 'version', 'version');
                }
                ret.push(activity);
            }
            return ret;
        }

        interpretAcbs (data) {
            var ret = [];
            var change;

            for (var i = 0; i < data.length; i++) {
                var activity = {date: data[i].activityDate};
                if (data[i].originalData && !angular.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                    activity.name = data[i].newData.name;
                    if (data[i].originalData.deleted !== data[i].newData.deleted) {
                        activity.action = data[i].newData.deleted ? 'ACB was deleted' : 'ACB was restored';
                    } else {
                        activity.action = 'Update:<ul>';
                        change = this.compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                        if (change) { activity.action += '<li>' + change + '</li>'; }
                        change = this.compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                        if (change) { activity.action += '<li>' + change + '</li>'; }
                        change = this.compareAddress(data[i].originalData.address, data[i].newData.address);
                        if (change && change.length > 0) {
                            activity.action += '<li>Address changes<ul>' + change.join('') + '</ul></li>';
                        }
                        activity.action += '</ul>';
                    }
                } else {
                    this.interpretNonUpdate(activity, data[i], 'ACB');
                }
                ret.push(activity);
            }
            return ret;
        }

        interpretAtls (data) {
            var ret = [];
            var change;

            for (var i = 0; i < data.length; i++) {
                var activity = {date: data[i].activityDate};
                if (data[i].originalData && !angular.isArray(data[i].originalData) && data[i].newData) { // both exist, originalData not an array: update
                    activity.name = data[i].newData.name;
                    if (data[i].originalData.deleted !== data[i].newData.deleted) {
                        activity.action = data[i].newData.deleted ? 'ONC-ATL was deleted' : 'ONC-ATL was restored';
                    } else {
                        activity.action = 'Update:<ul>';
                        change = this.compareItem(data[i].originalData, data[i].newData, 'name', 'Name');
                        if (change) { activity.action += '<li>' + change + '</li>'; }
                        change = this.compareItem(data[i].originalData, data[i].newData, 'website', 'Website');
                        if (change) { activity.action += '<li>' + change + '</li>'; }
                        change = this.compareAddress(data[i].originalData.address, data[i].newData.address);
                        if (change && change.length > 0) {
                            activity.action += '<li>Address changes<ul>' + change.join('') + '</ul></li>';
                        }
                        activity.action += '</ul>';
                    }
                } else {
                    this.interpretNonUpdate(activity, data[i], 'ONC-ATL');
                }
                ret.push(activity);
            }
            return ret;
        }

        interpretAnnouncements (data) {
            var ret = data;
            return ret;
        }

        interpretUsers (data) {
            var ret = data;
            return ret;
        }

        interpretUserActivities (data) {
            var ret = data;
            return ret;
        }

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
