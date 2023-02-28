const ProductsEditComponent = {
  templateUrl: 'chpl.organizations/developers/product/edit.html',
  bindings: {
  },
  controller: class ProductsEditComponent {
    constructor($log, $state, $stateParams, networkService, toaster) {
      'ngInject';

      this.$log = $log;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.networkService = networkService;
      this.toaster = toaster;
      this.backup = {};
    }

    $onInit() {
      const that = this;
      this.productId = this.$stateParams.productId;
      this.id = this.$stateParams.id;
      this.networkService.getProduct(this.productId)
        .then((data) => {
          that.product = data;
          that.backup.product = angular.copy(data);
        });
    }

    cancel() {
      this.product = angular.copy(this.backup.product);
      this.$state.go('organizations.developers.developer', {
        id: this.id,
      }, { reload: true });
    }

    save(product) {
      const that = this;
      const request = {
        productIds: [product.id],
        product,
        id: product.id,
      };
      this.networkService.updateProduct(request)
        .then((response) => {
          let messages = [];
          if (!response.status || response.status === 200 || angular.isObject(response.status)) {
            this.$state.go('organizations.developers.developer', {
              id: that.id,
            }, { reload: true });
          } else if (response.data.errorMessages) {
            messages = response.data.errorMessages;
          } else if (response.data.error) {
            messages.push(response.data.error);
          } else {
            messages = ['An error has occurred.'];
          }
          if (messages.length > 0) {
            that.toaster.pop({
              type: 'error',
              title: 'Save error',
              body: messages.join('<br />'),
            });
          }
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
              title: 'Save error',
              body: messages.join('<br />'),
            });
          }
        });
    }

    takeAction(action, data) {
      switch (action) {
        case 'cancel':
          this.cancel();
          break;
        case 'edit':
          this.save(data);
          break;
          // no default
      }
    }
  },
};

angular.module('chpl.organizations')
  .component('chplProductsEdit', ProductsEditComponent);

export default ProductsEditComponent;
