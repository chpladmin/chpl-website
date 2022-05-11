export const InspectVersionComponent = {
  templateUrl: 'chpl.components/listing/inspect/version.html',
  bindings: {
    onSelect: '&',
    pendingVersion: '<',
    product: '<',
    setChoice: '&',
  },
  controller: class InspectVersionController {
    constructor ($log, networkService) {
      'ngInject';
      this.$log = $log;
      this.networkService = networkService;
    }

    $onChanges (changes) {
      if (changes.pendingVersion) {
        this.pendingVersion = angular.copy(changes.pendingVersion.currentValue);
      }
      if (changes.product) {
        this.product = angular.copy(changes.product.currentValue);
      }
      if (this.pendingVersion && this.pendingVersion.id) {
        this.updateVersion();
      }
      if (this.product && this.product.id) {
        this.choice = 'choose';
        this.networkService.getVersionsByProduct(this.product.id)
          .then(result => this.availableVersions = result);
      } else {
        this.choice = 'create';
      }
      this.setChoice({choice: this.choice});
    }

    select () {
      this.pendingVersion.id = this.versionSelect.id;
      this.onSelect({id: this.versionSelect.id});
      this.updateVersion();
    }

    updateVersion () {
      this.networkService.getVersion(this.pendingVersion.id)
        .then(result => this.systemVersion = result);
    }
  },
};

angular.module('chpl.components')
  .component('aiInspectVersion', InspectVersionComponent);
