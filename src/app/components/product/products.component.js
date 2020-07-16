export const ProductsComponent = {
    templateUrl: 'chpl.components/product/products.html',
    bindings: {
        products: '<',
        searchOptions: '<',
    },
    controller: class ProductsComponent {
        constructor ($log, networkService) {
            'ngInject'
            this.$log = $log;
            this.networkService = networkService;
        }

        $onChanges (changes) {
            if (changes.products) {
                this.products = changes.products.currentValue.map(p => {
                    p.loaded = false;
                    p.ownerHistory = p.ownerHistory.map(o => {
                        o.transferDateObject = new Date(o.transferDate);
                        return o;
                    });
                    this.networkService.getVersionsByProduct(p.productId)
                        .then(versions => {
                            p.versions = versions
                                .sort((a, b) => (a.version < b.version ? -1 : a.version > b.version ? 1 : 0));
                        });
                    return p;
                });
            }
            if (changes.searchOptions) {
                this.searchOptions = changes.searchOptions.currentValue;
            }
        }

        toggleProduct (product) {
            let activeProduct = this.products.find(p => p.productId === product.productId);
            if (!activeProduct.loaded) {
                activeProduct.versions.forEach(v => {
                    this.networkService.getProductsByVersion(v.versionId, false).then(listings => v.listings = listings);
                });
                activeProduct.activeVersion = activeProduct.versions[0];
                activeProduct.loaded = true;
            }
            activeProduct.isOpen = !activeProduct.isOpen;
        }
    },
}

angular.module('chpl.components')
    .component('chplProducts', ProductsComponent);
