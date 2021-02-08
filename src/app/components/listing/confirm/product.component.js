export const ConfirmProductComponent = {
  templateUrl: 'chpl.components/listing/confirm/product.html',
  bindings: {
    developer: '<',
    showFormErrors: '<',
    takeAction: '&',
    uploaded: '<',
  },
  controller: class ConfirmProductController {
    constructor ($log, networkService) {
      'ngInject';
      this.$log = $log;
      this.networkService = networkService;
      this.backup = {};
    }

    $onInit () {
      if (this.products) {
        if (!this.products.find(d => d.productId === undefined)) {
          this.products.splice(0, 0, {
            name: '--- Create a new Product ---',
            productId: undefined,
          });
        }
        if (this.pending) {
          this.pendingSelect = this.products.find(d => d.productId === this.pending.productId);
        } else if (this.uploaded) {
          this.pendingSelect = this.products.find(d => d.productId === undefined);
          this.pending = angular.copy(this.uploaded);
        }
      }
    }

    $onChanges (changes) {
      if (changes.developer && changes.developer.currentValue) {
        this.developer = angular.copy(changes.developer.currentValue);
      }
      if (changes.uploaded) {
        this.uploaded = angular.copy(changes.uploaded.currentValue);
      }
      if (this.developer && this.developer.developerId) {
        this.networkService.getProductsByDeveloper(this.developer.developerId)
          .then(result => this.products = result.products);
      }
      if (this.uploaded && this.uploaded.productId) {
        this.networkService.getSimpleProduct(this.uploaded.productId)
          .then(result => this.pending = result);
      }
    }

    selectConfirmingProduct () {
      this.uploaded.productId = this.pendingSelect.productId;
      this.takeAction({action: 'select', payload: this.pendingSelect.productId});
      this.form.$setPristine();
    }

    saveConfirmingProduct () {
      let product = {
        contact: this.pending.contact,
        productCode: this.pending.productCode,
        name: this.pending.name,
      };
      let that = this;
      this.networkService.updateProduct(product)
        .then(() => {
          that.takeAction({action: 'select', payload: product.productId});
          that.form.$setPristine();
        });
    }

    undoEdits () {
      this.pending = angular.copy(this.backup.pending);
      this.form.$setPristine();
      this.analyzeDifferences();
      this.takeAction({action: 'clear'});
    }
  },
};

angular.module('chpl.components')
  .component('chplConfirmProduct', ConfirmProductComponent);
