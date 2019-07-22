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
            'ngInject'
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
                this._prepareFields();
            }
        }

        _prepareFields () {
            this.listing.certDate = new Date(this.listing.certificationDate);
            if (angular.isUndefined(this.listing.ics.parents)) {
                this.listing.ics.parents = [];
            }
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
            if (this.listing.meaningfulUseUserHistory && this.listing.meaningfulUseUserHistory.length > 0) {
                this.listing.meaningfulUseUserHistory = this.listing.meaningfulUseUserHistory.map(muu => {
                    muu.muuDateObject = new Date(muu.muuDate);
                    return muu;
                });
            } else {
                this.listing.meaningfulUseUserHistory = [];
            }

            this.listing.practiceType = this.utilService.findModel(this.listing.practiceType, this.resources.practices);
            this.listing.classificationType = this.utilService.findModel(this.listing.classificationType, this.resources.classifications);
            this.listing.certifyingBody = this.utilService.findModel(this.listing.certifyingBody, this.resources.bodies);
            if (this.listing.testingLab) {
                this.listing.testingLab = this.utilService.findModel(this.listing.testingLab, this.resources.testingLabs);
            }

            if (this.listing.product && this.listing.product.productId && this.listing.certificationEdition.name === '2015') {
                let that = this;
                this.networkService.getRelatedListings(this.listing.product.productId)
                    .then(family => that.relatedListings = family.filter(item => item.edition === '2015'));
            }
        }

        addPreviousMuu () {
            this.listing.meaningfulUseUserHistory.push({
                muuDateObject: new Date(),
                muuCount: 0,
            });
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

        disabledParent (listing) {
            return this.listing.ics.parents
                .reduce((disabled, current) => disabled || current.chplProductNumber === listing.chplProductNumber, !!(this.listing.chplProductNumber === listing.chplProductNumber));
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

        matchesPreviousMuuDate (muu) {
            let orderedMuu = this.$filter('orderBy')(this.listing.meaningfulUseUserHistory, 'muuDateObject');
            let muuLoc = orderedMuu.indexOf(muu);
            if (muuLoc > 0) {
                return (this.$filter('date')(muu.muuDateObject, 'mediumDate', 'UTC') === this.$filter('date')(orderedMuu[muuLoc - 1].muuDateObject, 'mediumDate', 'UTC'));
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

        missingIcsSource () {
            return this.listing.certificationEdition.name === '2015' && this.listing.ics.inherits && this.listing.ics.parents.length === 0;
        }

        removePreviousStatus (statusDateObject) {
            this.listing.certificationEvents = this.listing.certificationEvents.filter(event => event.statusDateObject.getTime() !== statusDateObject.getTime());
        }

        removePreviousMuu (muuDateObject) {
            this.listing.meaningfulUseUserHistory = this.listing.meaningfulUseUserHistory.filter(muu => muu.muuDateObject.getTime() !== muuDateObject.getTime());
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
            this.listing.meaningfulUseUserHistory.forEach(muu => muu.muuDate = muu.muuDateObject.getTime());
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
            });
        }
    },
}
angular.module('chpl.components')
    .component('chplListingEdit', ListingEditComponent);
