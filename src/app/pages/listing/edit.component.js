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
                this.listing = changes.listing.currentValue;
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
            this.networkService.updateCP({
                listing: listing,
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
        }

        update (listing) {
            this.listing.certificationResults = listing.certificationResults;
            this.listing.cqmResults = listing.cqmResults;
            this.listing.sed = listing.sed;
            this.listing.sedIntendedUserDescription = listing.sedIntendedUserDescription;
            this.listing.sedReportFileLocation = listing.sedReportFileLocation;
            this.listing.sedTestingEndDate = listing.sedTestingEndDate;

            this.listing.otherAcb = listing.otherAcb;
            this.listing.ics.inherits = angular.copy(listing.ics.inherits);
            this.listing.ics.parents = angular.copy(listing.ics.parents);
            this.listing.qmsStandards = angular.copy(listing.qmsStandards);
            this.listing.targetedUsers = angular.copy(listing.targetedUsers);
            this.listing.meaningfulUseUserHistory = listing.meaningfulUseUserHistory
                .map(muu => {
                    muu.muuDate = muu.muuDateObject.getTime();
                    return muu;
                });
            this.listing = angular.copy(this.listing);
        }
    },
};

angular
    .module('chpl.listing')
    .component('chplListingEditPage', ListingEditPageComponent);
