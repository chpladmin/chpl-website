export const ProductsMergeComponent = {
    templateUrl: 'chpl.components/products/product/merge.html',
    bindings: {
        product: '<',
        products: '<',
    },
    controller: class ProductsMergeController {
        constructor ($log) {
            'ngInject';
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.developer && changes.developer.currentValue) {
                this.developer = angular.copy(changes.developer.currentValue);
            }
            if (changes.developers && changes.developers.currentValue) {
                this.developers = changes.developers.currentValue.developers
                    .filter(d => !d.deleted)
                    .map(d => {
                        d.selected = false;
                        return d;
                    })
                    .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
            }
            if (this.developer && this.developers) {
                this.developers = this.developers.filter(d => d.developerId !== this.developer.developerId);
            }
        }

        cancel () {
        }

        merge () {
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
    },
};

angular
    .module('chpl.components')
    .component('chplProductsMerge', ProductsMergeComponent);
