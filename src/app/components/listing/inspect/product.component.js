export const InspectProductComponent = {
    templateUrl: 'chpl.components/listing/inspect/product.html',
    bindings: {
        onSelect: '&',
        pendingProduct: '<',
        developer: '<',
        setProductChoice: '&',
    },
    controller: class InspectProductController {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.pendingProduct) {
                this.pendingProduct = angular.copy(changes.pendingProduct.currentValue);
            }
            if (changes.developer) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (this.pendingProduct && this.pendingProduct.productId) {
                this.updateProduct();
            }
            if (this.developer && this.developer.developerId) {
                this.choice = 'choose';
                this.networkService.getProductsByDeveloper(this.developer.developerId)
                    .then(result => this.availableProducts = result.products);
            } else {
                this.choice = 'create';
            }
            this.setProductChoice({choice: this.choice});
        }

        select () {
            this.pendingProduct.productId = this.productSelect.productId;
            this.onSelect({productId: this.productSelect.productId});
            this.updateProduct();
        }

        updateProduct () {
            this.networkService.getSimpleProduct(this.pendingProduct.productId)
                .then(result => this.systemProduct = result);
        }
    },
}

angular.module('chpl.components')
    .component('aiInspectProduct', InspectProductComponent);
