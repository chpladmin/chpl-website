export const ListingComponent = {
    templateUrl: 'chpl.listing/listing.html',
    bindings: {
        listing: '<',
    },
    controller: class ListingComponent {
        constructor ($localStorage, $log, $q, $state, $stateParams, $uibModal, authService, featureFlags, networkService, utilService) {
            'ngInject';
            this.$localStorage = $localStorage;
            this.$log = $log;
            this.$q = $q;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.$uibModal = $uibModal;
            this.authService = authService;
            this.isOn = featureFlags.isOn;
            this.networkService = networkService;
            this.utilService = utilService;
            this.certificationStatus = utilService.certificationStatus;
            this.hasAnyRole = authService.hasAnyRole;
            this.resources = {};
        }

        $onInit () {
            this.panel = this.$stateParams.panel || 'cert';
        }

        $onChanges (changes) {
            if (changes.listing) {
                this.listing = changes.listing.currentValue;
                this.backupListing = angular.copy(this.listing);
                if (this.isOn('direct-review')) {
                    this.loadDirectReviews();
                }
                if (this.$localStorage.previouslyViewed) {
                    this.previouslyViewed = this.$localStorage.previouslyViewed;

                    if (this.previouslyViewed.indexOf((this.listing.id + '')) === -1) {
                        this.previouslyViewed.push((this.listing.id + ''));
                        if (this.previouslyViewed.length > 20) {
                            this.previouslyViewed.shift();
                        }
                        this.$localStorage.previouslyViewed = this.previouslyViewed;
                    }
                } else {
                    this.$localStorage.previouslyViewed = [this.listing.id + ''];
                }
            }
        }

        canEdit () {
            if (this.listing.certificationEdition.name === '2014') {
                return this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC']);
            } else {
                return this.hasAnyRole(['ROLE_ADMIN', 'ROLE_ONC', 'ROLE_ACB']);
            }
        }

        loadDirectReviews () {
            let that = this;
            this.networkService.getDirectReviews(this.listing.developer.developerId)
                .then(data => that.directReviews = {
                    status: 200,
                    drs: data,
                }, error => that.directReviews = {
                    status: error,
                    drs: [],
                });
        }

        takeDeveloperAction (action, developerId) {
            this.$state.go('organizations.developers.developer', {
                developerId: developerId,
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
};

angular
    .module('chpl.listing')
    .component('chplListing', ListingComponent);
