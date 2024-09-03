const ProductsMergeComponent = {
  templateUrl: 'chpl.organizations/developers/product/merge.html',
  bindings: {
    developer: '<',
  },
  controller: class ProductsMergeController {
    constructor($log, $state, $stateParams, authService, networkService, toaster) {
      'ngInject';

      this.$log = $log;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.toaster = toaster;
    }

    $onChanges(changes) {
      if (changes.developer && changes.developer.currentValue) {
        this.developer = angular.copy(changes.developer.currentValue);
        this.product = this.developer.products
          .find((p) => p.id === parseInt(this.$stateParams.productId, 10));
        this.products = this.developer.products
          .filter((d) => d.id !== parseInt(this.$stateParams.productId, 10) && !d.deleted)
          .map((d) => {
            d.selected = false;
            return d;
          })
          .sort((a, b) => (a.name < b.name ? -1 : 1));
      }
    }

    cancel() {
      this.$state.go('organizations.developers.developer', {
        id: this.developer.id,
      }, {
        reload: true,
      });
    }

    merge(product) {
      const productToSave = {
        product,
        productIds: this.selectedProducts.map((d) => d.id),
      };
      productToSave.productIds.push(this.product.id);
      const that = this;
      this.networkService.updateProduct(productToSave)
        .then(() => {
          that.$state.go('organizations.developers.developer', {
            id: that.developer.id,
          }, {
            reload: true,
          });
        }, (error) => {
          let messages = [];
          if (error.data.errorMessages) {
            messages = error.data.errorMessages;
          } else if (error.data.error) {
            messages.push(error.data.error);
          } else {
            messages = ['An error has occurred.'];
          }
          if (messages.length > 0) {
            that.toaster.pop({
              type: 'error',
              title: 'Merge error',
              body: messages.join('<br />'),
            });
          }
        });
    }

    selectProduct(product) {
      this.products
        .filter((d) => d.id === product.id)
        .forEach((d) => d.selected = !d.selected);
      this.selectedProducts = this.products
        .filter((d) => d.selected)
        .sort((a, b) => (a.name < b.name ? -1 : 0));
      this.selectedToMerge = null;
    }

    takeAction(action, data) {
      switch (action) {
        case 'cancel':
          this.cancel();
          break;
        case 'edit':
          this.merge(data);
          break;
          // no default
      }
    }
  },
};

angular
  .module('chpl.organizations')
  .component('chplProductsMerge', ProductsMergeComponent);

export default ProductsMergeComponent;
