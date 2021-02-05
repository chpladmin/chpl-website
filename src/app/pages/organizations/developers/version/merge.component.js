export const VersionsMergeComponent = {
  templateUrl: 'chpl.organizations/developers/version/merge.html',
  bindings: {
    developer: '<',
  },
  controller: class VersionsMergeController {
    constructor ($log, $state, $stateParams, authService, networkService) {
      'ngInject';
      this.$log = $log;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
    }

    $onChanges (changes) {
      if (changes.developer && changes.developer.currentValue) {
        this.developer = angular.copy(changes.developer.currentValue);
        this.product = this.developer.products
          .find(p => p.productId === parseInt(this.$stateParams.productId, 10));
        this.version = this.product.versions
          .find(v => v.versionId === parseInt(this.$stateParams.versionId, 10));
        this.versions = this.product.versions
          .filter(v => v.versionId !== parseInt(this.$stateParams.versionId, 10))
          .map(v => {
            v.selected = false;
            return v;
          })
          .sort((a, b) => a.version < b.version ? -1 : a.version > b.version ? 1 : 0);
      }
    }

    cancel () {
      this.$state.go('organizations.developers.developer', {
        developerId: this.developer.developerId,
      }, {
        reload: true,
      });
    }

    merge (version) {
      let versionToSave = {
        version: version,
        versionIds: this.selectedVersions.map(d => d.versionId),
        newProductId: this.product.productId,
      };
      versionToSave.versionIds.push(this.version.versionId);
      let that = this;
      this.networkService.updateVersion(versionToSave)
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

    selectVersion (version) {
      this.versions
        .filter(d => d.versionId === version.versionId)
        .forEach(d => d.selected = !d.selected);
      this.selectedVersions = this.versions
        .filter(d => d.selected)
        .sort((a, b) => a.version < b.version ? -1 : a.version > b.version ? 1 : 0);
      this.selectedToMerge = null;
    }

    takeAction (action, data) {
      switch (action) {
      case 'cancel':
        this.cancel();
        break;
      case 'edit':
        this.merge(data);
        break;
                //no default
      }
    }
  },
};

angular
  .module('chpl.organizations')
  .component('chplVersionsMerge', VersionsMergeComponent);
