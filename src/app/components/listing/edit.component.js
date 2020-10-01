export const ListingEditComponent = {
    templateUrl: 'chpl.components/listing/edit.html',
    bindings: {
        listing: '<',
        isSaving: '<',
        messages: '<',
        onSave: '&',
        onCancel: '&',
        resources: '<',
        workType: '<',
    },
    controller: class ListingEditComponent {
        constructor ($filter, $log, $timeout, authService, networkService, utilService) {
            'ngInject';
            this.$filter = $filter;
            this.$log = $log;
            this.$timeout = $timeout;
            this.addNewValue = utilService.addNewValue;
            this.certificationStatus = utilService.certificationStatus;
            this.extendSelect = utilService.extendSelect;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
            this.utilService = utilService;
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
                this.backupListing = angular.copy(changes.listing.currentValue);
            }
            if (changes.isSaving) {
                this.isSaving = angular.copy(changes.isSaving.currentValue);
            }
            if (changes.messages) {
                this.messages = angular.copy(changes.messages.currentValue);
            }
            if (changes.resources) {
                this.resources = angular.copy(changes.resources.currentValue);
                this.resources.qmsStandards.data = this.resources.qmsStandards.data.concat(
                    this.listing.qmsStandards
                        .filter(standard => !standard.id)
                        .map(standard => {
                            standard.name = standard.qmsStandardName;
                            return standard;
                        })
                );
            }
            if (changes.workType) {
                this.workType = angular.copy(changes.workType.currentValue);
            }
            if (this.listing && this.resources) {
                this.prepareFields();
            }
        }

        prepareFields () {
            this.listing.certDate = new Date(this.listing.certificationDate);
            if (this.listing.chplProductNumber.length > 12) {
                let idFields = this.listing.chplProductNumber.split('.');
                this.idFields = {
                    prefix: idFields[0] + '.' + idFields[1] + '.' + idFields[2] + '.' + idFields[3],
                    prod: idFields[4],
                    ver: idFields[5],
                    ics: idFields[6],
                    suffix: idFields[7] + '.' + idFields[8],
                };
            }
            this.listing.certificationEvents.forEach(ce => {
                ce.statusDateObject = new Date(ce.eventDate);
                ce.status = this.utilService.findModel(ce.status, this.resources.statuses);
            });

            this.listing.practiceType = this.utilService.findModel(this.listing.practiceType, this.resources.practices);
            this.listing.classificationType = this.utilService.findModel(this.listing.classificationType, this.resources.classifications);
            this.listing.certifyingBody = this.utilService.findModel(this.listing.certifyingBody, this.resources.bodies);
            if (this.listing.testingLab) {
                this.listing.testingLab = this.utilService.findModel(this.listing.testingLab, this.resources.testingLabs);
            }
            this.resources.testStandards.data = this.resources.testStandards.data.filter(item => !item.year || item.year === this.listing.certificationEdition.name);
        }

        addPreviousStatus () {
            this.listing.certificationEvents.push({
                statusDateObject: new Date(),
                status: {},
            });
        }

        cancel () {
            this.listing = angular.copy(this.backupListing);
            this.onCancel();
        }

        disabledStatus (name) {
            return ((name === 'Pending' && this.workType === 'edit') || (name !== 'Pending' && this.workType === 'confirm'));
        }

        hasDateMatches () {
            return this.listing.certificationEvents
                .reduce((acc, ce) => acc || this.matchesPreviousDate(ce), false);
        }

        hasStatusMatches () {
            return this.listing.certificationEvents
                .reduce((acc, ce) => acc || this.matchesPreviousStatus(ce), false);
        }

        improperFirstStatus () {
            return this.workType === 'confirm' ? false : this.$filter('orderBy')(this.listing.certificationEvents,'statusDateObject')[0].status.name !== 'Active';
        }

        matchesPreviousDate (event) {
            let orderedStatus = this.$filter('orderBy')(this.listing.certificationEvents, 'statusDateObject');
            let statusLoc = orderedStatus.indexOf(event);
            if (statusLoc > 0) {
                let test = this.$filter('date')(event.statusDateObject, 'mediumDate', 'UTC') === this.$filter('date')(orderedStatus[statusLoc - 1].statusDateObject, 'mediumDate', 'UTC');
                return test;
            }
            return false;
        }

        matchesPreviousStatus (event) {
            let orderedStatus = this.$filter('orderBy')(this.listing.certificationEvents, 'statusDateObject');
            let statusLoc = orderedStatus.indexOf(event);
            if (statusLoc > 0) {
                return (event.status.name === orderedStatus[statusLoc - 1].status.name);
            }
            return false;
        }

        mayCauseSuspension (name) {
            switch (name) {
            case ('Active'):
            case ('Retired'):
            case ('Suspended by ONC-ACB'):
            case ('Suspended by ONC'):
            case ('Withdrawn by Developer'):
            case ('Terminated by ONC'):
                return false;
            case ('Withdrawn by ONC-ACB'):
            case ('Withdrawn by Developer Under Surveillance/Review'):
                return true;
            default: return false;
            }
        }

        removePreviousStatus (statusDateObject) {
            this.listing.certificationEvents = this.listing.certificationEvents.filter(event => event.statusDateObject.getTime() !== statusDateObject.getTime());
        }

        requiredIcsCode () {
            let code = this.listing.ics.parents
                .map(item => parseInt(item.chplProductNumber.split('.')[6], 10))
                .reduce((max, current) => Math.max(max, current), -1)
                + 1;
            return (code > 9 || code < 0) ? '' + code : '0' + code;
        }

        save () {
            this.listing.certificationEvents.forEach(ce => ce.eventDate = ce.statusDateObject.getTime());
            if (this.listing.chplProductNumber.length > 12) {
                this.listing.chplProductNumber =
                    this.idFields.prefix + '.' +
                    this.idFields.prod + '.' +
                    this.idFields.ver + '.' +
                    this.idFields.ics + '.' +
                    this.idFields.suffix;
            }
            this.listing.certificationDate = this.listing.certDate.getTime();
            this.onSave({
                listing: this.listing,
                reason: this.reason,
                acknowledgeWarnings: this.acknowledgeWarnings,
            });
        }

        updateListing (listing) {
            this.listing.certificationResults = listing.certificationResults;
            this.listing.cqmResults = listing.cqmResults;
            this.listing.sed = listing.sed;
            this.listing.sedIntendedUserDescription = listing.sedIntendedUserDescription;
            this.listing.sedReportFileLocation = listing.sedReportFileLocation;
            this.listing.sedTestingEndDate = listing.sedTestingEndDate;
        }
    },
};
angular.module('chpl.components')
    .component('chplListingEdit', ListingEditComponent);
