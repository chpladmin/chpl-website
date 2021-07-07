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
          .find((p) => p.productId === parseInt(this.$stateParams.productId, 10));
        this.products = this.developer.products
          .filter((d) => d.productId !== parseInt(this.$stateParams.productId, 10) && !d.deleted)
          .map((d) => {
            d.selected = false;
            return d;
          })
          .sort((a, b) => (a.name < b.name ? -1 : 1));
      }
    }

    cancel() {
      this.$state.go('organizations.developers.developer', {
        developerId: this.developer.developerId,
      }, {
        reload: true,
      });
    }

    merge(product) {
      const productToSave = {
        product,
        productIds: this.selectedProducts.map((d) => d.productId),
        newDeveloperId: this.developer.developerId,
      };
      productToSave.productIds.push(this.product.productId);
      const that = this;
      this.networkService.updateProduct(productToSave)
        .then(() => {
          that.$state.go('organizations.developers.developer', {
            developerId: that.developer.developerId,
          }, {
            reload: true,
          });
        }, (error) => {
          that.toaster.pop({
            type: 'error',
            title: 'Merge error',
            body: error.data.error,
          });
        });
    }

    selectProduct(product) {
      this.products
        .filter((d) => d.productId === product.productId)
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
