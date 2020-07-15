export const ProductsComponent = {
    templateUrl: 'chpl.components/product/products.html',
    bindings: {
        products: '<',
        searchOptions: '<',
    },
    controller: class ProductsComponent {
        constructor ($log) {
            'ngInject'
            this.$log = $log;
        }

        $onChanges (changes) {
            if (changes.products) {
                this.products = angular.copy(changes.products.currentValue);
            }
            if (changes.searchOptions) {
                this.searchOptions = changes.searchOptions.currentValue;
            }
        }
    },
}

angular.module('chpl.components')
    .component('chplProducts', ProductsComponent);
