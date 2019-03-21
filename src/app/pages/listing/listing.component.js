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
            this.$log.info(this);
            this.loading = true;
            this.productId = this.$stateParams.id; //this.id; //this.resolve.id; ?
            this.initialPanel = this.$stateParams.initialPanel || 'cert'; //this.resolve.initialPanel || 'cert';
            if (this.$localStorage.previouslyViewed) {
                this.previouslyViewed = this.$localStorage.previouslyViewed;

                if (this.previouslyViewed.indexOf((this.productId + '')) === -1) {
                    this.previouslyViewed.push((this.productId + ''));
                    if (this.previouslyViewed.length > 20) {
                        this.previouslyViewed.shift();
                    }
                    this.$localStorage.previouslyViewed = this.previouslyViewed;
                }
            } else {
                this.$localStorage.previouslyViewed = [this.productId + ''];
            }

            this.loadProduct();
        }

        loadProduct () {
            let that = this;
            this.networkService.getProduct(this.productId)
                .then(data => {
                    that.loading = false;
                    that.product = data;
                }, () => {
                    that.loading = false;
                });
            this.networkService.getSingleCertifiedProductActivity(this.productId)
                .then(data => {
                    that.activity = data;
                });
        }

        takeDeveloperAction (action, developerId) {
            this.$state.go('organizations.developers', {
                developerId: developerId,
                action: action,
            });
        }

        viewProductHistory () {
            let that = this;
            this.$uibModal.open({
                templateUrl: 'chpl.listing/history/history.html',
                controller: 'ProductHistoryController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    activity: () => that.activity,
                },
            });
        }
    },
}

angular
    .module('chpl.listing')
    .component('chplListing', ListingComponent);
