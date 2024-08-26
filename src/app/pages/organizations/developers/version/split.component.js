const VersionsSplitComponent = {
  templateUrl: 'chpl.organizations/developers/version/split.html',
  bindings: {
    developer: '<',
  },
  controller: class VersionsSplitController {
    constructor($log, $state, $stateParams, authService, networkService, toaster) {
      'ngInject';

      this.$log = $log;
      this.$state = $state;
      this.$stateParams = $stateParams;
      this.hasAnyRole = authService.hasAnyRole;
      this.networkService = networkService;
      this.toaster = toaster;
      this.request = {
        newVersionCode: undefined,
        newVersionVersion: undefined,
        newListings: [],
        oldVersion: undefined,
        oldListings: [],
      };
    }

    $onChanges(changes) {
      if (changes.developer && changes.developer.currentValue) {
        this.developer = angular.copy(changes.developer.currentValue);
        this.product = this.developer.products
          .find((p) => p.id === parseInt(this.$stateParams.productId, 10));
        this.request.oldVersion = this.product.versions
          .find((v) => v.id === parseInt(this.$stateParams.versionId, 10));
        this.request.oldListings = this.request.oldVersion.listings
          .filter((l) => !l.deleted)
          .map((l) => ({
            ...l,
            selected: false,
          }))
          .sort((a, b) => (a.chplProductNumber < b.chplProductNumber ? -1 : a.chplProductNumber > b.chplProductNumber ? 1 : 0));
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

    toggleMove(listing, toNew) {
      if (toNew) {
        this.request.newListings.push(this.request.oldListings.find((l) => l.id === listing.id));
        this.request.oldListings = this.request.oldListings.filter((l) => l.id !== listing.id);
      } else {
        this.request.oldListings.push(this.request.newListings.find((l) => l.id === listing.id));
        this.request.newListings = this.request.newListings.filter((l) => l.id !== listing.id);
      }
    }

    isValid() {
      return this.form.$valid
        && this.request.newListings && this.request.newListings.length > 0
        && this.request.oldListings && this.request.oldListings.length > 0;
    }

    save() {
      const that = this;
      this.networkService.splitVersion(this.request)
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
  .component('chplVersionsSplit', VersionsSplitComponent);

export default VersionsSplitComponent;
