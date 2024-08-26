const VersionsEditComponent = {
  templateUrl: 'chpl.organizations/developers/version/edit.html',
  bindings: {
  },
  controller: class VersionsEditComponent {
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
      this.id = this.$stateParams.id;
      this.productId = this.$stateParams.productId;
      this.versionId = this.$stateParams.versionId;
      this.networkService.getVersion(this.versionId)
        .then((data) => {
          that.version = data;
          that.backup.version = angular.copy(data);
        });
      this.networkService.getProduct(this.productId)
        .then((data) => {
          that.product = data;
        });
    }

    cancel() {
      this.version = angular.copy(this.backup.version);
      this.$state.go('organizations.developers.developer', {
        id: this.id,
      }, { reload: true });
    }

    save(version) {
      const that = this;
      const request = {
        versionIds: [version.id],
        version,
        newProductId: version.productId,
      };
      this.errorMessages = [];
      this.networkService.updateVersion(request)
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
  .component('chplVersionsEdit', VersionsEditComponent);

export default VersionsEditComponent;
