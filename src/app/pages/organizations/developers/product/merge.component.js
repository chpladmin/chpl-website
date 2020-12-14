export const ProductsMergeComponent = {
    templateUrl: 'chpl.organizations/developers/product/merge.html',
    bindings: {
        developer: '<',
    },
    controller: class ProductsMergeController {
        constructor ($log, $state, $stateParams, authService, networkService) {
            'ngInject';
            this.$log = $log;
            this.$state = $state;
            this.$stateParams = $stateParams;
            this.hasAnyRole = authService.hasAnyRole;
            this.networkService = networkService;
        }

        $onInit () {
            let that = this;
            this.networkService.getProduct(this.$stateParams.productId)
                .then(response => {
                    that.product = response;
                });
        }

        $onChanges (changes) {
            if (changes.developer && changes.developer.currentValue) {
                this.developer = angular.copy(changes.developer.currentValue);
                this.products = this.developer.products
                    .filter(d => d.productId !== parseInt(this.$stateParams.productId, 10) && !d.deleted)
                    .map(d => {
                        d.selected = false;
                        return d;
                    })
                    .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
            }
        }

        cancel () {
            this.$state.go('organizations.developers.developer', {
                developerId: this.developer.developerId,
            }, {
                reload: true,
            });
        }

        merge (product) {
            let productToSave = {
                product: product,
                productIds: this.selectedProducts.map(d => d.productId),
                newDeveloperId: this.developer.developerId,
            };
            productToSave.productIds.push(this.product.productId);
            let that = this;
            this.networkService.updateProduct(productToSave)
                .then(() => {
                    that.$state.go('organizations.developers.developer', {
                        developerId: that.developer.developerId,
                    }, {
                        reload: true,
                    });
                }, error => {
                    that.$log.error(error);
                });
        }

        selectProduct (product) {
            this.products
                .filter(d => d.productId === product.productId)
                .forEach(d => d.selected = !d.selected);
            this.selectedProducts = this.products
                .filter(d => d.selected)
                .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
            this.selectedToMerge = null;
        }

        takeAction (action, data) {
            switch (action) {
            case 'cancel':
                this.cancel();
                break;
            case 'edit':
                this.merge(data);
                break;
                //no default
            }
        }
    },
};

angular
    .module('chpl.organizations')
    .component('chplProductsMerge', ProductsMergeComponent);
