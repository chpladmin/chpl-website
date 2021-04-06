export const VersionsSplitComponent = {
  templateUrl: 'chpl.organizations/developers/version/split.html',
  bindings: {
    developer: '<',
  },
  controller: class VersionsSplitController {
    constructor ($log, $state, $stateParams, authService, networkService, toaster) {
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

    $onChanges (changes) {
      if (changes.developer && changes.developer.currentValue) {
        this.developer = angular.copy(changes.developer.currentValue);
        this.product = this.developer.products
          .find(p => p.productId === parseInt(this.$stateParams.productId, 10));
        this.request.oldVersion = this.product.versions
          .find(v => v.versionId === parseInt(this.$stateParams.versionId, 10));
        this.request.oldListings = this.request.oldVersion.listings
          .filter(l => !l.deleted)
          .map(l => {
            l.selected = false;
            return l;
          })
          .sort((a, b) => a.chplProductNumber < b.chplProductNumber ? -1 : a.chplProductNumber > b.chplProductNumber ? 1 : 0);
      }
    }

    takeActionBarAction (action) {
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
        //no default
      }
    }

    cancel () {
      this.$state.go('organizations.developers.developer', {
        developerId: this.developer.developerId,
      }, {
        reload: true,
      });
    }

    toggleMove (listing, toNew) {
      if (toNew) {
        this.request.newListings.push(this.request.oldListings.find(l => l.id === listing.id));
        this.request.oldListings = this.request.oldListings.filter(l => l.id !== listing.id);
      } else {
        this.request.oldListings.push(this.request.newListings.find(l => l.id === listing.id));
        this.request.newListings = this.request.newListings.filter(l => l.id !== listing.id);
      }
    }

    isValid () {
      return this.form.$valid
        && this.request.newListings && this.request.newListings.length > 0
        && this.request.oldListings && this.request.oldListings.length > 0;
    }

    save () {
      let that = this;
      this.networkService.splitVersion(this.request)
        .then(() => {
          that.toaster.pop({
            type: 'success',
            title: 'Split successful',
            body: 'Your action has been completed',
          });
          that.$state.go('organizations.developers.developer', {
            developerId: that.developer.developerId,
          }, {
            reload: true,
          });
        }, error => {
          that.errors = [error.data.error];
        });
    }
  },
};

angular
  .module('chpl.organizations')
  .component('chplVersionsSplit', VersionsSplitComponent);
