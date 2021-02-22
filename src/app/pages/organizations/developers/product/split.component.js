export const ProductsSplitComponent = {
  templateUrl: 'chpl.organizations/developers/product/split.html',
  bindings: {
    developer: '<',
  },
  controller: class ProductsSplitController {
    constructor ($log, $state, $stateParams, authService, networkService) {
      'ngInject';
      this.$log = $log;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.movingVersions = [];
      this.newProduct = {};
    }

    $onChanges (changes) {
      if (changes.developer && changes.developer.currentValue) {
        this.developer = angular.copy(changes.developer.currentValue);
        this.product = this.developer.products
          .find(p => p.productId === parseInt(this.$stateParams.productId, 10));
        this.versions = this.product.versions
          .filter(v => !v.deleted)
          .map(v => {
            v.selected = false;
            return v;
          })
          .sort((a, b) => a.version < b.version ? -1 : a.version > b.version ? 1 : 0);
      }
    }

    takeAction (action, data) {
      this.$log.info({action, data});
      switch (action) {
      case 'cancel':
        this.cancel();
        break;
        // no default
      }
    }

    cancel () {
      this.$state.go('organizations.developers.developer', {
        developerId: this.developer.developerId,
      }, {
        reload: true,
      });
    }

    toggleMove (version, toNew) {
      if (toNew) {
        this.movingVersions.push(this.versions.find(ver => ver.versionId === version.versionId));
        this.versions = this.versions.filter(ver => ver.versionId !== version.versionId);
      } else {
        this.versions.push(this.movingVersions.find(ver => ver.versionId === version.versionId));
        this.movingVersions = this.movingVersions.filter(ver => ver.versionId !== version.versionId);
      }
    }

    /*
      split (product) {
      let productToSave = {
      product: product,
      productIds: this.selectedProducts.map(d => d.productId),
      newDeveloperId: this.developer.developerId,
      };
      productToSave.productIds.push(this.product.productId);
      let that = this;
      this.networkService.updateProduct(productToSave)
      .then(() => {
      that.$state.go('organizations.developers.developer', {
      developerId: that.developer.developerId,
      }, {
      reload: true,
      });
      }, error => {
      that.$log.error(error);
      });
      }
    */
    /*

      selectProduct (product) {
      this.products
      .filter(d => d.productId === product.productId)
      .forEach(d => d.selected = !d.selected);
      this.selectedProducts = this.products
      .filter(d => d.selected)
      .sort((a, b) => a.name < b.name ? -1 : a.name > b.name ? 1 : 0);
      this.selectedToSplit = null;
      }
    */
    /*

      takeAction (action, data) {
      switch (action) {
      case 'cancel':
      this.cancel();
      break;
      case 'edit':
      this.split(data);
      break;
      //no default
      }
      }
    */
  },
};

angular
  .module('chpl.organizations')
  .component('chplProductsSplit', ProductsSplitComponent);
