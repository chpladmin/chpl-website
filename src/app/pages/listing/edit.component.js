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

        save (listing, reason, acknowledgeWarnings) {
            let that = this;
            this.isSaving = true;
            this.listingBasic.certificationResults = this.listingDetails.certificationResults;
            this.listingBasic.cqmResults = this.listingDetails.cqmResults;
            this.listingBasic.sed = this.listingDetails.sed;
            this.listingBasic.sedIntendedUserDescription = this.listingDetails.sedIntendedUserDescription;
            this.listingBasic.sedReportFileLocation = this.listingDetails.sedReportFileLocation;
            this.listingBasic.sedTestingEndDate = this.listingDetails.sedTestingEndDate;

            this.listingBasic.otherAcb = this.listingDetails.otherAcb;
            this.listingBasic.ics = this.listingDetails.ics;
            this.listingBasic.qmsStandards = this.listingDetails.qmsStandards;
            this.listingBasic.targetedUsers = this.listingDetails.targetedUsers;
            this.listingBasic.meaningfulUseUserHistory = this.listingDetails.meaningfulUseUserHistory;
            that.$log.error(this.listingBasic, acknowledgeWarnings);
            /*
            this.networkService.updateCP({
                listing: this.listingBasic,
                reason: reason,
                acknowledgeWarnings: acknowledgeWarnings,
            }).then(response => {
                if (!response.status || response.status === 200) {
                    that.$state.go('^', {}, {reload: true});
                } else {
                    that.saveErrors = { errors: [response.error]};
                    that.isSaving = false;
                }
            }, error => {
                that.saveErrors = {
                    errors: [],
                    warnings: [],
                };
                if (error.data) {
                    if (error.data.error && error.data.error.length > 0) {
                        that.saveErrors.errors.push(error.data.error);
                    }
                    if (error.data.errorMessages && error.data.errorMessages.length > 0) {
                        that.saveErrors.errors = that.saveErrors.errors.concat(error.data.errorMessages);
                    }
                    if (error.data.warningMessages && error.data.warningMessages.length > 0) {
                        that.saveErrors.warnings = that.saveErrors.warnings.concat(error.data.warningMessages);
                    }
                }
                that.isSaving = false;
            });
            */
        }

        update (listing) {
            this.listingDetails.certificationResults = listing.certificationResults;
            this.listingDetails.cqmResults = listing.cqmResults;
            this.listingDetails.sed = listing.sed;
            this.listingDetails.sedIntendedUserDescription = listing.sedIntendedUserDescription;
            this.listingDetails.sedReportFileLocation = listing.sedReportFileLocation;
            this.listingDetails.sedTestingEndDate = listing.sedTestingEndDate;

            this.listingDetails.otherAcb = listing.otherAcb;
            this.listingDetails.ics = angular.copy(listing.ics);
            this.listingDetails.qmsStandards = angular.copy(listing.qmsStandards);
            this.listingDetails.targetedUsers = angular.copy(listing.targetedUsers);
            this.listingDetails.meaningfulUseUserHistory = listing.meaningfulUseUserHistory
                .map(muu => {
                    muu.muuDate = muu.muuDateObject.getTime();
                    return muu;
                });
        }
    },
};

angular
    .module('chpl.listing')
    .component('chplListingEditPage', ListingEditPageComponent);
