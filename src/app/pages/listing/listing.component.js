export const ListingComponent = {
    templateUrl: 'chpl.listing/listing.html',
    bindings: { },
    controller: class ListingComponent {
        constructor ($localStorage, $log, $state, $stateParams, $uibModal, authService, networkService, utilService) {
            'ngInject'
            this.$localStorage = $localStorage;
            this.$log = $log;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$uibModal = $uibModal;
            this.authService = authService;
            this.networkService = networkService;
            this.utilService = utilService;
            this.certificationStatus = utilService.certificationStatus;
            this.hasAnyRole = authService.hasAnyRole;
        }

        $onInit () {
            this.loading = true;
            this.listingId = this.$stateParams.id;
            this.initialPanel = this.$stateParams.initialPanel || 'cert';
            if (this.$localStorage.previouslyViewed) {
                this.previouslyViewed = this.$localStorage.previouslyViewed;

                if (this.previouslyViewed.indexOf((this.listingId + '')) === -1) {
                    this.previouslyViewed.push((this.listingId + ''));
                    if (this.previouslyViewed.length > 20) {
                        this.previouslyViewed.shift();
                    }
                    this.$localStorage.previouslyViewed = this.previouslyViewed;
                }
            } else {
                this.$localStorage.previouslyViewed = [this.listingId + ''];
            }

            this.loadListing();
        }

        can (action) {
            if (this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC'])) { return true; } // can do everything
            if (action === 'merge') { return false; } // if not above roles, can't merge
            return this.listing.developer.status.status === 'Active' && this.hasAnyRole(['ROLE_ACB']); // must be active
        }

        loadListing () {
            let that = this;
            this.networkService.getListing(this.listingId)
                .then(data => {
                    that.loading = false;
                    that.listing = data;
                }, () => {
                    that.loading = false;
                });
        }

        takeDeveloperAction (action, developerId) {
            this.$state.go('organizations.developers', {
                developerId: developerId,
                action: action,
            });
        }

        viewListingHistory () {
            let that = this;
            this.$uibModal.open({
                component: 'chplListingHistory',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    listing: () => that.listing,
                },
            });
        }
    },
}

angular
    .module('chpl.listing')
    .component('chplListing', ListingComponent);
