export const ListingEditComponent = {
    templateUrl: 'chpl.components/listing/edit.html',
    bindings: {
        listing: '<',
        onChange: '&',
        resources: '<',
        showFormErrors: '<',
        workType: '<',
    },
    controller: class ListingEditComponent {
        constructor ($filter, $log, $timeout, authService, utilService) {
            'ngInject';
            this.$filter = $filter;
            this.$log = $log;
            this.$timeout = $timeout;
            this.addNewValue = utilService.addNewValue;
            this.certificationStatus = utilService.certificationStatus;
            this.extendSelect = utilService.extendSelect;
            this.hasAnyRole = authService.hasAnyRole;
            this.utilService = utilService;
            this.newItem = {};
            this.addingItem = {};
            this.creatingItem = {};
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = angular.copy(changes.listing.currentValue);
                this.backupListing = angular.copy(changes.listing.currentValue);
            }
            if (changes.resources) {
                this.resources = angular.copy(changes.resources.currentValue);
                this.resources.accessibilityStandards = this.resources.accessibilityStandards.data.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
                this.resources.qmsStandards.data = this.resources.qmsStandards.data.concat(
                    this.listing.qmsStandards
                        .filter(standard => !standard.id)
                        .map(standard => {
                            standard.name = standard.qmsStandardName;
                            return standard;
                        })
                );
                this.resources.testingLabs = this.resources.testingLabs.sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
            }
            if (changes.workType) {
                this.workType = angular.copy(changes.workType.currentValue);
            }
            if (this.listing && this.resources) {
                this.prepareFields();
                this.update(true);
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

        disabledStatus (name) {
            return ((name === 'Pending' && this.workType === 'edit') || (name !== 'Pending' && this.workType === 'confirm'));
        }

        generateErrorMessages () {
            this.messages = {
                errors: [],
                warnings: [],
            };
            if (this.improperFirstStatus()) {
                this.messages.errors.push('The earliest status of this product must be "Active"');
            }
            if (this.idFields && this.idFields.ics !== this.requiredIcsCode() && this.requiredIcsCode() > 0 && this.listing.ics.parents.length > 0) {
                this.messages.errors.push('ICS Code must be exactly one more than highest ICS code of all of this Listing\'s ICS parents; it should be "' + this.requiredIcsCode());
            }
            if (this.hasStatusMatches()) {
                this.messages.errors.push('Certification status must not repeat');
            }
            if (this.hasDateMatches()) {
                this.messages.errors.push('Only one change of certification status allowed per day');
            }
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

        isValid () {
            return this.isSaving
                || !(this.form.$invalid
                     || this.hasStatusMatches()
                     || this.hasDateMatches()
                     || this.improperFirstStatus());
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

        requiredIcsCode () {
            let code = this.listing.ics.parents
                .map(item => parseInt(item.chplProductNumber.split('.')[6], 10))
                .reduce((max, current) => Math.max(max, current), -1)
                + 1;
            return (code > 9 || code < 0) ? '' + code : '0' + code;
        }

        update (doNotUpdateListing) {
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
            this.generateErrorMessages();
            this.onChange({
                listing: doNotUpdateListing ? undefined : this.listing,
                messages: this.messages,
                reason: this.reason,
                acknowledgeWarnings: this.acknowledgeWarnings,
            });
        }

        // item list
        cancelNewItem (type) {
            this.newItem[type] = undefined;
            this.addingItem[type] = false;
            this.creatingItem[type] = false;
        }

        filterListEditItems (type, items) {
            switch (type) {
            case 'accessibilityStandards':
                return items.filter(i => !this.listing.accessibilityStandards.filter(as => as.accessibilityStandardName === i.name).length);
            case 'oncAtls':
                return items.filter(i => !this.listing.testingLabs.filter(tl => tl.testingLabName === i.name).length);
            default:
                this.$log.error('filter', type, items);
            }
        }

        removeItem (type, item) {
            switch (type) {
            case 'accessibilityStandards':
                this.listing.accessibilityStandards = this.listing.accessibilityStandards.filter(l => l.accessibilityStandardName !== item.accessibilityStandardName);
                break;
            case 'certificationEvents':
                this.listing.certificationEvents = this.listing.certificationEvents.filter(event => event.statusDateObject.getTime() !== item.statusDateObject.getTime());
                break;
            case 'oncAtls':
                this.listing.testingLabs = this.listing.testingLabs.filter(l => l.testingLabName !== item.testingLabName);
                break;
            default:
                this.$log.error('remove', type, item);
            }
            this.update();
        }

        saveNewItem (type) {
            switch (type) {
            case 'accessibilityStandards':
                this.addNewValue(this.listing.accessibilityStandards, this.newItem[type]);
                this.listing.accessibilityStandards = this.listing.accessibilityStandards.sort((a, b) => a.accessibilityStandardName < b.accessibilityStandardName ? -1 : a.accessibilityStandardName > b.accessibilityStandardName ? 1 : 0);
                break;
            case 'certificationEvents':
                this.listing.certificationEvents.push({
                    status: this.newItem[type].status,
                    statusDateObject: this.newItem[type].statusDateObject,
                    reason: this.newItem[type].reason,
                });
                break;
            case 'oncAtls':
                this.addNewValue(this.listing.testingLabs, this.newItem[type]);
                this.listing.testingLabs = this.listing.testingLabs.sort((a, b) => a.testingLabName < b.testingLabName ? -1 : a.testingLabName > b.testingLabName ? 1 : 0);
                break;
            default:
                this.$log.error('add', type);
            }
            this.cancelNewItem(type);
            this.update();
        }
    },
};
angular.module('chpl.components')
    .component('chplListingEdit', ListingEditComponent);
