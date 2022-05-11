export const InspectProductComponent = {
  templateUrl: 'chpl.components/listing/inspect/product.html',
  bindings: {
    onSelect: '&',
    pendingProduct: '<',
    developer: '<',
    setChoice: '&',
  },
  controller: class InspectProductController {
    constructor($log, networkService) {
      'ngInject';

      this.$log = $log;
      this.networkService = networkService;
    }

    $onChanges(changes) {
      if (changes.pendingProduct) {
        this.pendingProduct = angular.copy(changes.pendingProduct.currentValue);
      }
      if (changes.developer) {
        this.developer = angular.copy(changes.developer.currentValue);
      }
      if (this.pendingProduct && this.pendingProduct.id) {
        this.updateProduct();
      }
      if (this.developer && this.developer.id) {
        this.choice = 'choose';
        this.networkService.getProductsByDeveloper(this.developer.id)
          .then((result) => this.availableProducts = result.products);
      } else {
        this.choice = 'create';
      }
      this.setChoice({ choice: this.choice });
    }

    select() {
      this.pendingProduct.id = this.productSelect.id;
      this.onSelect({ id: this.productSelect.id });
      this.updateProduct();
    }

    updateProduct() {
      this.networkService.getSimpleProduct(this.pendingProduct.id)
        .then((result) => this.systemProduct = result);
    }
  },
};

angular.module('chpl.components')
  .component('aiInspectProduct', InspectProductComponent);
