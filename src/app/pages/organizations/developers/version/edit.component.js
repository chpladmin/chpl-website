export const VersionsEditComponent = {
  templateUrl: 'chpl.organizations/developers/version/edit.html',
  bindings: {
  },
  controller: class VersionsEditComponent {
    constructor ($log, $scope, $state, $stateParams, networkService) {
      'ngInject';
      this.$log = $log;
      this.$scope = $scope;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.networkService = networkService;
      this.backup = {};
    }

    $onInit () {
      let that = this;
      this.versionId = this.$stateParams.versionId;
      this.productId = this.$stateParams.productId;
      this.id = this.$stateParams.id;
      this.networkService.getVersion(this.versionId)
        .then(data => {
          that.version = data;
          that.backup.version = angular.copy(data);
        });
      this.networkService.getProduct(this.productId)
        .then(data => {
          that.product = data;
        });
    }

    cancel () {
      this.version = angular.copy(this.backup.version);
      this.$state.go('organizations.developers.developer', {
        id: this.id,
      }, {reload: true});
    }

    save (version) {
      let that = this;
      let request = {
        versionIds: [version.versionId],
        version: version,
        newProductId: version.productId,
      };
      this.errorMessages = [];
      this.networkService.updateVersion(request)
        .then(response => {
          if (!response.status || response.status === 200 || angular.isObject(response.status)) {
            this.$state.go('organizations.developers.developer', {
              id: that.id,
            }, {reload: true});
          } else {
            if (response.data.errorMessages) {
              that.errorMessages = response.data.errorMessages;
            } else if (response.data.error) {
              that.errorMessages.push(response.data.error);
            } else {
              that.errorMessages = ['An error has occurred.'];
            }
          }
        }, error => {
          if (error.data.errorMessages) {
            that.errorMessages = error.data.errorMessages;
          } else if (error.data.error) {
            that.errorMessages.push(error.data.error);
          } else {
            that.errorMessages = ['An error has occurred.'];
          }
        });
    }

    takeAction (action, data) {
      switch (action) {
        case 'cancel':
          this.cancel();
          break;
        case 'edit':
          this.save(data);
          break;
          //no default
      }
    }

  },
};

angular.module('chpl.organizations')
  .component('chplVersionsEdit', VersionsEditComponent);
