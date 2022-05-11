const ProductsEditComponent = {
  templateUrl: 'chpl.organizations/developers/product/edit.html',
  bindings: {
  },
  controller: class ProductsEditComponent {
    constructor($log, $scope, $state, $stateParams, networkService) {
      'ngInject';

      this.$log = $log;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.networkService = networkService;
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
      this.errorMessages = [];
      this.networkService.updateProduct(request)
        .then((response) => {
          if (!response.status || response.status === 200 || angular.isObject(response.status)) {
            this.$state.go('organizations.developers.developer', {
              id: that.id,
            }, { reload: true });
          } else if (response.data.errorMessages) {
            that.errorMessages = response.data.errorMessages;
          } else if (response.data.error) {
            that.errorMessages.push(response.data.error);
          } else {
            that.errorMessages = ['An error has occurred.'];
          }
        }, (error) => {
          if (error.data.errorMessages) {
            that.errorMessages = error.data.errorMessages;
          } else if (error.data.error) {
            that.errorMessages.push(error.data.error);
          } else {
            that.errorMessages = ['An error has occurred.'];
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
