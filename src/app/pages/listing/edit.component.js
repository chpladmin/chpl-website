export const ListingEditPageComponent = {
    templateUrl: 'chpl.listing/edit.html',
    bindings: {
        listing: '<',
        resources: '<',
    },
    controller: class ListingEditPageComponent {
        constructor ($log, $q, $state, networkService) {
            'ngInject';
            this.$log = $log;
            this.$q = $q;
            this.$state = $state;
            this.errors = {
                basic: [],
                details: [],
                save: [],
            };
            this.warnings = {
                basic: [],
                details: [],
                save: [],
            };
            this.networkService = networkService;
            this.resources = {};
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listingBasic = angular.copy(changes.listing.currentValue);
                this.listingDetails = angular.copy(changes.listing.currentValue);
            }
            if (changes.resources) {
                this.resources = changes.resources.currentValue;
            }
        }

        cancel () {
            this.$state.go('^', {}, {reload: true});
        }

        consolidateErrors () {
            this.errorMessages = this.errors.basic.concat(this.errors.details).concat(this.errors.save);
            this.warningMessages = this.warnings.basic.concat(this.warnings.details).concat(this.warnings.save);
        }

        isValid () {
            return this.form.$valid
                && this.errors.basic.length === 0
                && this.errors.details.length === 0;
        }

        save () {
            let that = this;
            this.listingBasic.certificationResults = this.listingDetails.certificationResults;
            this.listingBasic.cqmResults = this.listingDetails.cqmResults;
            this.listingBasic.sed = this.listingDetails.sed;
            this.listingBasic.sedIntendedUserDescription = this.listingDetails.sedIntendedUserDescription;
            this.listingBasic.sedReportFileLocation = this.listingDetails.sedReportFileLocation;
            this.listingBasic.sedTestingEndDate = this.listingDetails.sedTestingEndDate;

            this.listingBasic.otherAcb = this.listingDetails.otherAcb;
            this.listingBasic.qmsStandards = this.listingDetails.qmsStandards;
            this.listingBasic.targetedUsers = this.listingDetails.targetedUsers;
            this.listingBasic.meaningfulUseUserHistory = this.listingDetails.meaningfulUseUserHistory;
            let updateObject = {
                listing: this.listingBasic,
                reason: this.reason,
                acknowledgeWarnings: this.acknowledgeWarnings,
            };
            //that.$log.error(updateObject);
            this.isSaving = true;
            this.networkService.updateCP(updateObject).then(response => {
                if (!response.status || response.status === 200) {
                    that.listingBasic = angular.copy(response);
                    that.listingDetails = angular.copy(response);
                    that.$state.go('^', {}, {reload: true});
                } else {
                    that.isSaving = undefined;
                    that.errors.save = [response.error];
                    that.consolidateErrors();
                }
            }, error => {
                that.isSaving = undefined;
                if (error.data) {
                    that.errors.save = [];
                    that.warnings.save = [];
                    if (error.data.error && error.data.error.length > 0) {
                        that.errors.save.push(error.data.error);
                    }
                    if (error.data.errorMessages && error.data.errorMessages.length > 0) {
                        that.errors.save = that.errors.save.concat(error.data.errorMessages);
                    }
                    if (error.data.warningMessages && error.data.warningMessages.length > 0) {
                        that.warnings.save = that.warnings.save.concat(error.data.warningMessages);
                    }
                    that.consolidateErrors();
                }
            });
        }

        takeActionBarAction (action, data) {
            switch (action) {
            case 'cancel':
                this.cancel();
                break;
            case 'mouseover':
                this.consolidateErrors();
                this.showFormErrors = true;
                break;
            case 'save':
                this.save();
                break;
            case 'updateAcknowledgement':
                this.acknowledgeWarnings = data;
                break;
                //no default
            }
        }

        updateBasic (listing, messages, reason) {
            if (listing) {
                this.listingBasic = angular.copy(listing);
            }
            this.errors.basic = messages.errors.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            this.warnings.basic = messages.warnings.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            this.consolidateErrors();
            this.reason = reason;
        }

        updateDetails (listing, messages) {
            this.listingDetails.certificationResults = listing.certificationResults;
            this.listingDetails.cqmResults = listing.cqmResults;
            this.listingDetails.sed = listing.sed;
            this.listingDetails.sedIntendedUserDescription = listing.sedIntendedUserDescription;
            this.listingDetails.sedReportFileLocation = listing.sedReportFileLocation;
            this.listingDetails.sedTestingEndDate = listing.sedTestingEndDate;

            this.listingDetails.otherAcb = listing.otherAcb;
            this.listingDetails.ics = angular.copy(listing.ics);
            this.listingBasic.ics = angular.copy(listing.ics);
            this.listingDetails.qmsStandards = angular.copy(listing.qmsStandards);
            this.listingDetails.targetedUsers = angular.copy(listing.targetedUsers);
            this.listingDetails.meaningfulUseUserHistory = listing.meaningfulUseUserHistory
                .map(muu => {
                    muu.muuDate = muu.muuDateObject.getTime();
                    return muu;
                });
            this.errors.details = messages.errors.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            this.warnings.details = messages.warnings.sort((a, b) => a < b ? -1 : a > b ? 1 : 0);
            this.listingBasic = angular.copy(this.listingBasic);
            this.consolidateErrors();
        }
    },
};

angular
    .module('chpl.listing')
    .component('chplListingEditPage', ListingEditPageComponent);
