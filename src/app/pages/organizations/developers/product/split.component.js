const ProductsSplitComponent = {
  templateUrl: 'chpl.organizations/developers/product/split.html',
  bindings: {
    developer: '<',
  },
  controller: class ProductsSplitController {
    constructor($log, $state, $stateParams, authService, networkService, toaster) {
      'ngInject';

      this.$log = $log;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.toaster = toaster;
      this.request = {
        newProductCode: undefined,
        newProductName: undefined,
        newVersions: [],
        oldProduct: undefined,
        oldVersions: [],
      };
    }

    $onChanges(changes) {
      if (changes.developer && changes.developer.currentValue) {
        this.developer = angular.copy(changes.developer.currentValue);
        this.request.oldProduct = this.developer.products
          .find((p) => p.id === parseInt(this.$stateParams.productId, 10));
        this.request.oldVersions = this.request.oldProduct.versions
          .filter((v) => !v.deleted)
          .map((v) => {
            v.selected = false;
            return v;
          })
          .sort((a, b) => (a.version < b.version ? -1 : a.version > b.version ? 1 : 0));
      }
    }

    takeActionBarAction(action) {
      switch (action) {
        case 'cancel':
          this.cancel();
          break;
        case 'mouseover':
          this.showFormErrors = true;
          break;
        case 'save':
          this.save();
          break;
        // no default
      }
    }

    cancel() {
      this.$state.go('organizations.developers.developer', {
        id: this.developer.id,
      }, {
        reload: true,
      });
    }

    toggleMove(version, toNew) {
      if (toNew) {
        this.request.newVersions.push(this.request.oldVersions.find((ver) => ver.id === version.id));
        this.request.oldVersions = this.request.oldVersions.filter((ver) => ver.id !== version.id);
      } else {
        this.request.oldVersions.push(this.request.newVersions.find((ver) => ver.id === version.id));
        this.request.newVersions = this.request.newVersions.filter((ver) => ver.id !== version.id);
      }
    }

    isValid() {
      return this.form.$valid
        && this.request.newVersions && this.request.newVersions.length > 0
        && this.request.oldVersions && this.request.oldVersions.length > 0;
    }

    save() {
      const that = this;
      this.networkService.splitProduct(this.request)
        .then(() => {
          that.toaster.pop({
            type: 'success',
            title: 'Split successful',
            body: 'Your action has been completed',
          });
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
              title: 'Split error',
              body: messages.join('<br />'),
            });
          }
        });
    }
  },
};

angular
  .module('chpl.organizations')
  .component('chplProductsSplit', ProductsSplitComponent);

export default ProductsSplitComponent;
