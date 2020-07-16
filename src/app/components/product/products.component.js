export const ProductsComponent = {
    templateUrl: 'chpl.components/product/products.html',
    bindings: {
        products: '<',
        searchOptions: '<',
    },
    controller: class ProductsComponent {
        constructor ($log, $q, networkService) {
            'ngInject'
            this.$log = $log;
            this.$q = $q;
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
            this.products = this.products
                .map(p => {
                    if (p.productId === product.productId) {
                        if (!p.loaded) {
                            let promises = p.versions.map(v => this.networkService.getProductsByVersion(v.versionId, false).then(listings => v.listings = listings));
                            this.$q.all(promises)
                                .then(() => {
                                    p.activeVersion = p.versions[0];
                                    p.loaded = true;
                                    p.isOpen = !p.isOpen;
                                });
                        } else {
                            p.isOpen = !p.isOpen;
                        }
                    }
                    return p;
                });
        }
    },
}

angular.module('chpl.components')
    .component('chplProducts', ProductsComponent);
