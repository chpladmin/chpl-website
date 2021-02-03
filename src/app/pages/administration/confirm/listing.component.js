export const ConfirmListingComponent = {
    templateUrl: 'chpl.administration/confirm/listing.html',
    bindings: {
        listing: '<',
        developers: '<',
    },
    controller: class ConfirmListingComponent {
        constructor ($log, $state, networkService, toaster) {
            'ngInject';
            this.$log = $log;
            this.$state = $state;
            this.networkService = networkService;
            this.toaster = toaster;
            this.stage = 'developer';
            this.products = [];
            this.versions = [];
            this.errorMessages = [];
            this.systemRequirements = [];
            this.resources = {};
            //this.resources.testStandards.data = this.resources.testStandards.data.filter(item => !item.year || item.year === this.listing.certificationEdition.name);
        }

        $onInit () {
            this.loadDev();
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.uploaded = angular.copy(changes.listing.currentValue);
                this.pending = angular.copy(changes.listing.currentValue);
                if (this.uploaded.developer && !this.uploaded.developer.country) {
                    this.uploaded.developer.country = 'USA';
                }
            }
            if (changes.developers) {
                this.developers = angular.copy(changes.developers.currentValue);
            }
        }

        canAct (action) {
            switch (action) {
            case 'confirm': return this.stage === 'listing';
            case 'next': return this.showFormErrors && (this.form.$pristine || !this.pending.developer.developerId) && !this.isDisabled();
            case 'previous': return this.stage !== 'developer';
                // no default
            }
        }

        loadDev () {
            let that = this;
            if (this.pending.developer && this.pending.developer.developerId) {
                this.networkService.getDeveloper(this.pending.developer.developerId)
                    .then(result => that.pending.developer = result);
            }
        }

        takeDeveloperAction (action, payload) {
            switch (action) {
            case 'clear':
                break;
            case 'select':
                this.pending.developer.developerId = payload;
                if (payload) {
                    this.loadDev();
                } else {
                    this.pending.developer = angular.copy(this.uploaded.developer);
                    this.pending.developer.developerId = undefined;
                }
                break;
                //no default
            }
            this.form.$setPristine();
            this.showFormErrors = false;
        }

        selectInspectingProduct (productId) {
            this.pending.product.productId = productId;
        }

        setProductChoice (choice) {
            this.productChoice = choice;
        }

        selectInspectingVersion (versionId) {
            this.pending.version.versionId = versionId;
        }

        setVersionChoice (choice) {
            this.versionChoice = choice;
        }

        takeAction (action) {
            switch (action) {
            case 'cancel': this.cancel();
                break;
            case 'confirm': this.confirm();
                break;
            case 'mouseover': this.showFormErrors = true;
                break;
            case 'next': this.next();
                break;
            case 'previous': this.previous();
                break;
            case 'reject': this.reject();
                break;
                // no default
            }
        }

        confirm () {
            let that = this;
            this.networkService.confirmPendingCp({
                pendingListing: this.pending,
                acknowledgeWarnings: this.acknowledgeWarnings,
            }).then(() => {
                that.toaster.pop({
                    type: 'success',
                    title: 'Success',
                    body: 'The Listing has been confirmed',
                });
                that.$state.go('^', {}, {reload: true});
            }, error => {
                if (error.data.contact) {
                    that.toaster.pop({
                        type: 'warning',
                        title: 'Warning',
                        body: 'The Listing was already resolved',
                    });
                    that.$state.go('^', {}, {reload: true});
                } else {
                    that.errorMessages = error.data.errorMessages;
                    that.warningMessages = error.data.warningMessages;
                }
            });
        }

        reject () {
            let that = this;
            this.networkService.rejectPendingListing(this.uploaded.id)
                .then(() => {
                    that.toaster.pop({
                        type: 'success',
                        title: 'Success',
                        body: 'The Listing has been rejected',
                    });
                    that.$state.go('^', {}, {reload: true});
                }, error => {
                    if (error.data.contact) {
                        that.toaster.pop({
                            type: 'warning',
                            title: 'Warning',
                            body: 'The Listing was already resolved',
                        });
                    } else {
                        that.errorMessages = error.data.errorMessages;
                        that.warningMessages = error.data.warningMessages;
                    }
                });
        }

        editListing (listing) {
            this.pending = listing;
        }

        next () {
            switch (this.stage) {
            case 'developer':
                this.stage = 'product';
                break;
            case 'product':
                this.stage = 'version';
                this.loadFamily();
                break;
            case 'version':
                this.stage = 'listing';
                break;
            default:
                break;
            }
        }

        previous () {
            switch (this.stage) {
            case 'product': this.stage = 'developer';
                break;
            case 'version': this.stage = 'product';
                break;
            case 'listing': this.stage = 'version';
                break;
            default:
                break;
            }
        }

        isDisabled () {
            switch (this.stage) {
            case 'developer':
                return this.form.$invalid;
            case 'product':
                return (this.productChoice === 'choose' && !this.pending.product.productId);
            case 'version':
                return (this.versionChoice === 'choose' && !this.pending.version.versionId);
            default:
                return true;
            }
        }

        cancel () {
            this.$state.go('^', {}, {reload: true});
        }

        getStage () {
            switch (this.stage) {
            case 'developer': return 1;
            case 'product': return 2;
            case 'version': return 3;
            case 'listing': return 4;
                //no default
            }
        }

        loadFamily () {
            let that = this;
            if (this.pending.product && this.pending.product.productId) {
                this.networkService.getRelatedListings(this.pending.product.productId)
                    .then(family => that.resources.relatedListings = family.filter(item => item.edition === '2015'));
            }
        }
    },
};

angular.module('chpl.administration')
    .component('chplConfirmListing', ConfirmListingComponent);
